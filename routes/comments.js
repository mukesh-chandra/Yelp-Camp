var express=require("express"),
    router=express.Router({mergeParams:true});
var Campground=require("../models/campgrounds"),
    Comment   =require("../models/comments");
    var middleware=require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req, res) {
Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
       }
       else{
           res.render("comments/new",{campground:campground});
       }
   })
  
})
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }
        else{
            
           Comment.create(req.body.comment,function(err,newComment){
               if(err){
                   console.log(err);
                   req.flash("error","Something went wrong")
               }
               else{
                   newComment.author.id=req.user._id;
                   newComment.author.username=req.user.username;
                   newComment.save()
                   campground.comments.push(newComment);
                   campground.save();
                   req.flash("success","Successfully added comment")
                   res.redirect("/campgrounds/"+campground._id);
               }
           })
        }
    })
    
})
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
  Comment.findById(req.params.comment_id,function(err, foundComment) {
      if(err){
          console.log(err)
      }
      else{
          
          res.render("comments/edit",{campground_id:req.params.id,comment:foundComment})
      }
  })
})
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
        if(err){
            console.log(err)
            req.flash("error","Something went wrong")
        }
        else{
            req.flash("success","Comment Successfully Updated")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
     if(err){
         console.log(err)
         
     }
     else{
         req.flash("success","Comment Successfully Deleted")
         res.redirect("/campgrounds/"+req.params.id);
     }
    })
})

  
module.exports=router;
