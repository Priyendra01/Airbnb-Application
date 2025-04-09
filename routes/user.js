const express = require("express");
const User = require("../models/user.js");
const wrapAsync = require("../utility/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const usercontroller = require("../controller/user.js");

router.route("/signup")
.get(usercontroller.renderSignupForm)
.post(wrapAsync(usercontroller.signup));

router.route("/login")
.get(usercontroller.renderLoginForm)
.post(passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),wrapAsync(usercontroller.login));


router.get("/logout",usercontroller.logout);


module.exports = router;