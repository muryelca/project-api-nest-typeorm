import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProductPost } from '../models/post.interface';
import { ProductService } from '../services/product.service';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    create(productPost: ProductPost, req: any): Observable<ProductPost>;
    findAll(): Observable<ProductPost[]>;
    findSelected(take?: number, skip?: number): Observable<ProductPost[]>;
    findProductById(productStringId: string): Observable<ProductPost>;
    update(id: number, productPost: ProductPost): Observable<UpdateResult>;
    delete(id: number): Observable<DeleteResult>;
}
