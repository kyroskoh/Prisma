const handleDatabaseError = require("../functions/handle-database-error.js");
const c4 = require("../functions/connect-4.js");

const editGame = (reaction, response, r, user) => {
	let win = false;
	for (var col = 0; col < response.game.length; col++) {
		for (var row = 0; row < response.game[col].length; row++) {
			if (response.game[col][row] !== 0) {
				if (response.game[col][row + 1] !== 0 && response.game[col][row + 1] === response.game[col][row]) {
					if (response.game[col][row + 2] !== 0 && response.game[col][row + 2] === response.game[col][row + 1]) {
						if (response.game[col][row + 3] !== 0 && response.game[col][row + 3] === response.game[col][row + 2]) {
							win = [[col, row], [col, row + 1], [col, row + 2], [col, row + 3]];
						}
					}
				} else if (response.game[col + 1] && response.game[col + 1][row] !== 0 && response.game[col + 1][row] === response.game[col][row]) {
					if (response.game[col + 2] && response.game[col + 2][row] !== 0 && response.game[col + 2][row] === response.game[col][row + 1]) {
						if (response.game[col + 3] && response.game[col + 3][row] !== 0 && response.game[col + 3][row] === response.game[col][row + 2]) {
							win = [[col, row], [col + 1, row], [col + 2, row], [col + 3, row]];
						}
					}
				} else if (response.game[col + 1] && response.game[col + 1][row + 1] && response.game[col + 1][row + 1] === response.game[col][row]) {
					if (response.game[col + 2] && response.game[col + 2][row + 2] !== 0 && response.game[col + 2][row + 2] === response.game[col + 1][row + 1]) {
						if (response.game[col + 3] && response.game[col + 3][row + 3] !== 0 && response.game[col + 3][row + 3] === response.game[col + 2][row + 2]) {
							win = [[col, row], [col + 1, row + 1], [col + 2, row + 2], [col + 3, row + 3]];
						}
					}
				} else if (response.game[col - 1] && response.game[col - 1][row - 1] && response.game[col - 1][row - 1] === response.game[col][row]) {
					if (response.game[col - 2] && response.game[col - 2][row - 2] && response.game[col - 2][row - 2] === response.game[col - 1][row - 1]) {
						if (response.game[col - 3] && response.game[col - 3][row - 3] && response.game[col - 3][row - 3] === response.game[col - 2][row - 2]) {
							win = [[col, row], [col - 1, row - 1], [col - 2, row - 2], [col - 3, row - 3]];
						}
					}
				}
			}
		}
	}
	let board = "";
	for (var x = 6; x >= 0; x--) {
		for (var y = 0; y < 6; y++) {
			board += (win && ((win[0][0] === y && win[0][1] === x) || (win[1][0] === y && win[1][1] === x) || (win[2][0] === y && win[2][1] === x) || (win[3][0] === y && win[3][1] === x))) ? ":large_orange_diamond:" : (response.game[y][x] === 1) ? ":red_circle:" : (response.game[y][x] === 2) ? ":large_blue_circle:" : ":black_circle:";
			if (y !== 5) board += "   |   ";
		}
		board += "\n";
	}
	reaction.message.edit({
		embed: {
			title: "Connect 4",
			color: 3066993,
			description: ((win) ? "**" + ((response.turn === 1) ? response.user1.tag : response.user2.tag) + "** won the game!" : "**" + ((response.turn === 1) ? response.user2.tag : response.user1.tag) + "**'s turn.") + "\n\n" + board
		}
	});
	if (win) {
		r.table("connect4").filter(r.row("user1")("id").eq(user.id).or(r.row("user2")("id").eq(user.id))).delete().run((error) => {
			if (error) return handleDatabaseError(error, reaction.message);
			c4.remove(reaction.message.id);
		});
	}
};

