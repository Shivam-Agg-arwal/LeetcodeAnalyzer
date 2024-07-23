import User from "../models/User.js";
import LeetcodeID from "../models/LeetcodeID.js";
import { fetchLeetcodeStats } from "../utils/fetchStats.js";
import { dateFinder } from "../utils/DateFinder.js";
import { preprocessStats } from "../utils/StatsPreProcesser.js";
import Statistics from "../models/Statistics.js";

export const AddLeetcodeId = async (req, res) => {
    try {
        const userId = req.user.id;
        const { leetcodeId } = req.body;

        if (!userId || !leetcodeId) {
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

        let leetcodeDetails = await LeetcodeID.findOne({
            username: leetcodeId,
        }).populate("stats");
        if (!leetcodeDetails) {
            leetcodeDetails = await LeetcodeID.create({
                username: leetcodeId,
            });
        }

        const leetcodeIdPresent = user.linkedto.some(
            (lId) => lId && lId.equals(leetcodeDetails._id)
        );

        if (leetcodeIdPresent) {
            return res.status(400).json({
                success: false,
                message: "Leetcode ID is already added",
            });
        }

        const response = await fetchLeetcodeStats(leetcodeId);
        if (response.status !== "success") {
            return res.status(400).json({
                success: false,
                message: "Invalid Leetcode ID",
            });
        }

        const currDate = dateFinder();
        if (user.linkedto.length === 0) {
            user.startDate = currDate;
        }

        const organizedStats = preprocessStats(
            response,
            leetcodeDetails._id,
            currDate
        );

        user.linkedto.push(leetcodeDetails._id);
        await user.save();

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
                leetcodeDetails.stats.pop();
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
            message: "Leetcode ID added successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error occurred while adding the ID:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred while adding the ID",
        });
    }
};

export const RemoveLeetcodeId = async (req, res) => {
    try {
        const userId = req.user.id;
        const { leetcodeId } = req.body;

        if (!userId || !leetcodeId) {
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

        const leetcodeDetails = await LeetcodeID.findOne({
            username: leetcodeId,
        });
        if (!leetcodeDetails) {
            user.password = undefined;
            return res.status(200).json({
                success: true,
                message: "Leetcode ID already absent",
                data: user,
            });
        }

        const leetcodeIdPresent = user.linkedto.some((lId) =>
            lId.equals(leetcodeDetails._id)
        );
        if (!leetcodeIdPresent) {
            user.password = undefined;
            return res.status(200).json({
                success: true,
                message: "Leetcode ID already absent",
                data: user,
            });
        }

        user.linkedto = user.linkedto.filter(
            (lId) => lId !== null && !lId.equals(leetcodeDetails._id)
        );
        await user.save();

        leetcodeDetails.linkedUsers = leetcodeDetails.linkedUsers.filter(
            (people) => !people.equals(userId)
        );
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
            message: "Leetcode ID removed successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error occurred while removing the ID:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred while removing the ID",
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

        const updateLinkedToPromises = user.linkedto.map(async (id) => {
            try {
                const leetcodeDetails = await LeetcodeID.findById(id).populate(
                    "stats"
                );
                if (!leetcodeDetails) {
                    console.warn(`Leetcode ID ${id} not found`);
                    return;
                }

                const response = await fetchLeetcodeStats(
                    leetcodeDetails.username
                );
                if (response.status === "success") {
                    const organizedStats = preprocessStats(
                        response,
                        leetcodeDetails._id,
                        currDate
                    );
                    const statsDetails = await Statistics.create(
                        organizedStats
                    );

                    if (leetcodeDetails.stats.length > 0) {
                        const lastStat =
                            leetcodeDetails.stats[
                                leetcodeDetails.stats.length - 1
                            ];
                        if (lastStat.date === currDate) {
                            leetcodeDetails.stats.pop();
                            await Statistics.findByIdAndDelete(lastStat._id);
                        }
                    }

                    leetcodeDetails.stats.push(statsDetails);
                    await leetcodeDetails.save();
                } else {
                    console.warn(
                        `Failed to fetch stats for ${leetcodeDetails.username}`
                    );
                }
            } catch (error) {
                console.error(
                    `Error processing Leetcode ID ${id}:`,
                    error.message
                );
            }
        });

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
    console.log("auto updation running ");
    try {
        const leetcodeProfiles = await LeetcodeID.find({})
            .populate("stats")
            .exec();
        const currDate = dateFinder();

        const updateLinkedToPromises = leetcodeProfiles.map(
            async (leetcodeDetails) => {
                try {
                    const response = await fetchLeetcodeStats(
                        leetcodeDetails.username
                    );
                    let organizedStats;
                    if (response && response.status === "success") {
                        organizedStats = preprocessStats(
                            response,
                            leetcodeDetails._id,
                            currDate
                        );
                    } else {
                        organizedStats = {
                            date: currDate,
                            leetcode_count: null,
                            leetcode_easy: null,
                            leetcode_medium: null,
                            leetcode_hard: null,
                            leetcode_id: leetcodeDetails._id,
                        };
                    }
                    const statsDetails = await Statistics.create(
                        organizedStats
                    );

                    if (leetcodeDetails.stats.length > 0) {
                        const lastStat =
                            leetcodeDetails.stats[
                                leetcodeDetails.stats.length - 1
                            ];
                        if (lastStat.date === currDate) {
                            leetcodeDetails.stats.pop();
                            await Statistics.findByIdAndDelete(lastStat._id);
                        }
                    }

                    leetcodeDetails.stats.push(statsDetails);
                    await leetcodeDetails.save();
                } catch (error) {
                    console.error(
                        `Error processing Leetcode ID ${leetcodeDetails._id}:`,
                        error.message
                    );
                }
            }
        );

        await Promise.all(updateLinkedToPromises);

        return res.status(200).json({
            success: true,
            message: "Auto-update completed successfully",
        });
    } catch (error) {
        console.error("Error occurred while auto-updating:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred while auto-updating",
        });
    }
};
