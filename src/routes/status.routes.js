const express = require("express");
const router = express.Router();
const statusController = require("../controllers/status.controller");

// GET /api/status
router.get("/", (req, res) => {
  statusController.getStatus(req, res);
});

module.exports = router;