module.exports = (bot, r) => {
	bot.on("messageReactionAdd", (reaction, user) => {
		if (c4.inGame(reaction.message.id)) {
			r.table("connect4").filter(r.row("user1")("id").eq(user.id).or(r.row("user2")("id").eq(user.id))).run((error, response) => {
				if (error) return handleDatabaseError(error, reaction.message);
				if (response.length > 0) {
					response = response[0];
					if ((response.turn === 1 && user.id === response.user2.id) || (response.turn === 2 && user.id === response.user1.id)) return;
					if (reaction._emoji.name === "1⃣") {
						if (response.game[0].filter(v => v !== 0).length > 5) return;
						if (response.user1.id === user.id) {
							response.game[0][response.game[0].indexOf(response.game[0].filter(v => v === 0)[0])] = 1;
						} else {
							response.game[0][response.game[0].indexOf(response.game[0].filter(v => v === 0)[0])] = 2;
						}
						r.table("connect4").filter(r.row("user1")("id").eq(user.id).or(r.row("user2")("id").eq(user.id))).update({ game: response.game, turn: ((response.turn === 1) ? 2 : 1) }).run((error) => {
							if (error) return handleDatabaseError(error, reaction.message);
							editGame(reaction, response, r, user);
						});
					} else if (reaction._emoji.name === "2⃣") {
						if (response.game[1].filter(v => v !== 0).length > 5) return;
						if (response.user1.id === user.id) {
							response.game[1][response.game[1].indexOf(response.game[1].filter(v => v === 0)[0])] = 1;
						} else {
							response.game[1][response.game[1].indexOf(response.game[1].filter(v => v === 0)[0])] = 2;
						}
						r.table("connect4").filter(r.row("user1")("id").eq(user.id).or(r.row("user2")("id").eq(user.id))).update({ game: response.game, turn: ((response.turn === 1) ? 2 : 1) }).run((error) => {
							if (error) return handleDatabaseError(error, reaction.message);
							editGame(reaction, response, r, user);
						});
					} else if (reaction._emoji.name === "3⃣") {
						if (response.game[2].filter(v => v !== 0).length > 5) return;
						if (response.user1.id === user.id) {
							response.game[2][response.game[2].indexOf(response.game[2].filter(v => v === 0)[0])] = 1;
						} else {
							response.game[2][response.game[2].indexOf(response.game[2].filter(v => v === 0)[0])] = 2;
						}
						r.table("connect4").filter(r.row("user1")("id").eq(user.id).or(r.row("user2")("id").eq(user.id))).update({ game: response.game, turn: ((response.turn === 1) ? 2 : 1) }).run((error) => {
							if (error) return handleDatabaseError(error, reaction.message);
							editGame(reaction, response, r, user);
						});
					} else if (reaction._emoji.name === "4⃣") {
						if (response.game[3].filter(v => v !== 0).length > 5) return;
						if (response.user1.id === user.id) {
							response.game[3][response.game[3].indexOf(response.game[3].filter(v => v === 0)[0])] = 1;
						} else {
							response.game[3][response.game[3].indexOf(response.game[3].filter(v => v === 0)[0])] = 2;
						}
						r.table("connect4").filter(r.row("user1")("id").eq(user.id).or(r.row("user2")("id").eq(user.id))).update({ game: response.game, turn: ((response.turn === 1) ? 2 : 1) }).run((error) => {
							if (error) return handleDatabaseError(error, reaction.message);
							editGame(reaction, response, r, user);
						});
					} else if (reaction._emoji.name === "5⃣") {
						if (response.game[4].filter(v => v !== 0).length > 5) return;
						if (response.user1.id === user.id) {
							response.game[4][response.game[4].indexOf(response.game[4].filter(v => v === 0)[0])] = 1;
						} else {
							response.game[4][response.game[4].indexOf(response.game[4].filter(v => v === 0)[0])] = 2;
						}
						r.table("connect4").filter(r.row("user1")("id").eq(user.id).or(r.row("user2")("id").eq(user.id))).update({ game: response.game, turn: ((response.turn === 1) ? 2 : 1) }).run((error) => {
							if (error) return handleDatabaseError(error, reaction.message);
							editGame(reaction, response, r, user);
						});
					} else if (reaction._emoji.name === "6⃣") {
						if (response.game[5].filter(v => v !== 0).length > 5) return;
						if (response.user1.id === user.id) {
							response.game[5][response.game[5].indexOf(response.game[5].filter(v => v === 0)[0])] = 1;
						} else {
							response.game[5][response.game[5].indexOf(response.game[5].filter(v => v === 0)[0])] = 2;
						}
						r.table("connect4").filter(r.row("user1")("id").eq(user.id).or(r.row("user2")("id").eq(user.id))).update({ game: response.game, turn: ((response.turn === 1) ? 2 : 1) }).run((error) => {
							if (error) return handleDatabaseError(error, reaction.message);
							editGame(reaction, response, r, user);
						});
					}
				}
			});
		}
	});
};