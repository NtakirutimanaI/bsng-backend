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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const roles_service_1 = require("../rbac/roles.service");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
const permission_entity_1 = require("../rbac/entities/permission.entity");
const projects_service_1 = require("../projects/projects.service");
const properties_service_1 = require("../properties/properties.service");
const payments_service_1 = require("../payments/payments.service");
const sponsors_service_1 = require("../sponsors/sponsors.service");
const updates_service_1 = require("../updates/updates.service");
const settings_service_1 = require("../settings/settings.service");
const services_service_1 = require("../services/services.service");
const employees_service_1 = require("../employees/employees.service");
const bcrypt = __importStar(require("bcrypt"));
let SeedService = class SeedService {
    rolesService;
    usersService;
    projectsService;
    propertiesService;
    paymentsService;
    sponsorsService;
    updatesService;
    settingsService;
    servicesService;
    employeesService;
    constructor(rolesService, usersService, projectsService, propertiesService, paymentsService, sponsorsService, updatesService, settingsService, servicesService, employeesService) {
        this.rolesService = rolesService;
        this.usersService = usersService;
        this.projectsService = projectsService;
        this.propertiesService = propertiesService;
        this.paymentsService = paymentsService;
        this.sponsorsService = sponsorsService;
        this.updatesService = updatesService;
        this.settingsService = settingsService;
        this.servicesService = servicesService;
        this.employeesService = employeesService;
    }
    async onModuleInit() {
        console.log('Seeding process started...');
        try {
            await this.seedRolesAndPermissions();
            console.log('Roles and permissions seeded.');
        }
        catch (e) {
            console.error('Error seeding roles:', e.message);
        }
        try {
            await this.seedUsers();
            console.log('Users seeded.');
        }
        catch (e) {
            console.error('Error seeding users:', e.message);
        }
        try {
            await this.seedData();
            console.log('Data (Projects/Properties) seeded.');
        }
        catch (e) {
            console.error('Error seeding data:', e.message);
        }
        try {
            await this.seedSettings();
            console.log('Settings seeded.');
        }
        catch (e) {
            console.error('Error seeding settings:', e.message);
        }
        try {
            await this.servicesService.seed();
            console.log('Services seeded.');
        }
        catch (e) {
            console.error('Error seeding services:', e.message);
        }
        try {
            await this.seedEmployees();
            console.log('Employees seeded.');
        }
        catch (e) {
            console.error('Error seeding employees:', e.message);
        }
        console.log('Seeding process completed.');
    }
    async seedRolesAndPermissions() {
        const roles = [
            'super_admin',
            'admin',
            'manager',
            'site_manager',
            'editor',
            'employee',
            'client',
            'contractor',
            'auditor',
            'general_user',
            'partner',
            'donor',
            'beneficiary',
            'volunteer',
            'consultant',
            'accountant',
            'hr',
            'investor',
            'guest',
        ];
        for (const roleName of roles) {
            const exists = await this.rolesService.findRoleByName(roleName);
            if (!exists) {
                await this.rolesService.createRole(roleName, `Role for ${roleName}`, 0, roleName === 'super_admin');
                console.log(`Created role: ${roleName}`);
            }
        }
        const permissions = [
            {
                module: 'users',
                action: permission_entity_1.PermissionAction.CREATE,
                resource: 'users',
                description: 'Create users',
            },
            {
                module: 'users',
                action: permission_entity_1.PermissionAction.READ,
                resource: 'users',
                description: 'Read users',
            },
            {
                module: 'content',
                action: permission_entity_1.PermissionAction.UPDATE,
                resource: 'website',
                description: 'Update website content',
            },
        ];
        for (const p of permissions) {
            try {
                const perm = await this.rolesService.createPermission(p.module, p.action, p.resource, p.description);
                await this.rolesService.addPermissionToRole('super_admin', perm);
                if (p.module === 'content') {
                    const auditorRole = await this.rolesService.findRoleByName('auditor');
                    if (auditorRole) {
                        await this.rolesService.addPermissionToRole('auditor', perm);
                    }
                    const editorRole = await this.rolesService.findRoleByName('editor');
                    if (editorRole) {
                        await this.rolesService.addPermissionToRole('editor', perm);
                    }
                }
            }
            catch (e) { }
        }
    }
    async seedUsers() {
        const usersToSeed = [
            {
                email: 'admin@bsng.com',
                username: 'superadmin',
                role: 'super_admin',
                uRole: user_entity_1.UserRole.SUPER_ADMIN,
                name: 'Super Admin',
            },
            {
                email: 'manager@bsng.com',
                username: 'manager',
                role: 'manager',
                uRole: user_entity_1.UserRole.MANAGER,
                name: 'General Manager',
            },
            {
                email: 'sitemanager@bsng.com',
                username: 'sitemanager',
                role: 'site_manager',
                uRole: user_entity_1.UserRole.SITE_MANAGER,
                name: 'Site Manager',
            },
            {
                email: 'editor@bsng.com',
                username: 'editor',
                role: 'editor',
                uRole: user_entity_1.UserRole.EDITOR,
                name: 'Content Editor',
            },
            {
                email: 'auditor@bsng.com',
                username: 'auditor',
                role: 'auditor',
                uRole: user_entity_1.UserRole.AUDITOR,
                name: 'System Auditor',
            },
            {
                email: 'employee@bsng.com',
                username: 'employee',
                role: 'employee',
                uRole: user_entity_1.UserRole.EMPLOYEE,
                name: 'Staff Member',
            },
            {
                email: 'client@bsng.com',
                username: 'client',
                role: 'client',
                uRole: user_entity_1.UserRole.CLIENT,
                name: 'Valued Client',
            },
            {
                email: 'contractor@bsng.com',
                username: 'contractor',
                role: 'contractor',
                uRole: user_entity_1.UserRole.CONTRACTOR,
                name: 'External Contractor',
            },
        ];
        const saltRounds = 10;
        const password = '123456';
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        for (const u of usersToSeed) {
            try {
                const emailExists = await this.usersService.findByEmail(u.email);
                const phone = `123456789${usersToSeed.indexOf(u)}`;
                if (!emailExists) {
                    console.log(`Checking if username/phone exists for new user: ${u.username}`);
                    const role = await this.rolesService.findRoleByName(u.role);
                    if (role) {
                        await this.usersService.create({
                            username: u.username,
                            email: u.email,
                            phone: phone,
                            fullName: u.name,
                            passwordHash: hashedPassword,
                            role: role,
                            userRole: u.uRole,
                        });
                        console.log(`Created user: ${u.username}`);
                    }
                }
                else {
                    console.log(`Email ${u.email} found as user ID ${emailExists.id} with username ${emailExists.username}`);
                    const updateData = {
                        passwordHash: hashedPassword,
                        username: u.username,
                        userRole: u.uRole,
                    };
                    if (!emailExists.phone) {
                        updateData.phone = phone;
                    }
                    await this.usersService.update(emailExists.id, updateData);
                    console.log(`Updated user: ${u.username}`);
                }
            }
            catch (err) {
                console.error(`Failed to seed user ${u.email}:`, err.message);
            }
        }
        try {
            const devEmail = 'innocentntakir@gmail.com';
            const devUser = await this.usersService.findByEmail(devEmail);
            if (devUser) {
                await this.usersService.update(devUser.id, {
                    passwordHash: hashedPassword,
                    isActive: true
                });
                console.log(`EMERGENCY: Reset password for ${devEmail} to 123456`);
            }
        }
        catch (e) {
            console.error('Failed to reset dev password:', e.message);
        }
    }
    async seedSettings() {
        const footerSettings = [
            {
                key: 'footer_company_name',
                value: 'BSNG Ltd',
                group: 'footer',
                description: 'Company Name in Footer',
            },
            {
                key: 'footer_company_tagline',
                value: 'Build Strong',
                group: 'footer',
                description: 'Tagline in Footer',
            },
            {
                key: 'footer_company_description',
                value: 'Building Strong For The Next Generations. Your trusted partner in construction and property development.',
                group: 'footer',
                description: 'Company Description in Footer',
            },
            {
                key: 'contact_address',
                value: 'Rwanda/Kigali/Gasabo/Kibagabaga',
                group: 'contact',
                description: 'Office Address',
            },
            {
                key: 'contact_phone',
                value: '+250 737 213 060',
                group: 'contact',
                description: 'Primary Contact Phone',
            },
            {
                key: 'contact_phone_1',
                value: '+250 737 213 060',
                group: 'contact',
                description: 'Contact Phone 1',
            },
            {
                key: 'contact_phone_2',
                value: '+250 737 213 060',
                group: 'contact',
                description: 'Contact Phone 2',
            },
            {
                key: 'contact_email_1',
                value: 'info.buildstronggenerations@gmail.com',
                group: 'contact',
                description: 'Primary Email',
            },
            {
                key: 'contact_email_2',
                value: 'info.buildstronggenerations@gmail.com',
                group: 'contact',
                description: 'Secondary Email',
            },
            {
                key: 'social_facebook',
                value: 'https://facebook.com/bsng',
                group: 'social',
                description: 'Facebook Link',
            },
            {
                key: 'social_twitter',
                value: 'https://twitter.com/bsng',
                group: 'social',
                description: 'Twitter Link',
            },
            {
                key: 'social_linkedin',
                value: 'https://linkedin.com/company/bsng',
                group: 'social',
                description: 'LinkedIn Link',
            },
            {
                key: 'social_instagram',
                value: 'https://instagram.com/bsng',
                group: 'social',
                description: 'Instagram Link',
            },
            {
                key: 'home_hero_title',
                value: 'Building Your Future With Excellence',
                group: 'home',
                description: 'Hero Title',
            },
            {
                key: 'home_hero_subtitle',
                value: 'Build Strong For The Next Generations',
                group: 'home',
                description: 'Hero Subtitle',
            },
            {
                key: 'home_about_title',
                value: 'Building Strong Generations',
                group: 'home',
                description: 'About Section Title',
            },
            {
                key: 'home_services_visible',
                value: 'true',
                group: 'home',
                description: 'Show services on home page',
            },
            {
                key: 'about_title',
                value: 'About BSNG Ltd',
                group: 'about',
                description: 'About Page Title',
            },
            {
                key: 'about_company_history',
                value: "Founded in 2005, BSNG Ltd has grown from a small construction firm to become one of the region's most trusted names in construction and property development.",
                group: 'about',
                description: 'Company History',
            },
            {
                key: 'about_vision',
                value: 'To be the most trusted and respected construction and property development company in the region.',
                group: 'about',
                description: 'Company Vision Statement',
            },
        ];
        for (const s of footerSettings) {
            await this.settingsService.createOrUpdate(s.key, s.value, s.group, s.description);
        }
        console.log('Seeded settings');
    }
    async seedData() {
        const projects = await this.projectsService.findAll(1, 1);
        if (projects.total === 0) {
            console.log('Seeding projects...');
            await this.projectsService.create({
                code: 'PRJ-2024-001',
                name: 'Kigali Heights Tower',
                type: 'construction',
                status: 'active',
                location: 'Kigali, Rwanda',
                startDate: '2024-01-15',
                endDate: '2025-06-30',
                budget: 'RWF 500,000,000',
                actualCost: 'RWF 325,000,000',
                manager: 'Jean Baptiste',
                client: 'Government of Rwanda',
                progress: 65,
            });
            await this.projectsService.create({
                code: 'PRJ-2024-002',
                name: 'Green Valley Estates',
                type: 'construction',
                status: 'planning',
                location: 'Musanze, Rwanda',
                startDate: '2024-03-01',
                endDate: '2025-12-31',
                budget: 'RWF 280,000,000',
                actualCost: 'RWF 70,000,000',
                manager: 'Marie Claire',
                client: 'Private Developer',
                progress: 25,
            });
            await this.projectsService.create({
                code: 'PRJ-2023-045',
                name: 'City Center Complex',
                type: 'renovation',
                status: 'active',
                location: 'Kigali, Rwanda',
                startDate: '2023-08-01',
                endDate: '2024-10-30',
                budget: 'RWF 720,000,000',
                actualCost: 'RWF 612,000,000',
                manager: 'Patrick Nkunda',
                client: 'City Mall Corp',
                progress: 85,
            });
        }
        const properties = await this.propertiesService.findAll(1, 1);
        if (properties.total === 0) {
            console.log('Seeding properties...');
            await this.propertiesService.create({
                code: 'PROP-2024-001',
                title: 'Luxury Villa in Nyarutarama',
                type: 'house',
                status: 'available',
                location: 'Nyarutarama, Kigali',
                size: 450,
                price: 250000000,
                monthlyRent: 2000000,
                isForSale: true,
                isForRent: true,
                bedrooms: 5,
                bathrooms: 4,
                image: 'https://images.unsplash.com/photo-1613490493576-2f5037657918?q=80&w=2069&auto=format&fit=crop',
            });
            await this.propertiesService.create({
                code: 'PROP-2024-002',
                title: 'Modern Apartment in City Center',
                type: 'apartment',
                status: 'rented',
                location: 'Downtown Kigali',
                size: 120,
                price: 85000000,
                monthlyRent: 800000,
                isForSale: true,
                isForRent: true,
                bedrooms: 3,
                bathrooms: 2,
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
            });
            await this.propertiesService.create({
                code: 'PROP-2024-003',
                title: 'Commercial Plot in Kimihurura',
                type: 'plot',
                status: 'available',
                location: 'Kimihurura, Kigali',
                size: 800,
                price: 180000000,
                isForSale: true,
                isForRent: false,
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2132&auto=format&fit=crop',
            });
        }
        const payments = await this.paymentsService.findAll(1, 1);
        if (payments.total === 0) {
            console.log('Seeding payments...');
            await this.paymentsService.create({
                code: 'PAY-2024-001',
                amount: 15000000,
                type: 'client_payment',
                status: 'completed',
                method: 'bank_transfer',
                date: '2024-01-25',
                description: 'Payment for Kigali Heights',
                payer: 'Gov Rwanda',
                payee: 'BSNG Ltd',
            });
            await this.paymentsService.create({
                code: 'PAY-2024-002',
                amount: 8500000,
                type: 'salary',
                status: 'completed',
                method: 'momo',
                date: '2024-01-30',
                description: 'Jan Salaries',
                payer: 'BSNG Ltd',
                payee: 'Employees',
            });
        }
        const sponsors = await this.sponsorsService.findAll(1, 1);
        if (sponsors.total === 0) {
            console.log('Seeding sponsors...');
            await this.sponsorsService.create({
                name: 'Rwanda Development Bank',
                type: 'government',
                contactPerson: 'Dr. James',
                email: 'j.ndahiro@rdb.gov.rw',
                phone: '+250 788 111 222',
                investmentAmount: 500000000,
                investmentDate: '2023-01-15',
                status: 'active',
                projects: 5,
            });
            await this.sponsorsService.create({
                name: 'East Africa Investment Group',
                type: 'company',
                contactPerson: 'Sarah Johnson',
                email: 'sarah@eaig.com',
                phone: '+250 788 222 333',
                investmentAmount: 350000000,
                investmentDate: '2023-06-20',
                status: 'active',
                projects: 3,
            });
        }
        const updates = await this.updatesService.findAll(1, 1);
        if (updates.total === 0) {
            console.log('Seeding updates...');
            await this.updatesService.create({
                title: 'New Luxury Apartments Project Launched',
                excerpt: 'BSNG Ltd announces new complex.',
                content: 'We are excited to announce our latest project...',
                category: 'Projects',
                author: 'Admin',
                date: '2026-01-25',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
                tags: ['Construction', 'Luxury'],
            });
            await this.updatesService.create({
                title: 'Best Construction Company Award 2025',
                excerpt: 'Honored to receive the award.',
                content: 'Our commitment to quality has been recognized...',
                category: 'Awards',
                author: 'Admin',
                date: '2026-01-20',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
                tags: ['Award', 'Achievement'],
            });
        }
    }
    async seedEmployees() {
        const employees = await this.employeesService.findAll(1, 1);
        if (employees.total === 0) {
            console.log('Seeding employees...');
            const sampleEmployees = [
                {
                    name: 'Innocent Mugisha',
                    employeeId: 'EMP-001',
                    email: 'mugisha@example.com',
                    phone: '+250788123456',
                    department: 'Engineering',
                    position: 'Site Engineer',
                    hireDate: '2023-01-10',
                    salaryType: 'monthly',
                    baseSalary: 1200000,
                    status: 'active',
                },
                {
                    name: 'Divine Uwase',
                    employeeId: 'EMP-002',
                    email: 'uwase@example.com',
                    phone: '+250788654321',
                    department: 'Operations',
                    position: 'Foreman',
                    hireDate: '2023-05-15',
                    salaryType: 'daily',
                    baseSalary: 25000,
                    status: 'active',
                },
                {
                    name: 'Jean Claude Ngabo',
                    employeeId: 'EMP-003',
                    email: 'ngabo@example.com',
                    phone: '+250788777888',
                    department: 'Engineering',
                    position: 'Electrician',
                    hireDate: '2023-08-20',
                    salaryType: 'daily',
                    baseSalary: 15000,
                    status: 'active',
                },
                {
                    name: 'Alice Umutoni',
                    employeeId: 'EMP-004',
                    email: 'umutoni@example.com',
                    phone: '+250788999000',
                    department: 'Management',
                    position: 'Project Manager',
                    hireDate: '2022-11-01',
                    salaryType: 'monthly',
                    baseSalary: 2500000,
                    status: 'active',
                },
                {
                    name: 'Patrick Kalisa',
                    employeeId: 'EMP-005',
                    email: 'kalisa@example.com',
                    phone: '+250788111222',
                    department: 'Finance',
                    position: 'Accountant',
                    hireDate: '2023-02-14',
                    salaryType: 'monthly',
                    baseSalary: 1500000,
                    status: 'active',
                }
            ];
            for (const empData of sampleEmployees) {
                const emp = await this.employeesService.create(empData);
                const daysInMonth = 18;
                for (let d = 1; d <= daysInMonth; d++) {
                    const date = `2026-02-${d.toString().padStart(2, '0')}`;
                    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                    if (!isWeekend) {
                        await this.employeesService.recordAttendance({
                            employeeId: emp.id,
                            date,
                            status: Math.random() > 0.1 ? 'Present' : 'Absent',
                            checkIn: '08:00',
                            checkOut: '17:00',
                            workingHours: 9,
                            reason: '',
                        });
                    }
                }
            }
            console.log('Finished seeding employees and attendance.');
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [roles_service_1.RolesService,
        users_service_1.UsersService,
        projects_service_1.ProjectsService,
        properties_service_1.PropertiesService,
        payments_service_1.PaymentsService,
        sponsors_service_1.SponsorsService,
        updates_service_1.UpdatesService,
        settings_service_1.SettingsService,
        services_service_1.ServicesService,
        employees_service_1.EmployeesService])
], SeedService);
//# sourceMappingURL=seed.service.js.map