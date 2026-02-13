const mongoose = require('mongoose')

const reportModel = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    start_time: {
        type: String,
        required: true,
    },
    break_duration_in_minutes: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    working_hours: {
        type: String,
        required: true,
    },
    total_hours: {
        type: String,
        required: true,
    },
    report: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Report", reportModel)