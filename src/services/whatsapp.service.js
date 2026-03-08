const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const config = require("../config");
const logger = require("../config/logger");

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.socketIO = null;
  }

  // Socket.IO
  setSocket(io) {
    this.socketIO = io;
  }

  initialize() {
    logger.info("WhatsApp client initializing...");

    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: config.whatsapp.sessionPath,
      }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      },
    });

    // QR
    this.client.on("qr", async (qr) => {
      logger.info("QR Code generated, scan it!");
      try {
        // QR image convert
        const qrImage = await qrcode.toDataURL(qr);
        // Frontend
        if (this.socketIO) {
          this.socketIO.emit("qr", qrImage);
          this.socketIO.emit("status", {
            connected: false,
            message: "Scan QR Code",
          });
        }
      } catch (error) {
        logger.error("QR generation failed: " + error.message);
      }
    });

    // WhatsApp ready
    this.client.on("ready", () => {
      this.isReady = true;
      logger.info("WhatsApp connected successfully!");
      if (this.socketIO) {
        this.socketIO.emit("status", {
          connected: true,
          message: "WhatsApp Connected!",
        });
      }
    });

    // Authentication
    this.client.on("authenticated", () => {
      logger.info("WhatsApp authenticated, session saved!");
    });

    // Disconnected
    this.client.on("disconnected", (reason) => {
      this.isReady = false;
      logger.warn("WhatsApp disconnected: " + reason);
      if (this.socketIO) {
        this.socketIO.emit("status", {
          connected: false,
          message: "WhatsApp Disconnected!",
        });
      }
      logger.info("Trying to reconnect...");
      setTimeout(() => this.initialize(), 5000);
    });
    this.client.initialize();
  }

  // Client
  getClient() {
    return this.client;
  }

  getStatus() {
    return this.isReady;
  }
}

module.exports = new WhatsAppService();
