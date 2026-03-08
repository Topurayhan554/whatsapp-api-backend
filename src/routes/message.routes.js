const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { validateMessage } = require("../middlewares/validator");
const rateLimiter = require("../middlewares/rateLimiter");

// POST /api/message/send
router.post("/send", rateLimiter, validateMessage, (req, res, next) => {
  messageController.sendMessage(req, res, next);
});

module.exports = router;
