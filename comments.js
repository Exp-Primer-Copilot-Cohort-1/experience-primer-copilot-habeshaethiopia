// Create web server
// 1. npm init
// 2. npm install express
// 3. npm install nodemon
// 4. npm install body-parser
// 5. npm install ejs
// 6. npm install mongoose
// 7. npm install method-override
// 8. npm install express-sanitizer
// 9. npm install passport
// 10. npm install passport-local
// 11. npm install passport-local-mongoose

// Require packages
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

// Require models
var Blog = require("./models/blog");
var Comment = require("./models/comment");
var User = require("./models/user");

// Require routes
var indexRoutes = require("./routes/index");
var blogRoutes = require("./routes/blog");
var commentRoutes = require("./routes/comment");

// Connect to database
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});

// Use packages
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "This is a secret message",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);

// Set view engine
app.set("view engine", "ejs");

// Set passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set user info to all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// Run web server
app.listen(3000, function() {
    console.log("Blog app server started");
});