'use strict';

const router = require('express').Router();
const webtorrent = require('../controller/torrent');

router.get('/', async function(req, res, next){
	res.json({
		download: webtorrent.downloadSpeed,
		upload: webtorrent.uploadSpeed,
		torrents: webtorrent.torrents
	})
});

module.exports = router;
