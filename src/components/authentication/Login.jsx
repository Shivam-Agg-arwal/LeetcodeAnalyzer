import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios"; // Import Axios
import { authenticationEndpoints } from "../../api";
import { setToken } from "../../slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../slices/profileSlice";
import toast from "react-hot-toast";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import login from "../../images/Login.jpg";

export const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const { user } = useSelector((state) => state.profile);

    useEffect(() => {
        if (user) {
            navigate("/stats");
        }
    }, []);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const { LOGIN_API } = authenticationEndpoints;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(
                LOGIN_API,
                { email: data.username, password: data.password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                dispatch(setToken(response.data.token));
                dispatch(setUser(response.data.user));
                localStorage.setItem(
                    "Leetcode_analyser_token",
                    JSON.stringify(response.data.token)
                );
                localStorage.setItem(
                    "Leetcode_analyser_user",
                    JSON.stringify(response.data.user)
                );
                navigate("/manage");
            }
        } catch (error) {
            toast.error("Login failed");
        }
        setLoading(false);
    };

    return (
        <>
            <div className="min-h-screen flex justify-center items-center bg-[#e9edf0] text-black">
                <div className="lg:w-7/12 md:w-9/12 w-10/12 mx-auto bg-white rounded-lg shadow-lg flex flex-row justify-between py-12 lg:pl-16 lg:pr-14 px-5 items-center">
                    {/* Left Side */}
                    <div className="flex items-start  justify-center  w-full  md:w-1/2 h-full flex-col pr-4 ">
                        <h1 className="text-3xl font-bold mb-4 w-full text-left mx-3 ">
                            Login
                        </h1>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-full"
                        >
                            <div className="flex flex-col mb-10 justify-center pt-14 pb-6 px-2 gap-8">
                                <div className="flex flex-row gap-4 border-b-[2px] border-black items-center p-[1px] pb-0 ">
                                    <div className="flex flex-row items-center mt-1">
                                        <IoPerson />
                                    </div>
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="Your Registered Email"
                                            className="w-full outline-none h-10  placeholder:text-xs"
                                            {...register("username", {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="-mt-6">
                                    {errors.username && (
                                        <p className="text-[#cc0000] text-xs">
                                            Username is required.
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-row gap-4 border-b-[2px] border-black items-center p-[1px] pb-0 ">
                                    <div className="flex flex-row items-center mt-1">
                                        <RiLockPasswordLine />
                                    </div>
                                    <div className="w-full">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Your Password"
                                            className="w-full outline-none h-10  placeholder:text-xs"
                                            {...register("password", {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="-mt-6">
                                    {errors.password && (
                                        <p className="text-[#cc0000] text-xs">
                                            Password is required.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-end items-center -mt-6 font-semibold">
                                        <p className=" hover:scale-95 transition-all duration-200  text-blue text-xs">
                                            <Link to="/forgotpassword">
                                                Forgot Password ?
                                            </Link>
                                        </p>
                                    </div>
                                        <div className="md:hidden hover:underline font-semibold flex flex-row justify-end items-end text-xs hover:scale-95">
                                            <Link to="/signup">
                                                Not Registered ?{" "}
                                            </Link>
                                        </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`text-white bg-[#007aff] px-6 py-2 rounded-md hover:scale-95 transition-all duration-200 opacity-85 w-fit font-semibold ${
                                    loading ? "opacity-70" : "opacity-100"
                                }`}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Login"}
                            </button>
                        </form>
                    </div>
                    <div className="md:w-1/2 hidden md:flex justify-center items-center bg-transaparent pl-8">
                        <div className="w-full flex flex-col gap-8">
                            <img src={login} alt="login-img" className="" />
                            <div className="hover:underline font-semibold flex flex-row justify-center items-center text-sm hover:scale-95">
                                <Link to="/signup">Not Registered ? </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
