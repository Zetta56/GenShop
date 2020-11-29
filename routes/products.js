const express = require("express"),
	  router = express.Router(),
	  path = require("path"),
	  fs = require("fs"),
	  mongoose = require("mongoose"),
	  middleware = require("../middleware"),
	  Product = require("../models/Product"),
	  Discount = require("../models/Discount"),
	  Review = require("../models/Review"),
	  User = require("../models/User");
  
router.get("/", async (req, res) => {
	try {
		let foundProducts = [];
		//Populate user's cart
		if(req.query.user && mongoose.Types.ObjectId.isValid(req.query.user)) {
			const foundUser = await User.findById(req.query.user);
			if(!foundUser) {
				return res.status(404).json({message: "User does not exist."});
			};
			for(const item of foundUser.cart) {
				const product = await Product.findById(item.product);
				foundProducts.push(product);
			}
		//Get all products
		} else {
			foundProducts = await Product.find();
		};

		const loadedProducts = await Promise.all(
			foundProducts.map(async product => {
				//Retreives associated discount
				const foundDiscount = await Discount.findOne({product: product._id});
				const foundReviews = await Review.find({product: product._id});
				
				//Discount keys are the same as product upsert form fieldnames
				if(foundDiscount) {
					return {
						...product.toObject(), 
						ratings: foundReviews.map(review => review.ratings),
						discount: foundDiscount.percent,
						expireAt: foundDiscount.expireAt,
						//Reads and encodes image from file system
						image: Buffer.from(fs.readFileSync(path.join(__dirname + "/../" + product.image)), "binary").toString("base64")
					};
				} else {
					return {
						...product.toObject(), 
						ratings: foundReviews.map(review => review.ratings),
						image: Buffer.from(fs.readFileSync(path.join(__dirname + "/../" + product.image)), "binary").toString("base64")
					}
				}
			})
		);

		res.json(loadedProducts);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

router.get("/:productId", middleware.hasProductId, async (req, res) => {
	try {
		const foundProduct = await Product.findById(req.params.productId);
		const foundDiscount = await Discount.findOne({product: foundProduct._id});
		const foundReviews = await Review.find({product: foundProduct._id});

		//Gets discount and image
		if(foundDiscount) {
			res.json({
				...foundProduct.toObject(),
				ratings: foundReviews.map(review => review.ratings),
				discount: foundDiscount.percent,
				expireAt: foundDiscount.expireAt,
				//Reads and encodes image from file system
				image: Buffer.from(fs.readFileSync(path.join(__dirname + "/../" + foundProduct.image)), "binary").toString("base64")
			});
		} else {
			res.json({
				...foundProduct.toObject(), 
				ratings: foundReviews.map(review => review.ratings),
				image: Buffer.from(fs.readFileSync(path.join(__dirname + "/../" + foundProduct.image)), "binary").toString("base64")
			});
		};
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

router.post("/", middleware.upload.single("image"), middleware.hasProductInfo, async (req, res) => {
	try {
		//Creates product
		const newProduct = await Product.create({
			title: req.body.title,
			description: req.body.description,
			//Price rounded to 2 decimal places
			price: Math.round(req.body.price),
			variations: req.body.variations,
			image: req.file.path
		});
		
		//Creates optional discount
		if(req.body.discount && req.body.discount !== "null") {
			console.log("hit")
			await Discount.create({
				percent: Math.round(req.body.discount * 100) / 100,
				product: newProduct._id,
				expireAt: new Date(`${req.body.discountDate}T23:59:00Z`)
			});
		};
		
		res.json(newProduct);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

router.put("/:productId", middleware.upload.single("image"), middleware.hasProductId, middleware.hasProductInfo, async (req, res) => {
	try {
		//Undoes formdata conversion between empty array and null
		const variations = req.body.variations != null ? req.body.variations : [];
		//Updates product
		const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, {
			title: req.body.title,
			description: req.body.description,
			price: Math.round(req.body.price * 100) / 100,
			variations: variations,
			image: req.file.path
		}, {new: true});

		//Upserts discount
		if(req.body.discount && req.body.discount != "null") {
			const foundDiscount = await Discount.findOne({product: updatedProduct._id});
			if(foundDiscount) {
				await Discount.findOneAndUpdate({product: updatedProduct._id}, {
					percent: Math.round(req.body.discount),
					expireAt: new Date(`${req.body.discountDate}T23:59:00Z`)
				}, {new: true});
			} else {
				await Discount.create({
					percent: Math.round(req.body.discount),
					expireAt: new Date(`${req.body.discountDate}T23:59:00Z`),
					product: updatedProduct._id
				});
			};
		};

		//Cleans up uploads folder
		for(const path of fs.readdirSync("uploads")) {
			const pathProduct = await Product.findOne({image: "uploads\\" + path});
			if(!pathProduct && path !== ".gitkeep") {
				await fs.unlink("uploads/" + path, (err) => {
					if(err) {
						console.log(err)
					};
				});
			};
		};

		res.json(updatedProduct);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

router.delete("/:productId", middleware.isAdmin, middleware.hasProductId, async (req, res) => {
	try {
		//Pulls product from all users' carts
		await User.updateMany({"cart.product": {$in: req.params.productId}}, {
			$pull: {cart: {product: mongoose.Types.ObjectId(req.params.productId)}}
		});
		await Product.findByIdAndDelete(req.params.productId);
		await Discount.findOneAndDelete({product: req.params.productId});
		await Review.deleteMany({product: req.params.productId});
		res.json(req.params.productId);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

module.exports = router;