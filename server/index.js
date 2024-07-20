import express from 'express'
import cron from 'node-cron'
const app=express();

//Routes import 
import AuthenticationRoutes from './routes/Auth.js'
import ManagementRoutes from './routes/Managing.js'
import {dbConnect} from './config/DatabaseConnection.js'
import { autoUpdate } from './controllers/Managing.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();

const PORT=process.env.PORT||4000;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads
app.use(cors({
    origin: ["http://localhost:3000","https://leetcode-analyzer.vercel.app"],
    credentials: true,  // Allow cookies and other credentials
}));
dbConnect();

cron.schedule('0 22 * * *', async () => {
    try {
        await autoUpdate(); // Call the function
        console.log('Auto update ran successfully at 10 PM');
    } catch (error) {
        console.error('Error running auto update:', error.message);
    }
});

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