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
function verify() {
    return __awaiter(this, void 0, void 0, function* () {
        yield ormconfig_1.default.initialize();
        console.log('🔍 Verifying seeded data...\n');
        // Check permissions
        const permissions = yield ormconfig_1.default.getRepository(Permission_1.Permission).find();
        console.log(`✅ Permissions (${permissions.length}):`);
        permissions.forEach(p => console.log(`  - ${p.name}: ${p.description}`));
        // Check roles
        const roles = yield ormconfig_1.default.getRepository(Role_1.Role).find();
        console.log(`\n✅ Roles (${roles.length}):`);
        roles.forEach(r => console.log(`  - ${r.name}: ${r.description}`));
        // Check role-permissions
        const rolePermissions = yield ormconfig_1.default.getRepository(RolePermission_1.RolePermission).find({
            relations: ['role', 'permission']
        });
        console.log(`\n✅ Role-Permissions (${rolePermissions.length}):`);
        rolePermissions.forEach(rp => {
            console.log(`  - ${rp.role.name} can ${rp.permission.name}`);
        });
        // Check hospitals
        const hospitals = yield ormconfig_1.default.getRepository(Hospital_1.Hospital).find();
        console.log(`\n✅ Hospitals (${hospitals.length}):`);
        hospitals.forEach(h => console.log(`  - ${h.name} (${h.branch_code}): ${h.address}`));
        // Check users
        const users = yield ormconfig_1.default.getRepository(User_1.User).find();
        console.log(`\n✅ Users (${users.length}):`);
        users.forEach(u => console.log(`  - ${u.username} (${u.email}): ${u.full_name}`));
        // Check user-hospital assignments
        const userHospitals = yield ormconfig_1.default.getRepository(UserHospital_1.UserHospital).find({
            relations: ['user', 'hospital', 'role']
        });
        console.log(`\n✅ User-Hospital Assignments (${userHospitals.length}):`);
        userHospitals.forEach(uh => {
            console.log(`  - ${uh.user.username} at ${uh.hospital.name} as ${uh.role.name} (Primary: ${uh.is_primary})`);
        });
        yield ormconfig_1.default.destroy();
        console.log('\n🎉 Verification complete!');
    });
}
verify().catch(e => { console.error(e); process.exit(1); });
