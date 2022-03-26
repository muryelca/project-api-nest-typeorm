"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserPostEntity = void 0;
var typeorm_1 = require("typeorm");
var UserPostEntity = /** @class */ (function () {
    function UserPostEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], UserPostEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ "default": '' })
    ], UserPostEntity.prototype, "body");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ nullable: true, name: 'create_date' })
    ], UserPostEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, name: 'update_date' })
    ], UserPostEntity.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.Column)()
    ], UserPostEntity.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)()
    ], UserPostEntity.prototype, "lastname");
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp' })
    ], UserPostEntity.prototype, "born");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], UserPostEntity.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)()
    ], UserPostEntity.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)()
    ], UserPostEntity.prototype, "location");
    UserPostEntity = __decorate([
        (0, typeorm_1.Entity)('user_post', { schema: 'postgres' })
    ], UserPostEntity);
    return UserPostEntity;
}());
exports.UserPostEntity = UserPostEntity;
