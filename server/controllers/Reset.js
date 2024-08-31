import User from "../models/User.js";
import { mailSender } from "../utils/mailSender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Reset Password Token
export const resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Received reset request for email:", email);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User is not registered. Please sign up to reset the password.",
                toastMessage:
                    "Email is not registered. Please head over to the signup page.",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                token,
                expirationTime: Date.now() + 5 * 60 * 1000, // 5 minutes
            },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;
        const emailContent = `
    <p>We received a request to reset your password associated with your account. To proceed, please click the link below:</p>
    <p><a href="${url}">Reset Your Password</a></p>
    <p>This link will expire in 5 minutes, so we encourage you to reset your password promptly. If you did not request a password reset, please disregard this email. Your account security is important to us.</p>
    <p>If you have any questions or need further assistance, feel free to reply to this email. We're here to help.</p>
    <br>
    <p>Best regards,</p>
    <p>Shivam Aggarwal</p>
    <p>LeetCode Analyzer</p>
`;

        await mailSender(
            email,
            "Reset Your Password - LeetCode Analyzer",
            emailContent
        );
        console.log("Reset email sent successfully.");

        return res.status(200).json({
            success: true,
            message: "Reset password link sent successfully.",
            toastMessage: "Reset link sent to your email.",
            updatedUser,
        });
    } catch (error) {
        console.error("Error during token generation:", error);
        return res.status(500).json({
            success: false,
            message: "Error generating reset password token.",
            toastMessage: "Technical error!",
        });
    }
};
// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        console.log("Password reset attempt:", password, confirmPassword);

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match.",
                toastMessage: "Passwords do not match.",
            });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid token or user does not exist.",
                toastMessage: "Reset link has expired.",
            });
        }

        if (user.expirationTime < Date.now()) {
            return res.status(410).json({
                success: false,
                message: "Reset link has expired.",
                toastMessage: "Reset link has expired.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { token },
            {
                password: hashedPassword,
                token: null,
                expirationTime: null,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
            toastMessage: "Password reset successfully.",
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating password.",
            toastMessage: "Technical error!",
        });
    }
};
