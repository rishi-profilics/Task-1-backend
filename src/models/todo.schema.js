const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, "Task is required"]
    },
    due: {
        type: Date,
        required: [true, "Due date is required"]
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    },
    assignedto:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "UserModel",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
},{
    timestamps: true
})

const todoModel = mongoose.model("todo", todoSchema)

module.exports = todoModel