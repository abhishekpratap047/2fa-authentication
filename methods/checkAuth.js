module.exports = function(req,res,next){
    if(req.session.is_logged_in){
        if(req.session.isActive){
            console.log("Active",req.session.isActive);
             next();
        }else{
            res.render("notVerified");
        }
       
    }
    else{
        res.redirect("/login");
    }
}