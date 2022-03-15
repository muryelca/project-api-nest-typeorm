import { Injectable, Inject } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { UserService } from "../user.service";
import { User } from "../user.entity";
import { PersonType } from "../../person/person";
import { NestApplicationContextProvider } from '../../../shared/provider/nest.provider';

@Injectable()
@ValidatorConstraint({ name: "cpfUserUniqueValidator", async: false })
export class CpfUserUniqueValidator implements ValidatorConstraintInterface {

    async validate(text: string, args: ValidationArguments) {
        if (text) {
            const userArgs = args.object as User;
            if (userArgs.personType === PersonType.PERSON) {
                const applicationContext = NestApplicationContextProvider.getInstance().getApplicationContext();
                const userService: UserService = applicationContext.get(UserService.name);
                const user: User = await userService.getUserByDocumentAndCompany(text, userArgs.company.id, PersonType.PERSON);
                if (user && userArgs && user.id !== userArgs.id) {
                    return false;
                }
            }
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `User with CPF ${validationArguments.value} already exists`;
    }
}
