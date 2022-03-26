import { ProductPostEntity } from 'api/product/models/post.entity';
import { Role } from './role.entity';
export declare class UserEntity {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    productPost: ProductPostEntity[];
    sellPost: any;
}
