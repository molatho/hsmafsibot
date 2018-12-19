const fs = require("fs");
const path = require('path');
const async = require("async");
const crypto = require("crypto");
var uidNumber = require("uid-number");

class Files {
    constructor(config) {
        this.config = config;
        this.folders = [];
    }

    browseFolder(folder){
        var i = 0;
        var list = [this.config.rootDirectory];
        do {
            var ents = fs.readdirSync(list[i], {withFileTypes: true});
            for (var e = 0; e < ents.length; e++){
                var fullPath=path.join(list[i], ents[e]);
                if (fs.statSync(fullPath).isDirectory()) {
                    list.push(fullPath);
                    this.folders.push(fullPath.replace(this.config.rootDirectory, "").substring(1));
                }
            }
            i++; 
        } while(i < list.length);
        this.folders = this.folders.sort();
    }

    browseRoot(){
        this.browseFolder(this.config.rootDirectory);
    }

    getFolders(pattern) {
        return this.folders.filter(f => f.toLowerCase().indexOf(pattern.toLowerCase()) !== -1);
    }

    getRandomName(length) {
        return crypto.randomBytes(length / 2).toString('hex');
    }

    createRandomDirectory(callback) {
        var randomDirectory = this.getRandomName(32);
        var fullPath = path.join(this.config.webRootDirectory, randomDirectory);
        fs.mkdirSync(fullPath, { recursive: false, mode: 0o644});
        uidNumber("www-data", function (er, uid, gid) {
            console.log(`UID: ${uid}, GID: ${GID}`);
            callback(er, randomDirectory);
            // gid is null because we didn't ask for a group name
            // uid === 24561 because that's my number.
          })
        fs.chownSync(fullPath,)
    }
}

module.exports = Files;