import { Router } from 'express';
import { HospitalController } from '../controllers/hospital.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const hospitalController = new HospitalController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

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

export default router; 