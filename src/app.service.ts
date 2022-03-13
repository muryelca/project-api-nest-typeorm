import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInit(): string {
    return 'Tela Inicial';
  }
  getLogin(): string {
    return 'Api Login';
  }
  getUser(): string {
    return 'Api Usuario';
  }
  getUsers(): string {
    return 'Api de todos os Usuarios';
  }
  getProduct(): string {
    return 'Api de Produto';
  }
  getSell(): string {
    return 'Api para Vender Produto';
  }
}
