import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQProvider } from '../../shared/provider/rabbitmq.provider';
import { CnpjValidator } from '../../shared/validation/cnpj.validation';
import { CpfValidator } from '../../shared/validation/cpf.validation';
import { EmailValidator } from '../../shared/validation/email.validation';
import { PhoneValidator } from '../../shared/validation/phone.validation';
import { StateRegistrationValidator } from '../../shared/validation/state-registration.validation';
import { ZipCodeValidator } from '../../shared/validation/zipCode.validation';
import { DeviceModule } from '../device/device.module';
import { KeyModule } from '../key/key.module';
import { ReaderModule } from '../reader/reader.module';
import { RoleModule } from '../role/role.module';
import { UserAccountModule } from '../user-account/user-account.module';
import { UserTypeModule } from '../user-type/user-type.module';
import { UserViewPreferenceModule } from '../user-view-preference/user-view-preference.module';
import { UserImage } from './user-image.entity';
import { UserImageHistory } from './history/user-email.history.entity';
import { UserHistory } from './history/user.history.entity';
import { UserEmail } from './user-email.entity';
import { UserPhone } from './user-phone.entity';
import { UserRole } from './user-role.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CnpjUserUniqueValidator } from './validation/cnpj-unique.validation';
import { CpfUserUniqueValidator } from './validation/cpf-unique.validation';
import { GeneralRegistrationUserUniqueValidator } from './validation/general-registration-unique.validation';
import { StateRegistrationUserUniqueValidator } from './validation/state-registration-unique.validation';
import { AuthModule } from '../auth/auth.module';
import { UserEmailHistory } from './history/user-image.history.entity';
import { UserPhoneHistory } from './history/user-phone.history.entity';
import { UserRoleHistory } from './history/user-role.history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserEmail, UserPhone, UserImage, UserRole, UserHistory, UserImageHistory, UserEmailHistory, UserPhoneHistory, UserRoleHistory]),
        forwardRef(() => UserAccountModule),
        forwardRef(() => KeyModule),
        forwardRef(() => DeviceModule),
        forwardRef(() => UserViewPreferenceModule),
        forwardRef(() => RoleModule),
        forwardRef(() => ReaderModule),
        forwardRef(() => AuthModule),
        forwardRef(() => UserTypeModule),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        ZipCodeValidator,
        EmailValidator,
        PhoneValidator,
        CnpjValidator,
        CpfValidator,
        CnpjUserUniqueValidator,
        CpfUserUniqueValidator,
        StateRegistrationValidator,
        StateRegistrationUserUniqueValidator,
        GeneralRegistrationUserUniqueValidator,
        RabbitMQProvider,
    ],
    exports: [UserService],
})
export class UserModule { }
