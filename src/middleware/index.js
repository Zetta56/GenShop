const mongoose = require("mongoose"),
	  Product = require("../models/Product"),
	  Review = require("../models/Review");

const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
	if(!req.user) {
		return res.status(401).json({message: "You must be logged in to do that."});
	};
	next();
};

middleware.isAdmin = (req, res, next) => {
	if(!req.user || !req.user.isAdmin) {
		return res.status(401).json({message: "You do not have permission to do that."});
	}
	next();
}

middleware.hasProductId = async (req, res, next) => {
	if(!mongoose.Types.ObjectId.isValid(req.params.productId)) {
		return res.status(404).json({message: "Product does not exist."});
	};
	const foundProduct = await Product.findById(req.params.productId);
	if(!foundProduct) {
		return res.status(404).json({message: "Product does not exist."});
	};
	next();
};

middleware.hasProductInfo = async (req, res, next) => {
	if(!req.body.image || !req.body.image.url || !req.body.image.publicId
			|| !req.body.title || !req.body.description || !req.body.price || req.body.price < 0) {
		return res.status(400).json({message: "Missing required fields."});
	}
	next();
};

middleware.reviewAuthorized = async (req, res, next) => {
	if(!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
		return res.status(404).json({message: "Review does not exist."});
	};
	const foundReview = await Review.findById(req.params.reviewId);
	if(!foundReview) {
		return res.status(404).json({message: "Review does not exist."});
	};
	if(!foundReview.user.id.equals(req.user._id) && !req.user.isAdmin) {
		return res.status(401).json({message: "You do not have permission to do that."});
	};
	next();
};


module.exports = middleware;