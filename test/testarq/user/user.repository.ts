import { EntityRepository, Repository } from "typeorm";
import { BaseIntegrationIdRepository } from "../../core/base.integrator.repository";
import { UserEmail } from "./user-email.entity";
import { UserImage } from "./user-image.entity";
import { UserPhone } from "./user-phone.entity";
import { UserRole } from "./user-role.entity";
import { User } from "./user.entity";
import { UserIntegrationId } from "./user.integrator.entity";
import { UserHistory } from "./history/user.history.entity";
import { UserImageHistory } from "./history/user-email.history.entity";

export class UserRepository extends Repository<User>{
}

export class UserEmailRepository extends Repository<UserEmail>{
}

export class UserPhoneRepository extends Repository<UserPhone>{
}    

export class UserImageRepository extends Repository<UserImage>{
}    

export class UserRoleRepository extends Repository<UserRole>{
}    

export class UserHistoryRepository extends Repository<UserHistory>{
}

export class UserImageHistoryRepository extends Repository<UserImageHistory>{
}

@EntityRepository(UserIntegrationId)
export class UserIntegrationIdRepository extends BaseIntegrationIdRepository<UserIntegrationId>{
    
}