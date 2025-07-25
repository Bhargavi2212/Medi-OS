"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHospital = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Hospital_1 = require("./Hospital");
const Role_1 = require("./Role");
let UserHospital = class UserHospital {
};
exports.UserHospital = UserHospital;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserHospital.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], UserHospital.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Hospital_1.Hospital, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'hospital_id' }),
    __metadata("design:type", Hospital_1.Hospital)
], UserHospital.prototype, "hospital", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Role_1.Role, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", Role_1.Role)
], UserHospital.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserHospital.prototype, "is_primary", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserHospital.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserHospital.prototype, "updated_at", void 0);
exports.UserHospital = UserHospital = __decorate([
    (0, typeorm_1.Entity)('user_hospitals'),
    (0, typeorm_1.Index)(['hospital'], {})
], UserHospital);
