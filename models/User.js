const mongoose = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
	googleId: String,
	isAdmin: {type: Boolean, default: false},
	watchlist: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		}
	],
	cart: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product"
			},
			quantity: Number,
			variation: String
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);