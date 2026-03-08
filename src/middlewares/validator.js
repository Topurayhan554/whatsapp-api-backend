const Joi = require("joi");

const messageSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10-15 digits only",
      "any.required": "Phone number is required",
    }),

  message: Joi.string().min(1).max(1000).required().messages({
    "string.min": "Message cannot be empty",
    "string.max": "Message cannot exceed 1000 characters",
    "any.required": "Message is required",
  }),
});

const validateMessage = (req, res, next) => {
  const { error } = messageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = { validateMessage };
