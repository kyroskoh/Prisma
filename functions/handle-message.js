const config = require("../config.json");

module.exports = (bot, r, msg) => {
	if (msg.author.bot) return;
	if (!msg.content.startsWith(((msg.guild) ? msg.guild.data.prefix : config.prefix)) && !msg.content.startsWith("<@" + bot.user.id + "> ") && !msg.content.startsWith("<@!" + bot.user.id + "> ")) return;
	let prefix;
	if (msg.content.startsWith(((msg.guild) ? msg.guild.data.prefix : config.prefix))) prefix = ((msg.guild) ? msg.guild.data.prefix : config.prefix);
	if (msg.content.startsWith("<@" + bot.user.id + ">")) prefix = "<@" + bot.user.id + "> ";
	if (msg.content.startsWith("<@!" + bot.user.id + ">")) prefix = "<@!" + bot.user.id + "> ";
	let command = Object.keys(bot.commands).filter((c) => bot.commands[c].commands.indexOf(msg.content.replace(prefix, "").split(" ")[0]) > -1);
	if (command.length > 0) {
		const args = ((msg.content.replace(prefix, "").split(" ").length > 1) ? msg.content.replace(prefix, "").split(" ").slice(1) : []);
		try {
			bot.commands[command[0]].execute(bot, r, msg, args);
		} catch (e) {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "An error occured when attempting to execute command."
				}
			});
			console.error("Failed to run '" + bot.commands[command[0]].commands[0] + "' command.", e);
		}
	}
};