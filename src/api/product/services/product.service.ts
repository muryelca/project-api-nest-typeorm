import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { User } from 'src/api/auth/models/user.interface';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProductPostEntity } from '../models/post.entity';
import { ProductPost } from '../models/post.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductPostEntity)
    private readonly productPostRepository: Repository<ProductPostEntity>,
  ) {}

  createPost(user: User, productPost: ProductPost): Observable<ProductPost> {
    productPost.author = user;
    return from(this.productPostRepository.save(productPost));
  }

  findAllPosts(): Observable<ProductPost[]> {
    return from(this.productPostRepository.find());
  }
  findPosts(take = 10, skip = 0): Observable<ProductPost[]> {
    return from(
      this.productPostRepository
        .findAndCount({ take, skip })
        .then(([posts]) => {
          return <ProductPost[]>posts;
        }),
    );
  }

  updatePost(id: number, productPost: ProductPost): Observable<UpdateResult> {
    return from(this.productPostRepository.update(id, productPost));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.productPostRepository.delete(id));
  }

  findProductById(id: number): Observable<ProductPost> {
    return from(this.productPostRepository.findOne({ id }));
  }
}
