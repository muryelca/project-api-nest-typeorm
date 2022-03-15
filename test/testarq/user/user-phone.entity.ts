import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsEnum, Validate } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { DeleteCascade } from '../../shared/decorators/delete-cascade';
import { PhoneValidator } from '../../shared/validation/phone.validation';
import { User } from './user.entity';
import { LabelPhone, labelPhoneToString } from '../../shared/enum/label-phone';

@Entity('user_phones', { schema: 'siam' })
export class UserPhone extends BaseEntity {

    constructor(o?: Partial<UserPhone>) {
        super(o);
        Object.assign(this, o);
    }

    @DeleteCascade(true)
    @Exclude()
    @ApiProperty({ type: () => User })
    @ManyToOne(type => User, user => user.contacts, { nullable: false })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: User;

    @ApiProperty()
    @Validate(PhoneValidator)
    @Column({ length: 20 })
    phone: string;

    @ApiProperty({ enum: ['NO_LABEL', 'MOBILE', 'WORK', 'HOME', 'MAIN', 'WORK_FAX', 'HOME_FAX', 'PAGER', 'OTHER', 'CUSTOM'] })
    @IsEnum(LabelPhone)
    @Transform(labelPhoneToString)
    @Column({ type: "integer", name: "label" })
    label: LabelPhone;

    @Exclude()
    get entityDescriptionHistory() {
        return this.phone;
    }
}
