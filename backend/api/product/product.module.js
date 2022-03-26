"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductModule = void 0;
var common_1 = require("@nestjs/common");
var product_service_1 = require("./services/product.service");
var product_controller_1 = require("./controllers/product.controller");
var typeorm_1 = require("@nestjs/typeorm");
var post_entity_1 = require("./models/post.entity");
var auth_module_1 = require("../auth/auth.module");
var ProductModule = /** @class */ (function () {
    function ProductModule() {
    }
    ProductModule = __decorate([
        (0, common_1.Module)({
            imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([post_entity_1.ProductPostEntity])],
            providers: [product_service_1.ProductService],
            controllers: [product_controller_1.ProductController]
        })
    ], ProductModule);
    return ProductModule;
}());
exports.ProductModule = ProductModule;
