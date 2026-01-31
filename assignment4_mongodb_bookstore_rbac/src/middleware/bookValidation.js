const Joi = require("joi");

const createBookSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  author: Joi.string().trim().min(1).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().trim().min(1).required(),
  inStock: Joi.boolean().optional(),

  isbn: Joi.string().trim().optional(),
  pages: Joi.number().integer().min(1).optional(),
  description: Joi.string().trim().optional(),
  coverUrl: Joi.string().trim().uri().optional()
});

const updateBookSchema = Joi.object({
  title: Joi.string().trim().min(1).optional(),
  author: Joi.string().trim().min(1).optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().trim().min(1).optional(),
  inStock: Joi.boolean().optional(),

  isbn: Joi.string().trim().optional(),
  pages: Joi.number().integer().min(1).optional(),
  description: Joi.string().trim().optional(),
  coverUrl: Joi.string().trim().uri().optional()
}).min(1);

module.exports = { createBookSchema, updateBookSchema };
