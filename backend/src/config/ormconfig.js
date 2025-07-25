"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const Hospital_1 = require("../entity/Hospital");
const Patient_1 = require("../entity/Patient");
const Appointment_1 = require("../entity/Appointment");
const Document_1 = require("../entity/Document");
const AuditLog_1 = require("../entity/AuditLog");
const UserHospital_1 = require("../entity/UserHospital");
const Role_1 = require("../entity/Role");
const Permission_1 = require("../entity/Permission");
const RolePermission_1 = require("../entity/RolePermission");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Anuradha@123',
    database: 'healthos',
    synchronize: false, // Use migrations for schema
    logging: true,
    entities: [
        User_1.User,
        Hospital_1.Hospital,
        Patient_1.Patient,
        Appointment_1.Appointment,
        Document_1.Document,
        AuditLog_1.AuditLog,
        UserHospital_1.UserHospital,
        Role_1.Role,
        Permission_1.Permission,
        RolePermission_1.RolePermission
    ],
    migrations: [__dirname + '/../migration/*.ts'],
    migrationsTableName: 'migrations',
});
exports.default = AppDataSource;
