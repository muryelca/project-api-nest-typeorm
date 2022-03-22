import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: user): Observable<User> {
    return this.authService.registerAccount(user);
  }
}
