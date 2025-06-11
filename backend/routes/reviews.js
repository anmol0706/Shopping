import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Reviews route - under construction',
    reviews: []
  });
});

export default router;
