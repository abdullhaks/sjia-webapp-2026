import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRole } from '../database/schemas/user.schema';
import * as bcrypt from 'bcrypt';

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userModel = app.get(getModelToken(User.name));

    try {
        // Check if super admin already exists
        const existingAdmin = await userModel.findOne({ email: 'admin@sjia.edu' });

        if (existingAdmin) {
            console.log('✅ Super admin found.');

            // Check if role update is needed
            if (existingAdmin.role !== UserRole.SUPERADMIN) {
                console.log(`🔄 Migrating role from '${existingAdmin.role}' to '${UserRole.SUPERADMIN}'...`);
                existingAdmin.role = UserRole.SUPERADMIN;
                await existingAdmin.save();
                console.log('✅ Role updated successfully.');
            } else {
                console.log('✅ Role is already correct.');
            }

            console.log(`Email: ${existingAdmin.email}`);
            await app.close();
            return;
        }

        // Create super admin
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const superAdmin = await userModel.create({
            email: 'admin@sjia.edu',
            password: hashedPassword,
            role: UserRole.SUPERADMIN,
            firstName: 'Super',
            lastName: 'Admin',
            isActive: true,
        });

        console.log('✅ Super admin created successfully!');
        console.log('📧 Email: admin@sjia.edu');
        console.log('🔑 Password: Admin@123');
        console.log(`👤 Name: ${superAdmin.firstName} ${superAdmin.lastName}`);
        console.log('\n⚠️  Please change the password after first login!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await app.close();
    }
}

seed();
