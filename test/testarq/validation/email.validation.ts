import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
const validator = require('br-validations');

@Injectable()
@ValidatorConstraint({ name: "emailValidator", async: false })
export class EmailValidator implements ValidatorConstraintInterface {

    constructor() {}

    async validate(text: string, args: ValidationArguments) {
        if(text) {
            const valid = /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(text);
            return valid;
        } else {
            return true;
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Email ${validationArguments.value} is invalid`;
    }
}