import { Observable } from 'rxjs';
import { User } from 'api/src/auth/models/user.interface';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SellPostEntity } from '../models/post.entity';
import { SellPost } from '../models/post.interface';
export declare class SellService {
    private readonly sellPostRepository;
    constructor(sellPostRepository: Repository<SellPostEntity>);
    createPost(user: User, sellPost: SellPost): Observable<SellPost>;
    findAllPosts(): Observable<SellPost[]>;
    findPosts(take?: number, skip?: number): Observable<SellPost[]>;
    updatePost(id: number, sellPost: SellPost): Observable<UpdateResult>;
    deletePost(id: number): Observable<DeleteResult>;
    findSellById(id: number): Observable<SellPost>;
}
