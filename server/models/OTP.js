import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.js";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Corrected pre-save middleware
OTPSchema.pre('save', async function (next) {
    try {
        // Only send email if it's a new OTP
        if (this.isNew) {
            await mailSender(this.email, "OTP FOR VERIFICATION", this.otp.toString());
            console.log("Mail sent successfully");
        }
    } catch (error) {
        console.log("Error while sending the mail for OTP:", error.message);
    }
    next();
});

export default mongoose.model("OTP", OTPSchema);
