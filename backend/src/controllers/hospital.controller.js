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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalController = void 0;
const hospital_service_1 = require("../services/hospital.service");
class HospitalController {
    constructor() {
        this.hospitalService = new hospital_service_1.HospitalService();
    }
    // POST /api/hospitals
    createHospital(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, address, branch_code, contact_info } = req.body;
                // Validation
                if (!name || !address || !branch_code || !contact_info) {
                    res.status(400).json({
                        success: false,
                        message: 'Name, address, branch code, and contact info are required'
                    });
                    return;
                }
                const result = yield this.hospitalService.createHospital({
                    name,
                    address,
                    branch_code,
                    contact_info
                });
                if (result.success) {
                    res.status(201).json(result);
                }
                else {
                    res.status(400).json(result);
                }
            }
            catch (error) {
                console.error('Create hospital controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // GET /api/hospitals
    getAllHospitals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.hospitalService.getAllHospitals();
                if (result.success) {
                    res.status(200).json(result);
                }
                else {
                    res.status(400).json(result);
                }
            }
            catch (error) {
                console.error('Get all hospitals controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // GET /api/hospitals/:id
    getHospitalById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.hospitalService.getHospitalById(parseInt(id));
                if (result.success) {
                    res.status(200).json(result);
                }
                else {
                    res.status(404).json(result);
                }
            }
            catch (error) {
                console.error('Get hospital by ID controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // PUT /api/hospitals/:id
    updateHospital(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, address, branch_code, contact_info } = req.body;
                const result = yield this.hospitalService.updateHospital(parseInt(id), {
                    name,
                    address,
                    branch_code,
                    contact_info
                });
                if (result.success) {
                    res.status(200).json(result);
                }
                else {
                    res.status(400).json(result);
                }
            }
            catch (error) {
                console.error('Update hospital controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
    // DELETE /api/hospitals/:id
    deleteHospital(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.hospitalService.deleteHospital(parseInt(id));
                if (result.success) {
                    res.status(200).json(result);
                }
                else {
                    res.status(400).json(result);
                }
            }
            catch (error) {
                console.error('Delete hospital controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });
    }
}
exports.HospitalController = HospitalController;
