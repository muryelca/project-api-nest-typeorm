import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { User } from '../user.entity';

@Injectable()
@ValidatorConstraint({ name: 'passwordValidator', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {

    // 2. check whether the entered password has a number
    private readonly NUMBER_PATTERN: RegExp = /\d/;
    // 3. check whether the entered password has upper case letter
    private readonly CAPITAL_CASE_PATTERN: RegExp = /[A-Z]/;
    // 4. check whether the entered password has a lower-case letter
    private readonly SMALL_CASE_PATTER: RegExp = /[a-z]/;

    private readonly MIN_LENGTH = 6;
    private readonly MAX_LENGTH = 24;

    constructor() {
    }

    async validate(text: string, args: ValidationArguments) {
        if (text) {
            let userArgs = args.object as User;
            if (userArgs._passwordConfirmation && text !== userArgs._passwordConfirmation) {
                return false;
            }
            let originalPassword = userArgs._originalPassword;
            if (originalPassword) {
                if (!this.NUMBER_PATTERN.test(originalPassword) || !this.CAPITAL_CASE_PATTERN.test(originalPassword) || !this.SMALL_CASE_PATTER.test(originalPassword)
                    || originalPassword.length > this.MAX_LENGTH || originalPassword.length < this.MIN_LENGTH) {
                    return false;
                }
            }
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Password is invalid`;
    }
}
