import { Injectable, OnModuleInit } from '@nestjs/common';
import { SitesService } from '../sites/sites.service';
import { RolesService } from '../rbac/roles.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { PropertiesService } from '../properties/properties.service';
import { PaymentsService } from '../payments/payments.service';
import { SponsorsService } from '../sponsors/sponsors.service';
import { UpdatesService } from '../updates/updates.service';
import { SettingsService } from '../settings/settings.service';
import { ServicesService } from '../services/services.service';
import { EmployeesService } from '../employees/employees.service';
import { EventsService } from '../events/events.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private propertiesService: PropertiesService,
    private paymentsService: PaymentsService,
    private sponsorsService: SponsorsService,
    private updatesService: UpdatesService,
    private settingsService: SettingsService,
    private servicesService: ServicesService,
    private employeesService: EmployeesService,
    private eventsService: EventsService,
    private sitesService: SitesService,
  ) { }

  async onModuleInit() {
    console.log('--- GLOBAL WORKFORCE SYNCHRONIZATION (Background) ---');
    // We do NOT await these so the server can boot and respond to Vercel instantly.
    // This prevents "FUNCTION_INVOCATION_TIMEOUT" during the cold start.
    this.runSeeding().catch(e => console.error('Background Seeding Error:', e.message));
  }

  private async runSeeding() {
    try {
      await this.seedSites();
      await this.seedRolesAndPermissions();
      await this.seedUsers();
      
      // Skip heavy scanning tasks in production to avoid Vercel timeouts
      if (process.env.NODE_ENV !== 'production') {
        await this.seedEmployees();
        await this.autoMapUnassignedUsers();
      }
      
      await this.settingsService.seed(); 
      await this.seedServices();
      await this.seedProperties();
      await this.seedUpdates();
      await this.seedEmployeesAuto();
      console.log('--- SYNCHRONIZATION COMPLETE ---');
    } catch (e) {
      console.error('Seeding Error:', e.message);
    }
  }

  async seedRolesAndPermissions() {
    const roles = ['super_admin', 'admin', 'manager', 'site_manager', 'employee', 'accountant', 'hr', 'auditor', 'client', 'editor', 'contractor'];
    for (const roleName of roles) {
      const exists = await this.rolesService.findRoleByName(roleName);
      if (!exists) {
        await this.rolesService.createRole(roleName, `Role for ${roleName}`, 0, roleName === 'super_admin');
      }
    }
  }

  async seedSites() {
    const sites = [
      { code: 'Site008', name: 'Kabeza', location: 'Kigarama' },
      { code: '004', name: 'Rebero2', location: 'Kicukiro' },
      { code: '001', name: 'Rebero', location: 'Rebero' },
    ];
    for (const s of sites) {
      const res = await this.sitesService.findAll(1, 10, s.name);
      if (res.total === 0) await this.sitesService.create(s);
    }
  }

  async seedUsers() {
    const saltRounds = 10;
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sitesRes = await this.sitesService.findAll(1, 100);
    const sites = sitesRes.data || [];
    
    // Explicit mappings for the users seen in the screenshot
    // Multi-account seeding for requested identities
    const usersToSeed = [
      { email: 'admin@bsng.com', username: 'superadmin', name: 'Super Admin', role: 'super_admin', uRole: UserRole.SUPER_ADMIN, phone: '1234567890', siteName: 'Kabeza' },
      { email: 'manager@bsng.com', username: 'manager', name: 'General Manager', role: 'manager', uRole: UserRole.MANAGER, phone: '1234567891', siteName: 'Rebero2' },
      { email: 'sitemanager@bsng.com', username: 'sitemanager', name: 'Site Manager', role: 'site_manager', uRole: UserRole.SITE_MANAGER, phone: '1234567892', siteName: 'Rebero' },
      { email: 'editor@bsng.com', username: 'editor', name: 'Content Editor', role: 'editor', uRole: UserRole.EDITOR, phone: '1234567893', siteName: 'Kabeza' },
      { email: 'auditor@bsng.com', username: 'auditor', name: 'System Auditor', role: 'auditor', uRole: UserRole.AUDITOR, phone: '1234567894', siteName: 'Rebero2' },
      { email: 'employee@bsng.com', username: 'employee', name: 'Staff Member', role: 'employee', uRole: UserRole.EMPLOYEE, phone: '1234567895', siteName: 'Rebero' },
      { email: 'client@bsng.com', username: 'client', name: 'Valued Client', role: 'client', uRole: UserRole.CLIENT, phone: '1234567896', siteName: 'Kabeza' },
      { email: 'contractor@bsng.com', username: 'contractor', name: 'External Contractor', role: 'contractor', uRole: UserRole.CONTRACTOR, phone: '1234567897', siteName: 'Rebero2' },
      { email: 'info.buildstronggenerations@gmail.com', username: 'dev_user', name: 'Innocent N', role: 'admin', uRole: UserRole.ADMIN, phone: '1234567898', siteName: 'Rebero' },
      { email: 'staff@bsng.com', username: 'staff_test', name: 'Staff Test', role: 'employee', uRole: UserRole.EMPLOYEE, phone: '1234567899', siteName: 'Kabeza' },
      { email: 'test@bsng.com', username: 'test_user', name: 'Test User', role: 'client', uRole: UserRole.CLIENT, phone: '1234567810', siteName: 'Rebero2' },
    ];

    for (const u of usersToSeed) {
      const existing = await this.usersService.findByEmail(u.email);
      const role = await this.rolesService.findRoleByName(u.role);
      const siteId = sites.find(s => s.name === u.siteName)?.id || sites[0]?.id;

      const userData: any = {
        email: u.email,
        username: u.username,
        fullName: u.name,
        userRole: u.uRole,
        siteId: siteId,
        isActive: true,
        passwordHash: hashedPassword,
        phone: u.phone
      };

      if (role) {
        userData.role = role;
      }

      if (existing) {
        // console.log(`Identity exists, skipping update to save time: ${u.email}`);
        continue;
      } else {
        await this.usersService.create(userData);
        console.log(`Seeded New Identity: ${u.email} (${u.name}) -> ${u.siteName}`);
      }
    }
  }

  /**
   * Scans all users and employees in the system.
   * If they are missing a site assignment, assigns them randomly to one of the available sites.
   */
  async autoMapUnassignedUsers() {
    const sitesRes = await this.sitesService.findAll(1, 100);
    const sites = sitesRes.data || [];
    if (sites.length === 0) return;

    // 1. Check all Users
    const usersRes = await this.usersService.findAll(1, 2000);
    for (const user of usersRes.data) {
      if (!user.siteId && !user.site) {
        const randomSite = sites[Math.floor(Math.random() * sites.length)];
        await this.usersService.update(user.id, { siteId: randomSite.id });
        console.log(`Auto-Assigned User [${user.email}] to Site [${randomSite.name}]`);
      }
    }

    // 2. Check all Employees
    const empsRes = await this.employeesService.findAll(1, 2000);
    for (const emp of empsRes.data) {
      if (!emp.siteId && !emp.site) {
        const randomSite = sites[Math.floor(Math.random() * sites.length)];
        await this.employeesService.update(emp.id, { siteId: randomSite.id });
        console.log(`Auto-Assigned Employee [${emp.name}] to Site [${randomSite.name}]`);
      }
    }
  }

  async seedServices() {
    const defaultServices = [
      { name: 'Residential Construction', title: 'Home Building', description: 'We build durable and beautiful residential homes tailored to your lifestyle.', icon: 'building', delay: '0.1s', isDark: true },
      { name: 'Commercial Construction', title: 'Office & Business', description: 'Expert solutions for commercial buildings, warehouses, and corporate offices.', icon: 'building', delay: '0.3s', isDark: false },
      { name: 'Project Management', title: 'Consultancy', description: 'Professional oversight and management of your construction projects from start to finish.', icon: 'hardhat', delay: '0.5s', isDark: true },
      { name: 'Interior Design', title: 'Aesthetics', description: 'Modern and functional interior design solutions for homes and offices.', icon: 'building', delay: '0.1s', isDark: false },
    ];

    const current = await this.servicesService.findAll();
    if (current && current.length > 0) return;

    for (const s of defaultServices) {
      await this.servicesService.create(s);
    }
    console.log(`Seeded ${defaultServices.length} default services.`);
  }

  async seedProperties() {
    const defaultProperties = [
      { title: 'Luxury Villa in Rebero', location: 'Rebero, Kigali', price: 150000000, description: 'Spacious 5-bedroom villa with panoramic views of Kigali city.', bedrooms: 5, bathrooms: 4, size: 450, isForSale: true },
      { title: 'Modern Office Space', location: 'Kigali Heights, Kimihurura', price: 2500000, description: 'Prime commercial location with glass facade and ample parking.', bedrooms: 0, bathrooms: 2, size: 200, isForRent: true, monthlyRent: 2500000 },
      { title: 'Family Home', location: 'Kabeza, Kanombe', price: 75000000, description: 'Cozy family home with a garden and secure neighborhood.', bedrooms: 3, bathrooms: 2, size: 150, isForSale: true },
    ];

    const current = await this.propertiesService.findAll();
    const data = Array.isArray(current) ? current : (current as any).data || [];
    if (data.length > 0) return;

    for (const p of defaultProperties) {
      await this.propertiesService.create(p);
    }
    console.log(`Seeded ${defaultProperties.length} default properties.`);
  }

  async seedUpdates() {
    const defaultUpdates = [
      { title: 'BSNG Milestone Anniversary', category: 'Company', content: 'We are celebrating 10 years of building strong foundations in Rwanda.', date: new Date().toISOString() },
      { title: 'New Safety Standards 2026', category: 'Events', content: 'Our team has completed advanced safety training for modern high-rise projects.', date: new Date().toISOString() },
      { title: 'Sustainable Building Initiative', category: 'Projects', content: 'Integrating green technologies in all our upcoming residential developments.', date: new Date().toISOString() },
    ];

    const current = await this.updatesService.findAll();
    const data = Array.isArray(current) ? current : (current as any).data || [];
    if (data.length > 0) return;

    for (const u of defaultUpdates) {
      await this.updatesService.create(u);
    }
    console.log(`Seeded ${defaultUpdates.length} default updates.`);
  }

  async seedEmployeesAuto() {
     const defaultStaff = [
        { name: 'Innocent Ntakirutimana', role: 'Managing Director', photo: '/img/team-1.jpg', description: 'Experienced leader in civil engineering.' },
        { name: 'M. Claudine', role: 'Senior Architect', photo: '/img/team-2.jpg', description: 'Award-winning architect with 15+ years experience.' },
     ];
     const current = await this.employeesService.findAll();
     const data = Array.isArray(current) ? current : (current as any).data || [];
     if (data.length > 0) return;
     for (const s of defaultStaff) {
         await this.employeesService.create(s);
     }
  }

  async seedData() { }
  async seedSettings() { }
}
