const snekfetch = require("snekfetch");
const config = require("../config.json");
const cardinalFromDegree = require("../functions/cardinal-from-degree.js");
const dateformat = require("dateformat");

module.exports = {
	commands: [
		"weather"
	],
	description: "View weather for a city or zip code.",
	usage: "weather <city | zip>",
	category: "Utility",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			snekfetch.post("http://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(args.join(" ")) + "&appid=" + config.api_keys.openweathermap).then((body) => {
				msg.channel.send({
					embed: {
						title: "Weather Information",
						color: 3066993,
						fields: [
							{
								name: "Weather",
								value: body.body.weather[0].main,
								inline: true
							},
							{
								name: "Temperature",
								value: (9 / 5 * (body.body.main.temp - 273) + 32).toFixed(1) + "°F / " + (body.body.main.temp - 273).toFixed(1) + "°C",
								inline: true
							},
							{
								name: "Min. Temperature",
								value: (9 / 5 * (body.body.main.temp_min - 273) + 32).toFixed(1) + "°F / " + (body.body.main.temp_min - 273).toFixed(1) + "°C",
								inline: true
							},
							{
								name: "Max. Temperature",
								value: (9 / 5 * (body.body.main.temp_max - 273) + 32).toFixed(1) + "°F / " + (body.body.main.temp_max - 273).toFixed(1) + "°C",
								inline: true
							},
							{
								name: "Pressure",
								value: (body.body.main.pressure / 51.71493256).toFixed(1) + " Psi",
								inline: true
							},
							{
								name: "Humidity",
								value: body.body.main.humidity.toFixed(1) + "%",
								inline: true
							},
							{
								name: "Visibility",
								value: (body.body.visibility / 1609.34).toFixed(1) + " mile" + (((body.body.visibility / 1609.34).toFixed(1) === 1) ? "" : "s"),
								inline: true
							},
							{
								name: "Wind",
								value: "\\" + cardinalFromDegree(body.body.wind.deg) + " / " + body.body.wind.speed + " mph",
								inline: true
							},
							{
								name: "Sunrise",
								value: dateformat(body.body.sys.sunrise * 1000, "hh:MM:ss TT"),
								inline: true
							},
							{
								name: "Sunset",
								value: dateformat(body.body.sys.sunset * 1000, "hh:MM:ss TT"),
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
						description: "An error occured while getting weather."
					}
				});
				console.error("Failed to get the weather.", error.message);
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<city | zip>` option."
				}
			});
		}
	}
};