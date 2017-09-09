const snekfetch = require("snekfetch");
const util = require("util");

module.exports = {
	commands: [
		"urban",
		"urbandictionary"
	],
	description: "Search a word from the urban dictionary.",
	usage: "urban <word>",
	category: "Fun",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			snekfetch.get("http://api.urbandictionary.com/v0/define?term=" + encodeURIComponent(args.join(" "))).then((body) => {
				if (body.body.result_type === "no_results") return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "There are no results for that word."
					}
				});
				msg.channel.send({
					embed: {
						title: "Urban Dictionary - " + args.join(" "),
						color: 3066993,
						description: body.body.list[0].definition,
						fields: [
							{
								name: "Upvotes",
								value: body.body.list[0].thumbs_up,
								inline: true
							},
							{
								name: "Downvotes",
								value: body.body.list[0].thumbs_down,
								inline: true
							},
							{
								name: "Author",
								value: body.body.list[0].author,
								inline: true
							}
						]
					}
				});
			}).catch((error) => {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "An error occured while searching for that word."
					}
				});
				console.error("Failed to search on the Urban Dictionary.", error);
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "You need to provide a word to search for."
				}
			});
		}
	}
};