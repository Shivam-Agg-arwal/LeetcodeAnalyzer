import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Tooltip from './Tooltip'; // Import the Tooltip component

const typemapping = ['leetcode_count', 'leetcode_easy', 'leetcode_medium', 'leetcode_hard'];

const calculateDifference = (stats, index, type) => {
    if (stats && stats.length > index) {
        const latestStat = stats[stats.length - 1];
        const previousStat = stats[stats.length - (index + 1)];
        return latestStat[type] - previousStat[type];
    }
    return <Tooltip text="Insufficient data available for this period">-</Tooltip>; // Use Tooltip here
};

const Stats = ({ type }) => {
    const { user, lightMode } = useSelector((state) => state.profile);
    const [leetcodeId, setLeetcodeId] = useState(user.linkedto);
    console.log(leetcodeId);

    return (
        <div className={`p-6 ${lightMode ? "bg-white" : "bg-gray-800"} rounded-lg shadow-lg font-quicksand`}>
            <Table className="w-full table-auto">
                <Thead>
                    <Tr className={`${lightMode ? "bg-gray-100 text-gray-600" : "text-gray-100 bg-gray-600"}`}>
                        <Th className="px-4 py-2 border-b border-gray-300">Leetcode Username</Th>
                        <Th className="px-4 py-2 border-b border-gray-300">Last 1 Day</Th>
                        <Th className="px-4 py-2 border-b border-gray-300">Last 3 Days</Th>
                        <Th className="px-4 py-2 border-b border-gray-300">Last 7 Days</Th>
                        <Th className="px-4 py-2 border-b border-gray-300">Last 15 Days</Th>
                        <Th className="px-4 py-2 border-b border-gray-300">Last Month</Th>
                        <Th className="px-4 py-2 border-b border-gray-300">Last 60 Days</Th>
                        <Th className="px-4 py-2 border-b border-gray-300">Last 100 Days</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {leetcodeId && leetcodeId.length > 0 && leetcodeId.map((id, index) => {
                        if (id) {
                            const stats = id.stats || [];
                            const typeMapping = typemapping[type];

                            return (
                                <Tr key={index} className={`border-t ${lightMode ? "hover:bg-gray-50" : "hover:bg-gray-700"}`}>
                                    <Td className="px-4 py-2 font-semibold border-b border-gray-300">{id.username}</Td>
                                    <Td className="px-4 py-2 border-b border-gray-300">{calculateDifference(stats, 1, typeMapping)}</Td>
                                    <Td className="px-4 py-2 border-b border-gray-300">{calculateDifference(stats, 3, typeMapping)}</Td>
                                    <Td className="px-4 py-2 border-b border-gray-300">{calculateDifference(stats, 7, typeMapping)}</Td>
                                    <Td className="px-4 py-2 border-b border-gray-300">{calculateDifference(stats, 15, typeMapping)}</Td>
                                    <Td className="px-4 py-2 border-b border-gray-300">{calculateDifference(stats, 31, typeMapping)}</Td>
                                    <Td className="px-4 py-2 border-b border-gray-300">{calculateDifference(stats, 61, typeMapping)}</Td>
                                    <Td className="px-4 py-2 border-b border-gray-300">{calculateDifference(stats, 101, typeMapping)}</Td>
                                </Tr>
                            );
                        }
                        return null;
                    })}
                </Tbody>
            </Table>
        </div>
    );
};

export default Stats;
