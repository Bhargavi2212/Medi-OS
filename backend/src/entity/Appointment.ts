import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Patient } from './Patient';
import { User } from './User';
import { Hospital } from './Hospital';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CHECKED_IN = 'checked_in',
  IN_CONSULT = 'in_consult',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('appointments')
@Index(['hospital'])
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @ManyToOne(() => Hospital, { nullable: false })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @Column({ type: 'timestamp' })
  appointment_time: Date;

  @Column({ type: 'enum', enum: AppointmentStatus })
  status: AppointmentStatus;

  @Column({ nullable: true })
  notes?: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 