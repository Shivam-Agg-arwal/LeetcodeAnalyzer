import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import calculateDaysFromToday from "../../utils/dayCounter";
import { Line } from "react-chartjs-2";
import { addDays, format } from "date-fns";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosCheckboxOutline } from "react-icons/io";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import Stats from "./Stats";
import { useNavigate } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AnalysisPage = () => {
    const { user, lightMode } = useSelector((state) => state.profile);
    const [leetcodeIds, setLeetcodeIds] = useState([]);
    const [chosenId, setChosenId] = useState([]);
    const [data, setData] = useState(null);
    const [type, setType] = useState(0);
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([]);
    const navigate = useNavigate();

    const daysLen = calculateDaysFromToday(user.startDate);

    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getData = (arr) => arr.map((item) => item[type]);

    const generateDataset = (arr) => {
        const data = getData(arr.data);
        const color = getRandomColor();

        return {
            label: arr.username,
            data,
            fill: false,
            borderColor: color,
            backgroundColor: color,
            pointBorderColor: color,
            tension: 0.1,
        };
    };

    const createDataSet = () => {
        if (!data) return;
        setDatasets(data.map((arr) => generateDataset(arr)));
    };

    const parseDateString = (dateString) => {
        const [day, monthName, year] = dateString.split(" ");
        const monthIndex = new Date(
            Date.parse(monthName + " 1, 2022")
        ).getMonth();
        return new Date(year, monthIndex, parseInt(day, 10));
    };

    const generateDates = (startDateStr, endDate) => {
        const startDate = parseDateString(startDateStr);
        const dates = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
        }
        return dates;
    };

    const processData = (count, arr) => {
        return arr
            .slice(-count)
            .map(
                ({
                    leetcode_count,
                    leetcode_easy,
                    leetcode_medium,
                    leetcode_hard,
                }) => [
                    leetcode_count,
                    leetcode_easy,
                    leetcode_medium,
                    leetcode_hard,
                ]
            );
    };

    const datasetCreator = () => {
        const temp2d = user.linkedto.reduce((acc, conn) => {
            if (conn && chosenId.includes(conn.username)) {
                const statsLen = conn.stats.length;
                const toAdd = daysLen - statsLen;
                const temp1d =
                    toAdd <= 0
                        ? processData(daysLen, conn.stats)
                        : [
                              ...new Array(toAdd).fill([
                                  null,
                                  null,
                                  null,
                                  null,
                              ]),
                              ...processData(statsLen, conn.stats),
                          ];

                acc.push({ data: temp1d, username: conn.username });
            }
            return acc;
        }, []);

        setData(temp2d);
    };

    const manageLeetcodeIds = () => {
        const ids = user.linkedto.map((conn) => conn?.username).filter(Boolean);
        setLeetcodeIds(ids);
        setChosenId(ids.slice(0, 3));
    };

    const addChosen = (id) => setChosenId((prev) => [...prev, id]);

    const removeChosen = (id) =>
        setChosenId((prev) => prev.filter((old) => old !== id));

    useEffect(() => {
        datasetCreator();
    }, [chosenId, user]);

    useEffect(() => {
        manageLeetcodeIds();
    }, [user]);

    useEffect(() => {
        createDataSet();
    }, [data, type]);

    useEffect(() => {
        const startDateStr = user.startDate;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
        const dates = generateDates(startDateStr, endDate);
        setLabels(dates.map((date) => format(date, "dd MMM yyyy")));
    }, [user.startDate]);

    const chartData = {
        labels: labels,
        datasets: datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "bottom",
                align: "start",
                labels: {
                    color: lightMode ? "#1A202C" : "#E2E8F0",
                    font: {
                        size: 10,
                        weight: "semibold",
                    },
                    boxWidth: 12,
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: "circle",
                },
            },
            title: {
                display: true,
                text: "Progress Chart",
                color: lightMode ? "#1A202C" : "#E2E8F0",
                font: {
                    size: 18,
                    weight: "bold",
                },
                padding: {
                    bottom: 20,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: lightMode ? "#E2E8F0" : "#4A5568",
                    borderDash: [5, 5],
                },
                ticks: {
                    color: lightMode ? "#1A202C" : "#E2E8F0",
                    font: {
                        size: 10,
                    },
                },
            },
            x: {
                grid: {
                    color: lightMode ? "#E2E8F0" : "#4A5568",
                    borderDash: [5, 5],
                },
                ticks: {
                    color: lightMode ? "#1A202C" : "#E2E8F0",
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };

    return (
        <div className={`w-11/12 mx-auto my-8 p-8 rounded-xl shadow-lg ${lightMode ? "bg-white" : "bg-gray-900"}`}>
            <div className="flex flex-col md:flex-row w-full gap-6">
                <div className={`md:w-3/4 w-full flex items-center ${lightMode ? "bg-gray-50" : "bg-gray-800"} p-4 rounded-lg shadow-md`}>
                    <Line
                        data={chartData}
                        options={options}
                        className="w-full h-[400px]"
                    />
                </div>
                <div className="md:w-1/4 w-full flex flex-col gap-6 mt-6 md:mt-0">
                    <div className={`flex flex-col border ${lightMode?"bg-gray-50  border-gray-200":"bg-gray-800 border-white"} rounded-lg p-4 shadow-md`}>
                        {["All", "Easy", "Medium", "Hard"].map((label, index) => (
                            <div
                                key={index}
                                onClick={() => setType(index)}
                                className={`border-[1px] font-semibold w-full py-3 cursor-pointer text-sm border-gray-300 rounded-lg transition-colors duration-300 ease-in-out ${
                                    lightMode?(type === index
                                        ? "text-white bg-gray-800"
                                        : "text-gray-800 bg-gray-50"):(type !== index
                                        ? "text-white bg-gray-800"
                                        : "text-gray-800 bg-gray-50")
                                }`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                    <div className={`border-2 rounded-lg p-4 ${lightMode ? "bg-gray-50 border-gray-800" : "bg-gray-800 border-gray-600"} shadow-md max-h-[400px] overflow-y-auto`}>
                        <div className="flex flex-col gap-2">
                            {leetcodeIds.map((id, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-3 p-3 border-b ${lightMode ? "border-gray-200 hover:bg-gray-100" : "border-gray-600 hover:bg-gray-700"} cursor-pointer rounded-md transition-colors duration-300 ease-in-out ${
                                        chosenId.includes(id)
                                            ? (lightMode ? "bg-gray-100" : "bg-gray-700")
                                            : (lightMode ? "" : "bg-gray-800")
                                    }`}
                                    onClick={() => {
                                        chosenId.includes(id)
                                            ? setChosenId((prev) => prev.filter((old) => old !== id))
                                            : setChosenId((prev) => [...prev, id]);
                                    }}
                                    role="button"
                                    aria-pressed={chosenId.includes(id)}
                                >
                                    <div className={`${lightMode ? "text-gray-800" : "text-gray-100"}`}>
                                        {chosenId.includes(id) ? (
                                            <IoIosCheckboxOutline />
                                        ) : (
                                            <MdCheckBoxOutlineBlank />
                                        )}
                                    </div>
                                    <div className={`text-sm ${lightMode ? "text-gray-700" : "text-gray-200"} font-medium`}>
                                        {id}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <Stats type={type} />
            </div>
        </div>
    );
};

export default AnalysisPage;
