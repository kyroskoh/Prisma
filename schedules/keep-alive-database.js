const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
    interval: 60000,
    execute: (bot, database) => {
        database.all("SELECT 1", (error) => {
            if (error) handleDatabaseError(bot, error);
        });
    }
}