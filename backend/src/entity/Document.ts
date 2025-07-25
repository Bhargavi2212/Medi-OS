import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Patient } from './Patient';
import { User } from './User';
import { Hospital } from './Hospital';

@Entity('documents')
@Index(['hospital'])
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by: User;

  @ManyToOne(() => Hospital, { nullable: false })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @Column()
  type: string;

  @Column({ nullable: true })
  category?: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @Column()
  file_path: string;

  @Column({ nullable: true })
  summary?: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 