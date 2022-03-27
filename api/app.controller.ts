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

  @Get('compra')
  getSell(): string {
    return this.appService.getSell();
  }
}
