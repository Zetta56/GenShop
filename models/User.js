const mongoose = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
	googleId: String,
	isAdmin: {type: Boolean, default: false},
	cart: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);