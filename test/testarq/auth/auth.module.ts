import { forwardRef, Module } from '@nestjs/common';
import { EmailService } from '../../core/email.service';
import { RabbitMQProvider } from '../../shared/provider/rabbitmq.provider';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { CompanyModule } from '../company/company.module';
import { RoleModule } from '../role/role.module';
import { SystemRoleGuard } from './system-role.guard';
import { AccountModule } from '../account/account.module';
import { AccessDeniedState } from './access-denied.state';
import { AccessLimitGuard } from './access-limit.guard';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => RoleModule),
        forwardRef(() => AccountModule)
    ],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        AuthService,
        EmailService,
        SystemRoleGuard,
        AccessLimitGuard,
        AccessDeniedState,
        RabbitMQProvider
    ],
    exports: [AuthService, SystemRoleGuard, AccessLimitGuard, AccessDeniedState]
})
export class AuthModule {
}
