import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { from, Observable } from 'rxjs'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { UserPostEntity } from '../models/post.entity'
import { UserPost } from '../models/post.interface'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserPostEntity)
    private readonly userPostRepository: Repository<UserPostEntity>
  ) {}

  createPost(userPost: UserPost): Observable<UserPost> {
    return from(this.userPostRepository.save(userPost))
  }

  findAllPosts(): Observable<UserPost[]> {
    return from(this.userPostRepository.find())
  }

  findPosts(take = 10, skip = 0): Observable<UserPost[]> {
    return from(
      this.userPostRepository.findAndCount({ take, skip }).then(([posts]) => {
        return <UserPost[]>posts
      })
    )
  }

  updatePost(id: number, userPost: UserPost): Observable<UpdateResult> {
    return from(this.userPostRepository.update(id, userPost))
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.userPostRepository.delete(id))
  }

  findUserById(id: number): Observable<UserPost> {
    return from(this.userPostRepository.findOne({ id }))
  }
}
