var dice = require('../functions/diceFunctions.js')
exports.run = (bot, msg, args) => {
    try {
        var arrayOfRolls = new Array(), arrayOfComments = new Array(), splitMessage = msg.content.toString().concat();
        var fullRollInline = "\n";
        splitMessage = splitMessage.split("[[");
        for(var i = 0; i < splitMessage.length; i++){
            if(splitMessage[i].includes("]]")){
                arrayOfComments.push(splitMessage[i].split("]]",1)[0]);
                if(splitMessage[i].includes(" ")){
                    arrayOfRolls.push(splitMessage[i].split("]]")[0].split(" ",1)[0]);
                }
                else{
                    arrayOfRolls.push(splitMessage[i].split("]]",1)[0]);
                }
            }
        }
        if(msg.content.match(/(\d|)[d]\d/)){
            for(var m = 0; m < arrayOfRolls.length; m++){
                fullRollInline += `${arrayOfComments[m]}: ${dice.rollDiceFunc(arrayOfRolls[m])} \n`;
            }
        }
        msg.reply(fullRollInline);
    }
    catch(Error){
        msg.channel.send(`Invalid roll. Try \`${bot.prefix}help roll\` for help.`);
        console.log(Error)
    }
}
module.exports.help = {
    name: "inlineroll",
    category: "Rolling",
    description: "Roll from within a normal message.",
    detailedDesc: "Inline rolls are a special way of rolling dice as you would via a roll command from within a normal message.\nThe message must use the format with an optional comment argument. For example [[d20+5]], [[d4+4 damage]] are valid inline rolls.",
    usage: "normal message... [[`<dice roll> [comment]`]] ... normal message",
    noPrefix: true
}