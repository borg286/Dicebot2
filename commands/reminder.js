var time = require('../functions/timeFunctions.js');
var fs = require('fs');
exports.run = (bot, msg, args) => {
    try {
        var remindTime = args[0];
        var remindTimescale = args[1];
        var remindContent = args[2];
        var timeS, wait;
        var d = new Date();
        if(isNaN(remindTime)){
            msg.reply("The format is: `!reminder <number> <time scale> <reminder content>` ie (!reminder 20 minutes prepare for dnd). Please use a number for <number>");
            return;
        }
        else{
            timeS = time.toms(parseInt(remindTime), remindTimescale)/1000;
            wait = time.toms(parseInt(remindTime), remindTimescale) + d.getTime();
        }
        if(timeS < 10){
            msg.reply("Sorry, I can't set a reminder for under 10 seconds.")
        }
        else{
            msg.reply(`Alright, I'll remind you in ${remindTime} ${remindTimescale} to: \`${remindContent}\` via private message.`);
            fs.appendFile('reminderQueue.txt', `\n${msg.author.id}|#${wait}|#Unticked|#${remindContent}\n`, function (err) {});
        }
    }
    catch(Error){
        console.log(Error)
    }
}