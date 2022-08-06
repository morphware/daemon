"use strict";

const router = require("express").Router();
const { JobWorker } = require("../model/jobWorker");

router.post("/start", async function (req, res, next) {
  try {
    await JobWorker.startMining();
    return res.json({ status: "success" });
  } catch (error) {
    next(error);
  }
});

router.post("/stop", async function (req, res, next) {
  try {
    await JobWorker.stopMining();
    return res.json({ status: "success" });
  } catch (error) {
    next(error);
  }
});

router.get("/stats", async function (req, res, next) {
  try {
    const stats = await JobWorker.getMiningStats();
    return res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get("/isMining", async function (req, res, next) {
  try {
    const isMining = JobWorker.isMining();
    return res.json({ isMining: isMining });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
