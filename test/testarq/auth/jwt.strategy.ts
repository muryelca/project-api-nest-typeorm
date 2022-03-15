import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { AUTH_JWT_SECRET } from '../../../shared/constants';
import { User } from '../../user/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: AUTH_JWT_SECRET,
            passReqToCallback: true,
        });
    }

    public async validate(request: any, payload: JwtPayload, done: Function) {
        const user: User = await this.authService.findUserById(Number(payload.sub));
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user);
    }
}
