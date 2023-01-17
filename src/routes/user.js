const express = require("express"),
	  router = express.Router(),
	  middleware = require("../middleware"),
	  User = require("../models/User");

router.put("/cart/:productId", middleware.isLoggedIn, async(req, res) => {
	try{
		const foundUser = await User.findById(req.user._id);
		const cartIndex = await foundUser.cart.findIndex(item => {
			return item.product.equals(req.params.productId)
		});
		
		if(cartIndex >= 0) {
			await foundUser.cart.splice(cartIndex, 1);
		} else {
			await foundUser.cart.push({
				product: req.params.productId, 
				quantity: req.body.quantity,
				variation: req.body.variation
			});
		}

		foundUser.save();
		res.json(foundUser);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	}
});

router.delete("/cart", middleware.isLoggedIn, async(req, res) => {
	try{
		const foundUser = await User.findById(req.user._id);

		foundUser.cart = [];
		foundUser.save();
		res.json(foundUser);
	} catch(err) {
		res.status(500).json(err);
	}
});

router.put("/watchlist/:productId", middleware.isLoggedIn, async(req, res) => {
	try{
		const foundUser = await User.findById(req.user._id);
		const watchlistIndex = await foundUser.watchlist.findIndex(item => {
			return item.equals(req.params.productId)
		});
		
		if(watchlistIndex >= 0) {
			await foundUser.watchlist.splice(watchlistIndex, 1);
		} else {
			await foundUser.watchlist.push(req.params.productId);
		}
		foundUser.save();

		res.json(foundUser);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	}
});

router.delete("/watchlist", middleware.isLoggedIn, async(req, res) => {
	try{
		const foundUser = await User.findById(req.user._id);

		foundUser.watchlist = [];
		foundUser.save();

		res.json(foundUser);
	} catch(err) {
		res.status(500).json(err);
	}
});

module.exports = router;