const steam = require("../functions/steam.js")();
const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
	commands: [
		"linksteam",
		"steamlink",
		"slink"
	],
	usage: "linksteam <steamID | vanity URL>",
	description: "Link your Steam account to this bot.",
	category: "Utility",
	hidden: false,
	execute: (bot, r, msg, args) => {
		return msg.channel.send({
			embed: {
				title: "Information!",
				color: 1030633,
				description: "This command has been disabled because of instability."
			}
		});
		if (args.length > 0) {
			if (/^\d+$/.test(args[0])) {
				steam.getPlayerSummaries({
					steamids: args[0]
				}, (error, summary) => {
					if (error || summary.players.length < 1) return msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "Either an error occured while fetching user summary or that Steam ID is invalid."
						}
					});
					if (summary.players[0].communityvisibilitystate !== 3) return msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "Your profile is private. I cannot get information on a profile that is private."
						}
					});
					r.table("steam_profiles").filter({userID: msg.author.id}).run((error, response) => {
						if (error) return handleDatabaseError(error, msg);
						if (response.length > 0) {
							r.table("steam_profiles").filter({userID: msg.author.id}).update({id: args[0]}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								msg.channel.send({
									embed: {
										title: "Linked!",
										color: 3066993,
										description: "Linked your Steam account to you successfully."
									}
								});
							});
						} else {
							r.table("steam_profiles").insert({
								userID: msg.author.id,
								id: args[0]
							}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								msg.channel.send({
									embed: {
										title: "Linked!",
										color: 3066993,
										description: "Linked your Steam account to you successfully."
									}
								});
							});
						}
					});
				});
			} else {
				steam.resolveVanityURL({
					vanityurl: encodeURIComponent(args.join(" ")),
					url_type: 1
				}, (error, user) => {
					if (error || user.success === 42) return msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "Either an error occured while fetching Steam ID or that vanity URL is invalid."
						}
					});
					steam.getPlayerSummaries({
						steamids: user.steamid
					}, (error, summary) => {
						if (error || summary.players.length < 1) return msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "Either an error occured while fetching user summary or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
							}
						});
						if (summary.players[0].communityvisibilitystate !== 3) return msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "Your profile is private. I cannot get information on a profile that is private."
							}
						});
						r.table("steam_profiles").filter({userID: msg.author.id}).run((error, response) => {
							if (error) return handleDatabaseError(error, msg);
							if (response.length > 0) {
								r.table("steam_profiles").filter({userID: msg.author.id}).update({id: summary.players[0].steamid}).run((error) => {
									if (error) return handleDatabaseError(error, msg);
									msg.channel.send({
										embed: {
											title: "Linked!",
											color: 3066993,
											description: "Linked your Steam account to you successfully."
										}
									});
								});
							} else {
								r.table("steam_profiles").insert({
									userID: msg.author.id,
									id: summary.players[0].steamid
								}).run((error) => {
									if (error) return handleDatabaseError(error, msg);
									msg.channel.send({
										embed: {
											title: "Linked!",
											color: 3066993,
											description: "Linked your Steam account to you successfully."
										}
									});
								});
							}
						});
					});
				});
			}
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<steamID | vanity URL>` option."
				}
			});
		}
	}
};