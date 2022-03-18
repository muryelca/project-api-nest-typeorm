import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DeleteResult, UpdateDateColumn, UpdateResult } from 'typeorm';
import { UserPost } from '../models/post.interface';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() userPost: UserPost): Observable<UserPost> {
    return this.userService.createPost(userPost);
  }

  @Get()
  findAll(): Observable<UserPost[]> {
    return this.userService.findAllPosts();
  }

  @Get(':id')
  findAny(@Param('id') id: number): Observable<UserPost> {
    return this.userService.findAnyPost(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() userPost: UserPost,
  ): Observable<UpdateResult> {
    return this.userService.updatePost(id, userPost);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.userService.deletePost(id);
  }
}