import { ProductPostEntity } from 'src/api/product/models/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('user', { schema: 'postgres' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(
    () => ProductPostEntity,
    (productPostEntity) => productPostEntity.author,
  )
  productPost: ProductPostEntity[];
}
