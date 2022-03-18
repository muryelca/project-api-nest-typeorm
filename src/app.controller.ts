// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Post, Delete, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInit(): string {
    return this.appService.getInit();
  }

  /* @Get('user')
  getUser(): string {
    return this.appService.getUser();
  }
*/
  @Get('users')
  getUsers(): string {
    return this.appService.getUsers();
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
