import AppDataSource from '../config/ormconfig';
import { Permission } from '../entity/Permission';
import { Role } from '../entity/Role';
import { RolePermission } from '../entity/RolePermission';
import { User } from '../entity/User';
import { Hospital } from '../entity/Hospital';
import { UserHospital } from '../entity/UserHospital';

async function verify() {
  await AppDataSource.initialize();
  console.log('🔍 Verifying seeded data...\n');

  // Check permissions
  const permissions = await AppDataSource.getRepository(Permission).find();
  console.log(`✅ Permissions (${permissions.length}):`);
  permissions.forEach(p => console.log(`  - ${p.name}: ${p.description}`));

  // Check roles
  const roles = await AppDataSource.getRepository(Role).find();
  console.log(`\n✅ Roles (${roles.length}):`);
  roles.forEach(r => console.log(`  - ${r.name}: ${r.description}`));

  // Check role-permissions
  const rolePermissions = await AppDataSource.getRepository(RolePermission).find({
    relations: ['role', 'permission']
  });
  console.log(`\n✅ Role-Permissions (${rolePermissions.length}):`);
  rolePermissions.forEach(rp => {
    console.log(`  - ${rp.role.name} can ${rp.permission.name}`);
  });

  // Check hospitals
  const hospitals = await AppDataSource.getRepository(Hospital).find();
  console.log(`\n✅ Hospitals (${hospitals.length}):`);
  hospitals.forEach(h => console.log(`  - ${h.name} (${h.branch_code}): ${h.address}`));

  // Check users
  const users = await AppDataSource.getRepository(User).find();
  console.log(`\n✅ Users (${users.length}):`);
  users.forEach(u => console.log(`  - ${u.username} (${u.email}): ${u.full_name}`));

  // Check user-hospital assignments
  const userHospitals = await AppDataSource.getRepository(UserHospital).find({
    relations: ['user', 'hospital', 'role']
  });
  console.log(`\n✅ User-Hospital Assignments (${userHospitals.length}):`);
  userHospitals.forEach(uh => {
    console.log(`  - ${uh.user.username} at ${uh.hospital.name} as ${uh.role.name} (Primary: ${uh.is_primary})`);
  });

  await AppDataSource.destroy();
  console.log('\n🎉 Verification complete!');
}

verify().catch(e => { console.error(e); process.exit(1); }); 