import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const Stats = ({ type }) => {
    const { user } = useSelector((state) => state.profile);
    const [leetcodeId, setLeetcodeId] = useState(user.linkedto);

    const typemapping = ['leetcode_count', 'leetcode_easy', 'leetcode_medium', 'leetcode_hard'];

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <Table className="w-full table-auto">
                <Thead>
                    <Tr className="bg-gray-200 ">
                        <Th className="px-4 py-2 ">Leetcode Username</Th>
                        <Th className="px-4 py-2">Last 1 Day</Th>
                        <Th className="px-4 py-2">Last 3 Day</Th>
                        <Th className="px-4 py-2">Last 7 Day</Th>
                        <Th className="px-4 py-2">Last 15 Day</Th>
                        <Th className="px-4 py-2">Last Month</Th>
                        <Th className="px-4 py-2">Last 60 days</Th>
                        <Th className="px-4 py-2">Last 100 days</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {leetcodeId.map((id, index) => (
                        <Tr key={index} className="border-t">
                            <Td className="px-4 py-2 font-semibold">{id.username}</Td>
                            <Td className="px-4 py-2">{id.stats.length >= 2 ? id.stats[id.stats.length - 1][typemapping[type]] - id.stats[id.stats.length - 2][typemapping[type]] : 'Less Data'}</Td>
                            <Td className="px-4 py-2">{id.stats.length >= 4 ? id.stats[id.stats.length - 1][typemapping[type]] - id.stats[id.stats.length - 4][typemapping[type]] : 'Less Data'}</Td>
                            <Td className="px-4 py-2">{id.stats.length >= 8 ? id.stats[id.stats.length - 1][typemapping[type]] - id.stats[id.stats.length - 8][typemapping[type]] : 'Less Data'}</Td>
                            <Td className="px-4 py-2">{id.stats.length >= 16 ? id.stats[id.stats.length - 1][typemapping[type]] - id.stats[id.stats.length - 16][typemapping[type]] : 'Less Data'}</Td>
                            <Td className="px-4 py-2">{id.stats.length >= 31 ? id.stats[id.stats.length - 1][typemapping[type]] - id.stats[id.stats.length - 31][typemapping[type]] : 'Less Data'}</Td>
                            <Td className="px-4 py-2">{id.stats.length >= 61 ? id.stats[id.stats.length - 1][typemapping[type]] - id.stats[id.stats.length - 61][typemapping[type]] : 'Less Data'}</Td>
                            <Td className="px-4 py-2">{id.stats.length >= 101 ? id.stats[id.stats.length - 1][typemapping[type]] - id.stats[id.stats.length - 101][typemapping[type]] : 'Less Data'}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </div>
    );
};

export default Stats;
