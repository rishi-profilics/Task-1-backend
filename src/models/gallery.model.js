const mongoose = require("mongoose");
const MongooseDelete = require("mongoose-delete");

const gallerySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"]
    },
    image_url: {
        type: String,
        required: [true, "image url is required"]
    },
    // createdBy:
    // updatedBy:
},{
    timestamps: true
})

gallerySchema.index({ user: 1, createdAt: -1 });

gallerySchema.plugin(MongooseDelete,{
    deletedAt: true,
    overrideMethods: true,
    indexFields: true
})

module.exports = mongoose.model("gallery", gallerySchema)




// we need 3 apis one to add photo, one to get all photos and one to get one photo


//todo join two schemas
// todo see the file send from the frontend with multer  https://www.npmjs.com/package/multer
//todo upload image on  cloud and get a url and store it in db  https://github.com/imagekit-developer/imagekit-nodejs
//todo on upload of a image first give an option to crop it  https://www.npmjs.com/package/react-easy-crop
