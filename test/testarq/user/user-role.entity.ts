import { Exclude } from 'class-transformer';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { DeleteCascade } from '../../shared/decorators/delete-cascade';
import { Role } from '../role/role.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users_roles', { schema: 'siam' })
export class UserRole extends BaseEntity {

    constructor(o?: Partial<UserRole>) {
        super(o);
        Object.assign(this, o);
    }

    @DeleteCascade(true)
    @Exclude()
    @ApiProperty({ type: () => User })
    @ManyToOne(type => User, user => user.userRoles, { nullable: false })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: User;

    @DeleteCascade(true)
    @ManyToOne(type => Role, { eager: true, nullable: false })
    @JoinColumn({ name: "role_id", referencedColumnName: "id" })
    role: Role;

    @Exclude()
    get entityDescriptionHistory() {
        return (this.user ? this.user.name : "") + " - " + (this.role ? this.role.name : "");
    }

}
