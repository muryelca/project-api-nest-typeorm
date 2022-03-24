// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtGuard } from 'src/api/auth/guards/jwt.guard';
import { IsCreatorGuard } from 'src/api/product/guards/is-creator.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SellPost } from '../models/post.interface';
import { SellService } from '../services/sell.service';

@Controller('sell')
export class SellController {
  constructor(private sellService: SellService) {}

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Post()
  create(@Body() sellPost: SellPost, @Request() req): Observable<SellPost> {
    return this.sellService.createPost(req.user, sellPost);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Get()
  findAll(): Observable<SellPost[]> {
    return this.sellService.findAllPosts();
  }
  @Get()
  findSelected(
    @Query('take') take = 1,
    @Query('skip') skip = 1,
  ): Observable<SellPost[]> {
    take = take > 15 ? 15 : take;
    return this.sellService.findPosts(take, skip);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Get(':sellId')
  findSellById(@Param('sellId') sellStringId: string): Observable<SellPost> {
    const sellId = parseInt(sellStringId);
    return this.sellService.findSellById(sellId);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() sellPost: SellPost,
  ): Observable<UpdateResult> {
    return this.sellService.updatePost(id, sellPost);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.sellService.deletePost(id);
  }
}
