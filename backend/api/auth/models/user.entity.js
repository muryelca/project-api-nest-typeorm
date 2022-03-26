"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserEntity = void 0;
var post_entity_1 = require("api/src/api/product/models/post.entity");
var typeorm_1 = require("typeorm");
var role_entity_1 = require("./role.entity");
var UserEntity = /** @class */ (function () {
    function UserEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], UserEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], UserEntity.prototype, "firstName");
    __decorate([
        (0, typeorm_1.Column)()
    ], UserEntity.prototype, "lastName");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], UserEntity.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)({ select: false })
    ], UserEntity.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', "enum": role_entity_1.Role, "default": role_entity_1.Role.USER })
    ], UserEntity.prototype, "role");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return post_entity_1.ProductPostEntity; }, function (productPostEntity) { return productPostEntity.author; })
    ], UserEntity.prototype, "productPost");
    UserEntity = __decorate([
        (0, typeorm_1.Entity)('user', { schema: 'postgres' })
    ], UserEntity);
    return UserEntity;
}());
exports.UserEntity = UserEntity;
