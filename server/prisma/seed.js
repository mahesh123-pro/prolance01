import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Create Admin
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@eventflow.com' },
        update: {},
        create: {
            email: 'admin@eventflow.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log({ admin });

    // Create Sample Events
    const event1 = await prisma.event.create({
        data: {
            title: 'React Advanced Workshop',
            description: 'Deep dive into React Server Components, Suspense, and advanced patterns.',
            startDate: new Date('2026-03-15T10:00:00'),
            endDate: new Date('2026-03-15T16:00:00'),
            location: 'Online via Zoom',
            type: 'Workshop', // Note: Model doesn't support 'type' field properly yet? Wait, let me check schema.
            maxSeats: 50,
            deadline: new Date('2026-03-14T23:59:59'),
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
        },
    });

    const event2 = await prisma.event.create({
        data: {
            title: 'Tech Startup Summit',
            description: 'Join the biggest startup event of the year.',
            startDate: new Date('2026-04-20T09:00:00'),
            endDate: new Date('2026-04-22T17:00:00'),
            location: 'Convention Center, NYC',
            maxSeats: 200,
            deadline: new Date('2026-04-10T23:59:59'),
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
        },
    });

    console.log({ event1, event2 });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
