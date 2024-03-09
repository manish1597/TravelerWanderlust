if(process.env.NODE_ENV !="production"){//means we use env file only in development phase
    require('dotenv').config(); 
}


const express =require("express");
const app=express();
const port=8080;
const mongoose = require("mongoose");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust" ;

//NOW WE DEPLOY OUR DATABASE ON ATLAS
const dbUrl=process.env.ATLASDB_URL;


// Session confuguration in production stage
const store=MongoStore.create({
    mongoUrl:dbUrl,//due to this session store on atlas
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});


store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

// Session configuration
const sessionOptions = {
    store,//above mongostore
    secret: process.env.SECRET,// secret used to sign the session id cookie
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 *24 *60 * 60 * 1000,
        maxAge:7 *24 *60 * 60 * 1000,
        httpOnly: true,
    },
};

//Requiring Routes 
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");







app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log("connected to DB");
 
})  
.catch(err => console.log(err));


// async function main() {
//   await mongoose.connect(MONGO_URL); 

 
// }


// Database connect to Atlas
async function  main() {
  await mongoose.connect(dbUrl); 

 
}



// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");

// });







// Use session and flash middlewares and use flash before /listings path 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//to intialize passport
app.use(passport.session());// in one session we want our user login only one time
passport.use(new LocalStrategy(User.authenticate()));


// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());//means store user info in the session
passport.deserializeUser(User.deserializeUser());//unstore user info in the session

// res.locals to store req and used in ejs
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");//because of res.locals we don't need to write in res.render we directly pass in ejs file
    res.locals.errorMsg=req.flash("error");   
    res.locals.currUser=req.user; //user info saved in req.user

    next();
})


// Demo User

// app.get("/demouser", async(req,res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });

//     let registerUser= await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// })


// all listing operations
// here /listings and /listings/:id/reviews is common part hence we write here
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


// page not found app.all match with all requests like get ,put, post etc

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
});


// Error Handling Middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"} =err;
    res.status(statusCode).render("./listings/error.ejs",{message});
    // res.status(statusCode).send(message);
    // res.send("Something went wrong");
})

app.listen(port,()=>{
    console.log(`server is listing to port ${port}`);
});

