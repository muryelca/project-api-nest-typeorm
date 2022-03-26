import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SellPost } from '../models/post.interface';
import { SellService } from '../services/sell.service';
export declare class SellController {
    private sellService;
    constructor(sellService: SellService);
    create(sellPost: SellPost, req: any): Observable<SellPost>;
    findAll(): Observable<SellPost[]>;
    findSelected(take?: number, skip?: number): Observable<SellPost[]>;
    findSellById(sellStringId: string): Observable<SellPost>;
    update(id: number, sellPost: SellPost): Observable<UpdateResult>;
    delete(id: number): Observable<DeleteResult>;
}
