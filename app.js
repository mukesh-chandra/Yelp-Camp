var  express       =require("express"),
     app           =express(),
     bodyParser    =require("body-parser"),
     mongoose      =require("mongoose"),
     flash         =require("connect-flash"),
     passport      = require("passport"),
     LocalStrategy =require("passport-local"),
     methodOverride=require("method-override"),
     Campground    =require("./models/campgrounds"),
     Comment       =require("./models/comments"),
     User          =require("./models/user"),
     seedDB        =require("./seed");

var campgroundRoutes=require("./routes/campgrounds"),
    commentRoutes=require("./routes/comments"),
    indexRoutes   =require("./routes/index")
app.use(bodyParser.urlencoded({extended:true})); 
app.set("view engine","ejs");
app.use(express.static(__dirname +"/public"))

app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret:"Julie is the cutest dog",
    resave:false,
    saveUninitialized:false
}))
app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success")
    next();
})
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/",indexRoutes)

mongoose.Promise=global.Promise;

mongoose.connect(process.env.DATABASEURL,{useMongoClient:true});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("cAmP gRoUnD Server Started :)");
})
     
    
    
 