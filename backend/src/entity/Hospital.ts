import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { UserHospital } from './UserHospital';

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ unique: true })
  branch_code: string;

  @Column()
  contact_info: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // @OneToMany(() => UserHospital, uh => uh.hospital)
  // userHospitals: UserHospital[];
} 