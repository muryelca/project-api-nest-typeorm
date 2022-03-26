import { Observable } from 'rxjs';
import { User } from 'api/src/auth/models/user.interface';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProductPostEntity } from '../models/post.entity';
import { ProductPost } from '../models/post.interface';
export declare class ProductService {
    private readonly productPostRepository;
    constructor(productPostRepository: Repository<ProductPostEntity>);
    createPost(user: User, productPost: ProductPost): Observable<ProductPost>;
    findAllPosts(): Observable<ProductPost[]>;
    findPosts(take?: number, skip?: number): Observable<ProductPost[]>;
    updatePost(id: number, productPost: ProductPost): Observable<UpdateResult>;
    deletePost(id: number): Observable<DeleteResult>;
    findProductById(id: number): Observable<ProductPost>;
}
