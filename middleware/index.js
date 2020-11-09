const passport = require("passport"),
	  mongoose = require("mongoose"),
	  multer = require("multer"),
	  path = require("path");

const middleware = {};

//Stores temporary image in uploads
middleware.upload = multer({
	storage: multer.diskStorage({ 
	    destination: (req, file, cb) => {
	    	cb(null, "uploads")
	    }, 
	    filename: (req, file, cb) => {
	    	cb(null, file.fieldname + "-" + Date.now() + ".png")
	    }
	}),
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png/;
		const extension = path.extname(file.originalname).toLowerCase();
		const mimetype = file.mimetype;

		if(allowedTypes.test(extension) && allowedTypes.test(mimetype)) {
			return cb(null, true);
		} else {
			return cb("That is not an image file.");
		}
	},
	limit: {
		//Max: 5MB
		fileSize: 1024 * 1024 * 5
	}
});

middleware.isLoggedIn = (req, res, next) => {
	if(!req.user) {
		return res.status(401).json({message: "You must be logged in to do that.", redirect: "/login"});
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