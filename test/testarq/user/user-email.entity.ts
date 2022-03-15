import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsEnum, Validate } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { DeleteCascade } from '../../shared/decorators/delete-cascade';
import { EmailValidator } from '../../shared/validation/email.validation';
import { User } from './user.entity';
import { LabelEmail, labelEmailToString } from '../../shared/enum/label-email';

@Entity('user_emails', { schema: 'siam' })
export class UserEmail extends BaseEntity {

    constructor(o?: Partial<UserEmail>) {
        super(o);
        Object.assign(this, o);
    }

    @DeleteCascade(true)
    @Exclude()
    @ApiProperty({ type: () => User })
    @ManyToOne(type => User, user => user.emails, { nullable: false })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: User;

    @ApiProperty()
    @Validate(EmailValidator)
    @Column({ length: 100 })
    email: string;

    @ApiProperty({ enum: ['NO_LABEL', 'HOME', 'WORK', 'OTHER', 'CUSTOM'] })
    @IsEnum(LabelEmail)
    @Transform(labelEmailToString)
    @Column({ type: "integer", name: "label" })
    label: LabelEmail;

    @Exclude()
    get entityDescriptionHistory() {
        return this.email;
    }
}
