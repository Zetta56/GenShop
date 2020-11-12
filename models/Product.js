const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	created: {type: Date, default: Date.now()},
	image: {
		data: Buffer,
		contentType: String
	},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Product", productSchema);