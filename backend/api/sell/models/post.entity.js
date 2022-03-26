"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SellPostEntity = void 0;
var user_entity_1 = require("../../auth/models/user.entity");
var typeorm_1 = require("typeorm");
var SellPostEntity = /** @class */ (function () {
    function SellPostEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], SellPostEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ nullable: true, name: 'create_date' })
    ], SellPostEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, name: 'update_date' })
    ], SellPostEntity.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.Column)()
    ], SellPostEntity.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ "default": '' })
    ], SellPostEntity.prototype, "body");
    __decorate([
        (0, typeorm_1.Column)()
    ], SellPostEntity.prototype, "price");
    __decorate([
        (0, typeorm_1.Column)()
    ], SellPostEntity.prototype, "quantity");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.UserEntity; }, function (userEntity) { return userEntity.sellPost; })
    ], SellPostEntity.prototype, "author");
    __decorate([
        (0, typeorm_1.Column)()
    ], SellPostEntity.prototype, "isSell");
    SellPostEntity = __decorate([
        (0, typeorm_1.Entity)('sell_post', { schema: 'postgres' })
    ], SellPostEntity);
    return SellPostEntity;
}());
exports.SellPostEntity = SellPostEntity;
