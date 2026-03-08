const whatsappService = require("../services/whatsapp.service");
const queueService = require("../services/queue.service");
const { successResponse } = require("../utils/response.helper");

class StatusController {
  getStatus(req, res) {
    const isConnected = whatsappService.getStatus();

    return successResponse(res, 200, "Status fetched!", {
      whatsapp: {
        connected: isConnected,
        message: isConnected
          ? "WhatsApp is connected!"
          : "WhatsApp is not connected!",
      },
      queue: {
        pending: queueService.getQueueSize(),
      },
      server: {
        uptime: Math.floor(process.uptime()) + " seconds",
        environment: process.env.NODE_ENV,
      },
    });
  }
}

module.exports = new StatusController();
