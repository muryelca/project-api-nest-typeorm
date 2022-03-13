// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Post, Delete, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('teste')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('usuario')
  getUser(): string {
    return this.appService.getUser();
  }

  @Get('login')
  getLogin(): string {
    return this.appService.getLogin();
  }

  @Get('produto')
  getProduct(): string {
    return this.appService.getProduct();
  }

  @Get('compra')
  getSell(): string {
    return this.appService.getSell();
  }
}
