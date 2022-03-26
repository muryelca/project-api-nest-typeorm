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
exports.ProductService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var rxjs_1 = require("rxjs");
var post_entity_1 = require("../models/post.entity");
var ProductService = /** @class */ (function () {
    function ProductService(productPostRepository) {
        this.productPostRepository = productPostRepository;
    }
    ProductService.prototype.createPost = function (user, productPost) {
        productPost.author = user;
        return (0, rxjs_1.from)(this.productPostRepository.save(productPost));
    };
    ProductService.prototype.findAllPosts = function () {
        return (0, rxjs_1.from)(this.productPostRepository.find());
    };
    ProductService.prototype.findPosts = function (take, skip) {
        if (take === void 0) { take = 10; }
        if (skip === void 0) { skip = 0; }
        return (0, rxjs_1.from)(this.productPostRepository
            .findAndCount({ take: take, skip: skip })
            .then(function (_a) {
            var posts = _a[0];
            return posts;
        }));
    };
    ProductService.prototype.updatePost = function (id, productPost) {
        return (0, rxjs_1.from)(this.productPostRepository.update(id, productPost));
    };
    ProductService.prototype.deletePost = function (id) {
        return (0, rxjs_1.from)(this.productPostRepository["delete"](id));
    };
    ProductService.prototype.findProductById = function (id) {
        return (0, rxjs_1.from)(this.productPostRepository.findOne({ id: id }));
    };
    ProductService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.ProductPostEntity))
    ], ProductService);
    return ProductService;
}());
exports.ProductService = ProductService;
