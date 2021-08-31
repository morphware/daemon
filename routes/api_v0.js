'use strict';

const router = require('express').Router();

router.use('/contract', require('./contract'));
router.use('/network', require('./network'));
router.use('/torrent', require('./torrent'));

module.exports = router;
