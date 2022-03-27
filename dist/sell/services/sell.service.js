"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../models/post.entity");
let SellService = class SellService {
    constructor(sellPostRepository) {
        this.sellPostRepository = sellPostRepository;
    }
    createPost(user, sellPost) {
        sellPost.author = user;
        return (0, rxjs_1.from)(this.sellPostRepository.save(sellPost));
    }
    findAllPosts() {
        return (0, rxjs_1.from)(this.sellPostRepository.find());
    }
    findPosts(take = 10, skip = 0) {
        return (0, rxjs_1.from)(this.sellPostRepository.findAndCount({ take, skip }).then(([posts]) => {
            return posts;
        }));
    }
    updatePost(id, sellPost) {
        return (0, rxjs_1.from)(this.sellPostRepository.update(id, sellPost));
    }
    deletePost(id) {
        return (0, rxjs_1.from)(this.sellPostRepository.delete(id));
    }
    findSellById(id) {
        return (0, rxjs_1.from)(this.sellPostRepository.findOne({ id }, { relations: ['author'] }));
    }
};
SellService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.SellPostEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SellService);
exports.SellService = SellService;
//# sourceMappingURL=sell.service.js.map