const express = require("express");
const router = express.Router();
const inboundController = require("../Controllers/inboundController");


router.post("/inbound", inboundController.inboundReceiver);

module.exports = router;

