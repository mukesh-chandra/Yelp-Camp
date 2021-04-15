var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");
var geocoder = require("geocoder");
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            req.flash("error","Something went wrong...please be patient");
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds,page:'campgrounds'})
        }
    })
      
        // res.render("campground",{campgrounds:campgrounds});
});
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var price = req.body.price;
 
  geocoder.geocode(req.body.location, function (err, data) {
        
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
   
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong")
        } else {
            //redirect back to campgrounds page
            
            req.flash("success","Successfully created New Campground")
            res.redirect("/campgrounds");
        }
    });
      
  });
});
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
})


router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
           }
        else{
           res.render("campgrounds/show",{campground:foundCampground});
        }
    })
})
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
         if(err){
            console.log(err)
        }
        else{
             res.render("campgrounds/edit",{foundCampground:foundCampground});
        }
       
    })
    
    
})
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
         
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds/" + campground._id);
        } else {
            
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
   
  });
});
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
          res.redirect("/campgrounds")
        }
        else{
          res.redirect("/campgrounds")
        }
    })
})



module.exports=router



