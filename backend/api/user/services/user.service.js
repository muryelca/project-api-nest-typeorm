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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var rxjs_1 = require("rxjs");
var post_entity_1 = require("../models/post.entity");
var UserService = /** @class */ (function () {
    function UserService(userPostRepository) {
        this.userPostRepository = userPostRepository;
    }
    UserService.prototype.createPost = function (userPost) {
        return (0, rxjs_1.from)(this.userPostRepository.save(userPost));
    };
    UserService.prototype.findAllPosts = function () {
        return (0, rxjs_1.from)(this.userPostRepository.find());
    };
    UserService.prototype.findPosts = function (take, skip) {
        if (take === void 0) { take = 10; }
        if (skip === void 0) { skip = 0; }
        return (0, rxjs_1.from)(this.userPostRepository.findAndCount({ take: take, skip: skip }).then(function (_a) {
            var posts = _a[0];
            return posts;
        }));
    };
    UserService.prototype.updatePost = function (id, userPost) {
        return (0, rxjs_1.from)(this.userPostRepository.update(id, userPost));
    };
    UserService.prototype.deletePost = function (id) {
        return (0, rxjs_1.from)(this.userPostRepository["delete"](id));
    };
    UserService.prototype.findUserById = function (id) {
        return (0, rxjs_1.from)(this.userPostRepository.findOne({ id: id }));
    };
    UserService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.UserPostEntity))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
