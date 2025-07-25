import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { Role } from './Role';
// import { UserHospital } from './UserHospital';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  full_name: string;

  // @ManyToOne(() => Role, role => role.users)
  // @JoinColumn({ name: 'role_id' })
  // role: Role;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // @OneToMany(() => UserHospital, uh => uh.user)
  // userHospitals: UserHospital[];
} 