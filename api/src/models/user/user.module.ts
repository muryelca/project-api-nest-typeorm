import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPostEntity } from './models/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPostEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
