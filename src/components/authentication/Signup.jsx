import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authenticationEndpoints } from "../../api";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../slices/profileSlice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";
// import { FormData } from "node-fetch";

function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch, // Watch the form values
    } = useForm();


    const [loading,setLoading]=useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.profile);
    
    useEffect(() => {
        if (user) {
            navigate("/dashboard/profile");
        }
    }, [user, navigate]);

    const { SEND_OTP_API ,LOGIN_API,SIGNUP_API} = authenticationEndpoints;
    const password = watch("password"); // Watch the password field

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(SEND_OTP_API, {email: data.email}, {
                headers: {
                    'Content-Type': 'application/json', // Ensure this header is set
                }
            });
            const result=response.data;
            
            if (result.success) {
                toast.success("OTP sent successfully");
                dispatch(setSignupData(data));
                navigate("/verifyotp");
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error("Error sending OTP");
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div className="md:w-full md:h-screen flex justify-center items-center bg-[#e9edf0]">
            <div className="w-7/12 mx-auto bg-white rounded-lg shadow-lg flex flex-row justify-between py-12 pl-20 pr-14">
                {/* Left Side */}
                <div className="flex items-start justify-center w-1/2 h-full flex-col pr-4">
                    <h1 className="text-3xl font-bold mb-1 w-full text-left mx-3">
                        Sign up
                    </h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col w-full h-fit py-1 px-2 rounded-xl my-5 mx-2 gap-10"
                    >
                        <div className="flex flex-col gap-3 w-full">
                            <div className="w-full h-full flex flex-col gap-3">
                                <div className="flex flex-row gap-4 border-b-[2px] border-black items-center p-[1px] pb-0">
                                    <div className="flex flex-row items-center mt-1">
                                        <MdEmail />
                                    </div>
                                    <div className="w-full">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full outline-none h-10 placeholder:text-xs"
                                            id="email"
                                            {...register("email", {
                                                required: "Email is required.",
                                            })}
                                        />
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className="text-[#cc0000] text-xs">
                                        {errors.email.message}
                                    </p>
                                )}
                                <div className="flex flex-row gap-4 border-b-[2px] border-black items-center p-[1px] pb-0">
                                    <div className="flex flex-row items-center mt-1">
                                        <RiLockPasswordFill />
                                    </div>
                                    <div className="w-full">
                                        <input
                                            type="password"
                                            placeholder="Enter password"
                                            className="w-full outline-none h-10 placeholder:text-xs"
                                            id="password"
                                            {...register("password", {
                                                required: "Password is required.",
                                            })}
                                        />
                                    </div>
                                </div>
                                {errors.password && (
                                    <p className="text-[#cc0000] text-xs">
                                        {errors.password.message}
                                    </p>
                                )}
                                <div className="flex flex-row gap-4 border-b-[2px] border-black items-center p-[1px] pb-0">
                                    <div className="flex flex-row items-center mt-1">
                                        <RiLockPasswordLine />
                                    </div>
                                    <div className="w-full">
                                        <input
                                            type="password"
                                            placeholder="Confirm password"
                                            className="w-full outline-none h-10 placeholder:text-xs"
                                            id="confirmPassword"
                                            {...register("confirmPassword", {
                                                required: "Confirm password is required.",
                                                validate: value =>
                                                    value === password || "Passwords do not match",
                                            })}
                                        />
                                    </div>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-[#cc0000] text-xs">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`text-white bg-[#007aff] px-6 py-2 rounded-md hover:scale-95 transition-all duration-200 opacity-85 w-fit font-semibold ${loading?"opacity-70":"opacity-100"}`}
                            disabled={loading}
                        >
                            {loading?"Processing...":"Register"}
                        </button>
                    </form>
                </div>
                <div className="w-1/2 flex justify-center items-center bg-transparent pl-8">
                    <div className="w-full flex flex-col gap-8">
                        <img
                            src="https://theuniqueacademy.co.in/assets/images/test.png"
                            alt="signup-img"
                            className="md:h-full md:w-full"
                        />
                        <div className="hover:underline font-semibold flex flex-row justify-center items-center text-sm hover:scale-95">
                            <Link to="/login">I am already a User</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
