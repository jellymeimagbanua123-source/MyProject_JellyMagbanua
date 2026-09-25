require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql  = require('mysql2/promise');

async function fix() {
    const conn = await mysql.createConnection({
        host:     'localhost',
        user:     'root',
        password: '',
        database: 'flower_shop_db'
    });

    const hash = await bcrypt.hash('admin123', 10);
    const [result] = await conn.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hash, 'admin@flowershop.com']
    );

    console.log('Rows updated:', result.affectedRows);
    console.log('Password verify:', await bcrypt.compare('admin123', hash));
    await conn.end();
    console.log('Done! Login with admin@flowershop.com / admin123');
}

fix().catch(e => {
    console.error('Full error:', e.message);
    console.error('Code:', e.code);
});
