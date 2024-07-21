import mongoose from "mongoose";

const LeetcodeIDSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    linkedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    stats:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Statistics"
    }]
},
{
    timestamps: true, // automatically adds createdAt and updatedAt fields
});

export default mongoose.model("LeetcodeID",LeetcodeIDSchema);