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

OTPSchema.pre('save', async function (next) {
    try {
        // Only send email if it's a new OTP
        if (this.isNew) {
            const emailContent = `
                <p>You have requested an OTP for verification. Please use the following OTP to complete the verification process:</p>
                <p style="font-size: 20px; font-weight: bold; color: #007aff; background-color: #f0f8ff; padding: 10px; border-radius: 5px;">
                    ${this.otp}
                </p>
                <p>This OTP is valid for a limited time only. If you did not request this OTP, please ignore this email.</p>
                <p>If you have any questions or need further assistance, please reply to this email. We are here to help.</p>
                <br>
                <p>Best regards,</p>
                <p>Shivam Aggarwal</p>
                <p>LeetCode Analyzer</p>
            `;

            await mailSender(this.email, "OTP for Verification - LeetCode Analyzer", emailContent);
            console.log("Mail sent successfully");
        }
    } catch (error) {
        console.log("Error while sending the mail for OTP:", error.message);
    }
    next();
});


export default mongoose.model("OTP", OTPSchema);
