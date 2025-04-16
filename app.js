if(process.env.Node_DEV != "Production"){
    require('dotenv').config()
}
console.log(process.env.CLOUD_NAME);
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;

// Routers
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const ExpressError = require("./utility/ExpressError.js");

const app = express();



// MongoDB Connection
async function main() {
    await mongoose.connect(dbUrl);
    console.log("Database connected successfully");
}
main().catch((err) => console.log(err));

// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//Mongo store
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secrete:process.env.SECRET
    },
    touchAfter : 24*3600,
});

store.on("error",()=>{
     console.log("error on mongo store",err);
})

// Session Configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Middleware
app.use((req, res, next) => {
    res.locals.msg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// Routes
app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// 404 Error Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// General Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render("error", { message });
});

// Start Server
app.listen(8080, () => {
    console.log("Server listening on port 8080");
});

// async function mode() {
//   await Listing.findByIdAndDelete('672cbbad96c925784ab5c06a')
//   .then((res)=>{
//     console.log(res);
//   }).catch((err)=>{
//     console.log(err);
//   })
// }

// mode();

// app.get("/testListing",(req,res)=>{
//    let sampleListing = new Listing({
//     titile:"My New Villa",
//     description : "By the beach",
//     price:1200,
//     location:"Calungute Goa",
//     country:"India"
//    });

//    sampleListing.save()
//    .then((res)=>{
//     console.log(res);
//    }).catch((err)=>{
//     console.log(err);
//    })

// res.send("successfully");
// })
