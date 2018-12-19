const fs = require("fs");
const CONFIG_FILE = "config.json";

var _instance = null;

class Config {
    constructor(cfg) {
        this._cfg = cfg;
    }
    static exists() {
        return fs.existsSync(CONFIG_FILE);
    }
    static create() {
        if (Config.exists()) return;
        fs.writeFileSync(CONFIG_FILE,
            JSON.stringify({
                botToken: "Your Token",
                rootDirectory: "/root/directory",
                webRootDirectory: "/www/data/webroot",
                webUid: 33,
                webGid: 33
            }),
            'utf8'
        );
    }
    static getInstance() {
        if (_instance !== null) return _instance;
        if (!Config.exists()) Config.create();

        var obj = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        _instance = new Config(obj);
        return _instance;
    }

    get botToken() {
        return this._cfg.botToken;
    }
    get rootDirectory() {
        return this._cfg.rootDirectory;
    }
    get webRootDirectory() {
        return this._cfg.webRootDirectory;
    }
    get webUid() {
        return this._cfg.webUid;
    }
    get webGid() {
        return this._cfg.webGid;
    }

    toString(){
        return  `[Token: \"${this._cfg.botToken}\", ` + 
                `RootDirectory: \"${this._cfg.rootDirectory}]\", ` +
                `WebRootDirectory: \"${this._cfg.webRootDirectory}\", ` +
                `WebUid: \"${this._cfg.webUid}\", ` +
                `WebGid: \"${this._cfg.webGid}\"]`;
    }
}

module.exports = Config;