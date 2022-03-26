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
exports.SellService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var rxjs_1 = require("rxjs");
var post_entity_1 = require("../models/post.entity");
var SellService = /** @class */ (function () {
    function SellService(sellPostRepository) {
        this.sellPostRepository = sellPostRepository;
    }
    SellService.prototype.createPost = function (user, sellPost) {
        sellPost.author = user;
        return (0, rxjs_1.from)(this.sellPostRepository.save(sellPost));
    };
    SellService.prototype.findAllPosts = function () {
        return (0, rxjs_1.from)(this.sellPostRepository.find());
    };
    SellService.prototype.findPosts = function (take, skip) {
        if (take === void 0) { take = 10; }
        if (skip === void 0) { skip = 0; }
        return (0, rxjs_1.from)(this.sellPostRepository.findAndCount({ take: take, skip: skip }).then(function (_a) {
            var posts = _a[0];
            return posts;
        }));
    };
    SellService.prototype.updatePost = function (id, sellPost) {
        return (0, rxjs_1.from)(this.sellPostRepository.update(id, sellPost));
    };
    SellService.prototype.deletePost = function (id) {
        return (0, rxjs_1.from)(this.sellPostRepository["delete"](id));
    };
    SellService.prototype.findSellById = function (id) {
        return (0, rxjs_1.from)(this.sellPostRepository.findOne({ id: id }, { relations: ['author'] }));
    };
    SellService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.SellPostEntity))
    ], SellService);
    return SellService;
}());
exports.SellService = SellService;
