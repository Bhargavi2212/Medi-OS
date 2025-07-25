import { Request, Response } from 'express';
import { HospitalService } from '../services/hospital.service';

export class HospitalController {
  private hospitalService = new HospitalService();

  // POST /api/hospitals
  async createHospital(req: Request, res: Response) {
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

      const result = await this.hospitalService.createHospital({
        name,
        address,
        branch_code,
        contact_info
      });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Create hospital controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // GET /api/hospitals
  async getAllHospitals(req: Request, res: Response) {
    try {
      const result = await this.hospitalService.getAllHospitals();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Get all hospitals controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // GET /api/hospitals/:id
  async getHospitalById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this.hospitalService.getHospitalById(parseInt(id));

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Get hospital by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // PUT /api/hospitals/:id
  async updateHospital(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, address, branch_code, contact_info } = req.body;

      const result = await this.hospitalService.updateHospital(parseInt(id), {
        name,
        address,
        branch_code,
        contact_info
      });

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Update hospital controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // DELETE /api/hospitals/:id
  async deleteHospital(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this.hospitalService.deleteHospital(parseInt(id));

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Delete hospital controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
} 