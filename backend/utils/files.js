'use strict';

const fileExtensionExtractor = (filename) => {
    console.log('fileExtensionExtractor ', filename.split('.').pop())
    return filename.split('.').pop()
}

const filenameExtractor = (filename) => {
    console.log('filenameExtractor ', filename.split('.').shift())
    return filename.split('.').shift()
}

module.exports = { fileExtensionExtractor, filenameExtractor };