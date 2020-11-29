const passport = require("passport"),
	  mongoose = require("mongoose"),
	  multer = require("multer"),
	  path = require("path"),
	  Product = require("../models/Product"),
	  Review = require("../models/Review");

const middleware = {};

middleware.upload = multer({
	//Stores image in uploads folder
	storage: multer.diskStorage({ 
	    destination: (req, file, cb) => {
	    	cb(null, "uploads")
	    }, 
	    filename: (req, file, cb) => {
	    	cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
	    }
	}),
	//Checks file is an image
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png/;
		const extension = path.extname(file.originalname).toLowerCase();
		const mimetype = file.mimetype;

		if(allowedTypes.test(extension) && allowedTypes.test(mimetype)) {
			return cb(null, true);
		} else {
			return cb("That is not an image file.");
		}
	},
	limit: {
		//Max: 5MB
		fileSize: 1024 * 1024 * 5
	}
});

middleware.isLoggedIn = (req, res, next) => {
	if(!req.user) {
		return res.status(401).json("You must be logged in to do that.");
	};
	next();
};

middleware.isAdmin = (req, res, next) => {
	if(!req.user.isAdmin) {
		return res.status(401).json("You do not have permission to do that.");
	}
	next();
}

middleware.hasProductInfo = async (req, res, next) => {
	const foundProducts = await Product.find({});
	const ownProduct = req.params ? await Product.findById(req.params.productId) : {title: null};

	if(!req.user.isAdmin) {
		return res.status(401).json("You do not have permission to do that.");
	}
	if(!req.file || !req.body.title || !req.body.description || !req.body.price) {
		return res.status(400).json("Missing required fields.");
	}
	if(foundProducts.map(product => product.title).includes(req.body.title) && req.body.title !== ownProduct.title) {
		return res.status(409).json("Product name is already taken.");
	}
	next();
};

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

middleware.reviewAuthorized = async (req, res, next) => {
	if(!mongoose.Types.ObjectId.isValid(req.params.productId)) {
		return res.status(404).json({message: "Product does not exist."});
	};
	if(!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
		return res.status(404).json({message: "Review does not exist."});
	};
	const foundProduct = await Product.findById(req.params.productId);
	const foundReview = await Review.findById(req.params.reviewId);
	if(!foundProduct) {
		return res.status(404).json({message: "Product does not exist."});
	};
	if(!foundReview) {
		return res.status(404).json({message: "Review does not exist."});
	};
	if(!foundReview.user.id.equals(req.user._id) && !req.user.isAdmin) {
		return res.status(401).json({message: "You do not have permission to do that."});
	};
	next();
};


module.exports = middleware;