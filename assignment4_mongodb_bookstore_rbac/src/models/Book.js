const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    inStock: { type: Boolean, default: true },

    // Optional fields (to make the object more "complex")
    isbn: { type: String, trim: true },
    pages: { type: Number, min: 1 },
    description: { type: String, trim: true },
    coverUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
