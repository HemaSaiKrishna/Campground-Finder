var express= require("express");
var router=express.Router({mergeParams: true});
var User=require("../models/user");
var passport=require("passport");


//Root Directory
router.get("/",function(req,res){
    res.render("home");
});


//===========
//AUTH Routes

router.get("/register",function(req,res){
    res.render("register",{page:'render'});
});

router.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
           req.flash("success","Welcome to Campground Finder "+user.username);
           res.redirect("/campgrounds");
        });
    });
});

router.get("/login",function(req,res){
    res.render("login",{page: 'login'});
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Successfully logged out.");
    res.redirect("/campgrounds");
});

module.exports=router;