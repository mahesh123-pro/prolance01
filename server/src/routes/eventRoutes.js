import express from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, getAllEvents, approveEvent } from '../controllers/eventController.js';
import auth, { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/admin/all', auth, isAdmin, getAllEvents); // Must be before /:id
router.get('/:id', getEvent);
router.post('/:id/register', registerForEvent);

// Protected Routes
router.post('/', auth, createEvent);
router.patch('/:id/approve', auth, isAdmin, approveEvent);
router.patch('/:id', auth, isAdmin, updateEvent);
router.delete('/:id', auth, isAdmin, deleteEvent);

export default router;
