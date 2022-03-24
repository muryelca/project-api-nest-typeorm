import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SellPostEntity } from '../sell/models/post.entity';
import { SellService } from '../sell/services/sell.service';
import { SellController } from '../sell/controllers/sell.controller';
import { IsCreatorGuard } from '../product/guards/is-creator.guard';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SellPostEntity])],
  providers: [SellService, IsCreatorGuard],
  controllers: [SellController],
})
export class SellModule {}
