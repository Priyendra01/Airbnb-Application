const User = require("../models/user.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup = async(req,res,next)=>{
    try{
        let {username , email , password} = req.body;
        let newUSer =  new User({username,email});
       let result = await User.register(newUSer,password);
       console.log(result);
       req.login(result,async(err)=>{
         if(err){
             next(err);
         }
         req.flash("success","Welcome to wanderlust");
       res.redirect("/listings");
        
       });
      
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  

}

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
}

module,exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    res.redirect("/listings");
  
 
 }

 module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    })
}