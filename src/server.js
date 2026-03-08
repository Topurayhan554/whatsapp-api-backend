const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const config = require("./config");
const logger = require("./config/logger");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const initializeSocket = require("./socket/socket.handler");
const whatsappService = require("./services/whatsapp.service");

// Express app
const app = express();

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//  Middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Routes

app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found!`,
  });
});

//  Error Handler

app.use(errorHandler);

//  Socket Initialize

initializeSocket(io);

whatsappService.initialize();

//  Server Start
server.listen(config.server.port, () => {
  logger.info(`Server running on port ${config.server.port}`);
  logger.info(`Environment: ${config.server.nodeEnv}`);
  logger.info(`API: http://localhost:${config.server.port}/api`);
});

// Unexpected error
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection: " + err.message);
  server.close(() => process.exit(1));
});
