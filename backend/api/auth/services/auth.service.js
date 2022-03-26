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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var user_entity_1 = require("../models/user.entity");
var AuthService = /** @class */ (function () {
    function AuthService(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    AuthService.prototype.hashPassword = function (password) {
        return (0, rxjs_1.from)(bcrypt.hash(password, 8));
    };
    AuthService.prototype.registerAccount = function (user) {
        var _this = this;
        var firstName = user.firstName, lastName = user.lastName, email = user.email, password = user.password;
        return this.hashPassword(password).pipe((0, operators_1.switchMap)(function (hashedPassword) {
            return (0, rxjs_1.from)(_this.userRepository.save({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword
            })).pipe((0, operators_1.map)(function (user) {
                delete user.password;
                return user;
            }));
        }));
    };
    AuthService.prototype.validateUser = function (email, password) {
        return (0, rxjs_1.from)(this.userRepository.findOne({ email: email }, {
            select: ['id', 'firstName', 'lastName', 'email', 'password', 'role']
        })).pipe((0, operators_1.switchMap)(function (user) {
            if (!user) {
                throw new common_1.HttpException({ status: common_1.HttpStatus.FORBIDDEN, error: 'Credenciais invalidas' }, common_1.HttpStatus.FORBIDDEN);
            }
            return (0, rxjs_1.from)(bcrypt.compare(password, user.password)).pipe((0, operators_1.map)(function (isValidPassword) {
                if (isValidPassword) {
                    delete user.password;
                    return user;
                }
            }));
        }));
    };
    AuthService.prototype.login = function (user) {
        var _this = this;
        var email = user.email, password = user.password;
        return this.validateUser(email, password).pipe((0, operators_1.switchMap)(function (user) {
            if (user) {
                return (0, rxjs_1.from)(_this.jwtService.signAsync({ user: user }));
            }
        }));
    };
    AuthService.prototype.findUserbyId = function (id) {
        return (0, rxjs_1.from)(this.userRepository.findOne({ id: id }, { relations: ['sellPosts'] })).pipe((0, operators_1.map)(function (user) {
            delete user.password;
            return user;
        }));
    };
    AuthService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
