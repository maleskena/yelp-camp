var express        = require("express"),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    flash          = require('connect-flash'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local'),
    methodOverride = require('method-override');
    Campground     = require('./models/campgrounds'),
    Comment        = require("./models/comment"),
    User           = require('./models/user'),
    seedDB         = require("./seed"),
    app            = express();

//routes
var indexRoutes      = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //to avoid .ejs at the end of the file
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB(); uncomment this to reemove all campgrounds or change database

//passport configuration
app.use(require("express-session")({
    secret: "you spoiled it",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(userInfo); //a middleware function call in every request
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set routes
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(commentRoutes);


//aux functions
function userInfo(req, res, next){
    res.locals.currentUser = req.user; //set user info to be used next
    res.locals.error = req.flash('error'); // send message to every page
    res.locals.success = req.flash('sucess');
    next();
}

//starts server
app.listen("3001", function(){
        console.log("YelpCamp served stated at port 3001");
    });