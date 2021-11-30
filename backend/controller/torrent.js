'use strict';

const {conf} = require("../conf");
var instance;

import ('webtorrent-hybrid').then(mod=>{
	/*
	This is a hack I(@wmantly) created to get around `webtorrent-hybrid` forcing
	the use of the import statement.

	To use this file, require it like so

	`const webtorrent = require('../controller/torrent');`

	and call `webtorrent` when you want to use it

	`webtorrent().torrents`

	`webtorrent()` will return the webtorrent instance.

	*/

	if(conf.torrentListenPort){
		instance = new mod.default({torrentPort: conf.torrentListenPort});	
	} else{
		instance = new mod.default();	
	}


	instance.findOrSeed = function(path){
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
	}.bind(instance);


	instance.downloadAll = function(path, ...links){
		let out = [];

		return new Promise((resolve, reject)=>{
			for(let link of links){
				this.add(link, {path}, (torrent)=>{
					console.log('torrent added');

					torrent.on('ready', function () {console.log('torrent ready')})
					torrent.on('warning', function (error) {console.log('torrent error', error)})
					torrent.on('download', function (bytes) {console.log('torrent is downloading', bytes)})

					torrent.on('done', ()=>{
						console.log('done!!!')
						out.push(torrent);
						if(out.length === links.length) resolve(out);
					});
					torrent.on('error', reject)
				});
			}
		});
	}.bind(instance);
});

module.exports = function(){return instance};
