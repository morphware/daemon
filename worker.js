
// TODO Listen for job-posting events emitted by the smart contract






// Download ///////////////////////////////////////////////////////////////////

// TODO Replace `magnet: ...` with a magnet link to the file to be downloaded
var magnetURI = 'magnet: ...'

// TODO Create a directory with the user's wallet address, or the job's GUID,
//      if one doesn't already exist
client.add(magnetURI, { path: '/path/to/folder' }, function (torrent) {
  torrent.on('done', function () {
    console.log('torrent download finished')
  })
})