import express from 'express'
const app=express();

//Routes import 
import AuthenticationRoutes from './routes/Auth.js'
import ManagementRoutes from './routes/Managing.js'
import {dbConnect} from './config/DatabaseConnection.js'

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();

const PORT=process.env.PORT||4000;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads
app.use(cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow all necessary HTTP methods
    credentials: true,  // Allow cookies and other credentials
}));
dbConnect();

//Define the routes

app.use("/api/v1/authentication",AuthenticationRoutes);
app.use("/api/v1/management",ManagementRoutes);

app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:"App running succesfully"
    })
})

app.listen((PORT),()=>{
    console.log(`App is running successfully on port = ${PORT}`)
})
