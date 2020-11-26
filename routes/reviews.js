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
		const newReview = await Review.create({
			...req.body, 
			product: req.params.productId,
			user: {id: req.user._id, username: req.user.username}
		});
		res.json(newReview);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	};
});

router.put("/:reviewId", async (req, res) => {
	try {
		const updatedReview = await Review.findByIdAndUpdate(req.params.reviewId, {...req.body}, {new: true});
		res.json(updatedReview);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.delete("/:reviewId", async (req, res) => {
	try {
		await Review.findByIdAndDelete(req.params.reviewId);
		res.json(req.params.reviewId);
	} catch(err) {
		res.status(500).json(err);
	};
});

module.exports = router;