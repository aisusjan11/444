const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const { validateBody } = require('../middleware/validateMiddleware');
const { createOrderSchema, updateOrderSchema } = require('../middleware/orderValidation');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public (no auth): Read routes
router.get('/', getOrders);
router.get('/:id', getOrderById);

// Admin-only (RBAC): Write routes
router.post('/', requireAuth, requireRole('admin'), validateBody(createOrderSchema), createOrder);
router.put('/:id', requireAuth, requireRole('admin'), validateBody(updateOrderSchema), updateOrder);
router.delete('/:id', requireAuth, requireRole('admin'), deleteOrder);

module.exports = router;
