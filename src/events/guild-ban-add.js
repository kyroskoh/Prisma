const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = (bot, r) => {
	bot.on("guildBanAdd", (guild, user) => {
		r.table("settings").filter({ id: guild.id, name: "log_channel" }).run((error, response) => {
			if (error) return handleDatabaseError(error);
			if (response.length > 0) {
				if (bot.channels.get(response[0].value)) bot.channels.get(response[0].value).send({
					embed: {
						title: "Member Banned",
						color: 15880993,
						fields: [
							{
								name: "Username",
								value: user.tag,
								inline: false
							},
							{
								name: "Timestamp",
								value: new Date().toUTCString(),
								inline: false
							}
						]
					}
				});
			}
		});
	});
};