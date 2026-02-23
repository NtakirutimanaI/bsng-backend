import { Role } from '../../rbac/entities/role.entity';
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    MANAGER = "manager",
    SITE_MANAGER = "site_manager",
    EDITOR = "editor",
    EMPLOYEE = "employee",
    CLIENT = "client",
    CONTRACTOR = "contractor",
    AUDITOR = "auditor",
    GENERAL_USER = "general_user",
    PARTNER = "partner",
    DONOR = "donor",
    BENEFICIARY = "beneficiary",
    VOLUNTEER = "volunteer",
    CONSULTANT = "consultant",
    ACCOUNTANT = "accountant",
    HR = "hr",
    INVESTOR = "investor",
    GUEST = "guest"
}
export declare class User {
    id: string;
    username: string;
    email: string;
    phone: string;
    googleId: string;
    passwordHash: string;
    fullName: string;
    roleId: string;
    role: Role;
    userRole: UserRole;
    language: string;
    country: string;
    timezone: string;
    isActive: boolean;
    resetToken: string;
    resetTokenExpires: Date;
    createdAt: Date;
}
