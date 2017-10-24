module.exports = {
	commands: [
		"coinflip"
	],
	description: "Flips a coin.",
	usage: "coinflip",
	category: "Fun",
	hidden: false,
	execute: (bot, r, msg) => {
		const result = Math.round(Math.random());
		if (result) {
			msg.channel.send({
				embed: {
					title: "Coinflip",
					color: 3066993,
					description: "The coin landed on heads."
				}
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Coinflip",
					color: 3066993,
					description: "The coin landed on tails."
				}
			});
		}
	}
};