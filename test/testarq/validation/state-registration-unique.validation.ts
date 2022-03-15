import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { PersonType } from '../../person/person';
import { NestApplicationContextProvider } from '../../../shared/provider/nest.provider';

@Injectable()
@ValidatorConstraint({ name: 'stateRegistrationUserUniqueValidator', async: false })
export class StateRegistrationUserUniqueValidator implements ValidatorConstraintInterface {

    async validate(text: string, args: ValidationArguments) {
        if (text) {
            const userArgs = args.object as User;
            if (userArgs.personType === PersonType.COMPANY) {
                const applicationContext = NestApplicationContextProvider.getInstance().getApplicationContext();
                const userService: UserService = applicationContext.get(UserService.name);
                const user: User = await userService.getUserByOtherDocumentAndCompany(text, userArgs.company, PersonType.COMPANY);
                if (user && userArgs && user.id !== userArgs.id) {
                    return false;
                }
            }
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `User with state registration ${validationArguments.value} already exists`;
    }
}
