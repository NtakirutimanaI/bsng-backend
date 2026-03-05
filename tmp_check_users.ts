import { DataSource } from 'typeorm';
import { User } from './src/modules/users/entities/user.entity';
import { Role } from './src/modules/rbac/entities/role.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

console.log('Connecting to postgres database', process.env.DB_NAME);

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123Rw@nd@',
    database: process.env.DB_NAME || 'bsngltd',
    entities: [User, Role],
    synchronize: false,
});

async function checkUsers() {
    await AppDataSource.initialize();
    console.log('--- DATABASE CONNECTED ---');

    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({ relations: ['role'] });

    console.log('--- USERS IN DATABASE ---');
    users.forEach(u => {
        console.log(`${u.email} | ${u.username} | Role: ${u.role?.name || u.userRole} | isActive: ${u.isActive}`);
    });

    const sitemanager = users.find(u => u.email === 'sitemanager@bsng.com');
    if (sitemanager) {
        console.log(`Found sitemanager:`, sitemanager);
        const match = await bcrypt.compare('123456', sitemanager.passwordHash);
        console.log(`Password match for "123456": ${match}`);
        const match2 = await bcrypt.compare('password123!', sitemanager.passwordHash);
        console.log(`Password match for "password123!": ${match2}`);

        // Update password manually
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash('123456', salt);
        await userRepository.update({ email: 'sitemanager@bsng.com' }, { passwordHash, isActive: true });
        console.log('Updated sitemanager password to 123456');

    } else {
        console.log('Sitemanager NOT found by email!');
    }

    await AppDataSource.destroy();
}

checkUsers().catch(console.error);
