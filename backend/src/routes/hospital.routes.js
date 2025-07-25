"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hospital_controller_1 = require("../controllers/hospital.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const hospitalController = new hospital_controller_1.HospitalController();
// Apply authentication middleware to all routes
router.use(auth_middleware_1.authMiddleware);
// GET /api/hospitals - Get all hospitals
router.get('/', (req, res) => hospitalController.getAllHospitals(req, res));
// GET /api/hospitals/:id - Get hospital by ID
router.get('/:id', (req, res) => hospitalController.getHospitalById(req, res));
// POST /api/hospitals - Create new hospital
router.post('/', (req, res) => hospitalController.createHospital(req, res));
// PUT /api/hospitals/:id - Update hospital
router.put('/:id', (req, res) => hospitalController.updateHospital(req, res));
// DELETE /api/hospitals/:id - Delete hospital
router.delete('/:id', (req, res) => hospitalController.deleteHospital(req, res));
exports.default = router;
