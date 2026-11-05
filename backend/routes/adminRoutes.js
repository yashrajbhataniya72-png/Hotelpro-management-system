import express from 'express';
import {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Staff & Admin routes
router.get('/stats', protect, authorize('staff', 'admin'), getDashboardStats);
router.get('/bookings', protect, authorize('staff', 'admin'), getAllBookings);
router.put('/bookings/:id/status', protect, authorize('staff', 'admin'), updateBookingStatus);

// Admin exclusive routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);

export default router;
