var mongoose=require("mongoose"),
    Campground=require("./models/campgrounds"),
    Comment=require("./models/comments");
  
var data=[
    {
        name:"Salmon Creek",
        image:"https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description:"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
    },
    {
        name:"Granite Hill",
        image:"https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg",
        description:"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
    },
    {
        name:"Mountain Goats Rest",
        image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg",
        description:"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
    }
    
    ]
function seedDB(){
    Campground.remove({},function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("all campground removed !!!")
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("added campground");
                    Comment.create({
                        text:"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old",
                        author:"MARK ZUKKERBURG"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        }
                        else{
                            campground.comments.push(comment);
                            console.log("comment added")
                            campground.save();
                        }
                    })
                }
            })
        })
    }
})
}
module.exports=seedDB
