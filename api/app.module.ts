import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { SellModule } from './sell/sell.module';
import { UserModule } from './user/user.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HEROKU_HOST,
      port: parseInt(<string>process.env.HEROKU_PORT),
      username: process.env.HEROKU_USER,
      password: process.env.HEROKU_PASSWORD,
      database: process.env.HEROKU_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    ProductModule,
    AuthModule,
    SellModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
