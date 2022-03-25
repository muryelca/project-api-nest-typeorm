import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SellPostEntity } from './models/post.entity';
import { SellService } from './services/sell.service';
import { SellController } from './controllers/sell.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SellPostEntity])],
  providers: [SellService],
  controllers: [SellController],
})
export class SellModule {}
