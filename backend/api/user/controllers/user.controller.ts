import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtGuard } from 'api/src/auth/guards/jwt.guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DeleteResult, UpdateDateColumn, UpdateResult } from 'typeorm';
import { UserPost } from '../models/post.interface';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() userPost: UserPost): Observable<UserPost> {
    return this.userService.createPost(userPost);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(): Observable<UserPost[]> {
    return this.userService.findAllPosts();
  }

  @UseGuards(JwtGuard)
  @Get()
  findSelected(
    @Query('take') take = 1,
    @Query('skip') skip = 1,
  ): Observable<UserPost[]> {
    take = take > 15 ? 15 : take;
    return this.userService.findPosts(take, skip);
  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  findUserById(@Param('userId') userStringId: string): Observable<UserPost> {
    const userId = parseInt(userStringId);
    return this.userService.findUserById(userId);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() userPost: UserPost,
  ): Observable<UpdateResult> {
    return this.userService.updatePost(id, userPost);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.userService.deletePost(id);
  }
}
