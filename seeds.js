require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/genshop", {useNewUrlParser: true, useUnifiedTopology: true});

const seeds = async () => {
	await User.deleteOne({username: process.env.ADMIN_USERNAME});
	await User.deleteOne({username: "a"});
	User.register({email: "a@a.com", username: "a"}, "a");
	User.register({username: process.env.ADMIN_USERNAME, isAdmin: true}, process.env.ADMIN_PASSWORD, (err, newUser) => {
		console.log("Users Seeded");
	});
};

seeds();