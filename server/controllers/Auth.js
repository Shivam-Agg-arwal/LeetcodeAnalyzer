import OTP from "../models/OTP.js";
import User from "../models/User.js";
import OtpGenerator from "otp-generator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

// Function to send OTP
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email not found",
            });
        }

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        // Generate OTP
        let otp;
        let existingOTP;
        do {
            otp = OtpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });
            existingOTP = await OTP.findOne({ otp });
        } while (existingOTP);

        // Create OTP entry
        const otpPayload = { email, otp };
        await OTP.create(otpPayload);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error("Error occurred while sending the OTP:", error);
        return res.status(500).json({
            success: false,
            message: "OTP sending failed",
        });
    }
};

// Function to sign in
export const signIn = async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        if (!email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: "Insufficient data",
            });
        }

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        // Get the latest OTP
        const otpEntry = await OTP.findOne({ email })
            .sort({ createdAt: -1 })
            .exec();
        if (!otpEntry) {
            return res.status(500).json({
                success: false,
                message: "No previously generated OTP found",
            });
        }

        // Check OTP expiry
        const duration = (Date.now() - otpEntry.createdAt.getTime()) / 1000; // Duration in seconds
        if (duration > 300) { // OTP expiry duration (e.g., 5 minutes)
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        // Validate OTP
        if (otpEntry.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Incorrect OTP",
            });
        }

        // Hash the password and create user profile
        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePayload = { email, password: hashedPassword };
        const userDetails=await User.create(profilePayload);

        return res.status(200).json({
            success: true,
            message: "Sign up successful",
            data:userDetails

        });
    } catch (error) {
        console.error("Sign up failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Sign up failed",
        });
    }
};

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(404).json({
                success: false,
                message: "Insufficient data"
            });
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(500).json({
                success: false,
                message: "User needs to register first "
            });
        }
        if(await bcrypt.compare(password,user.password)){
            const payload={
                id:user._id,
                email
            }

            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"24h"
            });
            user.token=token;
            user.password=undefined;

            const options={
                httpOnly:true,
            }
            //setting up cookie with token = token 
            res.cookie("token",token,options).status(200).json({
                success:true,
                user,
                token,
                message:"Login was successfull",
            })
        }
        else{
            return res.status(500).json({
                success: false,
                message: "Entered credentials are incorrect"
            });
        }


    }
    catch(error){
        console.log("Login failed",error.message);
        
    }
}
