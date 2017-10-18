let games = [];

module.exports.add = (messageID) => {
	games.push(messageID);
};

module.exports.remove = (messageID) => {
	games.splice(games.indexOf(messageID), 1);
};

module.exports.inGame = (messageID) => {
	return games.indexOf(messageID) > -1;
};