import { User } from 'api/auth/models/user.interface';
export interface SellPost {
    id?: number;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    price?: string;
    quantity?: string;
    author?: User;
    isSell?: boolean;
}
