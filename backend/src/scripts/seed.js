"use strict";
// import { Repository } from 'typeorm';
// import AppDataSource from '../config/ormconfig';
// import { User } from '../entity/User';
// import { Role } from '../entity/Role';
// async function seed() {
//   try {
//     await AppDataSource.initialize();
//     console.log('✅ Database connected');
//     const userRepository = AppDataSource.getRepository(User);
//     const roleRepository = AppDataSource.getRepository(Role);
//     // Create roles
//     const adminRole = roleRepository.create({
//       name: 'admin',
//       description: 'Administrator role'
//     });
//     await roleRepository.save(adminRole);
//     const doctorRole = roleRepository.create({
//       name: 'doctor',
//       description: 'Doctor role'
//     });
//     await roleRepository.save(doctorRole);
//     const nurseRole = roleRepository.create({
//       name: 'nurse',
//       description: 'Nurse role'
//     });
//     await roleRepository.save(nurseRole);
//     const receptionistRole = roleRepository.create({
//       name: 'receptionist',
//       description: 'Receptionist role'
//     });
//     await roleRepository.save(receptionistRole);
//     // Create admin user
//     const adminUserData = userRepository.create({
//       username: 'admin',
//       email: 'admin@healthos.com',
//       password_hash: '$2a$10$example.hash.for.admin.password',
//       full_name: 'System Administrator',
//       role: adminRole,
//       is_active: true
//     });
//     await userRepository.save(adminUserData);
//     // Create doctor user
//     const doctorUserData = userRepository.create({
//       username: 'doctor',
//       email: 'doctor@healthos.com',
//       password_hash: '$2a$10$example.hash.for.doctor.password',
//       full_name: 'Dr. John Doe',
//       role: doctorRole,
//       is_active: true
//     });
//     await userRepository.save(doctorUserData);
//     console.log('✅ Seed data created successfully');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Seed error:', error);
//     process.exit(1);
//   }
// }
// seed(); 
