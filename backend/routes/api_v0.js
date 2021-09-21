'use strict';

const router = require('express').Router();

router.use('/contract', require('./contract'));
router.use('/network', require('./network'));
router.use('/torrent', require('./torrent'));
router.use('/wallet', require('./wallet'));
router.use('/job', require('./job'));
router.use('/settings', require('./settings'));

module.exports = router;
