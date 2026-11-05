import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, authorize('staff', 'admin'), createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('staff', 'admin'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

export default router;
