import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, Validate, ValidateNested } from 'class-validator';
import * as crypto from 'crypto';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { IntegrationEntity } from '../../core/interfaces/integration-entity.interface';
import { DeleteCascade } from '../../shared/decorators/delete-cascade';
import { CnpjValidator } from '../../shared/validation/cnpj.validation';
import { CpfValidator } from '../../shared/validation/cpf.validation';
import { StateRegistrationValidator } from '../../shared/validation/state-registration.validation';
import { ZipCodeValidator } from '../../shared/validation/zipCode.validation';
import { Company } from '../company/company.entity';
import { Key } from '../key/key.entity';
import { Marker } from '../marker/marker.entity';
import { Person, PersonType, personTypeToString } from '../person/person';
import { UserAccount } from '../user-account/user-account.entity';
import { UserType } from '../user-type/user-type.entity';
import { UserEmail } from './user-email.entity';
import { UserImage } from './user-image.entity';
import { UserPhone } from './user-phone.entity';
import { UserRole } from './user-role.entity';
import { UserIntegrationId } from './user.integrator.entity';
import { CnpjUserUniqueValidator } from './validation/cnpj-unique.validation';
import { CpfUserUniqueValidator } from './validation/cpf-unique.validation';
import { GeneralRegistrationUserUniqueValidator } from './validation/general-registration-unique.validation';
import { PasswordValidator } from './validation/password.validation';
import { StateRegistrationUserUniqueValidator } from './validation/state-registration-unique.validation';

export function cryptoPassword(password: string, obj?: User): string {
    let passHash;
    if (password) {
        passHash = crypto.createHmac('sha256', password).digest('hex');
    }
    return passHash;
}

export function cryptoPasswordMd5(password: string, obj?: User): string {
    let passHash;
    if (password) {
        passHash = crypto.createHash('md5').update(password).digest('hex');
    }
    return passHash;
}

@Entity('users', { schema: 'siam' })
export class User extends BaseEntity implements Person, IntegrationEntity {
    constructor(o?: Partial<User>) {
        super(o);
        Object.assign(this, o);
    }

    @ApiProperty()
    @Column({ length: 255, nullable: false })
    name: string;

    @ApiProperty({ enum: ['COMPANY', 'PERSON'] })
    @IsEnum(PersonType)
    @Transform(personTypeToString)
    @Column({ nullable: false, type: 'integer', name: 'person_type' })
    personType: PersonType;

    @DeleteCascade(true)
    @ApiProperty({ type: () => UserType })
    @Type(() => UserType)
    @ManyToOne(type => UserType, { eager: true, nullable: false })
    @JoinColumn({ name: 'user_type_id', referencedColumnName: 'id' })
    userType: UserType;

    @ApiProperty()
    @Validate(CnpjValidator)
    @Validate(CpfValidator)
    @Validate(CnpjUserUniqueValidator)
    @Validate(CpfUserUniqueValidator)
    @Column({ nullable: true, unique: true, length: 14 })
    document: string; // CNPJ/CPF

    @ApiPropertyOptional()
    @Validate(StateRegistrationValidator)
    @Validate(StateRegistrationUserUniqueValidator)
    @Validate(GeneralRegistrationUserUniqueValidator)
    @Column({ name: 'other_document', nullable: true, unique: true, length: 20 })
    otherDocument: string; // RG/IE

    @ApiPropertyOptional()
    @Column({ name: 'date_birth', nullable: true })
    dateBirth: Date;

    @ApiProperty({ type: () => UserEmail, isArray: true })
    @ValidateNested()
    @Type(() => UserEmail)
    @OneToMany(type => UserEmail, userEmail => userEmail.user, { eager: true, nullable: false, persistence: false })
    emails: UserEmail[];

    @ApiPropertyOptional({ type: type => UserPhone, isArray: true })
    @ValidateNested()
    @Type(() => UserPhone)
    @OneToMany(type => UserPhone, userPhone => userPhone.user, { eager: true, nullable: true, persistence: false })
    contacts: UserPhone[];

    @ApiPropertyOptional({ type: type => UserImage, isArray: true })
    @Exclude()
    @ValidateNested()
    @Type(() => UserImage)
    @OneToMany(type => UserImage, userImage => userImage.user, { eager: false, nullable: true, persistence: true })
    images: UserImage[];

    @ApiPropertyOptional()
    @Validate(ZipCodeValidator)
    @Column({ name: 'zipcode', nullable: true })
    zipCode: string;

    @ApiPropertyOptional()
    @Column({ name: 'public_place', nullable: true, length: 255 })
    publicPlace: string;

