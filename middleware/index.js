const passport = require("passport"),
	  mongoose = require("mongoose");

const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
	if(!req.user) {
		return res.status(401).json({message: "You must be logged in to do that.", redirect: "/login"});
	};
	next();
};

middleware.isNotLoggedIn = (req, res, next) => {
	if(req.user) {
		return res.status(403).json({message: "You are already logged in."});
	};
	next();
};

// middleware.setAuthorized = async (req, res, next) => {
// 	if(!req.user) {
// 		return res.status(401).json({message: "You must be logged in to do that.", redirect: "/login"});
// 	};
// 	if(!mongoose.Types.ObjectId.isValid(req.params.setId)) {
// 		return res.status(404).json({message: "Set does not exist."});
// 	};
// 	const foundSet = await Set.findById(req.params.setId);
// 	if(!foundSet) {
// 		return res.status(404).json({message: "Set does not exist."});
// 	};
// 	if(!foundSet.creator.equals(req.user._id)) {
// 		return res.status(403).json({message: "You do not have permission to do that."});
// 	};
// 	next();
// };

// middleware.cardAuthorized = async(req, res, next) => {
// 	if(!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
// 		return res.status(404).json({message: "Card does not exist.", redirect: `/sets/${req.params.setId}`});
// 	};
// 	const foundCard = await Card.findById(req.params.cardId);
// 	if(!foundCard) {
// 		return res.status(404).json({message: "Card does not exist.", redirect: `/sets/${req.params.setId}`});
// 	};
// 	next();
// };

module.exports = middleware;