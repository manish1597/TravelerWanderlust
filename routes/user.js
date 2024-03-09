const express =require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../controllers/user.js");



router.route("/signup")
// SingUp User
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));


router.route("/login")
// Login user Authentication 
.get(userController.renderLoginForm)
.post( 
  saveRedirectUrl,
  passport.authenticate('local', 
  { failureRedirect: '/login',
  failureFlash:true }), //failureRedirect means if middleware fail it redirect to 
//   if middleware successfulluy work then only it move forward
  userController.login);


 router.get("/logout",userController.logOut); 
 


module.exports=router;
