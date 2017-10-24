module.exports = {
	commands: [
		"random"
	],
	description: "Generates a random number from 1 to 10.",
	usage: "random [max | min] [max]",
	category: "Utility",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			if (!isNaN(args[0])) {
				if (args[0] >= 0) {
					if (args.length > 1) {
						if (!isNaN(args[1])) {
							if (args[1] >= 0) {
								if (args[0] < args[1]) {
									if (args[1] > 1e6) {
										msg.channel.send({
											embed: {
												title: "Error!",
												color: 0xE50000,
												description: "The maximum number cannot be greater than 1 million."
											}
										});
									} else {
										msg.channel.send({
											embed: {
												title: "Random Number",
												color: 3066993,
												description: "The random number is `" + (Math.round(Math.random() * (Number(args[1]) - Number(args[0]))) + Number(args[0])) + "`."
											}
										});
									}
								} else {
									msg.channel.send({
										embed: {
											title: "Error!",
											color: 0xE50000,
											description: "The mininum number cannot be greater than or equal to the maximum number."
										}
									});
								}
							} else {
								msg.channel.send({
									embed: {
										title: "Error!",
										color: 0xE50000,
										description: "The maximum number must be greater than or equal to `0`."
									}
								});
							}
						} else {
							msg.channel.send({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "`" + args[1] + "` is not a valid number."
								}
							});
						}
					} else {
						if (args[0] > 1e6) {
							msg.channel.send({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "The maximum number cannot be greater than 1 million."
								}
							});
						} else {
							msg.channel.send({
								embed: {
									title: "Random Number",
									color: 3066993,
									description: "The random number is `" + Math.round(Math.random() * Number(args[0])) + "`."
								}
							});
						}
					}
				} else {
					msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "The maximum number must be greater than or equal to `0`."
						}
					});
				}
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "`" + args[0] + "` is not a valid number."
					}
				});
			}
		} else {
			msg.channel.send({
				embed: {
					title: "Random Number",
					color: 3066993,
					description: "The random number is `" + Math.round(Math.random() * 10) + "`."
				}
			});
		}
	}
};