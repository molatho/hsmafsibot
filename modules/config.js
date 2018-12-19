const fs = require("fs");
const CONFIG_FILE = "config.json";

var _instance = null;

class Config {
    constructor(botToken, rootDirectory, webRootDirectory) {
        this.botToken = botToken;
        this.rootDirectory = rootDirectory;
        this.webRootDirectory = webRootDirectory;
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
                webRootDirectory: "/www/data/webroot"
            }),
            'utf8'
        );
    }
    static getInstance() {
        if (_instance !== null) return _instance;
        if (!Config.exists()) Config.create();

        var obj = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        _instance = new Config(obj.botToken, obj.rootDirectory, obj.webRootDirectory);
        return _instance;
    }
    toString(){
        return `[Token: \"${this.botToken}\", RootDirectory: \"${this.rootDirectory}]\", WebRootDirectory: \"${this.webRootDirectory}]`;
    }
}

module.exports = Config;