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
exports.ProductController = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var common_1 = require("@nestjs/common");
var jwt_guard_1 = require("api/src/auth/guards/jwt.guard");
var ProductController = /** @class */ (function () {
    function ProductController(productService) {
        this.productService = productService;
    }
    ProductController.prototype.create = function (productPost, req) {
        return this.productService.createPost(req.user, productPost);
    };
    ProductController.prototype.findAll = function () {
        return this.productService.findAllPosts();
    };
    ProductController.prototype.findSelected = function (take, skip) {
        if (take === void 0) { take = 1; }
        if (skip === void 0) { skip = 1; }
        take = take > 15 ? 15 : take;
        return this.productService.findPosts(take, skip);
    };
    ProductController.prototype.findProductById = function (productStringId) {
        var productId = parseInt(productStringId);
        return this.productService.findProductById(productId);
    };
    ProductController.prototype.update = function (id, productPost) {
        return this.productService.updatePost(id, productPost);
    };
    ProductController.prototype["delete"] = function (id) {
        return this.productService.deletePost(id);
    };
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)())
    ], ProductController.prototype, "create");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)()
    ], ProductController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)('take')),
        __param(1, (0, common_1.Query)('skip'))
    ], ProductController.prototype, "findSelected");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)(':productId'),
        __param(0, (0, common_1.Param)('productId'))
    ], ProductController.prototype, "findProductById");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Put)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], ProductController.prototype, "update");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], ProductController.prototype, "delete");
    ProductController = __decorate([
        (0, common_1.Controller)('product')
    ], ProductController);
    return ProductController;
}());
exports.ProductController = ProductController;
