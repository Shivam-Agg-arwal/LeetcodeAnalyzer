import mongoose from "mongoose";

const StatisticsSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
            trim: true,
        },
        leetcode_count: {
            type: Number,
        },
        leetcode_easy: {
            type: Number,
        },
        leetcode_medium: {
            type: Number,
        },
        leetcode_hard: {
            type: Number,
        },
        leetcode_contest_rating: {
            type: Number,
        },
        leetcode_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LeetcodeID",
        },
    },
    {
        timestamps: true, // automatically adds createdAt and updatedAt fields
    }
);
export default mongoose.model("Statistics", StatisticsSchema);
