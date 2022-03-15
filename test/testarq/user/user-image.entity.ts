import { PipeTransform } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { DeleteCascade } from '../../shared/decorators/delete-cascade';
import { User } from './user.entity';

export enum UserImageType {
    PHOTO = 0,
    FORWARD_DOCUMENT = 1,
    BACKWARD_DOCUMENT = 2,
    OTHER = 3,
}

export function imageTypeToString(value): string {
    return UserImageType[value];
}

// export function bufferToString(code: Buffer, obj?: any): any {
//     return Array.isArray(code) ? code.toString("hex") : code;
// }

export class UserImageTypeTransform implements PipeTransform {
    
    transform(value: any, metadata: import("@nestjs/common").ArgumentMetadata) {
        return UserImageType[value];
    }
}

@Entity('user_images', { schema: 'siam' })
export class UserImage extends BaseEntity {

    constructor(o?: Partial<UserImage>) {
        super(o);
        Object.assign(this, o);
    }

    @DeleteCascade(true)
    @ApiProperty({ type: () => User })
    @Type(() => User)
    @ManyToOne(type => User, user => user.images, { nullable: false })
    @JoinColumn({ name : "user_id", referencedColumnName : "id" })
    user: User;

    @ApiPropertyOptional()
    @Exclude({toPlainOnly: true})
    @Column({ name: "file_data", type: "bytea", nullable: true})
    fileImage: Buffer;

    @ApiProperty({ enum: [ 'PHOTO', 'FORWARD_DOCUMENT', 'BACKWARD_DOCUMENT', 'OTHER'] })
    @IsEnum(UserImageType)
    @Transform(imageTypeToString)
    @Column({ type: "integer", name: "type" }) 
    type: UserImageType;

    @ApiPropertyOptional()
    @Column({ nullable: false, length: 255 })
    name: string;

    @ApiPropertyOptional()
    @Column({ name: "file_type", nullable: false, length: 255 })
    fileType: string;

    @ApiPropertyOptional()
    @Column({ name : "used_by_key", nullable: false, default: true })
    key: boolean;

    @ApiPropertyOptional()
    @Column({ name : "order", nullable: false, default: true })
    order: number;

    @Exclude()
    get entityDescriptionHistory() {
        return this.name;
    }
}
