var express=require("express");
var router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var middleware=require("../middleware");
var geocoder=require("geocoder");

//index
router.get("/",function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        }else {
           res.render("campgrounds/index",{campgrounds:campgrounds,page:'campgrounds'}); 
        }
    });
});

//New
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//Show
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            //console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground}); }
    });
});

//Create
router.post("/",middleware.isLoggedIn , function(req,res){
    var name=req.body.name;
    var image= req.body.image;
    var desc = req.body.description;
    var price=req.body.price;
    var author={
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location,function(err,data){
        if(err){
            console.log(err);
            req.flash("error","something went wrong");
            res.redirect("back");
        } else {
        var lat=data.results[0].geometry.location.lat;
        var lng=data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
        
        Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    }); }
    });
});

//Edit Route
router.get("/:id/edit",middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit",{campground : foundCampground});
        }
    });
});

//Update Route
/*router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});*/

router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if(err){
            console.log(err);
            req.flash("error","something went wrong");
            res.redirect("back");
        } else{
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    }); }
  });
});

//Delete Route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports=router;
