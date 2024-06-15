const express= require("express");
const app =express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");

const reviewRouter=require("./route/review.js");
const userRouter=require("./route/user.js");
const listingRouter=require("./route/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy =require("passport-local");
const User=require("./models/user.js");

main().then(()=>{
    console.log("connection established");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//when api made from get request send get request to another api
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7 * 24 *60 * 60 * 1000,
        maxAge:7 * 24 *60 * 60 * 1000,
        httpOnly: true,
    }
}
app.get("/",(req,res)=>{
    res.send("HI,i am root");
});
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})
app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student",
    });
    let registeredUser =await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"some error"));
});


app.use((err,req,res,next)=>{
    console.log(err.message);
    let {statusCode=500,message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{err});
// res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});
