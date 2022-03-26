"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductPostEntity = void 0;
var user_entity_1 = require("api/src/auth/models/user.entity");
var typeorm_1 = require("typeorm");
var ProductPostEntity = /** @class */ (function () {
    function ProductPostEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], ProductPostEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ nullable: true, name: 'create_date' })
    ], ProductPostEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, name: 'update_date' })
    ], ProductPostEntity.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.Column)()
    ], ProductPostEntity.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ "default": '' })
    ], ProductPostEntity.prototype, "body");
    __decorate([
        (0, typeorm_1.Column)()
    ], ProductPostEntity.prototype, "price");
    __decorate([
        (0, typeorm_1.Column)()
    ], ProductPostEntity.prototype, "quantity");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.UserEntity; }, function (userEntity) { return userEntity.productPost; })
    ], ProductPostEntity.prototype, "author");
    ProductPostEntity = __decorate([
        (0, typeorm_1.Entity)('product_post', { schema: 'postgres' })
    ], ProductPostEntity);
    return ProductPostEntity;
}());
exports.ProductPostEntity = ProductPostEntity;
