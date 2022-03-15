import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Res,
	UploadedFile,
	UseInterceptors,
	Injectable,
	PipeTransform,
	UsePipes, ParseBoolPipe, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery, ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {BaseController} from '../../core/base.controller';
import {CurrentUser} from '../auth/current-user.decorator';
import {Key} from '../key/key.entity';
import {PersonType, PersonTypeTransform} from '../person/person';
import {UserAccount} from '../user-account/user-account.entity';
import {UserImageType, UserImageTypeTransform, UserImage} from './user-image.entity';
import {UserRole} from './user-role.entity';
import {User} from './user.entity';
import {UserService} from './user.service';
import {UserHistory} from './history/user.history.entity';
import { SystemPermissionController } from '../../shared/decorators/system-permission-controller';
import { SystemPermissionMethod } from '../../shared/decorators/system-permission-method';
import { AuthGuard } from '@nestjs/passport';
import { SystemRoleGuard } from '../auth/system-role.guard';

@Injectable()
class UserImagemKeyTransform implements PipeTransform {
    transform(value: any, metadata: import("@nestjs/common").ArgumentMetadata) {
        if(value) {
            if(value.key && value.key == "true") {
                value.key = true;
            } else if(value.key && value.key == "false") {
				value.key = false;
			}
        }
        return value;
    }
}

@ApiBearerAuth()
@SystemPermissionController('user')
@ApiTags('users')
@UseGuards(AuthGuard('jwt'), SystemRoleGuard)
@Controller('users')
export class UserController extends BaseController<User, UserHistory>{

	constructor(private readonly userService: UserService) {
		super(userService, User)
	}

	@ApiBody({
		description: 'user',
		type: User
	})
	@SystemPermissionMethod()
	@Post()
	async create(@Body() entity: any): Promise<User> {
		entity._originalPassword = entity.password;
		entity._passwordMd5 = entity.password;
		let entityValidated = await this.validator.transform(entity);
		return this.userService.create(entityValidated);
	}

	@ApiBody({
		description: 'user',
		type: User
	})
	@SystemPermissionMethod()
	@Put(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() entity: any): Promise<User> {
		entity.originalPassword = entity.password;
		entity.passwordMd5 = entity.password;
		let entityValidated = await this.validator.transform(entity);
		return this.userService.update(id, entityValidated);
	}

	@SystemPermissionMethod('userAccounts')
	@Get(':id/userAccounts/:active')
	async getUserAccountsByUserId(@Param('id', ParseIntPipe) id: number, @Param('active', ParseBoolPipe) active: boolean): Promise<UserAccount[]> {
		return this.userService.getUserAccountsByUserId(id, active);
	}

	@SystemPermissionMethod('userRoles')
	@Get(':id/userRoles')
	async getUserRolesByUserId(@Param('id', ParseIntPipe) id: number): Promise<UserRole[]> {
		return this.userService.getUserRolesByUserIdCacheble(id);
	}

	@SystemPermissionMethod('keys')
	@Get(':id/keys')
	async getKeysByUserId(@Param('id', ParseIntPipe) id: number): Promise<Key[]> {
		return this.userService.getKeysByUserId(id);
	}

	@SystemPermissionMethod('images')
	@Get(':id/images')
	async getImagesByUserId(@Param('id', ParseIntPipe) idUser: number): Promise<UserImage[]> {
		return this.userService.getImagesByUserId(idUser);
	}

	@SystemPermissionMethod('imagesByKey')
	@Get(':id/imagesByKey')
	async getImagesByUserIdAndKey(@Param('id', ParseIntPipe) idUser: number): Promise<UserImage[]> {
		return this.userService.getImagesByUserId(idUser, true);
	}

	@SystemPermissionMethod('imagesById')
	@Delete('images/:id')
	async removeImage(@Param('id', ParseIntPipe) idImage: number, @CurrentUser() currentUser: any): Promise<UserImage> {
		return this.userService.removeImage(idImage, currentUser);
	}

	@ApiQuery({
		name: 'type',
		enum: [ 'PHOTO', 'FORWARD_DOCUMENT', 'BACKWARD_DOCUMENT', 'OTHER' ]	
	})
	@SystemPermissionMethod('imagesByType')
	@Get(':id/images/:type')
	async getImageByUserIdAndImageType(@Param('id', ParseIntPipe) idUser: number, @Param('type', UserImageTypeTransform) type: UserImageType): Promise<UserImage> {
		return this.userService.getImageByUserIdAndImageType(idUser, type);
	}

	@SystemPermissionMethod('createImage')
	@Post(':id/images')
	@UseInterceptors(FileInterceptor('fileImage'))
	@ApiConsumes('multipart/form-data')
	@UsePipes(UserImagemKeyTransform)
	createImage(@Param('id', ParseIntPipe) idUser: number, @Body() entity: UserImage, @UploadedFile() file): Promise<UserImage> {
		return this.userService.createUserImage(idUser, entity, file ? file.buffer : undefined);
	}

