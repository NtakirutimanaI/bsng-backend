import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

async function createSiteManager() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'bsngltd',
        password: '123Rw@nd@',
        port: 5432,
    });
    await client.connect();

    const email = 'sitemanager@bsng.com';
    const username = 'sitemanager';
    const fullName = 'Site Manager';
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('123456', salt);

    // Check if user exists
    const res = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (res.rowCount > 0) {
        console.log('User already exists, updating password');
        await client.query('UPDATE users SET password_hash = $1, is_active = true WHERE email = $2', [passwordHash, email]);
    } else {
        console.log('Inserting new site manager');
        await client.query(
            `INSERT INTO users (username, email, full_name, password_hash, user_role, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [username, email, fullName, passwordHash, 'site_manager', true]
        );
    }
    await client.end();
    console.log('Done');
}

createSiteManager().catch(console.error);
