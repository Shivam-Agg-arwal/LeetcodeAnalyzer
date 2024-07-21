import React, { useEffect, useState } from "react";
import { MdDelete, MdSupervisorAccount } from "react-icons/md";
import { managementEndpoints } from "../../api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../slices/profileSlice";
import toast from "react-hot-toast";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loader from "../common/Loader";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const ManagePage = () => {
    const [leetcodeId, setLeetcodeId] = useState("");
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState(null);
    const { token, user, lightMode } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const mapping = [
        "leetcode_count",
        "leetcode_hard",
        "leetcode_medium",
        "leetcode_easy",
    ];

    const [arr, setArr] = useState(user.linkedto);

    const sortArr = (index, order) => {
        const sortedArray = [...arr].sort((a, b) => {
            if (
                a.stats[a.stats.length - 1][mapping[index]] <
                b.stats[b.stats.length - 1][mapping[index]]
            ) {
                return order === "asc" ? -1 : 1;
            }
            if (
                a.stats[a.stats.length - 1][mapping[index]] >
                b.stats[b.stats.length - 1][mapping[index]]
            ) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
        console.log(sortedArray);
        setArr(sortedArray);
    };

    const { ADD_ID_API, REMOVE_ID_API } = managementEndpoints;

    const addLeetcodeId = async () => {
        setLoading(true);
        try {
            if (!leetcodeId) return;

            const response = await axios.post(
                ADD_ID_API,
                { token, leetcodeId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response);
            const result = response.data;
            if (!result.success) {
                throw new Error("Error occurred while adding the Leetcode ID");
            }

            dispatch(setUser(result.data));
            toast.success("Leetcode username added");
        } catch (error) {
            console.log(
                "Error occurred while adding the Leetcode ID",
                error.message
            );
            toast.error("Failed to add Leetcode ID");
        } finally {
            setLoading(false);
            setLeetcodeId("");
        }
    };

    useEffect(()=>{
        setArr(user.linkedto)
    },[user])

    const removeLeetcodeUsername = async (lId) => {
        setRemovingId(lId);
        try {
            const response = await axios.post(
                REMOVE_ID_API,
                { token, leetcodeId: lId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const result = response.data;
            if (!result.success) {
                throw new Error(
                    "Error occurred while removing the Leetcode ID"
                );
            }

            dispatch(setUser(result.data));
            toast.success("Leetcode username removed");
        } catch (error) {
            console.log("Error occurred while removing the ID", error.message);
            toast.error("Failed to remove Leetcode ID");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="flex flex-col items-center p-5 w-10/12 mx-auto">
            <div className="max-w-xl mb-6 mx-auto md:w-[500px] w-[80%] ">
                <div
                    className={`flex items-center justify-between border-b-2 ${
                        lightMode ? "border-black" : "border-white"
                    } pb-1 `}
                >
                    <div className="flex items-center gap-4">
                        <MdSupervisorAccount className="text-xl" />
                        <input
                            value={leetcodeId}
                            onChange={(e) => setLeetcodeId(e.target.value)}
                            type="text"
                            placeholder="Enter Leetcode username"
                            className="w-full outline-none h-10 placeholder:text-xs bg-transparent"
                        />
                    </div>
                    <button
                        className={`${
                            lightMode ? "text-black" : "text-white"
                        } text-xs rounded-md hover:scale-95 mr-3 transition-all duration-200 opacity-85 font-semibold ${
                            loading ? "opacity-70" : "opacity-100"
                        }`}
                        onClick={addLeetcodeId}
                        disabled={loading}
                    >
                        {loading ? "Adding" : "Add"}
                    </button>
                </div>
            </div>
            <div
                className={`w-full max-w-6xl ${
                    lightMode ? "bg-slate-50" : "bg-gray-300"
                }`}
            >
                {user.linkedto.length === 0 ? (
                    <div className="text-center py-10 text-gray-700 text-lg">
                        No Leetcode IDs linked yet. Add a Leetcode username to
                        start tracking your progress and unlock comprehensive
                        statistics.
                    </div>
                ) : (
                    <Table className="min-w-full border-collapse">
                        <Thead>
                            <Tr
                                className={`${
                                    lightMode
                                        ? "bg-gray-200"
                                        : "bg-gray-500 text-white"
                                }`}
                            >
                                <Th className="p-3 text-left">
                                    Leetcode Username
                                </Th>
                                <Th className="p-3 text-center ">
                                    <div className="flex flex-row gap-2 justify-center items-center">
                                        <div>Total Questions</div>
                                        <div className="flex flex-col mt-1 -ml-1">
                                            <IoMdArrowDropup
                                                className="text-lg hover:scale-[0.8] cursor-pointer"
                                                onClick={() => {
                                                    sortArr(0, "des");
                                                }}
                                            />
                                            <IoMdArrowDropdown
                                                className="-mt-2 text-lg hover:scale-[0.8] cursor-pointer"
                                                onClick={() => {
                                                    sortArr(0, "asc");
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Th>
                                <Th className="p-3 text-center ">
                                    <div className="flex flex-row gap-2 justify-center items-center">
                                        <div>Hard</div>
                                        <div className="flex flex-col mt-1 -ml-1">
                                            <IoMdArrowDropup
                                                className="text-lg hover:scale-[0.8] cursor-pointer"
                                                onClick={() => {
                                                    sortArr(1, "des");
                                                }}
                                            />
                                            <IoMdArrowDropdown
                                                className="-mt-2 text-lg hover:scale-[0.8] cursor-pointer"
                                                onClick={() => {
                                                    sortArr(1, "asc");
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Th>
                                <Th className="p-3 text-center ">
                                    <div className="flex flex-row gap-2 justify-center items-center">
                                        <div>Medium</div>
                                        <div className="flex flex-col mt-1 -ml-1">
                                            <IoMdArrowDropup
                                                className="text-lg hover:scale-[0.8] cursor-pointer"
                                                onClick={() => {
                                                    sortArr(2, "des");
                                                }}
                                            />
                                            <IoMdArrowDropdown
                                                className="-mt-2 text-lg hover:scale-[0.8] cursor-pointer"
                                                onClick={() => {
                                                    sortArr(2, "asc");
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Th>
                                <Th className="p-3 text-center ">
                                    <div className="flex flex-row gap-2 justify-center items-center">
                                        <div>Easy</div>
                                        <div className="flex flex-col mt-1 -ml-1">
                                            <IoMdArrowDropup
                                                className="text-lg hover:scale-[0.8] cursor-pointer"
                                                onClick={() => {
                                                    sortArr(3, "des");
                                                }}
                                            />
                                            <IoMdArrowDropdown
                                                className="-mt-2 text-lg hover:scale-[0.8] cursor-pointer"
                                                onClick={() => {
                                                    sortArr(3, "asc");
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Th>
                                <Th className="p-3 text-center">Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {arr.map((leetId, index) => (
                                <Tr
                                    key={index}
                                    className={`border-t text-xs ${
                                        lightMode
                                            ? "text-black"
                                            : "text-white bg-gray-700 border-slate-300"
                                    }`}
                                >
                                    <Td className="p-3 text-left font-semibold text-sm uppercase">
                                        {leetId.username}
                                    </Td>
                                    <Td className="p-3 text-center">
                                        {
                                            leetId.stats[
                                                leetId.stats.length - 1
                                            ].leetcode_count
                                        }
                                    </Td>
                                    <Td className="p-3 text-center">
                                        {
                                            leetId.stats[
                                                leetId.stats.length - 1
                                            ].leetcode_hard
                                        }
                                    </Td>
                                    <Td className="p-3 text-center">
                                        {
                                            leetId.stats[
                                                leetId.stats.length - 1
                                            ].leetcode_medium
                                        }
                                    </Td>
                                    <Td className="p-3 text-center">
                                        {
                                            leetId.stats[
                                                leetId.stats.length - 1
                                            ].leetcode_easy
                                        }
                                    </Td>
                                    <Td className="p-3 text-center flex flex-row items-center justify-center">
                                        {removingId === leetId.username ? (
                                            <div className="h-[30px]">
                                                <Loader className="text-xs" />
                                            </div>
                                        ) : (
                                            <MdDelete
                                                onClick={() => {
                                                    removeLeetcodeUsername(
                                                        leetId.username
                                                    );
                                                }}
                                                className="cursor-pointer text-lg font-semibold hover:scale-105"
                                            />
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default ManagePage;
