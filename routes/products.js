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
		const encodedProducts = foundProducts.map(product => {
			//Takes object version of product and converts image from binary buffer to base64 string
			return {...product.toObject(), image: Buffer.from(product.image.data.buffer, "binary").toString("base64")};
		});
		
		res.json(encodedProducts);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.get("/:productId", async (req, res) => {
	try {
		const foundProduct = await Product.findById(req.params.productId);

		res.json({
			...foundProduct.toObject(), 
			image: Buffer.from(foundProduct.image.data.buffer, "binary").toString("base64")
		});
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

		//Cleans temp file
		fs.unlink(req.file.path, (err) => {
			if(err) {
				res.status(500).json(err);
			};
			res.json(newProduct);
		});
	} catch(err) {
		res.status(500).json(err);
	};
});

router.put("/:productId", middleware.upload.single("image"), async (req, res) => {
	try {
		const product = {
			title: req.body.title,
			price: parseFloat(req.body.price).toFixed(2),
			image: {
				data: fs.readFileSync(path.join(__dirname + "/../uploads/" + req.file.filename)),
				contentType: req.file.mimetype
			}
		};
		const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, product, {new: true});
		
		fs.unlink(req.file.path, (err) => {
			if(err) {
				res.status(500).json(err);
			};
			res.json(updatedProduct);
		});
	} catch(err) {
		console.log(err)
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