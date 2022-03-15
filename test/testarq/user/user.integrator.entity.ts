import { Exclude, Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { isNullOrUndefined } from 'util';
import { IsNumber } from 'class-validator';
import { BaseEntity } from '../../core/base.entity';
import { Device } from '../device/device.entity';
import { DeleteCascade } from '../../shared/decorators/delete-cascade';
import { Reader } from '../reader/reader.entity';
import { User } from './user.entity';

@Entity('user_integration_ids', { schema: 'siam' })
export class UserIntegrationId extends BaseEntity {
    @Column({
        name: 'integration_id',
        nullable: false,
        transformer: {
            from(value: any) {
                return !isNullOrUndefined(value) && IsNumber(value) ? parseInt(value) : null;
            },
            to(value: any) {
                return value;
            },
        },
    })
    integrationId: number;

    @DeleteCascade(true)
    @Type(() => Device)
    @ManyToOne((type) => Device, { eager: true, nullable: false })
    @JoinColumn({ name: 'device_id', referencedColumnName: 'id' })
    device: Device;

    @DeleteCascade(true)
    @Type(() => Reader)
    @ManyToOne((type) => Reader, { eager: true, nullable: false })
    @JoinColumn({ name: 'reader_id', referencedColumnName: 'id' })
    reader: Reader;

    @DeleteCascade(true)
    @Exclude()
    @Type(() => User)
    @ManyToOne((type) => User, (user) => user.integrationIds, { eager: true, nullable: false })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    entity: User;

    @Exclude()
    get entityDescriptionHistory() {
        return this.entity ? this.entity.name : undefined;
    }
}
