import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPostEntity } from './models/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPostEntity])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
