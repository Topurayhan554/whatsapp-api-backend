const queueService = require("../services/queue.service");
const { successResponse, errorResponse } = require("../utils/response.helper");
const logger = require("../config/logger");

class MessageController {
  async sendMessage(req, res, next) {
    try {
      const { phone, message } = req.body;
      logger.info(`New message request for: ${phone}`);

      // Queue
      const result = await queueService.addToQueue(phone, message);

      return successResponse(res, 200, "Message sent successfully!", {
        messageId: result.messageId,
        phone: result.phone,
        timestamp: result.timestamp,
        queueSize: queueService.getQueueSize(),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
