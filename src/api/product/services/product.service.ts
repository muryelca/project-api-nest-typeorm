import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ProductPostEntity } from '../models/post.entity';
import { ProductPost } from '../models/post.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductPostEntity)
    private readonly productPostRepository: Repository<ProductPostEntity>,
  ) {}

  createPost(productPost: ProductPost): Observable<ProductPost> {
    return from(this.productPostRepository.save(productPost));
  }

  findAllPosts(): Observable<ProductPost[]> {
    return from(this.productPostRepository.find());
  }
}
