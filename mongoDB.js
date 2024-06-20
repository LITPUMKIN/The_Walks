const { Database } = require("quickmongo");
const db_text = new Database("mongodb+srv://xx2228:KLtVVP52Bcr9xdKd@walkstext.ettvd7o.mongodb.net/?retryWrites=true&w=majority&appName=WalksText");
db_text.on("ready", () => {
    console.log("Connected to the database");
});
db_text.connect();

const db_image = new Database("mongodb+srv://xx2228:kSOGNKhuID3xuv8S@walksimage.qqtsku2.mongodb.net/?retryWrites=true&w=majority&appName=WalksImage");
db_image.on("ready", () => {
    console.log("Connected to the database");
});
db_image.connect();

module.exports = { db_text, db_image };