	@SystemPermissionMethod('updateImage')
	@Put(':id/images/:idImage')
	@UseInterceptors(FileInterceptor('fileImage'))
	@ApiConsumes('multipart/form-data')
	@UsePipes(UserImagemKeyTransform)
	updateImage(@Param('id', ParseIntPipe) id: number, @Param('idImage', ParseIntPipe) idImage: number, @Body() entity: UserImage, @UploadedFile() file): Promise<UserImage> {
		return this.userService.updateUserImage(id, idImage, entity, file ? file.buffer : undefined);
	}

	@SystemPermissionMethod('imageHistories')
	@Get('/images/:idImage/historyByRevison/:revison')
	async getImageHistoryDataByRevision(@Res() response: Response, @Param('idImage', ParseIntPipe) idImage: number, @Param('revison', ParseIntPipe) revison: number) {
		let image: UserImage = await this.userService.getImageHistoryDataByIdAndRevision(idImage, revison);
		if(image) {
			response.setHeader(
				'Content-Disposition',
				`attachment; filename=${image.name}`,
			);
			response.setHeader(
				'Content-Type',
				`${image.fileType}`,
			);
			response.end(image.fileImage, 'binary');
		} else {
			throw new BadRequestException('Entity not found', `Entity with id ${idImage} not found`);
		}
	}

	@SystemPermissionMethod('imageData')
	@Get('/images/:idImage')
	async getImageData(@Res() response: Response, @Param('idImage') idImage: number) {
		let image: UserImage = await this.userService.getImageDataById(idImage);
		if(image) {
			response.setHeader(
				'Content-Disposition',
				`attachment; filename=${image.name}`,
			);
			response.setHeader(
				'Content-Type',
				`${image.fileType}`,
			);
			response.end(image.fileImage, 'binary');
		} else {
			throw new BadRequestException('Entity not found', `Entity with id ${idImage} not found`);
		}
	}

	@ApiQuery({
		name: 'type',
		enum: [ 'COMPANY', 'PERSON' ]	
	})
	@SystemPermissionMethod('userByDocumentAndType')
	@Get('userByDocument/:document/:type/:companyId')
	async getUserByDocumentAndType(@Param('document') document: string, @Param('type', PersonTypeTransform) type: PersonType, @Param('companyId') companyId: number): Promise<User> {
		return this.userService.getUserByDocumentAndCompany(document, companyId, type);
	}

	@SystemPermissionMethod('userByPhone')
	@Get('userByPhone/:phone/:companyId')
	async getUserByPhoneAndCompanyId(@Param('phone') phone: string, @Param('companyId') companyId: number): Promise<User> {
		return this.userService.getUserByPhoneAndCompanyId(phone, companyId);
	}

	@SystemPermissionMethod('usersToMerge')
	@Get('usersToMerge')
	async getUserToMerge(@CurrentUser() currentUser: any): Promise<any> {
		return this.userService.getUserToMerge(currentUser);
	}

	@SystemPermissionMethod('userAccounts')
	@Get(':userId/account/:accountId')
	async getUserAccountsByUserIdAndAccountId(@Param('userId', ParseIntPipe) userId: number, @Param('accountId') accountId: number): Promise<UserAccount> {
		return this.userService.getUserAccountsByUserIdAndAccountId(userId, accountId);
	}

	@SystemPermissionMethod('activeUserAccount')
	@Post('userAccount/:userAccountId/activate')
	async activeUserAccount(@Param('userAccountId') userAccountId: number, @CurrentUser() currentUser: any): Promise<UserAccount> {
		return this.userService.activeUserAccount(userAccountId, currentUser);
	}

	@ApiBody({
		description: 'userAccount',
		type: UserAccount
	})
	@SystemPermissionMethod('createUserAccount')
	@Post(':userId/userAccount')
	async createUserAccount(@Param('userId', ParseIntPipe) userId: number, @Body() userAccount: UserAccount, @CurrentUser() currentUser: any): Promise<UserAccount> {
		return this.userService.createUserAccount(userAccount, currentUser);
	}

	@ApiBody({
		description: 'Array',
		type: Number,
		isArray: true
    })
	@SystemPermissionMethod('merge')
	@Post('merge')
	async merge(@Body() idsToMerge: [[number]], @CurrentUser() currentUser: any) {
		await this.userService.merge(idsToMerge, currentUser);
	}

	@SystemPermissionMethod('insertUserRole')
	@Put(':id/userRoles/:idRole')
	insertUserRole(@Param('id', ParseIntPipe) id: number, @Param('idRole') idRole: number): Promise<UserRole> {
		return this.userService.insertUserRole(id, idRole);
	}
}
