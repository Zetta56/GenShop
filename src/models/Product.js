const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	variations: [{type: String}],
	image: {
		url: String,
		publicId: String
	}
});

module.exports = mongoose.model("Product", productSchema);