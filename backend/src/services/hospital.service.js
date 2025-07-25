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
exports.HospitalService = void 0;
const ormconfig_1 = __importDefault(require("../config/ormconfig"));
const Hospital_1 = require("../entity/Hospital");
class HospitalService {
    constructor() {
        this.hospitalRepository = ormconfig_1.default.getRepository(Hospital_1.Hospital);
    }
    // Create a new hospital
    createHospital(hospitalData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if hospital with same branch code already exists
                const existingHospital = yield this.hospitalRepository.findOne({
                    where: { branch_code: hospitalData.branch_code }
                });
                if (existingHospital) {
                    return {
                        success: false,
                        message: 'Hospital with this branch code already exists'
                    };
                }
                const hospital = this.hospitalRepository.create(Object.assign(Object.assign({}, hospitalData), { created_at: new Date(), updated_at: new Date() }));
                const savedHospital = yield this.hospitalRepository.save(hospital);
                return {
                    success: true,
                    message: 'Hospital created successfully',
                    hospital: savedHospital
                };
            }
            catch (error) {
                console.error('Create hospital error:', error);
                return {
                    success: false,
                    message: 'Failed to create hospital'
                };
            }
        });
    }
    // Get all hospitals
    getAllHospitals() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hospitals = yield this.hospitalRepository.find({
                    order: { name: 'ASC' }
                });
                return {
                    success: true,
                    hospitals,
                    count: hospitals.length
                };
            }
            catch (error) {
                console.error('Get all hospitals error:', error);
                return {
                    success: false,
                    message: 'Failed to fetch hospitals'
                };
            }
        });
    }
    // Get hospital by ID
    getHospitalById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hospital = yield this.hospitalRepository.findOne({
                    where: { id }
                });
                if (!hospital) {
                    return {
                        success: false,
                        message: 'Hospital not found'
                    };
                }
                return {
                    success: true,
                    hospital
                };
            }
            catch (error) {
                console.error('Get hospital by ID error:', error);
                return {
                    success: false,
                    message: 'Failed to fetch hospital'
                };
            }
        });
    }
    // Update hospital
    updateHospital(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hospital = yield this.hospitalRepository.findOne({
                    where: { id }
                });
                if (!hospital) {
                    return {
                        success: false,
                        message: 'Hospital not found'
                    };
                }
                // Check if branch code is being changed and if it already exists
                if (updateData.branch_code && updateData.branch_code !== hospital.branch_code) {
                    const existingHospital = yield this.hospitalRepository.findOne({
                        where: { branch_code: updateData.branch_code }
                    });
                    if (existingHospital) {
                        return {
                            success: false,
                            message: 'Hospital with this branch code already exists'
                        };
                    }
                }
                Object.assign(hospital, Object.assign(Object.assign({}, updateData), { updated_at: new Date() }));
                const updatedHospital = yield this.hospitalRepository.save(hospital);
                return {
                    success: true,
                    message: 'Hospital updated successfully',
                    hospital: updatedHospital
                };
            }
            catch (error) {
                console.error('Update hospital error:', error);
                return {
                    success: false,
                    message: 'Failed to update hospital'
                };
            }
        });
    }
    // Delete hospital
    deleteHospital(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hospital = yield this.hospitalRepository.findOne({
                    where: { id }
                });
                if (!hospital) {
                    return {
                        success: false,
                        message: 'Hospital not found'
                    };
                }
                // Note: Patient relation is not implemented in current schema
                // Hospital can be deleted without patient check
                yield this.hospitalRepository.remove(hospital);
                return {
                    success: true,
                    message: 'Hospital deleted successfully'
                };
            }
            catch (error) {
                console.error('Delete hospital error:', error);
                return {
                    success: false,
                    message: 'Failed to delete hospital'
                };
            }
        });
    }
    // Search hospitals
    searchHospitals(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hospitals = yield this.hospitalRepository
                    .createQueryBuilder('hospital')
                    .where('hospital.name ILIKE :query OR hospital.address ILIKE :query OR hospital.branch_code ILIKE :query', {
                    query: `%${query}%`
                })
                    .orderBy('hospital.name', 'ASC')
                    .getMany();
                return {
                    success: true,
                    hospitals,
                    count: hospitals.length
                };
            }
            catch (error) {
                console.error('Search hospitals error:', error);
                return {
                    success: false,
                    message: 'Failed to search hospitals'
                };
            }
        });
    }
}
exports.HospitalService = HospitalService;
