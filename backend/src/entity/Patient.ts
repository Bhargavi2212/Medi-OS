import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Hospital } from './Hospital';

@Entity('patients')
@Index(['abha_id'])
@Index(['hospital'])
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  abha_id?: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'date' })
  dob: string;

  @Column()
  gender: string;

  @Column()
  contact_number: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  blood_group?: string;

  @Column('text', { array: true, nullable: true })
  allergies?: string[];

  @Column('text', { array: true, nullable: true })
  existing_conditions?: string[];

  @ManyToOne(() => Hospital, { nullable: false })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 