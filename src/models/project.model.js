const mongoose = require("mongoose")
const MongooseDelete = require("mongoose-delete")

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"]
    },
    projectname: {
        type: String,
        required: [true, "Project name is requied"]
    },
    clientname: {
        type: String,
        required: [true, "Client name is required"]
    },
    technology: {
        type: [String],
        required: [true, "Technology is required"]
    },
    teammembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "UserModel",
        required: [true, "Team members are required"]
    }
},{
    timestamps: true,
})

projectSchema.plugin(MongooseDelete,{
    deletedAt: true,
    overrideMethods: true,
    indexFields: true
})

const projectModel = mongoose.model("projects", projectSchema)

module.exports = projectModel