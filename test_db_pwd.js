const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function check() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'bsngltd',
        password: '123Rw@nd@',
        port: 5432,
    });

    await client.connect();
    const res = await client.query("SELECT * FROM users WHERE email = 'sitemanager@bsng.com'");
    if (res.rows.length === 0) {
        console.log("User not found!");
    } else {
        const user = res.rows[0];
        console.log("Found user:", user.email, "isActive:", user.is_active);
        console.log("Password hash:", user.password_hash);
        const isMatch = await bcrypt.compare('123456', user.password_hash);
        console.log("Does 123456 match hash in db?", isMatch);
    }
    await client.end();
}

check().catch(console.error);
