import { UserEntity } from 'api/src/auth/models/user.entity';
export declare class SellPostEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    body: string;
    price: string;
    quantity: string;
    author: UserEntity;
    isSell: boolean;
}
