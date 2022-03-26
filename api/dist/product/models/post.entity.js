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
exports.ProductPostEntity = void 0;
const user_entity_1 = require("../../auth/models/user.entity");
const typeorm_1 = require("typeorm");
let ProductPostEntity = class ProductPostEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductPostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ nullable: true, name: 'create_date' }),
    __metadata("design:type", Date)
], ProductPostEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'update_date' }),
    __metadata("design:type", Date)
], ProductPostEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductPostEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], ProductPostEntity.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductPostEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductPostEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (userEntity) => userEntity.productPost),
    __metadata("design:type", user_entity_1.UserEntity)
], ProductPostEntity.prototype, "author", void 0);
ProductPostEntity = __decorate([
    (0, typeorm_1.Entity)('product_post', { schema: 'postgres' })
], ProductPostEntity);
exports.ProductPostEntity = ProductPostEntity;
//# sourceMappingURL=post.entity.js.map