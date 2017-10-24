module.exports = {
	commands: [
		"poll"
	],
	description: "Create a poll for people to vote on.",
	usage: "poll <poll title, poll option #1, poll option #2, ...>",
	category: "Utility",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			args = args.join(" ");
			const title = args.split(",")[0].split(" ")[1];
			const options = args.split(",").slice(1).map(v => v.trim());
			if (options.length < 2) return msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing two poll options."
				}
			});
			if (options.length > 10) return msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "You cannot have more than 10 options."
				}
			});
			msg.channel.send({
				embed: {
					title,
					color: 3066993,
					description: ":one: | " + options[0] + "\n" + ":two: | " + options[1] + ((options[2]) ? "\n:three: | " + options[2] : "") + ((options[3]) ? "\n:four: | " + options[3] : "") + ((options[4]) ? "\n:five: | " + options[4] : "") + ((options[5]) ? "\n:six: | " + options[5] : "") + ((options[6]) ? "\n:seven: | " + options[6] : "") + ((options[7]) ? "\n:eight: | " + options[7] : "") + ((options[8]) ? "\n:nine: | " + options[8] : "") + ((options[9]) ? "\n:ten: | " + options[9] : "")
				}
			}).then(async (m) => {
				if (options[0]) await m.react("1⃣");
				if (options[1]) await m.react("2⃣");
				if (options[2]) await m.react("3⃣");
				if (options[3]) await m.react("4⃣");
				if (options[4]) await m.react("5⃣");
				if (options[5]) await m.react("6⃣");
				if (options[6]) await m.react("7⃣");
				if (options[7]) await m.react("8⃣");
				if (options[8]) await m.react("9⃣");
				if (options[9]) m.react("🔟");
			})
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<poll title, poll option #1, poll option #2, ...>` option."
				}
			});
		}
	}
};