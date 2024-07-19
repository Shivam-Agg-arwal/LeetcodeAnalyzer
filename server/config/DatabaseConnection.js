import mongoose from "mongoose";

export const dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{console.log("Database connection was successfull")})
    .catch((error)=>{console.log("Database connection was unsuccesfull",error.message)})
}