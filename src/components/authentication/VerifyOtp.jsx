import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { authenticationEndpoints } from "../../api";
import axios from "axios";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const { signUpData } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);

    const { SIGNUP_API, SEND_OTP_API } = authenticationEndpoints;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                SIGNUP_API,
                {
                    email: signUpData.email,
                    password: signUpData.password,
                    otp: otp,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = response.data;

            if (result.success) {
                navigate("/login");
                toast.success("Verified");
            } else {
                toast.error("Verification failed");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            toast.error("Signup failed");
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const { email } = signUpData; // Assuming signupData is accessible here
            const response = await axios.post(SEND_OTP_API, { email }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                toast.success("OTP resent successfully");
            } else {
                toast.error("Failed to resend OTP");
            }
        } catch (error) {
            console.error("Error occurred while resending OTP:", error);
            toast.error("Failed to resend OTP");
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full bg-bgWhite text-black bg-[#e9edf0]">
            <div className="flex flex-col bg-white rounded-lg p-5 gap-2">
                <h2 className="text-xl font-semibold">Verify Email</h2>
                <div className="mx-auto w-11/12 mt-8 ">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold">
                            The verification code has been sent to you. Enter
                            the code below
                        </p>
                    </div>

                    <div className="text-lg flex space-x-8 mt-5">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span className="mx-1">-</span>}
                            renderInput={(props) => <input {...props} />}
                            id="otpstyle"
                            inputStyle="inputStyle"
                        />
                    </div>
                    <div>
                        <p className="text-xs mt-3">
                            Didn't receive the OTP?{" "}
                            <button onClick={handleResendOTP}>
                                <span className="font-bold hover:text-theme">
                                    Resend OTP
                                </span>
                            </button>
                        </p>
                    </div>

                    <div className="flex justify-end my-5">
                        <button
                            onClick={handleSubmit}
                            className={`text-white bg-[#007aff] px-6 py-2 rounded-md hover:scale-95 transition-all duration-200 opacity-85 w-fit font-semibold ${loading ? "opacity-70" : "opacity-100"}`}
                            disabled={loading}
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
