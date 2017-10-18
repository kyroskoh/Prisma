const snekfetch = require("snekfetch");

module.exports = {
	commands: [
		"bitcoin",
		"btc"
	],
	description: "Get the current price of the Bitcoin.",
	usage: "bitcoin",
	category: "Economy",
	hidden: false,
	execute: (bot, r, msg) => {
		snekfetch.get("https://blockchain.info/ticker").then((body) => {
			msg.channel.send({
				embed: {
					title: "Bitcoin Worth",
					description: "Each of these values is the worth of a Bitcoin that it's worth in different countries.",
					color: 3066993,
					fields: Object.keys(body.body).map((c) => {
						return {
							name: c,
							value: "**Buy Price**: " + body.body[c].symbol + body.body[c].buy + "\n**Sell Value**: " + body.body[c].symbol + body.body[c].sell,
							inline: true
						};
					})
				}
			});
		}).catch((error) => {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "An unexpected error occured while fetching Bitcoin prices."
				}
			});
			console.error("Failed to get Bitcoin information.", error.message);
		});
	}
};