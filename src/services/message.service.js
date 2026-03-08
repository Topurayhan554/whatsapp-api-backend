const whatsappService = require("./whatsapp.service");
const logger = require("../config/logger");

class MessageService {
  async sendMessage(phone, message) {
    // WhatsApp connected
    if (!whatsappService.getStatus()) {
      throw Object.assign(new Error("WhatsApp is not connected!"), {
        statusCode: 503,
      });
    }

    // Phone number format
    const formattedNumber = this.formatPhoneNumber(phone);
    const client = whatsappService.getClient();

    try {
      const isRegistered = await client.isRegisteredUser(formattedNumber);
      if (!isRegistered) {
        throw Object.assign(
          new Error("This phone number is not registered on WhatsApp!"),
          { statusCode: 404 },
        );
      }
      const response = await client.sendMessage(formattedNumber, message);
      logger.info(`Message sent to ${phone}`);

      return {
        messageId: response.id._serialized,
        phone: phone,
        message: message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Failed to send message to ${phone}: ${error.message}`);
      throw error;
    }
  }

  // Phone number WhatsApp format
  formatPhoneNumber(phone) {

    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = "88" + cleaned;
    }

    return cleaned + "@c.us";
  }
}

module.exports = new MessageService();
