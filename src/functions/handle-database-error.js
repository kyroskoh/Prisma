module.exports = (error, msg) => {
	if (msg) msg.channel.send({
		embed: {
			title: "Error!",
			color: 0xE50000,
			description: "An error occured when attempting to query database."
		}
	});
	console.error(error);
};