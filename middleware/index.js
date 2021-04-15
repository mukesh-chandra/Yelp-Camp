 var Campground    =require("../models/campgrounds");
 var Comment    =require("../models/comments");
var middlewareObj={}
middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err)
            req.flash("error","Campground Not Found")
           
        }
        else{
            if(foundCampground.author.id.equals(req.user._id)){
                next();
                // res.render("campgrounds/edit",{foundCampground:foundCampground});
            }
            else{
                req.flash("error","You dont have permission to do that!!!")
            }
           }
    }) 
    }
    else{
       req.flash("error","You need to be logged in to do that !!!")
    }
}
middlewareObj.checkCommentOwnership=function(req,res,next){
   
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log(err);
             req.flash("error","Comment Not Found");
           
        }
        else{
            if(foundComment.author.id.equals(req.user._id)){
                next();
               
            }
            else{
              
                 req.flash("error","You dont have permission to do that!!!")
            }
           }
    }) 
    }
    else{
          req.flash("error","You need to be logged in to do that !!!")
    }

    
}
middlewareObj.isLoggedIn=function(req,res,next){

    if(req.isAuthenticated()){
       return next()
    }
    req.flash("error","You need to be logged in to do that !!!")
    res.redirect("/login")
  }

module.exports=middlewareObj



