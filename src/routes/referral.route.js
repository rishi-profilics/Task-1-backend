const express = require("express")
const referralRouter = express.Router()
const multer = require("multer")
const path = require("path")
const middleware = require("../../middleware/auth")
const { createReferralController } = require("../controllers/referral.controller")
const authorize = require("../../middleware/authorize")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/documents"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fullName = req.body.name ? req.body.name.replace(/\s+/g, '-') : 'unknown'
    cb(null, fullName + '-resume-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage})

referralRouter.post("/", upload.single("document"), middleware, authorize("employee"), createReferralController)


module.exports = referralRouter