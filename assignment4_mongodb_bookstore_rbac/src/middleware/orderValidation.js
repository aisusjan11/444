const Joi = require("joi");

const createOrderSchema = Joi.object({
  customerName: Joi.string().trim().min(1).required(),
  customerEmail: Joi.string().trim().email().required(),
  items: Joi.array()
    .items(
      Joi.object({
        bookId: Joi.string().trim().required(),
        quantity: Joi.number().integer().min(1).required()
      })
    )
    .min(1)
    .required()
});

const updateOrderSchema = Joi.object({
  status: Joi.string().valid("pending", "paid", "shipped", "cancelled").optional()
}).min(1);

module.exports = { createOrderSchema, updateOrderSchema };
