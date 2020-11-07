const express = require("express"),
	  router = express.Router(),
	  path = require("path"),
	  fs = require("fs"),
	  middleware = require("../middleware"),
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

router.post("/", middleware.upload.single("image"), async (req, res) => {
	try {
		//Price rounded to 2 decimal places + Image read from local file
		const product = {
			title: req.body.title,
			price: parseFloat(req.body.price).toFixed(2),
			image: {
				data: fs.readFileSync(path.join(__dirname + "/../uploads/" + req.file.filename)),
				contentType: req.file.mimetype
			},
			seller: req.user._id
		};
		const newProduct = await Product.create(product);

		//Cleans uploads folder
		fs.unlink(req.file.path, (err) => {
			if(err) {
				res.status(500).json(err);
			};
			res.json(newProduct);
		});
	} catch(err) {
		console.log(err)
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