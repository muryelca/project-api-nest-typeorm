import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Teste';
  }
  getLogin(): string {
    return 'Api Login';
  }
  getUser(): string {
    return 'Api Usuario';
  }
  getProduct(): string {
    return 'Api de Produto';
  }
  getSell(): string {
    return 'Api para Vender Produto';
  }
}
