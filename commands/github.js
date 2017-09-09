const snekfetch = require("snekfetch");
const dateformat = require("dateformat");

module.exports = {
	commands: [
		"github",
		"git"
	],
	description: "View information about a GitHub repository.",
	usage: "github <username/repo>",
	category: "Information",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			snekfetch.get("https://api.github.com/repos/" + ((args[0].indexOf("/") > -1) ? args[0] : args[0] + "/" + args[1])).then((body) => {
				msg.channel.send({
					embed: {
						title: "GitHub Repository",
						color: 3066993,
						fields: [
							{
								name: "Repository",
								value: body.body.full_name,
								inline: true
							},
							{
								name: "Owner",
								value: body.body.owner.login,
								inline: true
							},
							{
								name: "Primary Language",
								value: body.body.language,
								inline: true
							},
							{
								name: "Size",
								value: (body.body.size / 1024).toFixed(1) + " MB",
								inline: true
							},
							{
								name: "Website",
								value: ((body.body.homepage) ? body.body.homepage : "No Website"),
								inline: true
							},
							{
								name: "Created At",
								value: new Date(body.body.created_at).toUTCString(),
								inline: true
							},
							{
								name: "Issues",
								value: ((body.body.has_issues) ? body.body.open_issues : "Unknown"),
								inline: true
							},
							{
								name: "Stars",
								value: body.body.stargazers_count,
								inline: true
							},
							{
								name: "Forks",
								value: body.body.forks_count,
								inline: true
							},
							{
								name: "Watchers",
								value: body.body.watchers_count,
								inline: true
							}
						]
					}
				});
			}).catch((error) => {
				if (error.status === 404) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Unable to find a repository by that name."
					}
				});
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "An unexpected error occured while fetching GitHub repository information."
					}
				});
				console.error("Failed to get information on GitHub repository.", error.message);
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<username/repo>` option."
				}
			});
		}
	}
};