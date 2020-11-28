const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	variations: [{type: String}],
	image: String,
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Product", productSchema);