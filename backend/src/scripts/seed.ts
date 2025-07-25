import { Repository } from 'typeorm';
import AppDataSource from '../config/ormconfig';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { Hospital } from '../entity/Hospital';
import { UserHospital } from '../entity/UserHospital';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);
    const hospitalRepository = AppDataSource.getRepository(Hospital);
    const userHospitalRepository = AppDataSource.getRepository(UserHospital);

    // Create roles
    const roles = [
      { name: 'admin', description: 'Administrator role' },
      { name: 'doctor', description: 'Doctor role' },
      { name: 'nurse', description: 'Nurse role' },
      { name: 'receptionist', description: 'Receptionist role' },
      { name: 'analyst', description: 'Market Analyst role' },
      { name: 'integration', description: 'Integration Engineer role' },
    ];
    const savedRoles: Record<string, Role> = {};
    for (const r of roles) {
      let role = await roleRepository.findOne({ where: { name: r.name } });
      if (!role) {
        role = roleRepository.create(r);
        await roleRepository.save(role);
      }
      savedRoles[r.name] = role;
    }

    // Create a hospital
    let hospital = await hospitalRepository.findOne({ where: { name: 'Demo Hospital' } });
    if (!hospital) {
      hospital = hospitalRepository.create({ name: 'Demo Hospital', branch_code: 'DH001', address: '123 Main St', contact_info: 'info@demo-hospital.com' });
      await hospitalRepository.save(hospital);
    }
    if (!hospital) {
      throw new Error('Hospital creation failed');
    }

    // Helper to create user
    async function createUser(username: string, password: string, full_name: string, role: Role, hospital: Hospital) {
      let user = await userRepository.findOne({ where: { username } });
      if (!user) {
        const password_hash = await bcrypt.hash(password, 10);
        user = userRepository.create({
          username,
          email: `${username}@healthos.com`,
          password_hash,
          full_name,
          is_active: true
        });
        await userRepository.save(user);
      }
      // Assign to hospital/role
      let userHospital = await userHospitalRepository.findOne({ where: { user: { id: user.id }, hospital: { id: hospital.id } }, relations: ['user', 'hospital'] });
      if (!userHospital) {
        userHospital = userHospitalRepository.create({
          user,
          hospital,
          role,
          is_primary: true
        });
        await userHospitalRepository.save(userHospital);
      }
      return user;
    }

    // Create demo users
    await createUser('admin', 'admin123', 'System Administrator', savedRoles['admin'], hospital);
    await createUser('doctor', 'doctor123', 'Dr. John Doe', savedRoles['doctor'], hospital);
    await createUser('nurse', 'nurse123', 'Nurse Jane', savedRoles['nurse'], hospital);
    await createUser('reception', 'reception123', 'Receptionist Bob', savedRoles['receptionist'], hospital);
    await createUser('analyst', 'analyst123', 'Market Analyst Alice', savedRoles['analyst'], hospital);
    await createUser('integration', 'integration123', 'Integration Engineer Eve', savedRoles['integration'], hospital);

    console.log('✅ Seed data created successfully!');
    console.log('Demo credentials:');
    console.log('  Admin:        admin / admin123');
    console.log('  Doctor:       doctor / doctor123');
    console.log('  Nurse:        nurse / nurse123');
    console.log('  Receptionist: reception / reception123');
    console.log('  Analyst:      analyst / analyst123');
    console.log('  Integration:  integration / integration123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed(); 