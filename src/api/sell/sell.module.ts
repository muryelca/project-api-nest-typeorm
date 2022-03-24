import { Module } from '@nestjs/common';
import { SellService } from './services/sell.service';
import { SellController } from './controllers/sell.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellPostEntity } from './models/post.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SellPostEntity])],
  providers: [SellService],
  controllers: [SellController],
})
export class SellModule {}
