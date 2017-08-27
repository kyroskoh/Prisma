const config = require("../config.json");

module.exports = {
    commands: [
        "cleverbot",
        "clever",
        "askclever"
    ],
    description: "Ask the \"intelligent\" Cleverbot API a question.",
    usage: "cleverbot <question>",
    category: "Fun",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (args.length > 0) {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Cleverbot is now charging for their services, so we are unable to have a cleverbot. If you want to make this command work again, please donate using `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "donate`."
                }
            });
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Missing `<question>` option."
                }
            });
        }
    }
};