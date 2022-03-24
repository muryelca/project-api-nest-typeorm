import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/api/auth/models/user.interface';
import { AuthService } from 'src/api/auth/services/auth.service';
import { SellService } from 'src/api/sell/services/sell.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private sellService: SellService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: User; params: { id: number } } = request;

    if (!user || !params) return false;

    const userId = user.id;
    const sellId = params.id;

    return this.authService.findUserbyId(userId).pipe
  }
}
