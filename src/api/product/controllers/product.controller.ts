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
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProductPost } from '../models/post.interface';
import { ProductService } from '../services/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() productPost: ProductPost,
    @Request() req,
  ): Observable<ProductPost> {
    return this.productService.createPost(req.user, productPost);
  }

  @Get()
  findAll(): Observable<ProductPost[]> {
    return this.productService.findAllPosts();
  }
  @Get()
  findSelected(
    @Query('take') take = 1,
    @Query('skip') skip = 1,
  ): Observable<ProductPost[]> {
    take = take > 15 ? 15 : take;
    return this.productService.findPosts(take, skip);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() productPost: ProductPost,
  ): Observable<UpdateResult> {
    return this.productService.updatePost(id, productPost);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.productService.deletePost(id);
  }
}
