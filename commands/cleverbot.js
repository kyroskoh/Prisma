const config = require("../config.json");
const cleverbot = require("cleverbot.io");
const clever = new cleverbot(...[config.api_keys.cleverbot]);
clever.create((error, session) => {
    if (error) throw new error();
    clever.setNick(session);
});

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
            /* return msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Cleverbot is now charging for their services, so we are unable to have a cleverbot. If you want to make this command work again, please donate using `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "donate`."
                }
            }); */
            clever.ask(args.join(" "), (error, response) => {
                if (error) {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "An unexpected error occured while asking cleverbot a question."
                        }
                    });
                    console.error("Failed to ask cleverbot a question.", response);
                } else {
                    msg.channel.send({
                        embed: {
                            title: "Cleverbot Response",
                            color: 3066993,
                            description: response
                        }
                    });
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