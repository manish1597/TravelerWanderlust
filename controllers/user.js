const User=require("../models/user");


module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signUp=async(req,res)=>{

    try{
    let {username,email,password}= req.body;
    const newUser = new User({email, username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    // auto login after signUp
    req.login(registerUser, (err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Welcome to Wanderlust")
      res.redirect("/listings");
    } )



    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
 }

 module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req, res)=> {
    req.flash("success", "welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }


module.exports.logOut=(req,res)=>{
    // req.logOut always takes callback as a parameter means after logged out what work would be immedialtely done
    req.logOut((err)=>{// we take error as callback
      if(err){
        return next(err);
      }
      req.flash("success","you are logged out now!");
      res.redirect("/listings");
  
    })
   }  