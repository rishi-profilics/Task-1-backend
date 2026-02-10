const mongoose = require('mongoose')

const activitySchame = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    activity_type: {
        type: String,
        enum: ["punch_in", "punch_out", "break_in", "break_out"],
        default: "punch_in",
    },
    description:{
        type:String,
        default: ""
    } ,
    in_time: {
        type: Date,
        required: true,
    },
    out_time: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        emun: ["active", "complete", "break", "completed"],
        default: "active"
    },
    deleted_at: {
        type: Date,
        default: null
    },
    punchInRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        default: null,
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Activity", activitySchame)