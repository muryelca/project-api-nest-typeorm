import { UserEntity } from 'src/api/auth/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_post', { schema: 'postgres' })
export class ProductPostEntity {
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
  price: string;

  @Column()
  quantity: string;

  @ManyToOne(
    () => ProductPostEntity,
    (productPostEntity) => productPostEntity.author,
  )
  author: UserEntity;
}
