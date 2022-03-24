import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SellPostEntity } from '../sell/models/post.entity';
import { SellService } from '../sell/services/sell.service';
import { SellController } from '../sell/controllers/sell.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SellPostEntity])],
  providers: [SellService],
  controllers: [SellController],
})
export class SellModule {}
