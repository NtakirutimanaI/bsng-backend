import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from '../rbac/roles.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private rolesService;
    constructor(usersService: UsersService, jwtService: JwtService, rolesService: RolesService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(registrationData: {
        email: string;
        fullName: string;
        passwordHash: string;
    }): Promise<any>;
    validateGoogleUser(details: {
        email: string;
        firstName: string;
        lastName: string;
        picture: string;
        googleId: string;
    }): Promise<User>;
    requestPasswordReset(email: string): Promise<{
        message: string;
        resetToken?: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
