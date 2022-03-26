"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellPostEntity = void 0;
const user_entity_1 = require("../../auth/models/user.entity");
const typeorm_1 = require("typeorm");
let SellPostEntity = class SellPostEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SellPostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ nullable: true, name: 'create_date' }),
    __metadata("design:type", Date)
], SellPostEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'update_date' }),
    __metadata("design:type", Date)
], SellPostEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SellPostEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], SellPostEntity.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SellPostEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SellPostEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (userEntity) => userEntity.sellPost),
    __metadata("design:type", user_entity_1.UserEntity)
], SellPostEntity.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SellPostEntity.prototype, "isSell", void 0);
SellPostEntity = __decorate([
    (0, typeorm_1.Entity)('sell_post', { schema: 'postgres' })
], SellPostEntity);
exports.SellPostEntity = SellPostEntity;
//# sourceMappingURL=post.entity.js.map