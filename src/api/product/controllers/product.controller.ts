// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProductPost } from '../models/post.interface';
import { ProductService } from '../services/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Body() productPost: ProductPost): Observable<ProductPost> {
    return this.productService.createPost(productPost);
  }

  @Get()
  findAll(): Observable<ProductPost[]> {
    return this.productService.findAllPosts();
  }
}
