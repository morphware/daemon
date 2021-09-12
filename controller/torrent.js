'use strict';
const WebTorrent = require('webtorrent-hybrid');

const webtorrent = new WebTorrent();

webtorrent.findOrSeed = function(path){
	return new Promise((resolve, reject)=>{
		this.seed(path, function(torrent){
			resolve(torrent); // magnetURI
		}).on('error', error=>{
			let infoHash = error.message.replace('Cannot add duplicate torrent ', '');
			if(error.message.startsWith('Cannot add duplicate torrent ')){
				return resolve(this.get(infoHash));
			}
			console.error('torrent findOrSeed error', error);
			reject(error);
		})
	});
}.bind(webtorrent);


module.exports = webtorrent;

