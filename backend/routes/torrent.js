'use strict';

const router = require('express').Router();
const webtorrent = require('../controller/torrent');

console.log(webtorrent)

router.get('/', async function(req, res, next){
	try{

		console.log('torrent', webtorrent())

		let torrents = [];
		for(let torrent of webtorrent().torrents){
			torrents.push({
				name: torrent.info.name.toString(),
				progress: torrent.progress,
				downloadSpeed: torrent.downloadSpeed,
				uploadedSpeed: torrent.uploadedSpeed,
				numPeers: torrent.numPeers,
				timeRemaining: torrent.timeRemaining,
				magnetURI: torrent.magnetURI,
			});
		}

		res.json({
			download: webtorrent().downloadSpeed,
			upload: webtorrent().uploadSpeed,
			port: webtorrent().torrentPort,
			torrents: torrents,
		});

	}catch(error){
		next(error);
	}
});

module.exports = router;
