import { Inject, Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { PersonType } from '../../person/person';
import { NestApplicationContextProvider } from '../../../shared/provider/nest.provider';

@Injectable()
@ValidatorConstraint({ name: 'cnpjUserUniqueValidator', async: false })
export class CnpjUserUniqueValidator implements ValidatorConstraintInterface {

    async validate(text: string, args: ValidationArguments) {
        if (text) {
            const userArgs = args.object as User;
            if (userArgs.personType === PersonType.COMPANY) {
                const applicationContext = NestApplicationContextProvider.getInstance().getApplicationContext();
                const userService: UserService = applicationContext.get(UserService.name);
                const user: User = await userService.getUserByDocumentAndCompany(text, userArgs.company.id, PersonType.COMPANY);
                if (user && userArgs && user.id !== userArgs.id) {
                    return false;
                }
            }
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `User with CNPJ ${validationArguments.value} already exists`;
    }
}
