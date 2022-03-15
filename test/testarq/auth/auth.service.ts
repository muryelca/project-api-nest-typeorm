import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as dateformat from 'date-format';
import { rootPath } from 'get-root-path';
import { sign, verify } from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';
import * as path from 'path';
import { EmailService } from '../../core/email.service';
import { AUTH_EXPIRES_DEFAULT, AUTH_JWT_SECRET } from '../../shared/constants';
import { createUUID } from '../../shared/functions';
import { AuthDTO, AuthInputDTO } from './interfaces/auth.interface';
import { cryptoPassword, cryptoPasswordMd5, User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Service } from '../../shared/decorators/service';
import { Company } from '../company/company.entity';
import { CompanyService } from '../company/company.service';
import { RoleService } from '../role/role.service';
import { AccountService } from '../account/account.service';
import { CompanyImage, CompanyImageType } from '../company/company-image.entity';
import { AccountImage, AccountImageType } from '../account/account-image.entity';
import { UserAccount } from '../user-account/user-account.entity';
import { UserImage, UserImageType } from '../user/user-image.entity';
import { VisibilityDeviceType } from '../system-role/system-role-permission.entity';
import {
    SystemPathPermission,
    SystemViewPermissionDTO
} from '../role/interfaces/user-system-permission.interface';

@Service()
@Injectable()
export class AuthService {

    @Inject()
    protected readonly i18n: I18nService;

