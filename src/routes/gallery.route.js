const express = require("express")
const { addGalleryImage, getGalleryImage, deleteGalleryImageById, getGalleryImageById } = require("../controllers/gallery.controller")
const middleware = require("../../middleware/auth")
const multer = require("multer")
const path = require("path")
const galleryRouter = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/images"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage})


galleryRouter.post("/", upload.single("image") ,middleware, addGalleryImage)
galleryRouter.get("/", middleware, getGalleryImage)

// get image by id
galleryRouter.get("/:id", middleware, getGalleryImageById )

//delete image by id
galleryRouter.delete("/:id", middleware, deleteGalleryImageById )

module.exports = galleryRouter