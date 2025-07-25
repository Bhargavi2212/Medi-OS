import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from './User';
import { Hospital } from './Hospital';

@Entity('audit_logs')
@Index(['hospital'], { })
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Hospital, { nullable: false })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @Column()
  action: string;

  @Column({ nullable: true })
  details?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 