import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserPost } from '../models/post.interface';
import { UserService } from '../services/user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    create(userPost: UserPost): Observable<UserPost>;
    findAll(): Observable<UserPost[]>;
    findSelected(take?: number, skip?: number): Observable<UserPost[]>;
    findUserById(userStringId: string): Observable<UserPost>;
    update(id: number, userPost: UserPost): Observable<UpdateResult>;
    delete(id: number): Observable<DeleteResult>;
}
