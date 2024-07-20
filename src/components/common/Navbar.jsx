import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from '../../images/logo.png'
import Loader from "./Loader";
import { managementEndpoints } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { VscRefresh } from "react-icons/vsc";
import { setUser } from "../../slices/profileSlice";
import toast from "react-hot-toast";

const Navbar = () => {
    const [loading,setLoading]=useState(false);

    const {FETCH_DATA_API}=managementEndpoints;
    const {token}=useSelector((state)=>state.profile);
    const dispatch=useDispatch();

    const refreshData=async()=>{
        setLoading(true);
        try{
            const response=await axios.post(FETCH_DATA_API,{token},{
                headers:{
                    "Content-type":"application/json"
                }
            })
            console.log(response);
            const result=response.data;
            if(!result.success){
                throw new Error("Error occured while refreshng the page");
            }

            dispatch(setUser(result.data))
            toast.success("Data updated")
        }catch(error){
            console.log("Error occured while refershing the data ",error.message)
        }
        finally{
            setLoading(false);
        }
    }
	const navigate=useNavigate();
    return (
        <div className="h-[60px] border-b-[1px] border-black flex flex-row justify-between items-center bg-[#b7d9f0]">
            <div className="w-10/12 mx-auto my-2 flex flex-row justify-between items-center">
                <div className="flex items-center justify-center w-[200px]"><img src={logo}/></div>
                <div className="flex flex-row gap-10">
                    <div onClick={()=>{navigate('/stats')}} className="cursor-pointer hover:scale-95 font-semibold">Analysis</div>
                    <div onClick={()=>{navigate('/manage')}} className="cursor-pointer hover:scale-95 font-semibold">Manage</div>
                </div>
                <div className="flex flex-row items-center gap-4">
                <button onClick={()=>{refreshData()}} disabled={loading} className="font-bold">
                    {loading?<Loader/>:<VscRefresh/>}
                </button>
                <FaSignOutAlt className="text-lg hover:scale-95 cursor-pointer"/>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
