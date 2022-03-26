import { UserEntity } from 'api/auth/models/user.entity';
export declare class ProductPostEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    body: string;
    price: string;
    quantity: string;
    author: UserEntity;
}
