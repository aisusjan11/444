const mongoose = require("mongoose");
const Book = require("../models/Book");
const asyncHandler = require("../middleware/asyncHandler");

// POST /api/books
exports.createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
});

// GET /api/books
exports.getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
});

// GET /api/books/:id
exports.getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid book id");
  }

  const book = await Book.findById(id);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.json(book);
});

// PUT /api/books/:id
exports.updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid book id");
  }

  const updated = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!updated) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.json(updated);
});

// DELETE /api/books/:id
exports.deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid book id");
  }

  const deleted = await Book.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.json({ message: "Book deleted" });
});
