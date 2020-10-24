const mongoose = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
	googleId: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);