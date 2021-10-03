'use strict';

var instnace;

import ('webtorrent-hybrid').then(mod=>{
	console.log('here')
	instnace = new mod.default();

	instnace.findOrSeed = function(path){
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
	}.bind(instnace);


	instnace.downloadAll = function(path, ...links){
		
		console.log('here in downloadAll', path, links);
		let count = 0;

		return new Promise((resolve, reject)=>{
			for(let link of links){
				console.log('adding', link);
				this.add(link, {path}, (torrent)=>{
					console.log('torrent added');

					torrent.on('ready', function () {console.log('torrent ready')})
					torrent.on('warning', function (err) {console.log('torrent error', error)})
					torrent.on('download', function (bytes) {console.log('torrent is downloading', bytes)})

					torrent.on('done', ()=>{
						console.log('done!!!')
						if(count++ === links.length) resolve();
					});
					torrent.on('error', reject)
				});
			}
		});
	}.bind(instnace);
});



module.exports = function(){return instnace};
