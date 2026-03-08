const whatsappService = require("../services/whatsapp.service");
const logger = require("../config/logger");

const initializeSocket = (io) => {
  // Socket.IO WhatsApp service
  whatsappService.setSocket(io);

  io.on("connection", (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    // Frontend connect current status
    socket.emit("status", {
      connected: whatsappService.getStatus(),
      message: whatsappService.getStatus()
        ? "WhatsApp is connected!"
        : "Waiting for QR scan...",
    });

    // Client disconnect
    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  logger.info("Socket.IO initialized!");
};

module.exports = initializeSocket;
