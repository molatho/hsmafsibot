const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const Config = require('./modules/config').getInstance();
const Files = require('./modules/files');

var files = new Files(Config);
files.browseRoot();

console.log(Config.toString());

const bot = new TelegramBot(Config.botToken, { polling: true });

bot.on('inline_query', (msg) => {
    const chatId = msg.id;

    if (msg.query.length >= 3) {
        console.log(`Query: ${msg.query}`);
        var folders = files.getFolders(msg.query);
        var answers = [];
        for (var f = 0; f < folders.length && f < 50; f++) {
            answers.push({
                type: "article",
                id: f,
                title: folders[f],
                input_message_content: {
                    message_text: folders[f]
                }
            });
        }

        console.log(`-> Got ${answers.length} results (${answers.length > 0 ? answers[0].title : "-"})`);
        bot.answerInlineQuery(msg.id, answers);
    } else {
        bot.answerInlineQuery(msg.id, []);
    }
});

bot.on('chosen_inline_result', (msg) => {
    var folders = files.getFolders(msg.query);
    var folder = folders[msg.result_id];
    bot.sendMessage(msg.from.id, `Creating directory for \"${folder}\"...`);
    files.createRandomDirectory((err, dir) => {
        if (err) return bot.sendMessage(msg.from.id, `Failed to create directory: ${err.toString()}`);
        bot.sendMessage(msg.from.id, `Created \"${dir}\", copying files...`);
        files.copyFiles(folder, dir, (err) => {
            if (err) return bot.sendMessage(msg.from.id, `Failed to copy files: ${err.toString()}`);
            bot.sendMessage(msg.from.id, `Done, URL: https://abc.de/fg/${dir}/`);    
        });
    });
});