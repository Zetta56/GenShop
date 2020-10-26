const express = require("express"),
	  router = express.Router(),
	  Product = require("../models/Product");

router.get("/", async (req, res) => {
	try {
		const foundProducts = await Product.find();
		res.json(foundProducts);
	} catch(err) {
		res.status(500).json(err);
	};
})

router.post("/", async (req, res) => {
	try {
		const newProduct = await Product.create({...req.body, seller: req.user._id});
		res.json(newProduct);
	} catch(err) {
		res.status(500).json(err);
	};
});

module.exports = router;