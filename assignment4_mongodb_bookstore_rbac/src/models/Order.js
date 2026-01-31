const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 } // snapshot of book price
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    items: { type: [orderItemSchema], required: true, validate: v => Array.isArray(v) && v.length > 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
