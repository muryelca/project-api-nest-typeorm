import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPostEntity } from '../models/post.entity';
import { UserPost } from '../models/post.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserPostEntity)
    private readonly userPostRepository: Repository<UserPostEntity>,
  ) {}

  createPost(userPost: UserPost) {
    return this.userPostRepository.save(userPost);
  }
}
