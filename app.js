var express= require("express"),
    app=express(),
    bodyparser= require("body-parser"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    localStrategy=require("passport-local"),
    Campground=require("./models/campground"),
    Comment=require("./models/comment"),
    User=require("./models/user"),
    seedDB=require("./seeds"),
    flash=require("connect-flash"),
    methodOverride=require("method-override"),
    geocoder=require("geocoder");
    
var campgroundRoutes=require("./routes/campgrounds");
var commentRoutes=require("./routes/comments");
var indexRoutes=require("./routes/index");

app.locals.moment=require("moment");
    
//App Config
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://hsk:password@ds117913.mlab.com:17913/yelp_camp");
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport config
app.use(require("express-session")({
    secret:"hsk",
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDB();  //Seed DB is commented out


app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//Routes
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Started!!");
});