const fs = require('fs')

function writeFile(path, data, callback){
    fs.writeFile(path, data, callback)
}

module.exports = writeFile;