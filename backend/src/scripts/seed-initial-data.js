"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ormconfig_1 = __importDefault(require("../config/ormconfig"));
const Permission_1 = require("../entity/Permission");
const Role_1 = require("../entity/Role");
const RolePermission_1 = require("../entity/RolePermission");
const User_1 = require("../entity/User");
const Hospital_1 = require("../entity/Hospital");
const UserHospital_1 = require("../entity/UserHospital");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield ormconfig_1.default.initialize();
        console.log('✅ Database connected');
        // 1. Permissions
        const permissions = [
            { name: 'manage_patients', description: 'Can manage patients' },
            { name: 'manage_appointments', description: 'Can manage appointments' },
            { name: 'manage_documents', description: 'Can manage documents' },
            { name: 'admin', description: 'Full admin access' },
        ];
        for (const perm of permissions) {
            yield ormconfig_1.default.getRepository(Permission_1.Permission).upsert(perm, ['name']);
        }
        console.log('✅ Permissions seeded');
        // 2. Roles
        const roles = [
            { name: 'Admin', description: 'System administrator' },
            { name: 'Doctor', description: 'Doctor' },
            { name: 'Receptionist', description: 'Reception/front desk' },
        ];
        for (const role of roles) {
            yield ormconfig_1.default.getRepository(Role_1.Role).upsert(role, ['name']);
        }
        console.log('✅ Roles seeded');
        // 3. Assign permissions to roles
        const allPerms = yield ormconfig_1.default.getRepository(Permission_1.Permission).find();
        const allRoles = yield ormconfig_1.default.getRepository(Role_1.Role).find();
        for (const role of allRoles) {
            let permsToAssign = allPerms;
            if (role.name === 'Doctor') {
                permsToAssign = allPerms.filter(p => p.name !== 'admin');
            }
            else if (role.name === 'Receptionist') {
                permsToAssign = allPerms.filter(p => p.name === 'manage_patients' || p.name === 'manage_appointments');
            }
            for (const perm of permsToAssign) {
                // Check if role-permission already exists
                const existing = yield ormconfig_1.default.getRepository(RolePermission_1.RolePermission).findOne({
                    where: { role: { id: role.id }, permission: { id: perm.id } }
                });
                if (!existing) {
                    yield ormconfig_1.default.getRepository(RolePermission_1.RolePermission).save({
                        role,
                        permission: perm
                    });
                }
            }
        }
        console.log('✅ Role-permissions seeded');
        // 4. Create a hospital (if not exists)
        const hospitalRepo = ormconfig_1.default.getRepository(Hospital_1.Hospital);
        let hospital = yield hospitalRepo.findOneBy({ branch_code: 'MAIN001' });
        if (!hospital) {
            hospital = hospitalRepo.create({
                name: 'Main Hospital',
                address: '123 Main Street',
                branch_code: 'MAIN001',
                contact_info: '+91-9999999999',
            });
            yield hospitalRepo.save(hospital);
        }
        console.log('✅ Hospital seeded');
        // 5. Create admin user (if not exists)
        const userRepo = ormconfig_1.default.getRepository(User_1.User);
        let admin = yield userRepo.findOneBy({ username: 'admin' });
        if (!admin) {
            const password_hash = yield bcryptjs_1.default.hash('admin123', 10);
            admin = userRepo.create({
                username: 'admin',
                email: 'admin@healthos.com',
                password_hash,
                full_name: 'Admin User',
                is_active: true,
            });
            yield userRepo.save(admin);
        }
        console.log('✅ Admin user seeded');
        // 6. Assign admin user to hospital and role
        const adminRole = allRoles.find(r => r.name === 'Admin');
        if (adminRole && hospital) {
            const userHospitalRepo = ormconfig_1.default.getRepository(UserHospital_1.UserHospital);
            const existing = yield userHospitalRepo.findOne({ where: { user: { id: admin.id }, hospital: { id: hospital.id } } });
            if (!existing) {
                const userHospital = userHospitalRepo.create({
                    user: admin,
                    hospital,
                    role: adminRole,
                    is_primary: true,
                });
                yield userHospitalRepo.save(userHospital);
            }
            console.log('✅ Admin user assigned to hospital and role');
        }
        yield ormconfig_1.default.destroy();
        console.log('🎉 Seeding complete!');
    });
}
seed().catch(e => { console.error(e); process.exit(1); });
