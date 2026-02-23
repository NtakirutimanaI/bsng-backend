"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const roles_service_1 = require("../rbac/roles.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    rolesService;
    constructor(usersService, jwtService, rolesService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.rolesService = rolesService;
    }
    async validateUser(email, pass) {
        console.log(`Validating user: ${email}`);
        const user = await this.usersService.findByEmail(email);
        if (user) {
            console.log(`User found: ${user.email}, hasPassword: ${!!user.passwordHash}`);
        }
        else {
            console.log(`User NOT found: ${email}`);
        }
        if (user && user.passwordHash) {
            const isMatch = await bcrypt.compare(pass, user.passwordHash);
            console.log(`Password match for ${email}: ${isMatch}`);
            if (isMatch) {
                const { passwordHash, ...result } = user;
                return result;
            }
        }
        else {
            console.log(`User ${email} has no password hash set.`);
        }
        return null;
    }
    async login(user) {
        const payload = {
            username: user.email,
            sub: user.id,
            role: user.role?.name || user.userRole,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
    async register(registrationData) {
        const existingUser = await this.usersService.findByEmail(registrationData.email);
        if (existingUser) {
            throw new common_1.UnauthorizedException('User already exists with this email');
        }
        const clientRole = await this.rolesService.findRoleByName('client');
        const newUser = await this.usersService.create({
            email: registrationData.email,
            fullName: registrationData.fullName,
            username: registrationData.email.split('@')[0] +
                '_' +
                Math.random().toString(36).substring(7),
            passwordHash: registrationData.passwordHash,
            userRole: user_entity_1.UserRole.CLIENT,
            role: clientRole || undefined,
            isActive: true,
        });
        const fullyLoadedUser = await this.usersService.findOne(newUser.id);
        return this.login(fullyLoadedUser || newUser);
    }
    async validateGoogleUser(details) {
        const user = await this.usersService.findByEmail(details.email);
        if (user) {
            if (!user.googleId) {
                const updatedUser = await this.usersService.update(user.id, {
                    googleId: details.googleId,
                });
                return updatedUser || (await this.usersService.findOne(user.id)) || user;
            }
            return (await this.usersService.findOne(user.id)) || user;
        }
        const clientRole = await this.rolesService.findRoleByName('client');
        const newUser = await this.usersService.create({
            email: details.email,
            fullName: `${details.firstName} ${details.lastName}`,
            username: details.email.split('@')[0] +
                '_' +
                Math.random().toString(36).substring(7),
            googleId: details.googleId,
            userRole: user_entity_1.UserRole.CLIENT,
            role: clientRole || undefined,
            isActive: true,
        });
        return (await this.usersService.findOne(newUser.id)) || newUser;
    }
    async requestPasswordReset(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('The account with this email doesn\'t exist. First create the account.');
        }
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const resetTokenExpires = new Date();
        resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);
        await this.usersService.update(user.id, {
            resetToken,
            resetTokenExpires,
        });
        console.log(`Password reset token for ${email}: ${resetToken}`);
        return {
            message: 'Password reset link has been sent to your email.',
            resetToken
        };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findByResetToken(token);
        if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);
        await this.usersService.update(user.id, {
            passwordHash,
            resetToken: undefined,
            resetTokenExpires: undefined,
        });
        return { message: 'Password has been reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        roles_service_1.RolesService])
], AuthService);
//# sourceMappingURL=auth.service.js.map