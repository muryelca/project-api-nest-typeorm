import { Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserPostEntity } from '../models/post.entity';
import { UserPost } from '../models/post.interface';
export declare class UserService {
    private readonly userPostRepository;
    constructor(userPostRepository: Repository<UserPostEntity>);
    createPost(userPost: UserPost): Observable<UserPost>;
    findAllPosts(): Observable<UserPost[]>;
    findPosts(take?: number, skip?: number): Observable<UserPost[]>;
    updatePost(id: number, userPost: UserPost): Observable<UpdateResult>;
    deletePost(id: number): Observable<DeleteResult>;
    findUserById(id: number): Observable<UserPost>;
}
