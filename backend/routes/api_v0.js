"use strict";

const router = require("express").Router();

router.use("/contract", require("./job")); // This will go away soon
router.use("/job", require("./job"));
router.use("/network", require("./network"));
router.use("/torrent", require("./torrent"));
router.use("/wallet", require("./wallet"));
router.use("/settings", require("./settings"));
router.use("/notebook", require("./notebook"));
// router.use('/miner', require('./miner'));
router.use("/miner", require("./miner"));

module.exports = router;
