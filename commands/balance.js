const handleDatabaseError = require("../functions/handle-database-error.js");
const resolveUser = require("../functions/resolve-user.js");

module.exports = {
	commands: [
		"balance",
		"bal",
		"money"
	],
	description: "View your balance.",
	usage: "balance [@user | user ID | username]",
	category: "Economy",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			resolveUser(bot, args.join(" ")).then((user) => {
				if (user.bot) return msg.channel.send({
					embed: {
						title: "Error!",
						description: "Bots do not have a balance.",
						color: 0xE50000
					}
				});
				r.table("economy").filter({userID: msg.author.id}).run((error, response) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.send({
						embed: {
							title: user.tag + "'s Balance",
							color: 3066993,
							fields: [
								{
									name: "Wallet",
									value: ((response.length > 0) ? "$" + response[0].wallet : "$0"),
									inline: true
								},
								{
									name: "Bank",
									value: ((response.length > 0) ? "$" + response[0].bank : "$0"),
									inline: true
								},
								{
									name: "Net Worth",
									value: ((response.length > 0) ? "$" + (response[0].wallet + response[0].bank) : "$0"),
									inline: true
								}
							]
						}
					});
				});
			}).catch(() => {
				msg.channel.send({
					embed: {
						title: "Error!",
						description: "Unable to find any users by that query.",
						color: 0xE50000
					}
				});
			});
		} else {
			r.table("economy").filter({userID: msg.author.id}).run((error, response) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.send({
					embed: {
						title: msg.author.tag + "'s Balance",
						color: 3066993,
						fields: [
							{
								name: "Wallet",
								value: ((response.length > 0) ? "$" + response[0].wallet : "$0"),
								inline: true
							},
							{
								name: "Bank",
								value: ((response.length > 0) ? "$" + response[0].bank : "$0"),
								inline: true
							},
							{
								name: "Net Worth",
								value: ((response.length > 0) ? "$" + (response[0].wallet + response[0].bank) : "$0"),
								inline: true
							}
						]
					}
				});
			});
		}
	}
};