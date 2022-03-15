import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Person, PersonType } from '../../modules/person/person';

const validator = require('br-validations');

@Injectable()
@ValidatorConstraint({ name: 'cpfValidator', async: false })
export class CpfValidator implements ValidatorConstraintInterface {
    async validate(text: string, args: ValidationArguments) {
        const object = args.object as Person;
        if (text && object.personType === PersonType.PERSON) {
            return validator.cpf.validate(text);
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `CPF ${validationArguments.value} is invalid`;
    }
}
