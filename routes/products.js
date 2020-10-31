const express = require("express"),
	  router = express.Router(),
	  Product = require("../models/Product"),
	  User = require("../models/User");

router.get("/", async (req, res) => {
	try {
		const foundProducts = await Product.find();
		res.json(foundProducts);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.get("/:productId", async (req, res) => {
	try {
		const foundProduct = await Product.findById(req.params.productId);
		res.json(foundProduct);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.post("/", async (req, res) => {
	try {
		//Rounds price to 2 decimal places
		req.body.price = parseFloat(req.body.price).toFixed(2);
		const newProduct = await Product.create({...req.body, seller: req.user._id});
		res.json(newProduct);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.put("/:productId", async (req, res) => {
	try {
		req.body.price = parseFloat(req.body.price).toFixed(2);
		const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, {new: true});
		res.json(updatedProduct);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.delete("/:productId", async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.productId);
		res.json(req.params.productId);
	} catch(err) {
		res.status(500).json(err);
	};
});

module.exports = router;