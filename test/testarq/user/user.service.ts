import { BadGatewayException, BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { serialize } from 'class-transformer';
import * as crypto from 'crypto';
import { getCustomRepository, In, Repository, SelectQueryBuilder } from 'typeorm';
import { isNullOrUndefined, isUndefined } from 'util';
import { BaseService } from '../../core/base.service';
import { Service } from '../../shared/decorators/service';
import { Company } from '../company/company.entity';
import { Account } from '../account/account.entity';
import { Device } from '../device/device.entity';
import { DeviceService } from '../device/device.service';
import { RootType } from '../key-root-type/key-root-type.entity';
import { Key } from '../key/key.entity';
import { KeyService } from '../key/key.service';
import { PersonType } from '../person/person';
import { Reader } from '../reader/reader.entity';
import { ReaderService } from '../reader/reader.service';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { SyncData } from '../sync-data/sync-data.entity';
import { UserAccount } from '../user-account/user-account.entity';
import { UserAccountService } from '../user-account/user-account.service';
import { UserType } from '../user-type/user-type.entity';
import { UserTypeService } from '../user-type/user-type.service';
import { UserViewPreferenceService } from '../user-view-preference/user-view-preference.service';
import { UserHistory } from './history/user.history.entity';
import { UserEmail } from './user-email.entity';
import { UserImage, UserImageType } from './user-image.entity';
import { UserPhone } from './user-phone.entity';
import { UserRole } from './user-role.entity';
import { cryptoPassword, cryptoPasswordMd5, User } from './user.entity';
import { UserIntegrationId } from './user.integrator.entity';
import {
    UserEmailRepository,
    UserHistoryRepository,
    UserImageHistoryRepository,
    UserImageRepository,
    UserIntegrationIdRepository as UserIntegrationIdRepository,
    UserPhoneRepository,
    UserRepository,
    UserRoleRepository,
} from './user.repository';
import { getUniqueObjectsArray } from '../../shared/functions';
import { Cache, CacheEvict, CacheParam } from '../../shared/decorators/cache';
import { LabelEmail } from '../../shared/enum/label-email';
import { LabelPhone } from '../../shared/enum/label-phone';
import { VisitUserDTO } from '../visit-user/interface/visit-user.interface';
import { MicroservicePattern } from '../../shared/enum/microservice-pattern';

@Service()
@Injectable()
export class UserService extends BaseService<User, UserHistory> {

    private readonly LOGGER: Logger = new Logger(UserService.name);
    private readonly MASTER_USER_ID: number = 1;
    private readonly MASTER_USER_NAME: string = '.:SIAM:.';
    private readonly MASTER_USER_PASSWORD: number = 51416;

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
        @Inject('UserEmailRepository')
        private readonly userEmailRepository: UserEmailRepository,
        @Inject('UserPhoneRepository')
        private readonly userPhoneRepository: UserPhoneRepository,
        @Inject('UserImageRepository')
        private readonly userImageRepository: UserImageRepository,
        @Inject('UserRoleRepository')
        private readonly userRoleRepository: UserRoleRepository,
        @Inject('UserHistoryRepository')
        private readonly userHistoryRepository: UserHistoryRepository,
        @Inject('UserImageHistoryRepository')
        private readonly userImageHistoryRepository: UserImageHistoryRepository,
        @Inject(forwardRef(() => UserAccountService))
        private readonly userAccountService: UserAccountService,
        @Inject(forwardRef(() => KeyService))
        private readonly keyService: KeyService,
        @Inject(forwardRef(() => ReaderService))
        private readonly readerService: ReaderService,
        @Inject(forwardRef(() => DeviceService))
        private readonly deviceService: DeviceService,
        @Inject('UserViewPreferenceService')
        private readonly userViewPreferenceService: UserViewPreferenceService,
        @Inject('RoleService')
        private readonly roleService: RoleService,
        @Inject('UserTypeService')
        private readonly userTypeService: UserTypeService) {

        super(userRepository, userHistoryRepository, getCustomRepository(UserIntegrationIdRepository));
    }

    async checkKeyWeb(user: User) {

        let key: Key = await this.keyService.getKeyByUserAndRootType(user, RootType.WEB);
        if (isNullOrUndefined(key)) {

            user.keys = user.keys || [];
            key = await this.keyService.createKeyWeb(user);
            if (!isNullOrUndefined(key)) {
                user.keys.push(key);
            }
        }
    }

    async loadEntityToDelete(id: number, currentUser: User) {
        return await this.genericRepository.findOne(id, { relations: ['userAccounts', 'integrationIds'] });
    }

    async getUserToMerge(currentUser: User): Promise<any> {
        let mainCompany: boolean = currentUser.company.mainCompany;
        let companyId: number = currentUser.company.id;

        let whereCompany = (mainCompany) ? ' where ' : ` where u1.company_id = ${companyId} and `;
        return this.userRepository.query(' select u1.id, ' +
            '       u1.name, ' +
            '       u1.person_type as "personType", ' +
            '       u1.document, ' +
            '       up1.phone ' +
            ' from siam.users u1 ' +
            ' left join siam.user_phones up1 on up1.user_id = u1.id ' +
            ` ${whereCompany} ` +
            '    (exists (select u2.id from siam.users u2 where u2.company_id = u1.company_id and u2.document = u1.document and u2.id <> u1.id and u1.document is not null and u1.document <> \'\') ' +
            '    or exists (select up2.id from siam.users u2 inner join siam.user_phones up2 on up2.user_id = u2.id where u2.company_id = u1.company_id and up2.phone = up1.phone and up2.id <> up1.id and up1.phone is not null and up1.phone <> \'\')) ' +
            ' group by u1.id, u1.name, u1.person_type, u1.document, up1.phone ' +
            ' order by u1.document, up1.phone, u1.id ');
    }

    async findUnrelatedUsersByDevice(device: Device): Promise<User[]> {
        return this.userRepository.createQueryBuilder('user')
            .addSelect(['company', 'emails', 'contacts', 'marker', 'userType'])
            .innerJoin('user.company', 'company')
            .innerJoin('user.userType', 'userType')
            .innerJoin('user.userAccounts', 'userAccounts')
            .innerJoin('userAccounts.account', 'account')
            .leftJoin('user.emails', 'emails')
            .leftJoin('user.contacts', 'contacts')
            .leftJoin('user.marker', 'marker')
            .where(qb => {
                const subQuery = qb.subQuery()
                    .select('1')
                    .from(UserIntegrationId, 'uii')
                    .where('uii.entity.id = user.id')
                    .andWhere('uii.device.id = :device_id')
                    .getQuery();
                return 'not exists ' + subQuery;
            })
            .andWhere('company.id = :company_id')
            .andWhere('account.id = :account_id')
            .setParameter('device_id', device.id)
            .setParameter('company_id', device.company.id)
            .setParameter('account_id', device.account.id)
            .orderBy('user.id')
            .getMany();
    }

    async findUnrelatedUsersByReader(reader: Reader): Promise<User[]> {
        return this.userRepository.createQueryBuilder('user')
            .addSelect(['company', 'emails', 'contacts', 'marker', 'userType'])
            .innerJoin('user.company', 'company')
            .innerJoin('user.userType', 'userType')
            .innerJoin('user.userAccounts', 'userAccounts')
            .innerJoin('userAccounts.account', 'account')
            .leftJoin('user.emails', 'emails')
            .leftJoin('user.contacts', 'contacts')
            .leftJoin('user.marker', 'marker')
            .where(qb => {
                const subQuery = qb.subQuery()
                    .select('1')
                    .from(UserIntegrationId, 'uii')
                    .where('uii.entity.id = user.id')
                    .andWhere('uii.reader.id = :reader_id')
                    .getQuery();
                return 'not exists ' + subQuery;
            })
            .andWhere('company.id = :company_id')
            .andWhere('account.id = :account_id')
            .setParameter('reader_id', reader.id)
            .setParameter('company_id', reader.company.id)
            .setParameter('account_id', reader.account.id)
            .orderBy('user.id')
            .getMany();
    }

    async merge(idsToMerge: [[number]], currentUser: User) {
        for (const ids of idsToMerge) {
            const users = await this.userRepository.findByIds(ids, { relations: ['userAccounts', 'keys', 'integrationIds', 'images', 'userRoles'] });
            const minId = Math.min(...users.map(u => u.id));
            const userBase: User = users.find(u => u.id === minId);
            const usersToMerge: User[] = users.filter(u => u.id !== minId);

            await this.mergeUsers(userBase, usersToMerge, currentUser);
        }
    }

    async activate(id: number, currentUser: User): Promise<any> {
        let activate = await super.activate(id, currentUser);
        await this.activateUserAccount(id, currentUser);
        await this.activateKeys(id, currentUser);

        await this.export(activate);
        return new Promise<User>(async (resolve) => {
            resolve(activate);
        });
    }

    async inactivate(id: number, currentUser: User): Promise<any> {
        let inactivate = await super.inactivate(id, currentUser);

        await this.inactivateUserAccount(id, currentUser);
        await this.inactivateKeys(id, currentUser);

        await this.export(inactivate);
        return new Promise<User>(async (resolve) => {
            resolve(inactivate);
        });
    }

    public async exportUserByUserAccount(userAccount: UserAccount) {
        let user: User = await this.userRepository.findOne(userAccount.user.id);
        this.export(user);
    }

    public async exportUserImage(entity: UserImage) {
        entity.fileImage = undefined; // remove buffer file because of serialize
        let syncData: SyncData = this.getSyncDataUserImage(entity, undefined, MicroservicePattern.USER_IMAGE_EXPORT);
        let serializedEntity = serialize(syncData, { ignoreDecorators: true, enableCircularCheck: true });
        this.client.send({ key: MicroservicePattern.USER_IMAGE_EXPORT, parallel: false }, serializedEntity).toPromise();

        return new Promise<UserImage>(async (resolve) => {
            resolve(entity);
        });
    }

    public async removeUserImages(entity: UserImage) {
        entity.fileImage = undefined; // remove buffer file because of serialize
        let syncData: SyncData = this.getSyncDataUserImage(entity, undefined, MicroservicePattern.USER_IMAGE_REMOVE);
        let serializedEntity = serialize(syncData, { ignoreDecorators: true, enableCircularCheck: true });
        this.client.send({ key: MicroservicePattern.USER_IMAGE_REMOVE, parallel: false }, serializedEntity).toPromise();

        return new Promise<UserImage>(async (resolve) => {
            resolve(entity);
        });
    }

    async exportUserKeys(user: User) {
        const keys = await this.keyService.find({ user: user });
        this.keyService.exportKeys(keys);
    }

    async exportUserRoles(user: User, ignoredDevice?: Device, onlyCreate?: boolean) {
        let userRoles: UserRole[] = await this.getUserRolesByUserIdCacheble(user.id);
        if (Array.isArray(userRoles) && userRoles.length > 0) {
            let roles: Role[] = userRoles.map(userRole => userRole.role);
            await this.roleService.publishRoleToExportSync(roles, ignoredDevice, onlyCreate, true);
        }
    }

    getUserByDocumentAndCompany(document: string, companyId?: number, personType?: PersonType): Promise<User> {
        try {
            let whereCondition: any = { document: document };
            if (!isUndefined(companyId)) {
                whereCondition.company = { id: companyId };
            }
            if (!isUndefined(personType)) {
                whereCondition.personType = personType;
            }
            return <Promise<User>>this.userRepository.findOne({
                where: [whereCondition],
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    async getUserActiveByDocumentAndCompany(document: string): Promise<Company[]> {
        let companys: Company[];
        try {
            let whereCondition: any = { document: document, active: true };
            let users: User[] = await this.userRepository.find({ where: [whereCondition] });

            if (users && users.length > 0) {
                companys = users.filter(user => user.active).map(user => {
                    const company = user.company;
                    return {
                        id: company.id,
                        document: company.document,
                        otherDocument: company.otherDocument,
                        corporateName: company.corporateName,
                        fantasyName: company.corporateName,
                    } as Company;
                });
                companys = getUniqueObjectsArray(companys, 'id');
            }
            return companys;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getNameUserByDocument(document: string, companyId: number): Promise<User> {
        try {
            return <Promise<User>>this.userRepository.findOne({
                select: ['id', 'name'],
                where: { document: document, company: { id: companyId } },
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getUserByToken(token: string): Promise<User> {
        try {
            return <Promise<User>>this.userRepository.findOne({
                where: { accessToken: token },
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getUserByPhoneAndCompanyId(phone: string, companyId: number): Promise<User> {
        try {
            return <Promise<User>>this.userRepository.createQueryBuilder('user')
                .innerJoin('user.contacts', 'contacts', 'contacts.phone = :phone', { phone })
                .innerJoin('user.company', 'company', 'company.id = :companyId', { companyId })
                .getOne();
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getUserAccountsByUserIdAndAccountId(userId: number, accountId: number): Promise<UserAccount> {
        try {
            return this.userAccountService.getUserAccountsByUserIdAndAccountId(userId, accountId);
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    activeUserAccount(userAccountId: number, currentUser: any): Promise<UserAccount> {
        return this.userAccountService.activate(userAccountId, currentUser);
    }

    createUserAccount(userAccount: UserAccount, currentUser: any): Promise<UserAccount> {
        return this.userAccountService.create(userAccount);
    }

    getUserByOtherDocumentAndCompany(otherDocument: string, company: Company, personType: PersonType): Promise<User> {
        try {
            return <Promise<User>>this.userRepository.findOne({
                where: [{ otherDocument: otherDocument, company: { id: company.id }, personType: personType }],
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    async getDevicesByUser(user: User): Promise<Device[]> {
        let userAccounts: UserAccount[] = await this.getUserAccountsByUserId(user.id);
        user.userAccounts = userAccounts;
        return this.deviceService.getDevicesByUser(user);
    }

    getDevicesByAccountId(...accountsId: number[]): Promise<Device[]> {
        return this.deviceService.getDevicesByAccountId(...accountsId);
    }

    getUserAccountsByUserId(id: number, active?: boolean): Promise<UserAccount[]> {
        return this.userAccountService.getUserAccountsByUserId(id, active);
    }

    @Cache({ key: 'getUserRolesByUserId_#id', ttl: 10 })
    async getUserRolesByUserIdCacheble(@CacheParam('id') id: number): Promise<UserRole[]> {
        return this.getUserRolesByUserId(id);
    }

    async getUserRolesByUserId(id: number): Promise<UserRole[]> {
        try {
            return this.userRoleRepository.createQueryBuilder('userRole')
                .select(['userRole.id', 'role.id', 'role.name', 'role.administrator', 'company.id', 'company.corporateName', 'company.city', 'account.id', 'account.corporateName', 'account.city', 'systemRole.id', 'systemRole.name', 'systemRole.api'])
                .innerJoin('userRole.user', 'user', 'user.id = :id', { id })
                .innerJoin('userRole.role', 'role')
                .innerJoin('role.company', 'company')
                .leftJoin('role.systemRole', 'systemRole')
                .leftJoin('role.account', 'account').getMany();
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getKeysByUserId(id: number): Promise<Key[]> {
        return this.keyService.getKeysByUserId(id);
    }

    countImagesByUserId(idUser: number, key?: boolean): Promise<number> {
        try {
            let where = { user: { id: idUser } };
            if (key) {
                where['key'] = key;
            }
            return this.userImageRepository.count({
                where: [where],
                order: { order: 'ASC' },
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getImagesByUserId(idUser: number, key?: boolean, count?: number): Promise<UserImage[]> {
        try {
            let where = { user: { id: idUser } };
            if (key) {
                where['key'] = key;
            }
            return this.userImageRepository.find({
                where: [where],
                take: (count || 999),
                order: { order: 'ASC' },
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    countImageByUserIdAndImageType(idUser: number, ...type: UserImageType[]): Promise<number> {
        try {
            return this.userImageRepository.count({
                where: [{ type: In(type), user: { id: idUser } }],
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getImageByUserIdAndImageType(idUser: number, ...type: UserImageType[]): Promise<UserImage> {
        try {
            return this.userImageRepository.findOne({
                where: [{ type: In(type), user: { id: idUser } }],
                order: { order: 'ASC' },
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getImageDataById(idImage: number): Promise<UserImage> {
        try {
            return this.userImageRepository.findOne({
                select: ['id', 'name', 'fileType', 'fileImage', 'order'],
                where: [{ id: idImage }],
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getImageHistoryDataByIdAndRevision(idImage: number, revision: number): Promise<UserImage> {
        try {
            return this.userImageHistoryRepository.findOne({
                select: ['id', 'name', 'fileType', 'fileImage', 'order'],
                where: [{ entityId: idImage, revision: revision }],
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    async getUserByUserImageId(idImage: number): Promise<User> {
        try {
            let image = await this.userImageRepository.findOne(idImage,
                {
                    select: ['id', 'user'],
                    relations: ['user'],
                });
            return image.user;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    createUserImageEntity(): UserImage {
        return this.userImageRepository.create();
    }

    async createUserImage(idUser: number, entity: UserImage, buffer: any): Promise<UserImage> {
        try {
            let user = await this.genericRepository.findOne(idUser);
            if (user == null) {
                throw new BadRequestException('Entity not found', `Entity with id ${idUser} not found`);
            } else {
                let image = await this.createImage(entity, user, buffer);
                this.exportUserImage(image);
                return image;
            }
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    createImage(entity: UserImage, user: User, buffer: any): Promise<UserImage> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                if (isUndefined(entity.order) || (entity.order == 0 && entity.type == UserImageType.OTHER)) {
                    let result = await this.getMaxOrderImageUser(user);
                    let max = result.max;
                    if (max == 0) {
                        max = 2;
                    }
                    entity.order = max + 1;
                }
                entity.user = user;
                entity.fileImage = buffer;
                let created = await this.userImageRepository.save(entity);
                resolve(created);
            } catch (err) {
                reject(err);
            }
        });
    }

    async updateUserImage(id: number, idImage: number, entity: UserImage, buffer: any): Promise<UserImage> {
        try {
            let user = await this.genericRepository.findOne(id);
            if (user == null) {
                throw new BadRequestException('Entity not found', `Entity with id ${id} not found`);
            } else {
                let image = await this.updateImage(idImage, entity, user, buffer);
                this.exportUserImage(image);
                return image;
            }
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    updateImage(idImage: number, entity: UserImage, user: User, buffer: any): Promise<UserImage> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                let responseGet = await this.userImageRepository.findOne(idImage);
                if (responseGet == null) {
                    throw new BadRequestException('Entity not found', `Entity with id ${idImage} not found`);
                } else {
                    entity.user = user;
                    entity.fileImage = buffer;
                    entity.id = Number(idImage);
                    let updated = await this.userImageRepository.save(entity);
                    updated.user = user;
                    resolve(updated);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    saveImage(image: UserImage): Promise<UserImage> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                let updated = await this.userImageRepository.save(image);
                resolve(updated);
            } catch (err) {
                reject(err);
            }
        });
    }

    async removeImage(idImage: number, currentUser: User): Promise<any> {
        try {
            let entity = await this.userImageRepository.findOne(idImage,
                {
                    select: ['id', 'user', 'type'],
                    relations: ['user'],
                });
            if (entity == null) {
                throw new BadRequestException('Entity not found', `Entity with id ${idImage} not found`);
            }

            //Required to log history
            entity.currentUser = currentUser;
            entity.currentUserId = currentUser.id;
            this.removeUserImages(entity);
            return this.userImageRepository.remove(entity);
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getPhoneByType(user: User, type: LabelPhone): string {
        let contact: UserPhone = user.contacts.filter(c => c.label === type)[0];
        if (contact) {
            return contact.phone;
        }
        return null;
    }

    addDefaultEmail(user: User, email: string) {
        const userEmail: UserEmail = this.userEmailRepository.create();
        userEmail.user = user;
        userEmail.email = email;
        userEmail.label = LabelEmail.NO_LABEL;
        user.emails = user.emails || [];
        user.emails.push(userEmail);
    }

    addDefaultPhone(user: User, phone: string) {
        const userPhone: UserPhone = this.userPhoneRepository.create();
        userPhone.user = user;
        userPhone.phone = phone;
        userPhone.label = LabelPhone.NO_LABEL;
        user.contacts = user.contacts || [];
        user.contacts.push(userPhone);
    }

    addUserAccount(user: User, account: Account): UserAccount {
        const userAccount: UserAccount = this.userAccountService.createEntity();
        userAccount.user = user;
        userAccount.account = account;
        if (isUndefined(user.userAccounts)) {
            user.userAccounts = [];
        }
        user.userAccounts.push(userAccount);
        return userAccount;
    }

    public async inactivateKeysByUserId(userId: number) {
        this.inactivateKeys(userId, undefined, false);
    }

    async insertUserRole(id: number, idRole: number): Promise<UserRole> {
        let user: User = await this.genericRepository.findOne({ relations: ['company'], where: { id: id } });
        if (user == null) {
            throw new BadRequestException('Entity not found', `Entity with id ${id} not found`);
        }
        let role: Role = await this.roleService.get(idRole);
        if (user == null) {
            throw new BadRequestException('Entity not found', `Entity with id ${idRole} not found`);
        }
        return this.createUserRole(user, role);
    }

    @CacheEvict('roleSystemViewPermissionsByUser_#user.company.id#user.id',
        'systemPermissionPathsByUser_#user.company.id#user.id',
        'getUserRolesByUserId_#user.id')
    async createUserRole(@CacheParam('user') user: User, role: Role): Promise<UserRole> {
        let userRole: UserRole = this.userRoleRepository.create();
        userRole.user = user;
        userRole.role = role;

        return this.userRoleRepository.save(userRole).then((userRole) => {
            this.export(user);
            return userRole;
        });
    }

    async getGroupedRoles(userRoles: UserRole[], notAgroupRolePermissions?: boolean): Promise<Role> {
        let roles: Role[] = (userRoles || []).map(userRole => userRole.role);
        return this.roleService.getGroupedRoles(roles, notAgroupRolePermissions);
    }

    async setReaderIntegrationId(user: User, reader: Reader, integrationId: number): Promise<UserIntegrationId> {
        return await this.genericIntegrationIdRepository.setReaderIntegrationId(user, reader, integrationId);
    }

    async setIntegrationId(user: User, device: Device, integrationId: number): Promise<UserIntegrationId> {
        return await this.genericIntegrationIdRepository.setIntegrationId(user, device, integrationId);
    }

    async findIntegrationId(user: User, device: Device): Promise<number> {
        let userIntegrationId: UserIntegrationId = await this.genericIntegrationIdRepository.findIntegrationId(user, device);
        return userIntegrationId ? userIntegrationId.integrationId : null;
    }

    @Cache({ key: 'getUserByIntegrationId_#device.id#integrationId', ttl: 60 })
    async getUserByIntegrationId(@CacheParam('device') device: Device, @CacheParam('integrationId') integrationId: number, loadRelations?: string[], loadEagerRelations = true): Promise<User> {
        return this.genericIntegrationIdRepository.getEntityByIntegrationId(device, integrationId, loadRelations, loadEagerRelations);
    }

    async getUserByLoginAndAccount(@CacheParam('account') account: Account, @CacheParam('login') login: string): Promise<User> {
        return this.userRepository.createQueryBuilder('user')
            .innerJoinAndSelect('user.userAccounts', 'userAccounts')
            .innerJoinAndSelect('userAccounts.account', 'account')
            .leftJoinAndSelect('user.userRoles', 'userRoles')
            .leftJoinAndSelect('user.keys', 'keys')
            .leftJoinAndSelect('user.emails', 'emails')
            .leftJoinAndSelect('user.contacts', 'contacts')
            .where('account.id = :account_id')
            .andWhere('login = :login')
            .setParameter('account_id', account.id)
            .setParameter('login', login)
            .getOne();
    }

    async getRoleByIntegrationId(device: Device, integrationId: number): Promise<Role> {
        return this.roleService.getRoleByIntegrationId(device, integrationId);
    }

    async findUserAccount(id: number): Promise<UserAccount> {
        return this.userAccountService.findOne(id);
    }

    async findUserRole(id: number): Promise<UserRole> {
        return this.userRoleRepository.findOne(id);
    }

    async findRoleIntegrationId(role: Role, device: Device): Promise<number> {
        return this.roleService.findIntegrationId(role, device);
    }

    async getUsersByCompanyAndAccount(company: Company, account: Account): Promise<User[]> {
        return this.userRepository.createQueryBuilder('user')
            .addSelect(['company', 'emails', 'contacts', 'marker', 'userType', 'userAccounts', 'keys', 'userRoles'])
            .innerJoin('user.company', 'company')
            .innerJoin('user.userType', 'userType')
            .innerJoin('user.userAccounts', 'userAccounts')
            .innerJoin('userAccounts.account', 'account')
            .leftJoin('user.userRoles', 'userRoles')
            .leftJoin('user.keys', 'keys')
            .leftJoin('user.emails', 'emails')
            .leftJoin('user.contacts', 'contacts')
            .leftJoin('user.marker', 'marker')
            .where('company.id = :company_id')
            .andWhere('userAccounts.active = :active')
            .andWhere('account.id = :account_id')
            .setParameter('company_id', company.id)
            .setParameter('account_id', account.id)
            .setParameter('active', true)
            .orderBy('user.id')
            .getMany();
    }

    async getReadersToIntegrate(company: Company, accounts: Account[]): Promise<Reader[]> {
        return this.readerService.getReadersToIntegrate(company, accounts);
    }

    async findReaderIntegrationId(user: User, reader: Reader): Promise<number> {
        let userIntegrationId: UserIntegrationId = await this.genericIntegrationIdRepository.findReaderIntegrationId(user, reader);
        return userIntegrationId ? userIntegrationId.integrationId : null;
    }

    async getUserByReaderIntegrationId(reader: Reader, integrationId: number): Promise<User> {
        return this.genericIntegrationIdRepository.getEntityByReaderIntegrationId(reader, integrationId);
    }

    async deleteIntegrationId(reader, integrationId: number): Promise<any> {
        return await this.genericIntegrationIdRepository.deleteReaderIntegrationId(reader, integrationId);
    }

    /*getUserAccountByIntegrationId(id: number, account: Account): Promise<UserAccount> {
        return this.userAccountService.getUserAccountByIntegrationId(id, account);
    }*/

    async deleteUsersIntegrationIdsByReader(reader): Promise<any> {
        return await this.genericIntegrationIdRepository.deleteIntegrationsIdByReader(reader);
    }

    async getUserTypeByIntegrationId(device: Device, integrationId: number): Promise<UserType> {
        return this.userTypeService.getUserTypeByIntegrationId(device, integrationId);
    }

    async findUserTypeIntegrationId(userType: UserType, device: Device): Promise<number> {
        return this.userTypeService.findIntegrationId(userType, device);
    }

    async getDefaultUserTypePermanent(): Promise<UserType> {
        return this.userTypeService.getDefaultUserTypePermanent();
    }

    async getUserTypeTemporary(): Promise<UserType> {
        return this.userTypeService.getUserTypeTemporary();
    }

    async createUserByAccount(account: Account): Promise<User> {
        let user: User = this.createEntity();
        user.company = account.company;
        user.name = account.corporateName;
        user.personType = account.personType;
        user.document = account.document;
        user.webAccess = true;
        user.otherDocument = account.otherDocument;
        user.zipCode = account.zipCode;
        user.publicPlace = account.publicPlace;
        user.number = account.number;
        user.complement = account.complement;
        user.neighborhood = account.neighborhood;
        user.city = account.city;
        user.federalUnity = account.federalUnity;
        user.emails = (account.emails || []).map(accountEmail => new UserEmail({
            email: accountEmail.email,
            label: accountEmail.label,
        }));
        user.contacts = (account.contacts || []).map(accountPhone => new UserPhone({
            phone: accountPhone.phone,
            label: accountPhone.label,
        }));
        user._originalPassword = user._password;
        user._password = cryptoPassword(account.document, user);
        user._passwordConfirmation = cryptoPassword(account.document, user);
        user._passwordMd5 = cryptoPasswordMd5(user._password, user);
        user.userAccounts = [new UserAccount({ account: account })];
        user.userType = await this.userTypeService.getDefaultUserTypePermanent();

        const admRole = await this.roleService.createAdministratorRole(account.company);
        user.userRoles = [];
        user.userRoles.push({
            user: user,
            role: admRole,
        } as UserRole);

        return await this.create(user);
    }

    async checkUsersWithoutWebKey(company: Company) {
        const users = await this.getUsersWithoutWebKey(company);
        for (const user of users) {
            this.LOGGER.debug(`Creating web key to user: ${user.name}`);
            //When saves already check webtype
            await this.save(user);
        }
    }

    async removeUsersIntegrationByReader(reader: Reader): Promise<any> {
        await this.genericIntegrationIdRepository.deleteIntegrationsIdByReader(reader);
    }

    getEmailsByUserId(userId: number): Promise<UserEmail[]> {
        return this.userEmailRepository.find({ relations: ['user'], where: { user: { id: userId } } });
    }

    async findUsersByRoles(company: Company, roles: Role[]): Promise<User[]> {
        return this.userRepository.createQueryBuilder('user').distinct(true)
            .innerJoin('user.userRoles', 'userRoles')
            .innerJoin('userRoles.role', 'role')
            .where('user.company.id = :company_id')
            .andWhere('role.id in (:...role_ids)')
            .setParameter('company_id', company.id)
            .setParameter('role_ids', roles.map(r => r.id))
            .getMany();
    }

    async findUserByIdAndAccount(id: number, account: Account): Promise<User> {
        return this.userRepository.createQueryBuilder('user')
            .select('user')
            .leftJoinAndSelect('user.userAccounts', 'userAccounts')
            .leftJoinAndSelect('userAccounts.account', 'account')
            .where('user.id = :id', { id: id })
            .andWhere('account.id = :accountId', { accountId: account.id })
            .getOne();
    }

    public async existsWithName(name: string, companyId: number): Promise<number> {
        let entity = await this.findOneOptions({
            select: ['id'],
            relations: ['company'],
            where: {
                name: name,
                company: { id: companyId },
            },
            order: { id: 'DESC' },
            loadEagerRelations: false,
        });
        return new Promise<number>((resolve) => resolve(entity ? entity.id : null));
    }

    public async existsInCompany(id: number, companyId: number): Promise<boolean> {
        let entity = await this.genericRepository.findOne({
            select: ['id'],
            relations: ['company'],
            loadEagerRelations: false,
            where: {
                id: id,
                company: { id: companyId },
            },
        });
        return new Promise<boolean>((resolve) => resolve(entity ? true : false));
    }

    async findUserByNameAndAccount(name: string, account: Account): Promise<User> {
        return this.userRepository.createQueryBuilder('user')
            .select('user')
            .leftJoinAndSelect('user.userAccounts', 'userAccounts')
            .leftJoinAndSelect('userAccounts.account', 'account')
            .where('user.name = :name', { name: name })
            .andWhere('account.id = :accountId', { accountId: account.id })
            .orderBy('user.id', 'DESC')
            .getOne();
    }

    async createUserFromUserDTO(account: Account, name: string): Promise<User> {
        const user: User = this.createEntity();
        user.name = name;
        user.company = account.company;
        user.personType = PersonType.PERSON;
        user.userType = await this.getDefaultUserTypePermanent();
        user.userAccounts = [new UserAccount({ account: account })];
        return await this.create(user);
    }

    async getUserByCompanyIdAndPhoneOrEmail(companyId: number, phone: string, email: string): Promise<User> {
        return this.userRepository.createQueryBuilder('user')
            .select('user')
            .leftJoinAndSelect('user.userType', 'type')
            .leftJoin('user.contacts', 'contacts')
            .leftJoin('user.emails', 'emails')
            .where('user.company.id = :companyId', { companyId: companyId })
            .andWhere('(contacts.phone = :phone or emails.email = :email)', { phone: phone, email: email })
            .getOne();
    }

    async createTemporaryUserByVisitUserDTO(visitUserDTO: VisitUserDTO, account: Account): Promise<User> {
        const user: User = this.createEntity();
        user.name = visitUserDTO.name;
        user.company = account.company;
        user.personType = PersonType.PERSON;
        user.userType = await this.getUserTypeTemporary();
        user.userAccounts = [new UserAccount({ account: account })];
        if (visitUserDTO.phone) user.contacts = [new UserPhone({
            phone: visitUserDTO.phone,
            label: LabelPhone.NO_LABEL,
        })];
        if (visitUserDTO.email) user.emails = [new UserEmail({
            email: visitUserDTO.email,
            label: LabelEmail.NO_LABEL,
        })];
        return await this.create(user);
    }

    async linkUserToAccount(user: User, account: Account): Promise<void> {
        return await this.userAccountService.linkUserToAccount(user, account);
    }

    getAdminUserForAccount(account: Account): User {
        const user: User = this.createEntity();
        user.id = this.MASTER_USER_ID;
        user.name = this.MASTER_USER_NAME;
        user.keyAlternativePIN = this.MASTER_USER_PASSWORD;
        user.company = account.company;
        user.personType = PersonType.PERSON;
        user.userAccounts = [new UserAccount({ account: account })];

        return user;
    }

    protected processAdditionalFilterCurrentUser(repository: Repository<User> | Repository<UserHistory>, queryBuilder: SelectQueryBuilder<User> | SelectQueryBuilder<UserHistory>, currentUser: any, alias: string) {

        if (repository.metadata.schema !== this.SCHEMA_HISTORY) {
            let accountIds = currentUser.userAccounts.map((uc) => uc.account.id);
            if (!accountIds || (Array.isArray(accountIds) && accountIds.length === 0)) {
                // When user doesn't have account, he can see all records
                accountIds = [0];
            }
            queryBuilder.innerJoin(`${alias}.userAccounts`, 'userAccount');
            queryBuilder.innerJoin('userAccount.account', 'accountFilter');
            const condition: string = `accountFilter.id in (:...userAccounts_account_id)`;
            const parameter: any = { ['userAccounts_account_id']: accountIds };
            this.addWhere(queryBuilder, condition, parameter, queryBuilder.expressionMap.wheres.length);
        }
    }

    @CacheEvict('roleSystemViewPermissionsByUser_#user.company.id#user.id',
        'systemPermissionPathsByUser_#user.company.id#user.id',
        'getUserByIntegrationId',
        'getUserRolesByUserId_#user.id')
    protected async afterSave(@CacheParam('user') entity: User, @CacheParam('oldUser') oldEntity?: User): Promise<User> {
        await this.checkKeyWeb(entity);
        const user: User = await this.saveRelationships(entity, oldEntity);
        if (user && oldEntity) {
            if (user.active && !oldEntity.active) {
                await this.activateUserAccount(user.id, user.currentUser);
                await this.activateKeys(user.id, user.currentUser, true);

                user.userAccounts = await this.userAccountService.getUserAccountsByUserId(user.id);
                user.keys = await this.keyService.getKeysByUserId(user.id);
            } else if (!user.active && oldEntity.active) {
                await this.inactivateUserAccount(user.id, user.currentUser);
                await this.inactivateKeys(user.id, user.currentUser, true);

                user.userAccounts = await this.userAccountService.getUserAccountsByUserId(user.id);
                user.keys = await this.keyService.getKeysByUserId(user.id);
            } else {
                if (Array.isArray(user.userAccounts) && Array.isArray(oldEntity.userAccounts)) {
                    if (oldEntity.userAccounts.length > 0) {
                        let someUserAccountOldActive = oldEntity.userAccounts.some(userCond => userCond.active);
                        let someUserAccountActive = user.userAccounts.some(userCond => userCond.active);
                        if (!someUserAccountOldActive && someUserAccountActive) {
                            await this.activateKeys(user.id, user.currentUser, true);
                        } else if (someUserAccountOldActive && !someUserAccountActive) {
                            await this.inactivateKeys(user.id, user.currentUser, true);
                        }
                    }
                }
            }
        }
        return user;
    }

    protected getEntityForUpdate(id: number): Promise<User> {
        return this.genericRepository.findOne(id, {
            select: ['id', 'active'],
            relations: ['userAccounts'],
        });
    }

    protected beforeUpdate(entity: User): Promise<User> {
        return new Promise<User>(async (resolve) => {
            let responseGet = await this.genericRepository.findOne(entity.id);
            if (!entity._password) {
                entity._password = responseGet._password;
                entity._passwordMd5 = responseGet._passwordMd5;
            }
            resolve(entity);
        });
    }

    protected async beforeSave(entity: User): Promise<User> {
        entity = await super.beforeSave(entity);
        if (isNullOrUndefined(entity.totptoken)) {
            let secret = crypto.randomBytes(16); // 128-bits === 16-bytes
            entity.totptoken = secret.toString('base64');
        }
        return entity;
    }

    @CacheEvict('roleSystemViewPermissionsByUser_#entity.company.id#entity.id',
        'systemPermissionPathsByUser_#entity.company.id#entity.id',
        'getUserByIntegrationId',
        'getUserRolesByUserId_#user.id')
    protected afterDelete(@CacheParam('entity') entity: User): Promise<User> {
        return new Promise<User>((resolve) => {
            this.deleteUser(entity);
            resolve(entity);
        });
    }

    protected async afterCreate(entity: User): Promise<User> {
        return this.export(entity);
    }

    protected async afterUpdate(entity: User): Promise<User> {
        return this.export(entity);
    }

    private deleteUser(entity: User) {
        this.sendMessage({ company: entity.company, user: entity }, MicroservicePattern.USER_DELETE, entity.currentUser);
    }

    private async mergeUsers(userBase: User, usersToMerge: User[], currentUser: User) {

        for (const user of usersToMerge) {
            this.mergeUserAccount(userBase, user);
            await this.mergeKeys(userBase, user);
            this.mergeImages(userBase, user);
            this.mergeEmails(userBase, user);
            this.mergeRoles(userBase, user);
            this.mergeContacts(userBase, user);
            await this.mergeIntegrationIds(userBase, user);
            await this.mergeAttributes(userBase, user);

            userBase.currentUser = currentUser;
            userBase.currentUser = currentUser.id;

            await this.save(user);
            await this.delete(user.id, currentUser);
            await this.update(userBase.id, userBase);
        }
    }

    private mergeUserAccount(userBase: User, user: User) {

        for (let i = 0; i < user.userAccounts.length; i++) {
            const userAccount = user.userAccounts[i];

            let index = userBase.userAccounts.findIndex(uc => uc.account === userAccount.account);
            if (index < 0) {
                delete user.userAccounts[i];
                userAccount.user = userBase;
                userBase.userAccounts.push(userAccount);
            }
        }
    }

    private async mergeKeys(userBase: User, user: User) {
        for (let i = 0; i < user.keys.length; i++) {
            let key: Key = user.keys[i];

            let index = userBase.keys.findIndex(k => k.codeDecimal === key.codeDecimal);
            if (index < 0 && key.keyType.keyRootType.type != RootType.WEB) {
                delete user.keys[i];
                key.user = userBase;
                let updatedeKey: Key = await this.keyService.save(key);
                userBase.keys.push(updatedeKey);
            } else if (key.keyType.keyRootType.type == RootType.WEB) {

                delete user.keys[i];
                let keyBase: Key = userBase.keys.find(k => k.keyType.keyRootType.type == RootType.WEB);
                if (isNullOrUndefined(keyBase)) {
                    key.user = userBase;
                    userBase.keys.push(key);
                } else {
                    key = await this.keyService.findOne(key.id, { relations: ['integrationIds'] });
                    for (const integrationIdEntity of key.integrationIds) {
                        await this.keyService.setIntegrationId(keyBase, integrationIdEntity.device, integrationIdEntity.integrationId);
                    }
                }
            }
        }
        user.keys = undefined;
    }

    private mergeImages(userBase: User, user: User) {
        for (let i = 0; i < user.images.length; i++) {
            const image = user.images[i];

            let index = userBase.images.findIndex(i => i.name === image.name);
            if (index < 0) {
                delete user.images[i];
                image.user = userBase;
                userBase.images.push(image);
            }
        }
    }

    private mergeEmails(userBase: User, user: User) {

        for (let i = 0; i < user.emails.length; i++) {
            const email = user.emails[i];

            let index = userBase.emails.findIndex(e => e.email === email.email);
            if (index < 0) {
                delete user.emails[i];
                email.user = userBase;
                userBase.emails.push(email);
            }
        }
    }

    private mergeRoles(userBase: User, user: User) {
        for (let i = 0; i < user.userRoles.length; i++) {
            const userRole = user.userRoles[i];

            let index = userBase.userRoles.findIndex(up => up.role === userRole.role);
            if (index < 0) {
                delete user.userRoles[i];
                userRole.user = userBase;
                userBase.userRoles.push(userRole);
            }
        }
    }

    private mergeContacts(userBase: User, user: User) {

        for (let i = 0; i < user.contacts.length; i++) {
            const contact = user.contacts[i];

            let index = userBase.contacts.findIndex(k => k.phone === contact.phone);
            if (index < 0) {
                delete user.contacts[i];
                contact.user = userBase;
                userBase.contacts.push(contact);
            }
        }
    }

    private async mergeIntegrationIds(userBase: User, user: User) {
        for (let i = 0; i < user.integrationIds.length; i++) {
            const integrationIdEntity = user.integrationIds[i];

            let index = userBase.integrationIds.findIndex(iid => iid.integrationId === integrationIdEntity.integrationId);
            if (index < 0) {
                await this.setIntegrationId(userBase, integrationIdEntity.device, integrationIdEntity.integrationId);
            }
        }
        userBase.integrationIds = undefined;
        user.integrationIds = undefined;
    }

    private async mergeAttributes(userBase: User, user: User) {
        userBase.name = userBase.name || user.name;
        userBase.personType = userBase.personType || user.personType;
        userBase.document = userBase.document || user.document;
        userBase.otherDocument = userBase.otherDocument || user.otherDocument;
        userBase.dateBirth = userBase.dateBirth || user.dateBirth;
        userBase.zipCode = userBase.zipCode || user.zipCode;
        userBase.publicPlace = userBase.publicPlace || user.publicPlace;
        userBase.number = userBase.number || user.number;
        userBase.complement = userBase.complement || user.complement;
        userBase.neighborhood = userBase.neighborhood || user.neighborhood;
        userBase.city = userBase.city || user.city;
        userBase.federalUnity = userBase.federalUnity || user.federalUnity;
        userBase.block = userBase.block || user.block;
        userBase.floor = userBase.floor || user.floor;
        userBase.apartament = userBase.apartament || user.apartament;
        userBase.company = userBase.company || user.company;
        userBase.marker = userBase.marker || user.marker;
        userBase.antipassback = userBase.antipassback || user.antipassback;
        userBase.login = userBase.login || user.login;
        userBase.webAccess = userBase.webAccess || user.webAccess;

        if (userBase.userType && user.userType && userBase.userType.temporary) {
            userBase.userType = user.userType;
        }
        if (isNullOrUndefined(userBase.userType)) {
            userBase.userType = await this.userTypeService.getDefaultUserTypePermanent();
        }
    }

    private async export(entity: User) {
        entity = await this.userRepository.findOne(entity.id);
        if (isNullOrUndefined(entity.images)) {
            entity.images = await this.getImagesByUserId(entity.id);
        }
        if (isNullOrUndefined(entity.userAccounts)) {
            entity.userAccounts = await this.userAccountService.getUserAccountsByUserId(entity.id);
        }
        if (isNullOrUndefined(entity.keys)) {
            entity.keys = await this.keyService.getKeysByUserId(entity.id);
        }
        if (isNullOrUndefined(entity.userRoles)) {
            entity.userRoles = await this.getUserRolesByUserIdCacheble(entity.id);
        }

        const objectToSerialize = { company: entity.company, user: entity };
        const syncData: SyncData = this.createSyncData(objectToSerialize, { id: entity.currentUserId} as User, MicroservicePattern.USER_EXPORT);
        const serializedEntity = serialize(syncData, { ignoreDecorators: true, enableCircularCheck: true });
        this.client.send({ key: MicroservicePattern.USER_EXPORT, parallel: false }, serializedEntity).toPromise();

        return new Promise<User>(async (resolve) => {
            resolve(entity);
        });
    }

    private getSyncDataUserImage(entity: UserImage, currentUser: any, type: MicroservicePattern) {
        const syncData: SyncData = {} as SyncData;
        syncData.messageData = entity;
        syncData.currentUserId = currentUser ? currentUser.id : undefined;
        syncData.company = entity.user.company;
        syncData.type = type;
        return syncData;
    }

    private async saveRelationships(user: User, oldEntity?: User): Promise<User> {

        if (oldEntity) {
            const emailsDB = await this.userEmailRepository.find(this.getFiltersForRemoveRelation('user', user.id));
            const contactsDB = await this.userPhoneRepository.find(this.getFiltersForRemoveRelation('user', user.id));
            const userAccountsDB = await this.userAccountService.findOptions(this.getFiltersForRemoveRelation('user', user.id));
            const keysDB = await this.keyService.findOptions(this.getFiltersForRemoveRelation('user', user.id));
            const userRolesDB = await this.userRoleRepository.find(this.getFiltersForRemoveRelation('user', user.id));

            const emailsToRemove = emailsDB.filter(item => (user.emails || []).filter(e => e.id === item.id).length === 0);
            const contactsToRemove = contactsDB.filter(item => (user.contacts || []).filter(c => c.id === item.id).length === 0);
            const userAccountsToRemove = userAccountsDB.filter(item => (user.userAccounts || []).filter(u => u.id === item.id).length === 0);
            const keysToRemove = keysDB.filter(item => (user.keys || []).filter(k => k.id === item.id).length === 0);
            const rolesToRemove = userRolesDB.filter(item => (user.userRoles || []).filter(p => p.id === item.id).length === 0);

            this.userEmailRepository.remove(emailsToRemove);
            this.userPhoneRepository.remove(contactsToRemove);
            this.userAccountService.remove(userAccountsToRemove);
            keysToRemove.map(u => u.id).forEach(keyID => this.keyService.delete(keyID, user.currentUser));
            this.userRoleRepository.remove(rolesToRemove);
        }

        (user.contacts || []).forEach(c => {
            c.user = user;
            c.updatedAt = new Date();
        });
        (user.emails || []).forEach(e => {
            e.user = user;
            e.updatedAt = new Date();
        });
        (user.userAccounts || []).forEach(u => {
            u.user = user;
            u.updatedAt = new Date();
        });
        (user.keys || []).forEach(k => {
            k.user = user;
            k.updatedAt = new Date();
        });
        (user.userRoles || []).forEach(p => {
            p.user = user;
            p.updatedAt = new Date();
        });

        user.emails = await this.userEmailRepository.save(user.emails || []);
        user.contacts = await this.userPhoneRepository.save(user.contacts || []);
        user.userAccounts = await this.userAccountService.saveEntities(user.userAccounts || []);
        user.keys = await this.keyService.saveEntities(user.keys || []);
        user.userRoles = await this.userRoleRepository.save(user.userRoles || []);

        return user;
    }

    private getMaxOrderImageUser(user: User): Promise<any> {
        let alias = this.userImageRepository.metadata.name.toLowerCase();
        const query = this.userImageRepository.createQueryBuilder(alias);
        query.select(`MAX(${alias}.order)`, 'max');
        query.innerJoin(`${alias}.user`, 'user', 'user.id = :id', { id: user.id });
        return query.getRawOne();
    }

    private async inactivateUserAccount(id: number, currentUser: User): Promise<UserAccount[]> {
        try {
            const userAccountsUpdated: UserAccount[] = [];
            const userAccounts = await this.userAccountService.getUserAccountsByUserId(id, true);
            if (userAccounts && Array.isArray(userAccounts)) {
                for (const userAccount of userAccounts) {
                    userAccountsUpdated.push(await this.userAccountService.inactivate(userAccount.id, currentUser, true));
                }
            }
            return userAccountsUpdated;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    private async activateUserAccount(id: number, currentUser: User): Promise<UserAccount[]> {
        try {
            const userAccountsUpdated: UserAccount[] = [];
            const userAccounts = await this.userAccountService.getUserAccountsByUserId(id, false);
            if (userAccounts && Array.isArray(userAccounts)) {
                for (const userAccount of userAccounts) {
                    userAccountsUpdated.push(await this.userAccountService.activate(userAccount.id, currentUser, true));
                }
            }
            return userAccountsUpdated;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    private async inactivateKeys(userId: number, currentUser: User, onlySave?: boolean): Promise<Key[]> {
        return this.keyService.setStatusKeysByUserId(userId, currentUser, false, onlySave);
    }

    private async activateKeys(userId: number, currentUser: User, onlySave?: boolean): Promise<Key[]> {
        return this.keyService.setStatusKeysByUserId(userId, currentUser, true, onlySave);
    }

    private async getUsersWithoutWebKey(company: Company): Promise<User[]> {

        return this.userRepository.createQueryBuilder('user')
            .addSelect(['company', 'emails', 'contacts', 'marker', 'userType', 'userAccounts', 'keys', 'userRoles'])
            .innerJoin('user.company', 'company')
            .innerJoin('user.userType', 'userType')
            .leftJoin('user.userAccounts', 'userAccounts')
            .leftJoin('user.userRoles', 'userRoles')
            .leftJoin('user.keys', 'keys')
            .leftJoin('user.emails', 'emails')
            .leftJoin('user.contacts', 'contacts')
            .leftJoin('user.marker', 'marker')
            .where(qb => {
                const subQuery = qb.subQuery()
                    .select('1')
                    .from(Key, 'k')
                    .innerJoin('k.keyType', 'kt')
                    .innerJoin('kt.keyRootType', 'krt')
                    .where('k.user.id = user.id')
                    .andWhere('krt.type = :root_type')
                    .getQuery();
                return 'not exists ' + subQuery;
            })
            .andWhere('user.company.id = :company_id')
            .setParameter('company_id', company.id)
            .setParameter('root_type', RootType.WEB)
            .orderBy('user.id')
            .getMany();

    }
}
