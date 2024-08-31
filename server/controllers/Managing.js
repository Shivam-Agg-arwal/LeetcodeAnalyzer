import User from "../models/User.js";
import LeetcodeID from "../models/LeetcodeID.js";
import { fetchLeetcodeStats } from "../utils/fetchStats.js";
import { dateFinder } from "../utils/DateFinder.js";
import { preprocessStats } from "../utils/StatsPreProcesser.js";
import Statistics from "../models/Statistics.js";
import { mailSender } from "../utils/mailSender.js";

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

        if (response.errors) {
            return res.status(400).json({
                success: false,
                message: "Invalid Leetcode ID",
            });
        }

        const currDate = dateFinder();
        if (user.startDate === undefined || user.startDate === null) {
            user.startDate = currDate;
        }
        const countStats =
            response.data.matchedUser.submitStats.acSubmissionNum;
        const all = countStats[0].count;
        const hard = countStats[3].count;
        const medium = countStats[2].count;
        const easy = countStats[1].count;


        const organizedStats = preprocessStats(
            [all, hard, medium, easy],
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

                if (response.errors) {
                    throw new Error("Id is not present ");
                } else {
                    const countStats =
                        response.data.matchedUser.submitStats.acSubmissionNum;
                    const all = countStats[0].count;
                    const hard = countStats[3].count;
                    const medium = countStats[2].count;
                    const easy = countStats[1].count;


                    const organizedStats = preprocessStats(
                        [all, hard, medium, easy],
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
    console.log("Auto update running");

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
                    if (response.errors) {
                        organizedStats = {
                            date: currDate,
                            leetcode_count: null,
                            leetcode_easy: null,
                            leetcode_medium: null,
                            leetcode_hard: null,
                            leetcode_id: leetcodeDetails._id,
                        };
                    } else {
                        const countStats =
                            response.data.matchedUser.submitStats
                                .acSubmissionNum;
                        const all = countStats[0].count;
                        const hard = countStats[3].count;
                        const medium = countStats[2].count;
                        const easy = countStats[1].count;

                        organizedStats = preprocessStats(
                            [all, hard, medium, easy],
                            leetcodeDetails._id,
                            currDate
                        );

                    }

                    const statsDetails = await Statistics.create(
                        organizedStats
                    );

                    await updateLeetcodeStats(
                        leetcodeDetails,
                        statsDetails,
                        currDate
                    );
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

const updateLeetcodeStats = async (leetcodeDetails, statsDetails, currDate) => {
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
};


export const sendMails = async (req, res) => {
    try {
        const emails1 = [];
        const htmlContent=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LeetCode Analyzer - Registration Issue Resolved</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600px" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                    <tr>
                        <td align="center" style="background-color: #007aff; padding: 20px; color: #ffffff;">
                            <h1>LeetCode Analyzer</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; color: #333333;">
                            <h2 style="font-size: 24px;">We Apologize for the Inconvenience</h2>
                            <p style="font-size: 16px; line-height: 1.6;">
                                We're reaching out to apologize for the technical issues that may have prevented you from registering on our site, LeetCode Analyzer. We understand how frustrating this can be and appreciate your patience.
                            </p>
                            <p style="font-size: 16px; line-height: 1.6;">
                                The issue has been resolved, and you can now complete your registration without any trouble. Please click the button below to return to our site and get started.
                            </p>
                            <p style="text-align: center; margin: 40px 0;">
                                <a href="https://leetcode-analyzer.vercel.app/signup" style="background-color: #007aff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                    Complete Your Registration
                                </a>
                            </p>
                            <p style="font-size: 16px; line-height: 1.6;">
                                If you encounter any further issues or have any questions, please feel free to reach out. We're here to help!
                            </p>
                            <p style="font-size: 16px; line-height: 1.6;">
                                Thank you for your understanding and support.
                            </p>
                            <p style="font-size: 16px; line-height: 1.6;">
                                Best regards,<br>
                                Shivam Aggarwal<br>
                                LeetCode Analyzer Team
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999999;">
                            © 2024 LeetCode Analyzer. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
        await Promise.all(emails.map(async (email) => {
            await mailSender(email, "Apologies for the Inconvenience: Registration Issue Resolved", htmlContent);
        }));
        res.status(200).send("Emails sent successfully!");
    } catch (error) {
        console.error("kuch toh gadbad hogyi", error);
        res.status(500).send("Failed to send emails.");
    }
};
