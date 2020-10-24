const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
	token: String,
	userId: String,
	createdAt: {type: Date, expires: 259200, default: Date.now} //Expires in 3 days
});

module.exports = mongoose.model("Token", tokenSchema);