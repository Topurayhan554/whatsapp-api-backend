const express = require("express");
const router = express.Router();
const messageRoutes = require("./message.routes");
const statusRoutes = require("./status.routes");

router.use("/message", messageRoutes);
router.use("/status", statusRoutes);

module.exports = router;
