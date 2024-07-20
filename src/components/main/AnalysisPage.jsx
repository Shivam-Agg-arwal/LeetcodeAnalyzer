import React, { useEffect, useRef, useState } from "react";
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
    const { user } = useSelector((state) => state.profile);
    const [leetcodeIds, setLeetcodeIds] = useState([]);
    const [chosenId, setChosenId] = useState([]);
    const [data, setData] = useState(null);
    const [type, setType] = useState(0);
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([]);

    // 0 => all
    // 1 => easy
    // 2 => medium
    // 3 => hard

    const daysLen = calculateDaysFromToday(user.startDate);
    console.log(daysLen);

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
            backgroundColor: "#ffffff",
            pointBorderColor: color,
            tension: 0.1,
        };
    };

    const createDataSet = () => {
        if (data === null) return;
        setDatasets(data.map((arr) => generateDataset(arr)));
    };

    const parseDateString = (dateString) => {
        const [day, monthName, year] = dateString.split(" ");
        const monthIndex = new Date(
            Date.parse(monthName + " 1, 2022")
        ).getMonth(); // Convert month name to index
        return new Date(year, monthIndex, parseInt(day, 10));
    };

    const generateDates = (startDateStr, endDate) => {
        const startDate = parseDateString(startDateStr);
        const dates = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate)); // Push a new date object to avoid mutation issues
            currentDate = addDays(currentDate, 1);
        }
        return dates;
    };

    const processData = (count, arr) => {
        return arr.slice(-count).map(({ leetcode_count, leetcode_easy, leetcode_medium, leetcode_hard }) => [
            leetcode_count,
            leetcode_easy,
            leetcode_medium,
            leetcode_hard,
        ]);
    };

    const datasetCreator = () => {
        const temp2d = user.linkedto.reduce((acc, conn) => {
            if (chosenId.includes(conn.username)) {
                const statsLen = conn.stats.length;
                const toAdd = daysLen - statsLen;
                const temp1d = toAdd <= 0
                    ? processData(daysLen, conn.stats)
                    : [
                        ...new Array(toAdd).fill([null, null, null, null]),
                        ...processData(statsLen, conn.stats),
                    ];

                acc.push({ data: temp1d, username: conn.username });
            }
            return acc;
        }, []);

        setData(temp2d);
    };

    const manageLeetcodeIds = () => {
        const ids = user.linkedto.map((conn) => conn.username);
        setLeetcodeIds(ids);
    };

    const addChosen = (id) => setChosenId((prev) => [...prev, id]);

    const removeChosen = (id) => setChosenId((prev) => prev.filter((old) => old !== id));

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
        const endDate = new Date(); // Today's date
        endDate.setDate(endDate.getDate() + 1); // Increase endDate by 1 day
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
                position: "left",
            },
            title: {
                display: true,
                text: "Progress Chart",
            }
        },
        scales: {
            y: {
                beginAtZero: true, // Ensure y-axis starts from 0
                ticks: {
                    callback: function(value) {
                        return value; // Customize tick labels if needed
                    }
                }
            }
        }
    };

    return (
        <div className="w-11/12 mx-auto my-10">
            <div className="flex flex-row w-full gap-2">
                <div className="h-[700px] w-[80%]">
                    <Line data={chartData} options={options} className="w-full" />
                </div>
                <div className="w-[20%] flex flex-col gap-4 mt-10">
                    <div className="flex flex-row">
                        {["All", "Easy", "Medium", "Hard"].map((label, index) => (
                            <div
                                key={index}
                                onClick={() => setType(index)}
                                className={`border-[1px] font-semibold p-4 py-2 cursor-pointer text-sm border-black ${
                                    type === index ? "text-white bg-black" : "text-black bg-white"
                                }`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-row flex-wrap border-[1px] border-black w-full max-h-[380px] overflow-y-auto">
                        {leetcodeIds.map((id, index) => (
                            <div key={index} className="px-5 py-2 flex flex-row gap-1 items-center">
                                <div onClick={() => { chosenId.includes(id) ? removeChosen(id) : addChosen(id); }} className="text-blue">
                                    {chosenId.includes(id) ? <IoIosCheckboxOutline /> : <MdCheckBoxOutlineBlank />}
                                </div>
                                <div className="-mt-[2px] text-xs">{id}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div><Stats type={type}/></div>
        </div>
    );
};

export default AnalysisPage;
