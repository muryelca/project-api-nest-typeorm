import { User } from 'api/auth/models/user.interface';
export interface ProductPost {
    id?: number;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    price?: string;
    quantity?: string;
    author?: User;
}
