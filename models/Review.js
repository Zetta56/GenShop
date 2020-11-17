const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
	rating: Number,
	comment: String,
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product"
	}
});

module.exports = mongoose.model("Review", reviewSchema);