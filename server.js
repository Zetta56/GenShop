require("dotenv").config();

//Packages
const express = require("express"),
	  app = express(),
	  http = require("http").createServer(app),
	  path = require("path"),
	  cors = require("cors"),
	  mongoose = require("mongoose"),
	  bodyParser = require("body-parser"),
	  cookieParser = require("cookie-parser"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  JwtStrategy = require("passport-jwt").Strategy;

//Models
const User = require("./models/User");

//Routes
const indexRoutes = require("./routes/index");
const productRoutes = require("./routes/products");
const reviewRoutes = require("./routes/reviews");

//DB Config
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/genshop", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useFindAndModify", false);
mongoose.set('useCreateIndex', true);

//App Config
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("client/build"));

//Authentication Config
app.use(passport.initialize());
passport.use(new JwtStrategy({
	jwtFromRequest: (req) => {
		let token = null;
		if(req && req.cookies) {
			token = req.cookies["access_token"];
		};
		return token;
	},
	secretOrKey: process.env.ACCESS_KEY
}, (payload, done) => {
    User.findOne({_id: payload.sub}, (err, user) => {
        if(err) {
            return done(err, false);
        };
        if(!user) {
        	return done(null, false);
        };
        return done(null, user);
    });
}));
passport.use(new LocalStrategy(User.authenticate()));
app.use((req, res, next) => {
	passport.authenticate("jwt", (err, user) => {
		req.user = user;
		next();
	})(req, res);
});

//Run Routes
app.use("/api", indexRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/:productId/reviews", reviewRoutes);
app.use((req, res) => {
	res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//Start Server
http.listen(process.env.PORT || 3001, () => {
	console.log("Server Started");
});