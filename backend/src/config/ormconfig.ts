import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Hospital } from '../entity/Hospital';
import { Patient } from '../entity/Patient';
import { Appointment } from '../entity/Appointment';
import { Document } from '../entity/Document';
import { AuditLog } from '../entity/AuditLog';
import { UserHospital } from '../entity/UserHospital';
import { Role } from '../entity/Role';
import { Permission } from '../entity/Permission';
import { RolePermission } from '../entity/RolePermission';


const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Anuradha@123',
  database: 'healthos',
  synchronize: false, // Use migrations for schema
  logging: true,
  entities: [
    User,
    Hospital,
    Patient,
    Appointment,
    Document,
    AuditLog,
    UserHospital,
    Role,
    Permission,
    RolePermission
  ],
  migrations: [__dirname + '/../migration/*.ts'],
  migrationsTableName: 'migrations',
});

export default AppDataSource; 