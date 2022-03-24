import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { User } from 'src/api/auth/models/user.interface';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SellPostEntity } from '../models/post.entity';
import { SellPost } from '../models/post.interface';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(SellPostEntity)
    private readonly sellPostRepository: Repository<SellPostEntity>,
  ) {}

  createPost(user: User, sellPost: SellPost): Observable<SellPost> {
    sellPost.author = user;
    return from(this.sellPostRepository.save(sellPost));
  }

  findAllPosts(): Observable<SellPost[]> {
    return from(this.sellPostRepository.find());
  }
  findPosts(take = 10, skip = 0): Observable<SellPost[]> {
    return from(
      this.sellPostRepository.findAndCount({ take, skip }).then(([posts]) => {
        return <SellPost[]>posts;
      }),
    );
  }

  updatePost(id: number, sellPost: SellPost): Observable<UpdateResult> {
    return from(this.sellPostRepository.update(id, sellPost));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.sellPostRepository.delete(id));
  }

  findSellById(id: number): Observable<SellPost> {
    return from(
      this.sellPostRepository.findOne({ id }, { relations: ['author'] }),
    );
  }
}
