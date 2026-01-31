const express = require('express');
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

const { validateBody } = require('../middleware/validateMiddleware');
const { createBookSchema, updateBookSchema } = require('../middleware/bookValidation');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public (no auth): Read routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Admin-only (RBAC): Write routes
router.post('/', requireAuth, requireRole('admin'), validateBody(createBookSchema), createBook);
router.put('/:id', requireAuth, requireRole('admin'), validateBody(updateBookSchema), updateBook);
router.delete('/:id', requireAuth, requireRole('admin'), deleteBook);

module.exports = router;
