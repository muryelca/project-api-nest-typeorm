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
exports.SellController = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var common_1 = require("@nestjs/common");
var jwt_guard_1 = require("../../auth/guards/jwt.guard");
var SellController = /** @class */ (function () {
    function SellController(sellService) {
        this.sellService = sellService;
    }
    SellController.prototype.create = function (sellPost, req) {
        return this.sellService.createPost(req.user, sellPost);
    };
    SellController.prototype.findAll = function () {
        return this.sellService.findAllPosts();
    };
    SellController.prototype.findSelected = function (take, skip) {
        if (take === void 0) { take = 1; }
        if (skip === void 0) { skip = 1; }
        take = take > 15 ? 15 : take;
        return this.sellService.findPosts(take, skip);
    };
    SellController.prototype.findSellById = function (sellStringId) {
        var sellId = parseInt(sellStringId);
        return this.sellService.findSellById(sellId);
    };
    SellController.prototype.update = function (id, sellPost) {
        return this.sellService.updatePost(id, sellPost);
    };
    SellController.prototype["delete"] = function (id) {
        return this.sellService.deletePost(id);
    };
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)())
    ], SellController.prototype, "create");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)()
    ], SellController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)('take')),
        __param(1, (0, common_1.Query)('skip'))
    ], SellController.prototype, "findSelected");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)(':sellId'),
        __param(0, (0, common_1.Param)('sellId'))
    ], SellController.prototype, "findSellById");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Put)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], SellController.prototype, "update");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], SellController.prototype, "delete");
    SellController = __decorate([
        (0, common_1.Controller)('sell')
    ], SellController);
    return SellController;
}());
exports.SellController = SellController;