    @ApiPropertyOptional()
    @Column('integer', { nullable: true })
    number: number;

    @ApiPropertyOptional()
    @Column({ nullable: true, length: 255 })
    complement: string;

    @ApiPropertyOptional()
    @Column({ nullable: true, length: 255 })
    neighborhood: string;

    @ApiPropertyOptional()
    @Column({ nullable: true, length: 255 })
    city: string;

    @ApiProperty()
    @Column({ name: 'federal_unity', nullable: true, length: 2 })
    federalUnity: string;

    @ApiPropertyOptional()
    @Column({ nullable: true, length: 255 })
    block: string;

    @ApiPropertyOptional()
    @Column('integer', { nullable: true })
    floor: number;

    @ApiPropertyOptional()
    @Column({ nullable: true, length: 255 })
    apartament: string;

    @Exclude({ toPlainOnly: true })
    _originalPassword: string;

    @ApiPropertyOptional()
    @Exclude({ toPlainOnly: true })
    @Validate(PasswordValidator)
    @Column({ name: 'password', length: 255, nullable: false })
    _password: string;

    @ApiPropertyOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ name: 'password_confirmation', length: 255, nullable: false })
    _passwordConfirmation: string;

    @Exclude({ toPlainOnly: true })
    @Column({ name: 'password_md5', length: 255, nullable: false })
    _passwordMd5: string;

    @DeleteCascade(true)
    @ApiProperty({ type: () => Company })
    @Type(() => Company)
    @ManyToOne(type => Company, { eager: true, nullable: false })
    @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
    company: Company;

    @ApiPropertyOptional({ type: type => Key, isArray: true })
    @Exclude({ toPlainOnly: true })
    @ValidateNested()
    @Type(() => Key)
    @OneToMany(type => Key, key => key.user, { eager: false, nullable: false, persistence: false })
    keys: Key[];

    @ApiProperty({ type: () => UserAccount, isArray: true })
    @Exclude({ toPlainOnly: true })
    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => UserAccount)
    @OneToMany(type => UserAccount, userAccount => userAccount.user, { eager: false, nullable: false, persistence: false })
    userAccounts: UserAccount[];

    @Exclude()
    @Column({ name: 'access_token', length: 255, nullable: true })
    accessToken: string;

    @Exclude()
    @Column({ name: 'expiration_date', nullable: true })
    expirationDate: Date;

    @DeleteCascade(false)
    @ApiProperty({ type: () => Marker })
    @Type(() => Marker)
    @ManyToOne(type => Marker, { eager: true, nullable: true })
    @JoinColumn({ name: 'marker_id', referencedColumnName: 'id' })
    marker: Marker;

    @ApiPropertyOptional({ type: type => UserRole, isArray: true })
    @ValidateNested()
    @Type(() => UserRole)
    @OneToMany(type => UserRole, role => role.user, { eager: false, nullable: true, persistence: false })
    userRoles: UserRole[];

    @OneToMany(type => UserIntegrationId, integration => integration.entity)
    integrationIds: UserIntegrationId[];

    @Column({ name: 'antipassback' })
    antipassback: boolean;

    @Exclude()
    @Column({ name: 'login' })
    login: string;

    @Column({ name: 'web_access' })
    webAccess: boolean = true;

    @Column({ name: 'totp_token' })
    totptoken: string;

    @Column({ name: 'key_alternative_pin' })
    keyAlternativePIN: number;

    // User has image but the image hasn't saved yet
    // Needs because of concurrent user's and image's integration
    @Exclude()
    hasImage: boolean;

    @Exclude()
    onlyOwnRecords: boolean;

    set originalPassword(originalPassword: string) {
        this._originalPassword = originalPassword;
    }

    get originalPassword() {
        return this._originalPassword;
    }

    set password(password: string) {
        if (password) {
            this._password = cryptoPassword(password);
        }
    }

    get password() {
        return this._password;
    }

    set passwordConfirmation(passwordConfirmation: string) {
        if (passwordConfirmation) {
            this._passwordConfirmation = cryptoPassword(passwordConfirmation);
        }
    }

    get passwordConfirmation() {
        return this._passwordConfirmation;
    }

    set passwordMd5(passwordMd5: string) {
        if (passwordMd5) {
            this._passwordMd5 = cryptoPasswordMd5(passwordMd5);
        }
    }

    get passwordMd5() {
        return this._passwordMd5;
    }

    @Exclude()
    get entityDescriptionHistory() {
        return this.name;
    }
}
