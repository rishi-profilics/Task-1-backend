const mongoose = require('mongoose')
const MongooseDelete = require('mongoose-delete')

const eventSchema = new mongoose.Schema({
    event_type: {
        type: String,
        required: true,
        enum: ["holiday", "event"]
    },
    name: {
        type: String,
        require: [true, "Name is Required"]
    },
    event_on: {
        type: Date,
        required: [true, "Date is required"]
    },
},
{timestamps:true})

eventSchema.plugin(MongooseDelete,{
    deletedAt: true,
    overrideMethods: true,
    indexFields: true
})

module.exports = mongoose.model("Event", eventSchema)