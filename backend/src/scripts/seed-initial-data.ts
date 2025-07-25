import AppDataSource from '../config/ormconfig';
import { Permission } from '../entity/Permission';
import { Role } from '../entity/Role';
import { RolePermission } from '../entity/RolePermission';
import { User } from '../entity/User';
import { Hospital } from '../entity/Hospital';
import { UserHospital } from '../entity/UserHospital';
import bcrypt from 'bcryptjs';

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  // 1. Permissions
  const permissions = [
    { name: 'manage_patients', description: 'Can manage patients' },
    { name: 'manage_appointments', description: 'Can manage appointments' },
    { name: 'manage_documents', description: 'Can manage documents' },
    { name: 'admin', description: 'Full admin access' },
  ];
  for (const perm of permissions) {
    await AppDataSource.getRepository(Permission).upsert(perm, ['name']);
  }
  console.log('✅ Permissions seeded');

  // 2. Roles
  const roles = [
    { name: 'Admin', description: 'System administrator' },
    { name: 'Doctor', description: 'Doctor' },
    { name: 'Receptionist', description: 'Reception/front desk' },
  ];
  for (const role of roles) {
    await AppDataSource.getRepository(Role).upsert(role, ['name']);
  }
  console.log('✅ Roles seeded');

  // 3. Assign permissions to roles
  const allPerms = await AppDataSource.getRepository(Permission).find();
  const allRoles = await AppDataSource.getRepository(Role).find();
  for (const role of allRoles) {
    let permsToAssign = allPerms;
    if (role.name === 'Doctor') {
      permsToAssign = allPerms.filter(p => p.name !== 'admin');
    } else if (role.name === 'Receptionist') {
      permsToAssign = allPerms.filter(p => p.name === 'manage_patients' || p.name === 'manage_appointments');
    }
    for (const perm of permsToAssign) {
      // Check if role-permission already exists
      const existing = await AppDataSource.getRepository(RolePermission).findOne({
        where: { role: { id: role.id }, permission: { id: perm.id } }
      });
      if (!existing) {
        await AppDataSource.getRepository(RolePermission).save({
          role,
          permission: perm
        });
      }
    }
  }
  console.log('✅ Role-permissions seeded');

  // 4. Create a hospital (if not exists)
  const hospitalRepo = AppDataSource.getRepository(Hospital);
  let hospital = await hospitalRepo.findOneBy({ branch_code: 'MAIN001' });
  if (!hospital) {
    hospital = hospitalRepo.create({
      name: 'Main Hospital',
      address: '123 Main Street',
      branch_code: 'MAIN001',
      contact_info: '+91-9999999999',
    });
    await hospitalRepo.save(hospital);
  }
  console.log('✅ Hospital seeded');

  // 5. Create admin user (if not exists)
  const userRepo = AppDataSource.getRepository(User);
  let admin = await userRepo.findOneBy({ username: 'admin' });
  if (!admin) {
    const password_hash = await bcrypt.hash('admin123', 10);
    admin = userRepo.create({
      username: 'admin',
      email: 'admin@healthos.com',
      password_hash,
      full_name: 'Admin User',
      is_active: true,
    });
    await userRepo.save(admin);
  }
  console.log('✅ Admin user seeded');

  // 6. Assign admin user to hospital and role
  const adminRole = allRoles.find(r => r.name === 'Admin');
  if (adminRole && hospital) {
    const userHospitalRepo = AppDataSource.getRepository(UserHospital);
    const existing = await userHospitalRepo.findOne({ where: { user: { id: admin.id }, hospital: { id: hospital.id } } });
    if (!existing) {
      const userHospital = userHospitalRepo.create({
        user: admin,
        hospital,
        role: adminRole,
        is_primary: true,
      });
      await userHospitalRepo.save(userHospital);
    }
    console.log('✅ Admin user assigned to hospital and role');
  }

  await AppDataSource.destroy();
  console.log('🎉 Seeding complete!');
}

seed().catch(e => { console.error(e); process.exit(1); }); 