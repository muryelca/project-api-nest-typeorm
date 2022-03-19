import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_post', { schema: 'postgres' })
export class UserPostEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: '' })
  body: string;

  @CreateDateColumn({ nullable: true, name: 'create_date' })
  createdAt: Date;

  @Column({ nullable: true, name: 'update_date' })
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ type: 'timestamp' })
  born: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  location: string;
}
