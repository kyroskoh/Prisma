module.exports = {
	commands: [
		"crime"
	],
	description: "Commit a crime and gain money.",
	usage: "crime",
	category: "Economy",
	hidden: false,
	execute: (bot, r, msg) => {
		msg.channel.send({
			embed: {
				title: "Information!",
				color: 1030633,
				description: "This command is currently under construction."
			}
		});
	}
};