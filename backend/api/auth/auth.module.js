"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./services/auth.service");
var auth_controller_1 = require("./controllers/auth.controller");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("./models/user.entity");
var jwt_1 = require("@nestjs/jwt");
var jwt_guard_1 = require("./guards/jwt.guard");
var jwt_strategy_1 = require("./guards/jwt.strategy");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                jwt_1.JwtModule.registerAsync({
                    useFactory: function () { return ({
                        secret: process.env.JWT_SECRET,
                        signOptions: { expiresIn: '3600s' }
                    }); }
                }),
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]),
            ],
            providers: [auth_service_1.AuthService, jwt_guard_1.JwtGuard, jwt_strategy_1.JwtStrategy],
            controllers: [auth_controller_1.AuthController],
            exports: [auth_service_1.AuthService]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
