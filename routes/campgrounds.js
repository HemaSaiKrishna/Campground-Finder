var express=require("express");
var router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var middleware=require("../middleware");

//index
router.get("/",function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        }else {
           res.render("campgrounds/index",{campgrounds:campgrounds}); 
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
    var newCampground= {name: name,price: price,image: image , description : desc, author: author};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
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
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
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
