import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RolesService } from '../rbac/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    console.log(`Validating user: ${email}`);
    const user = await this.usersService.findByEmail(email);
    if (user) {
      console.log(
        `User found: ${user.email}, hasPassword: ${!!user.passwordHash}`,
      );
    } else {
      console.log(`User NOT found: ${email}`);
    }
    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      console.log(`Password match for ${email}: ${isMatch}`);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    } else {
      console.log(`User ${email} has no password hash set.`);
    }
    return null;
  }

  async login(user: any) {
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

  async register(registrationData: {
    email: string;
    fullName: string;
    passwordHash: string;
  }): Promise<any> {
    const existingUser = await this.usersService.findByEmail(registrationData.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists with this email');
    }

    const clientRole = await this.rolesService.findRoleByName('client');

    const newUser = await this.usersService.create({
      email: registrationData.email,
      fullName: registrationData.fullName,
      username:
        registrationData.email.split('@')[0] +
        '_' +
        Math.random().toString(36).substring(7),
      passwordHash: registrationData.passwordHash,
      userRole: UserRole.CLIENT,
      role: clientRole || undefined,
      isActive: true,
    });

    // Re-fetch to get relations (role)
    const fullyLoadedUser = await this.usersService.findOne(newUser.id);
    return this.login(fullyLoadedUser || newUser);
  }

  async validateGoogleUser(details: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    googleId: string;
  }): Promise<User> {
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
      username:
        details.email.split('@')[0] +
        '_' +
        Math.random().toString(36).substring(7),
      googleId: details.googleId,
      userRole: UserRole.CLIENT,
      role: clientRole || undefined,
      isActive: true,
    });


    return (await this.usersService.findOne(newUser.id)) || newUser;
  }

  async requestPasswordReset(email: string): Promise<{ message: string; resetToken?: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('The account with this email doesn\'t exist. First create the account.');
    }

    // Generate a random reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour

    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpires,
    });

    // TODO: In production, send email with reset link
    // For now, we'll return the token for testing
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return {
      message: 'Password reset link has been sent to your email.',
      resetToken // Remove this in production
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
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
}
