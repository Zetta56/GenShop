const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
	ratings: Number,
	comment: String,
	created: {type: Date, default: Date.now()},
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product"
	},
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Review", reviewSchema);