const mongoose = require("mongoose");
const Order = require("../models/Order");
const Book = require("../models/Book");
const asyncHandler = require("../middleware/asyncHandler");

// helper: build items with current book prices
async function buildOrderItems(items) {
  const built = [];

  for (const it of items) {
    if (!mongoose.isValidObjectId(it.bookId)) {
      const err = new Error("Invalid bookId in items");
      err.statusCode = 400;
      throw err;
    }

    const book = await Book.findById(it.bookId);
    if (!book) {
      const err = new Error("Book not found for one of the items");
      err.statusCode = 404;
      throw err;
    }

    built.push({
      book: book._id,
      quantity: it.quantity,
      unitPrice: book.price
    });
  }

  return built;
}

function calcTotal(itemsBuilt) {
  return itemsBuilt.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
}

// POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { customerName, customerEmail, items } = req.body;

  const itemsBuilt = await buildOrderItems(items);
  const totalAmount = calcTotal(itemsBuilt);

  const order = await Order.create({
    customerName,
    customerEmail,
    items: itemsBuilt,
    totalAmount
  });

  res.status(201).json(order);
});

// GET /api/orders
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("items.book", "title author price category")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// GET /api/orders/:id
exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid order id");
  }

  const order = await Order.findById(id).populate("items.book", "title author price category");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

// PUT /api/orders/:id (status update)
exports.updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid order id");
  }

  const updated = await Order.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .populate("items.book", "title author price category");

  if (!updated) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(updated);
});

// DELETE /api/orders/:id
exports.deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid order id");
  }

  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ message: "Order deleted" });
});
