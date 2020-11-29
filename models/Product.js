const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	variations: [{type: String}],
	image: String
});

module.exports = mongoose.model("Product", productSchema);