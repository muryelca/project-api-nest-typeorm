import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { from, Observable, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 8));
  }

  registerAccount(user: User): Observable<User> {
    const { firtName, lastName, email, password } = user;
    return this.hashPassword(password).pipe(
      switchMap((hashedPassword: string) => {
        return from(this.userRepository);
      }),
    );
  }
}
