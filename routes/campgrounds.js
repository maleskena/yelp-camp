var express = require("express");
var router = express.Router();
var Campground = require('../models/campgrounds');

//  campgrounds routes
router.get('/', function (req, res) {
  //  retrive campground from database
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/index', {campgrounds: campgrounds})
    }
  })
})

router.get('/new', function(req, res){
    res.render('campgrounds/new');
});

router.get("/:id", function(req, res){
    //gets comments from id and attach it to foundCampground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

router.post("/", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var campground = {name: name, image: image, description: description};

    Campground.create(campground, function(err, campground){
        newCampgroundCreated(err, campground, res);
    });
});

//aux functions
function newCampgroundCreated(err, campground, res){
    if(err){
        console.log(err);
    } else{
        console.log("A new campground has been created");
        console.log(campground);
        res.redirect("/");
    }
}

module.exports = router;