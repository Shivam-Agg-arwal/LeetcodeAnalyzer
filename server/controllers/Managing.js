import User from "../models/User.js";
import LeetcodeID from "../models/LeetcodeID.js";
import { fetchLeetcodeStats } from "../utils/fetchStats.js";
import { dateFinder } from "../utils/DateFinder.js";
import { preprocessStats } from "../utils/StatsPreProcesser.js";
import Statistics from "../models/Statistics.js";

export const AddLeetcodeId = async (req, res) => {
    try {
        const userId = req.user.id;
        let { leetcodeId } = req.body;

        if (!userId || !leetcodeId) {
            return res.status(500).json({
                success: false,
                message: "Insuffient data",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User dont exist",
            });
        }

        let leetcodeDetails = await LeetcodeID.findOne({
            username: leetcodeId,
        });
        if (!leetcodeDetails) {
            leetcodeDetails = await LeetcodeID.create({ username: leetcodeId });
        }

        const leetcodeIdPresent = user.linkedto.find((lId) =>
            lId.equals(leetcodeDetails._id)
        );
        if (leetcodeIdPresent) {
            return res.status(500).json({
                success: false,
                message: "Leetcode Id is already added",
            });
        }

        const response = await fetchLeetcodeStats(leetcodeId);
        if (response.status !== "success") {
            return res.status(500).json({
                success: false,
                message: "Leetcode Id is invalid",
            });
        }

        //ab is id ko user ko dedo

        const currDate = dateFinder();
        if (user.linkedto.length == 0) {
            user.startDate = currDate;
        }

        const organizedStats = preprocessStats(
            response,
            leetcodeDetails._id,
            currDate
        );
        user.linkedto.push(leetcodeDetails._id);
        await user.save();

        //dekho agar y leetcode m h nhi h toh daldo

        leetcodeDetails.linkedUsers.push(userId);

        if (
            user.linkedto.length > 0 &&
            user.linkedto[user.linkedto.length - 1].date === currDate
        ) {
            user.linkedto.pop();
        }

        const statsDetails = await Statistics.create(organizedStats);
        if (leetcodeDetails.stats.length > 0) {
            const lastStat =
                leetcodeDetails.stats[leetcodeDetails.stats.length - 1];
            if (lastStat.date === currDate) {
                leetcodeDetails.stats.pop(); // Remove the last entry if the date matches
                await Statistics.findByIdAndDelete(lastStat._id);
            }
        }
        leetcodeDetails.stats.push(statsDetails);

        await leetcodeDetails.save();

        const updatedUser = await User.findById(userId).populate({
            path: "linkedto",
            populate: {
                path: "stats",
            },
        });

        updatedUser.password = undefined;
        return res.status(200).json({
            success: true,
            message: "Id Added Successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log("error occured while addign the id ", error.message);
        return res.status(500).json({
            success: false,
            message: "Error during addtion of id ",
        });
    }
};

export const RemoveLeetcodeId = async (req, res) => {
    try {
        const userId = req.user.id;
        let { leetcodeId } = req.body;

        if (!userId || !leetcodeId) {
            return res.status(500).json({
                success: false,
                message: "Insuffient data",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User dont exist",
            });
        }
        let leetcodeDetails = await LeetcodeID.findOne({
            username: leetcodeId,
        });
        if (!leetcodeDetails) {
            user.password = undefined;
            return res.status(200).json({
                success: true,
                message: "Leetcode Id already abssent",
                data: user,
            });
        }

        const leetcodeIdPresent = user.linkedto.find((lId) =>
            lId.equals(leetcodeDetails._id)
        );
        if (!leetcodeIdPresent) {
            user.password = undefined;
            return res.status(200).json({
                success: true,
                message: "Leetcode Id already abssent",
                data: user,
            });
        }

        const updatedlinks = user.linkedto.filter(
            (lId) => !lId.equals(leetcodeDetails._id)
        );
        user.linkedto = updatedlinks;
        await user.save();

        const leetcodeIdDetails = await LeetcodeID.findOne({
            username: leetcodeId,
        });
        const updatedLinked = leetcodeIdDetails.linkedUsers.filter(
            (people) => !people.equals(userId)
        );
        leetcodeIdDetails.linkedUsers = updatedLinked;
        await leetcodeIdDetails.save();

        const updatedUser = await User.findById(userId).populate({
            path: "linkedto",
            populate: {
                path: "stats",
            },
        });
        updatedUser.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Id Removed Successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log("Error occured during removal of id", error.message);
        return res.status(500).json({
            success: false,
            message: "Error occured during removal of id ",
        });
    }
};

export const fetchData = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Insufficient data",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }

        const currDate = dateFinder();

        // Map async operations and handle them with Promise.all
        const updateLinkedToPromises = user.linkedto.map(async (id) => {
            try {
                const leetcodeDetails = await LeetcodeID.findById(id);
                if (!leetcodeDetails) {
                    console.warn(`Leetcode ID ${id} not found`);
                    return;
                }
                
                const response = await fetchLeetcodeStats(leetcodeDetails.username);
                if (response.status === "success") {
                    const organizedStats = preprocessStats(
                        response,
                        leetcodeDetails._id,
                        currDate
                    );

                    const statsDetails = await Statistics.create(organizedStats);

                    if (leetcodeDetails.stats.length > 0) {
                        const lastStat =
                            leetcodeDetails.stats[leetcodeDetails.stats.length - 1];
                        if (lastStat.date === currDate) {
                            leetcodeDetails.stats.pop(); // Remove the last entry if the date matches
                            await Statistics.findByIdAndDelete(lastStat._id);
                        }
                    }

                    leetcodeDetails.stats.push(statsDetails);
                    await leetcodeDetails.save();
                } else {
                    console.warn(`Failed to fetch stats for ${leetcodeDetails.username}`);
                }
            } catch (error) {
                console.error(`Error processing Leetcode ID ${id}:`, error.message);
            }
        });

        // Await all the promises
        await Promise.all(updateLinkedToPromises);

        const updatedUser = await User.findById(userId).populate({
            path: "linkedto",
            populate: {
                path: "stats",
            },
        });

        updatedUser.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error occurred while fetching the data:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching the data",
        });
    }
};


export const autoUpdate = async (req, res) => {
    try {
        const leetcodeProfiles = await LeetcodeID.find({}).populate('stats').exec();

        const currDate = dateFinder();
        const updateLinkedToPromises = leetcodeProfiles.map(async (leetcodeDetails) => {
            try {
                const response = await fetchLeetcodeStats(leetcodeDetails.username);
                // console.log(response);
                if (response && response?.status === "success") {
                    const organizedStats = preprocessStats(
                        response,
                        leetcodeDetails._id,
                        currDate
                    );

                    const statsDetails = await Statistics.create(organizedStats);
                    if (leetcodeDetails.stats.length > 0) {
                        const lastStat =
                            leetcodeDetails.stats[leetcodeDetails.stats.length - 1];
                        if (lastStat.date === currDate) {
                            leetcodeDetails.stats.pop(); // Remove the last entry if the date matches
                            await Statistics.findByIdAndDelete(lastStat._id);
                        }
                    }

                    leetcodeDetails.stats.push(statsDetails);
                    await leetcodeDetails.save();
                } else {
                    console.warn(`Failed to fetch stats for ${leetcodeDetails.username}`);
                }
            } catch (error) {
                console.error(`Error processing Leetcode ID ${leetcodeDetails._id}:`, error.message);
            }
        });

        // Await all the promises
        await Promise.all(updateLinkedToPromises);

        

    } catch (error) {
        console.error("Error occurred while auto updating:", error.message);
    }
};
