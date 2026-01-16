import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { startDate: 'asc' },
            where: { deletedAt: null, status: 'APPROVED' },
            include: { _count: { select: { registrations: true } } }
        });
        const formattedEvents = events.map(event => ({
            ...event,
            registrationsCount: event._count.registrations
        }));
        res.json(formattedEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await prisma.event.findUnique({
            where: { id },
            include: { _count: { select: { registrations: true } } }
        });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json({ ...event, registrationsCount: event._count.registrations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            where: { deletedAt: null },
            include: { _count: { select: { registrations: true } } }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createEvent = async (req, res) => {
    try {
        // Force status to PENDING
        const eventData = { ...req.body, status: 'PENDING' };
        const event = await prisma.event.create({ data: eventData });
        res.status(201).json(event);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const approveEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await prisma.event.update({
            where: { id },
            data: { status: 'APPROVED' }
        });
        res.json(event);
    } catch (error) {
        res.status(404).json({ message: "Event not found" });
    }
}

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await prisma.event.update({ where: { id }, data: req.body });
        res.json(event);
    } catch (error) {
        res.status(404).json({ message: "Event not found" });
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.event.update({ where: { id }, data: { deletedAt: new Date() } }); // Soft delete
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Event not found" });
    }
}

export const registerForEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, company } = req.body;

        // Check if event exists and seats available
        const event = await prisma.event.findUnique({
            where: { id },
            include: { _count: { select: { registrations: true } } }
        });

        if (!event) return res.status(404).json({ message: "Event not found" });
        if (event._count.registrations >= event.maxSeats) return res.status(400).json({ message: "Event is full" });

        const registration = await prisma.registration.create({
            data: {
                eventId: id,
                name,
                email,
                phone,
                company
            }
        });
        res.status(201).json(registration);
    } catch (error) {
        res.status(409).json({ message: error.message }); // Likely unique constraint violation
    }
}
