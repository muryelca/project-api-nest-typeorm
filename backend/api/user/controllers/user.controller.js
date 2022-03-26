"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.UserController = void 0;
var common_1 = require("@nestjs/common");
var jwt_guard_1 = require("api/src/auth/guards/jwt.guard");
var UserController = /** @class */ (function () {
    function UserController(userService) {
        this.userService = userService;
    }
    UserController.prototype.create = function (userPost) {
        return this.userService.createPost(userPost);
    };
    UserController.prototype.findAll = function () {
        return this.userService.findAllPosts();
    };
    UserController.prototype.findSelected = function (take, skip) {
        if (take === void 0) { take = 1; }
        if (skip === void 0) { skip = 1; }
        take = take > 15 ? 15 : take;
        return this.userService.findPosts(take, skip);
    };
    UserController.prototype.findUserById = function (userStringId) {
        var userId = parseInt(userStringId);
        return this.userService.findUserById(userId);
    };
    UserController.prototype.update = function (id, userPost) {
        return this.userService.updatePost(id, userPost);
    };
    UserController.prototype["delete"] = function (id) {
        return this.userService.deletePost(id);
    };
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)())
    ], UserController.prototype, "create");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)()
    ], UserController.prototype, "findAll");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)('take')),
        __param(1, (0, common_1.Query)('skip'))
    ], UserController.prototype, "findSelected");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)(':userId'),
        __param(0, (0, common_1.Param)('userId'))
    ], UserController.prototype, "findUserById");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Put)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], UserController.prototype, "update");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], UserController.prototype, "delete");
    UserController = __decorate([
        (0, common_1.Controller)('user')
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
