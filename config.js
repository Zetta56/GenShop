require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/genshop", {useNewUrlParser: true, useUnifiedTopology: true});

const config = async () => {
	await User.deleteMany({isAdmin: true});
	User.register({username: process.env.ADMIN_USERNAME, isAdmin: true}, process.env.ADMIN_PASSWORD, (err, newUser) => {
		console.log("Admin Created");
		mongoose.connection.close()
	});
};

config();