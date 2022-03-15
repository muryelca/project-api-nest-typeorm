import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { PersonType } from '../../person/person';
import { NestApplicationContextProvider } from '../../../shared/provider/nest.provider';

@Injectable()
@ValidatorConstraint({ name: 'generalRegistrationUserUniqueValidator', async: false })
export class GeneralRegistrationUserUniqueValidator implements ValidatorConstraintInterface {
    async validate(text: string, args: ValidationArguments) {
        if (text) {
            const userArgs = args.object as User;
            if (userArgs.personType === PersonType.PERSON) {
                const applicationContext = NestApplicationContextProvider.getInstance().getApplicationContext();
                const userService: UserService = applicationContext.get(UserService.name);
                const user: User = await userService.getUserByOtherDocumentAndCompany(text, userArgs.company, PersonType.PERSON);
                if (user && userArgs && user.id !== userArgs.id) {
                    return false;
                }
            }
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `User with general registration ${validationArguments.value} already exists`;
    }
}
