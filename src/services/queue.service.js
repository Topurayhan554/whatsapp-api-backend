const logger = require("../config/logger");
const messageService = require("./message.service");

class QueueService {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  async addToQueue(phone, message) {
    return new Promise((resolve, reject) => {
      this.queue.push({ phone, message, resolve, reject });
      logger.info(`Message added to queue. Queue size: ${this.queue.length}`);

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { phone, message, resolve, reject } = this.queue.shift();

      try {
        logger.info(`Processing message for ${phone}`);
        const result = await messageService.sendMessage(phone, message);
        resolve(result);
      } catch (error) {
        reject(error);
      }
      if (this.queue.length > 0) {
        await this.delay(1000);
      }
    }

    this.isProcessing = false;
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getQueueSize() {
    return this.queue.length;
  }
}

module.exports = new QueueService();
