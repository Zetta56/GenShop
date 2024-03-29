const express = require("express"),
	  router = express.Router(),
	  stripe = require("stripe")(process.env.STRIPE_SECRET),
	  passport = require("passport"),
	  jwt = require("jsonwebtoken"),
	  OAuth2Client = require("google-auth-library").OAuth2Client,
	  middleware = require("../middleware"),
	  User = require("../models/User"),
	  Token = require("../models/Token"),
	  Discount = require("../models/Discount");

router.post("/register", (req, res) => {
	const user = {email: req.body.email, username: req.body.username};
	User.register(user, req.body.password, (err, newUser) => {
		if(err) {
			res.status(409).json(err);
		};

		res.json(newUser);
	});
});

router.post("/login", async (req, res) => {
	//Handles page reload with jwt
	if(req.user) {
		const foundUser = await User.findById(req.user._id);
		return res.json(foundUser);
	};

	let currentUser = null;
	//Uses custom authenticate function for better error handling
	passport.authenticate("local", async(err, user) => {
		//Google OAuth2
		if(process.env.GOOGLE_CLIENTID && req.body.googleToken) {
			try {
				//Verifies that google token is valid
				const ticket = await new OAuth2Client(process.env.GOOGLE_CLIENTID).verifyIdToken({
					idToken: req.body.googleToken,
					audience: process.env.GOOGLE_CLIENTID
				});
				//Finds user by google id
				const googleUser = await User.findOne({googleId: ticket.getPayload().sub});
				currentUser = googleUser 
					? googleUser
					: await User.create({username: ticket.getPayload().name, googleId: ticket.getPayload().sub});
			} catch(err) {
				return res.status(500).json(err);
			};
		//Local Auth
		} else if(err) {
			return res.status(500).json(err);
		} else if(!user) {
			return res.status(401).json({message: "Username or password is incorrect"});
		} else {
			await req.logIn(user, {session: false});
			currentUser = user;
		};

		//Creates JWT
		const refreshToken = jwt.sign({sub: currentUser._id}, process.env.REFRESH_KEY, {expiresIn: "3 days"});
		const accessToken = jwt.sign({sub: currentUser._id}, process.env.ACCESS_KEY, {expiresIn: "15min"});
		await Token.create({token: refreshToken, userId: currentUser._id});
		
		//Sends Cookies
		res.cookie("refresh_token", refreshToken, {httpOnly: true, sameSite: "none", secure: true});
		res.cookie("access_token", accessToken, {httpOnly: true, sameSite: "none", secure: true});
		
		//Sends necessary user info
		const foundUser = await User.findById(currentUser._id);
		res.json(foundUser);
	})(req, res);
});

router.get("/logout", (req, res) => {
	//Clears JWT cookies with same options
	res.clearCookie("access_token", {httpOnly: true, sameSite: "none", secure: true, path: "/"});
	res.clearCookie("refresh_token", {httpOnly: true, sameSite: "none", secure: true, path: "/"});
	res.json(true);
});

router.get("/access", (req, res) => {
	res.json(req.user);
});

router.post("/refresh", (req, res) => {
	//Checks if refresh token exists
	if(!req.cookies["refresh_token"]) {
		return res.json(false);
	};
	Token.findOne({token: req.cookies["refresh_token"]}, (err, refreshToken) => {
		//Checks if refresh token matches DB refresh token
		if(!refreshToken) {
			return res.json(false);
		};
		//Checks if refresh token is valid
		jwt.verify(refreshToken.token, process.env.REFRESH_KEY, (err, token) => {
			if(err) {
				return res.status(500).json(err);
			};
			//Re-creates access token
			const accessToken = jwt.sign({sub: token.sub}, process.env.ACCESS_KEY, {expiresIn: "15min"});
			res.cookie("access_token", accessToken, {httpOnly: true, sameSite: true});
			res.json(token.sub);
		});
	});
});

//Stripe Logic
router.post("/checkout", middleware.isLoggedIn, async (req, res) => {
	try {
		const foundUser = await User.findById(req.user._id).populate({path: "cart", populate: {path: "product"}});
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: await Promise.all(foundUser.cart.map(populateLineItem)),
			mode: "payment",
			success_url: `${process.env.FRONTEND_URL}/checkout?success=true`,
			cancel_url: `${process.env.FRONTEND_URL}/checkout?cancel=true`
		})
		res.json(session.id);
	} catch(err) {
		console.log(err)
		res.status(500).json(err);
	}
});

const populateLineItem = async (item) => {
	const productName = item.variation && item.variation.length > 0
		? item.product.title + " (" + item.variation + ")"
		: item.product.title;
	const foundDiscount = await Discount.findOne({product: item.product._id});
	const discountPercent = foundDiscount ? foundDiscount.percent : 0;
	
	return {
		price_data: {
			currency: "usd",
			product_data: {
				name: productName,
				images: [item.product.image.url]
			},
			unit_amount_decimal: item.product.price * 100 - Math.round(item.product.price * discountPercent)
		},
		quantity: item.quantity
	}
}

module.exports = router;