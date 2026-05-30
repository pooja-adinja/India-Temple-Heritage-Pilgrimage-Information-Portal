const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const existing = await User.findOne({ email: 'admin@example.com' });
        if (existing) {
            console.log('⚠️  Admin user already exists. Deleting and recreating...');
            await User.deleteOne({ email: 'admin@example.com' });
        }

        const admin = await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123456',
            role: 'admin'
        });

        console.log('✅ Admin user created!');
        console.log('   Email   : admin@example.com');
        console.log('   Password: admin123456');
        console.log('   Role    :', admin.role);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

createAdmin();