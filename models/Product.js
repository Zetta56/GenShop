const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	title: String,
	created: {type: Date, default: Date.now()},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Product", productSchema);