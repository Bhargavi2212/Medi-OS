import { Repository } from 'typeorm';
import AppDataSource from '../config/ormconfig';
import { Hospital } from '../entity/Hospital';

export class HospitalService {
  private hospitalRepository: Repository<Hospital>;

  constructor() {
    this.hospitalRepository = AppDataSource.getRepository(Hospital);
  }

  // Create a new hospital
  async createHospital(hospitalData: {
    name: string;
    address: string;
    branch_code: string;
    contact_info: string;
  }) {
    try {
      // Check if hospital with same branch code already exists
      const existingHospital = await this.hospitalRepository.findOne({
        where: { branch_code: hospitalData.branch_code }
      });

      if (existingHospital) {
        return {
          success: false,
          message: 'Hospital with this branch code already exists'
        };
      }

      const hospital = this.hospitalRepository.create({
        ...hospitalData,
        created_at: new Date(),
        updated_at: new Date()
      });

      const savedHospital = await this.hospitalRepository.save(hospital);

      return {
        success: true,
        message: 'Hospital created successfully',
        hospital: savedHospital
      };
    } catch (error) {
      console.error('Create hospital error:', error);
      return {
        success: false,
        message: 'Failed to create hospital'
      };
    }
  }

  // Get all hospitals
  async getAllHospitals() {
    try {
      const hospitals = await this.hospitalRepository.find({
        order: { name: 'ASC' }
      });

      return {
        success: true,
        hospitals,
        count: hospitals.length
      };
    } catch (error) {
      console.error('Get all hospitals error:', error);
      return {
        success: false,
        message: 'Failed to fetch hospitals'
      };
    }
  }

  // Get hospital by ID
  async getHospitalById(id: number) {
    try {
      const hospital = await this.hospitalRepository.findOne({
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
    } catch (error) {
      console.error('Get hospital by ID error:', error);
      return {
        success: false,
        message: 'Failed to fetch hospital'
      };
    }
  }

  // Update hospital
  async updateHospital(id: number, updateData: {
    name?: string;
    address?: string;
    branch_code?: string;
    contact_info?: string;
  }) {
    try {
      const hospital = await this.hospitalRepository.findOne({
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
        const existingHospital = await this.hospitalRepository.findOne({
          where: { branch_code: updateData.branch_code }
        });

        if (existingHospital) {
          return {
            success: false,
            message: 'Hospital with this branch code already exists'
          };
        }
      }

      Object.assign(hospital, {
        ...updateData,
        updated_at: new Date()
      });

      const updatedHospital = await this.hospitalRepository.save(hospital);

      return {
        success: true,
        message: 'Hospital updated successfully',
        hospital: updatedHospital
      };
    } catch (error) {
      console.error('Update hospital error:', error);
      return {
        success: false,
        message: 'Failed to update hospital'
      };
    }
  }

  // Delete hospital
  async deleteHospital(id: number) {
    try {
      const hospital = await this.hospitalRepository.findOne({
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

      await this.hospitalRepository.remove(hospital);

      return {
        success: true,
        message: 'Hospital deleted successfully'
      };
    } catch (error) {
      console.error('Delete hospital error:', error);
      return {
        success: false,
        message: 'Failed to delete hospital'
      };
    }
  }

  // Search hospitals
  async searchHospitals(query: string) {
    try {
      const hospitals = await this.hospitalRepository
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
    } catch (error) {
      console.error('Search hospitals error:', error);
      return {
        success: false,
        message: 'Failed to search hospitals'
      };
    }
  }
} 