const os = require('os');
const fs = require("fs");
const path = require('path');
const ncp = require('ncp').ncp;
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
        return crypto.randomBytes(length / 2).toString('hex').toUpperCase();
    }

    createRandomDirectory(callback) {
        var randomDirectory = this.getRandomName(32);
        var fullPath = path.join(this.config.webRootDirectory, randomDirectory);
        fs.mkdirSync(fullPath, { recursive: false, mode: 0o644});
        if (os.platform() === 'win32') {
            callback(null, randomDirectory);
        } else {
            uidNumber("www-data", function (err, uid, gid) {
                if (err) return callback(err);
                fs.chownSync(fullPath, uid, gid);
                callback(null, randomDirectory);
            });
        }
    }

    copyFiles(from, to, callback) {
        var fullSourcePath = path.join(this.config.rootDirectory, from);
        var fullDestinationPath = path.join(this.config.webRootDirectory, to);
        ncp.limit = 16;
        ncp(fullSourcePath, fullDestinationPath, { clobber: false, stopOnerr: true}, callback);
    }
}

module.exports = Files;