    @Inject()
    protected readonly emailService: EmailService;

    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => AccountService))
        private readonly accountService: AccountService,
        @Inject(forwardRef(() => CompanyService))
        private readonly companyService: CompanyService,
        @Inject(forwardRef(() => RoleService))
        private readonly roleService: RoleService) {
    }

    async resetPassword(document: string, email: string, companyId: number, linkBase: string): Promise<void> {
        const token = await this.createAccessToken(document, companyId);
        const link = `${ linkBase }/${ token }`;
        const user: User = await this.userService.getNameUserByDocument(document, companyId);
        const subject: string = await this.i18n.translate('email.request-change-password.subject', { lang: 'pt' });

        const now = new Date();
        const formatDate = await this.i18n.translate('format.data', { lang: 'pt' } );
        const dateStr: string = dateformat.asString(formatDate, now);
        const formatHour = await this.i18n.translate('format.hour.minute.second', { lang: 'pt' });
        const hourStr: string = dateformat.asString(formatHour, now);
        const html: string = await this.i18n.translate('email.request-change-password.content-html', {
            lang: 'pt',
            args: [
                {
                name: user.name,
                link: link,
                date: dateStr,
                hour: hourStr
            }]
        });

        const attachments = [{
            filename: 'siam-144x144.png',
            path: path.join(rootPath, `/libs/modules/src/assets/images/siam/siam-144x144.png`),
            cid: 'image-siam'
        }];
        this.emailService.send(subject, html, [email], attachments);
    }

    public async updateUser(token: string, entity: User): Promise<void> {
        const user: User = entity as User;
        const userToken = await this.userService.getUserByToken(token);
        if (user && userToken && user.id === userToken.id) {
            userToken._originalPassword = user._password;
            userToken._password = cryptoPassword(user._password);
            userToken._passwordConfirmation = cryptoPassword(user._passwordConfirmation);
            userToken._passwordMd5 = cryptoPasswordMd5(user._password);
            userToken.accessToken = null;
            userToken.expirationDate = null;
            await this.userService.save(userToken, true);
        } else {
            let message = {};
            message['user.user-diferente-of-token'] = 'Token doesn\'t belong to sent user!';
            throw new BadRequestException([message], 'Validation failed');
        }
    }

    async getEmailsByDocument(document: string, companyId: number): Promise<string[]> {
        let user: User = await this.userService.getUserByDocumentAndCompany(document, companyId);
        if (user) {
            if (!user.active) {
                let message = {};
                message['user.inactivated'] = 'User is inactivated. Contact the system adminstratator.';
                throw new BadRequestException([message], 'Validation failed');
            } else if (Array.isArray(user.emails) && user.emails.length > 0) {
                return user.emails.map(email => email.email);
            } else {
                let message = {};
                message['user.email-not-found'] = 'User hasn\'t e-mail registered. Contact the system adminstratator.';
                throw new BadRequestException([message], 'Validation failed');
            }
        } else {
            let message = {};
            message['user.not-found'] = 'User didn\'t found with login informed.';
            throw new BadRequestException([message], 'Validation failed');
        }
    }

    getCompanysByDocument(document: string): Promise<Company[]> {
        return this.userService.getUserActiveByDocumentAndCompany(document);
    }

    async getCompanyById(companyId: number): Promise<Company> {
        const companys: Company[] = await this.companyService.findOptions({
            select: ['id', 'corporateName'],
            where: { id: companyId }
        });
        return companys && companys.length > 0 ? companys[0] : undefined;
    }

    async validateAccessToken(token: string): Promise<User> {
        let user: User = await this.userService.getUserByToken(token);
        let valid: boolean = false;

        if (user) {
            valid = user.expirationDate.getTime() >= new Date().getTime();
        } else {
            let message = {};
            message['user.access-token-has-already-used'] = 'Sent token has already used.';
            throw new BadRequestException([message], 'Invalid access');
        }

        if (valid) {
            return user;
        } else {
            let message = {};
            message['user.access-token-expirated'] = 'Sent token is expired.';
            throw new BadRequestException([message], 'Invalid access');
        }
    }

    async login(access: AuthInputDTO): Promise<AuthDTO> {

        let user: User = await this.userService.getUserByDocumentAndCompany(access.login, access.company);
        const passHash = cryptoPassword(access.password);
        const passHashMd5 = cryptoPasswordMd5(access.password, { _originalPassword: access.password } as User);

        if (user) {
            if (!user.active) {
                let message = {};
                message['user.inactivated'] = 'User is inactivated. Contact the system adminstratator.';
                throw new UnauthorizedException([message], 'Invalid access');
            } else if (!user.webAccess) {
                let message = {};
                message['user.notWebAccess'] = 'User doesn`t have web access. Contact the system adminstratator.';
                throw new UnauthorizedException([message], 'Invalid access');
            } else if (passHash === user._password || passHashMd5 === user._passwordMd5) {
                let token: any = await this.createToken(user);
                return {
                    id: user.id,
                    name: user.name,
                    login: user.document,
                    token: token,
                    company: user.company,
                    mainCompany: user.company.mainCompany
                };
            } else {
                throw new UnauthorizedException('Invalid access');
            }
        } else {
            throw new UnauthorizedException('Invalid access');
        }
    }

    async refreshToken(access: AuthInputDTO): Promise<AuthDTO> {
        return this.login(access);
    }

    async createToken(user: any): Promise<string> {
        const expiresIn: string = AUTH_EXPIRES_DEFAULT;
        const token: string = sign({
            sub: user.id
        }, AUTH_JWT_SECRET, { expiresIn });
        return token;
    }

    verifyToken(token: string): number {
        try {
            const result = verify(token, AUTH_JWT_SECRET) as any;
            if (result && result.sub) {
                return result.sub;
            }
            return undefined;
        } catch (e) {
            return undefined;
        }
    }

    async findUserById(id: number): Promise<User> {
        return this.userService.findOne(id, {
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    userAccount: 'user.userAccounts',
                    account: 'userAccount.account'
                },
                innerJoinAndSelect: {
                    company: 'user.company'
                }
            },
            loadEagerRelations: false
            // loadRelationIds: { relations: ['company', 'userAccounts', 'account'], disableMixedMap: true }
        });
    }

    async getSystemPermissionsByUser(user: User): Promise<SystemPathPermission[]> {
        return this.roleService.getSystemPermissionPathsByUser(user);
    }

    private async createAccessToken(document: string, companyId: number) {
        let token: string = createUUID();
        await this.insertTokenInUser(document, companyId, token);
        return token;
    }

    private async insertTokenInUser(document: string, companyId: number, token: string) {
        let user = await this.userService.getUserByDocumentAndCompany(document, companyId);
        let date: Date = new Date();
        date.setUTCHours(date.getUTCHours() + 1);
        user.expirationDate = date;
        user.accessToken = token;
        await this.userService.save(user, true);
    }

    public getCompanyImageByCompanyId(id: number, type: CompanyImageType): Promise<CompanyImage> {
        return this.companyService.getImageByCompanyId(id, type);
    }

    public getCompanyImageById(id: number): Promise<CompanyImage> {
        return this.companyService.getImageById(id);
    }

    public getAccountImageByAccountId(id: number, type: AccountImageType): Promise<AccountImage> {
        return this.accountService.getImageByAccountId(id, type);
    }

    public getAccountImageById(id: number): Promise<AccountImage> {
        return this.accountService.getImageById(id);
    }

    public getUserAccountsByUserId(userId: number): Promise<UserAccount[]> {
        return this.userService.getUserAccountsByUserId(userId, true);
    }

    public getUserImageByUserIdAndImageType(userId: number, type: UserImageType): Promise<UserImage> {
        return this.userService.getImageByUserIdAndImageType(userId, type);
    }

    public getUserImageDataById(imageId: number): Promise<UserImage> {
        return this.userService.getImageDataById(imageId);
    }

    async getSystemViewPermissionsByUser(company: Company, userId: number, visibilityDeviceType: VisibilityDeviceType): Promise<SystemViewPermissionDTO[]> {
        return this.roleService.getSystemViewPermissionsByUser(company, userId, visibilityDeviceType);
    }
}
