const express = require("express"),
	  router = express.Router(),
	  cloudinary = require("cloudinary"),
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

		//Retreives associated discount
		const loadedProducts = await Promise.all(
			foundProducts.map(async product => {
				const foundDiscount = await Discount.findOne({product: product._id});
				const foundReviews = await Review.find({product: product._id});
				
				//Includes discount details depending on if discount was found
				if(foundDiscount) {
					return {
						...product.toObject(), 
						ratings: foundReviews.map(review => review.ratings),
						discount: foundDiscount.percent,
						expireAt: foundDiscount.expireAt
					};
				} else {
					return {
						...product.toObject(), 
						ratings: foundReviews.map(review => review.ratings)
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

		//Adds discount to product if it exists
		if(foundDiscount) {
			res.json({
				...foundProduct.toObject(),
				ratings: foundReviews.map(review => review.ratings),
				discount: foundDiscount.percent,
				expireAt: foundDiscount.expireAt
			});
		} else {
			res.json({
				...foundProduct.toObject(), 
				ratings: foundReviews.map(review => review.ratings)
			});
		};
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

router.post("/", middleware.hasProductInfo, (req, res) => {
	try {
		//Uploads image to cloudinary and creates product
		cloudinary.v2.uploader.upload(req.body.image, {folder: process.env.CLOUDINARY_FOLDER}, async (err, result) => {
			const newProduct = await Product.create({
				title: req.body.title,
				description: req.body.description,
				//Price rounded to 2 decimal places
				price: Math.round(req.body.price * 100) / 100,
				variations: req.body.variations,
				image: {
					url: result.secure_url,
					publicId: result.public_id
				}
			});

			if(req.body.discount && req.body.discount !== "null") {
				await Discount.create({
					percent: Math.round(req.body.discount * 100) / 100,
					product: newProduct._id,
					expireAt: new Date(`${req.body.discountDate}T23:59:00Z`)
				});
			};

			res.json(newProduct);
		});
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

router.put("/:productId", middleware.hasProductId, middleware.hasProductInfo, async (req, res) => {
	try {
		const foundProduct = await Product.findById(req.params.productId);
		//Uploads image to cloudinary and updates product
		cloudinary.v2.uploader.upload(
			req.body.image, 
			{public_id: foundProduct.image.publicId, overwrite: true}, 
			async(err, result) => {
				const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, {
					title: req.body.title,
					description: req.body.description,
					price: Math.round(req.body.price * 100) / 100,
					variations: req.body.variations,
					"image.url": result.secure_url
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

				res.json(updatedProduct);
			}
		);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

router.delete("/:productId", middleware.isAdmin, middleware.hasProductId, async (req, res) => {
	try {
		const foundProduct = await Product.findById(req.params.productId);
		cloudinary.v2.uploader.destroy(foundProduct.image.publicId, async () => {
			//Pulls product from all users' carts
			await User.updateMany({"cart.product": {$in: req.params.productId}}, {
				$pull: {cart: {product: mongoose.Types.ObjectId(req.params.productId)}}
			});
			
			await Discount.findOneAndDelete({product: req.params.productId});
			await Review.deleteMany({product: req.params.productId});
			await Product.findByIdAndDelete(req.params.productId);
			res.json(req.params.productId);
		});
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

module.exports = router;