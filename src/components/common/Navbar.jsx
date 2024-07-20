import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../../images/logo.png';
import Loader from "./Loader";
import { managementEndpoints } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { VscRefresh } from "react-icons/vsc";
import { setUser, setToken } from "../../slices/profileSlice";
import toast from "react-hot-toast";

const Navbar = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { FETCH_DATA_API } = managementEndpoints;
    const { token, user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const location = useLocation();

    const logout = () => {
        dispatch(setUser(null));
        dispatch(setToken(null));
        localStorage.clear();
        toast.success("Logout successful");
        navigate('/login');
    };

    const refreshData = async () => {
        setLoading(true);
        try {
            const response = await axios.post(FETCH_DATA_API, { token }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const result = response.data;
            if (!result.success) {
                throw new Error("Error occurred while refreshing the page");
            }

            dispatch(setUser(result.data));
            toast.success("Data updated");
        } catch (error) {
            console.error("Error occurred while refreshing the data", error.message);
            toast.error("Error occurred while refreshing the data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="h-16 border-b border-gray-300 flex justify-between items-center bg-white px-4 sm:px-6 md:px-8 shadow-md">
            <div className="w-full flex justify-between items-center mx-auto">
                <div className="flex items-center justify-center w-36 sm:w-48">
                    <img src={logo} alt="Logo" className="w-full h-auto" />
                </div>
                <div className="flex flex-row gap-4 sm:gap-6">
                    <button
                        onClick={() => navigate('/stats')}
                        className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-200 transition-transform ${location.pathname === "/stats" ? "bg-gray-200 font-semibold" : "text-gray-700"} ${user.linkedto.length === 0 ? "opacity-60 cursor-not-allowed" : "opacity-100 cursor-pointer"}`}
                        disabled={user.linkedto.length === 0}
                        aria-label="Go to Analysis"
                    >
                        Analysis
                    </button>
                    <button
                        onClick={() => navigate('/manage')}
                        className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-200 transition-transform ${location.pathname === "/manage" ? "bg-gray-200 font-semibold" : "text-gray-700"}`}
                        aria-label="Go to Manage"
                    >
                        Manage
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={refreshData}
                        disabled={loading}
                        className="flex items-center p-2 rounded-md hover:bg-gray-200 transition-transform font-bold"
                        aria-label="Refresh Data"
                    >
                        {loading ? <Loader /> : <VscRefresh className="text-gray-700" />}
                    </button>
                    <button
                        onClick={logout}
                        className="text-lg hover:bg-gray-200 p-2 rounded-md transition-transform cursor-pointer"
                        aria-label="Logout"
                    >
                        <FaSignOutAlt className="text-gray-700" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
