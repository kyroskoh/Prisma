const config = require("../config.json");
const snekfetch = require("snekfetch");
const util = require("util");
const removeSensitiveInformation = require("../functions/remove-sensitive-information.js");

module.exports = {
    commands: [
        "sql",
        "query"
    ],
    usage: "sql",
    description: "Runs a query in the database.",
    category: "Developers",
    hidden: true,
    execute: (bot, database, msg, args) => {
        if (config.trusted.indexOf(msg.author.id) > -1) {
            if (args.length > 0) {
                database.all(args.join(" "), (error, response, fields) => {
                    if (error) return msg.channel.send("```js\n" + util.inspect(error) + "```");
                    let result = util.inspect(response);
                    result = removeSensitiveInformation(result);
                    if (result.length > 1985) {
                        snekfetch.post("https://hastebin.com/documents").send(result).then((body) => {
                            msg.channel.send({
                                embed: {
                                    title: "Warning!",
                                    color: 0xFFA500,
                                    description: "Result was over 2,000 charactersm generated hastebin link instead. http://hastebin.com/" + body.body.key
                                }
                            });
                        });
                    } else {
                        msg.channel.send("```js\n" + result + "```");
                    }
                });
            } else {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Missing `<query>` option."
                    }
                });
            }
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "You do not have permission to execute this command."
                }
            });
        }
    }
};