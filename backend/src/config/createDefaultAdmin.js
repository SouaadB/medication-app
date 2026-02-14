const db = require('./database');
const bcrypt = require('bcryptjs');

async function createDefaultAdmin() {
    try {
        console.log('🔍 Checking if default admin exists...');

        const adminData = {
            name: 'Administrateur Principal',
            email: 'admin@medapp.com',
            password: 'Admin@2026!',
            phone: '0555555555'
        };

        // Check if admin already exists
        const [existingAdmin] = await db.execute(
            'SELECT u.id FROM users u JOIN admins a ON u.id = a.id WHERE u.email = ?',
            [adminData.email]
        );

        if (existingAdmin.length > 0) {
            console.log('✅ Default admin already exists!');
            console.log('📧 Email:', adminData.email);
            console.log('🔑 Password:', adminData.password);
            return { success: true, message: 'Admin already exists', admin: adminData };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Insert into users table (no transaction needed for simple insert)
        const [userResult] = await db.execute(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [adminData.name, adminData.email, hashedPassword, adminData.phone, 'admin']
        );

        const adminId = userResult.insertId;

        // Insert into admins table
        await db.execute(
            'INSERT INTO admins (id) VALUES (?)',
            [adminId]
        );

        console.log('✅ Default admin created successfully!');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Password:', adminData.password);
        console.log('👤 Name:', adminData.name);
        console.log('⚠️  IMPORTANT: Save these credentials!');
        
        return { success: true, message: 'Admin created successfully', admin: adminData };

    } catch (error) {
        console.error('❌ Error creating default admin:', error.message);
        return { success: false, message: error.message };
    }
}

module.exports = createDefaultAdmin;