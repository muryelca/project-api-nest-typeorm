import { ProductPost } from 'api/product/models/post.interface';
import { Role } from './role.entity';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: Role;
  posts?: ProductPost[];
}
