const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  middleware = require("../middleware"),
	  Review = require("../models/Review");

router.get("/", async (req, res) => {
	try {
		const foundReviews = await Review.find({product: req.params.productId});
		res.json(foundReviews);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.post("/", async (req, res) => {
	try {
		const newReview = await Review.create({...req.body, product: req.params.productId});
		console.log(newReview)
		res.json(newReview);
	} catch(err) {
		res.status(500).json(err);
	};
});

module.exports = router;