import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    linkedto:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"LeetcodeID"
    }],
    startDate:{
        type:String
    },
    token: {
        type: String,
        default: null,  
    },
    expirationTime: {
        type: Date,
        default: null, 
    }
},
{
    timestamps: true, // automatically adds createdAt and updatedAt fields
});

export default mongoose.model("User",UserSchema);