const referralModel = require("../models/referral.model")
const userModel = require("../models/user-model")
const sendReferralEmail = require("../utils/sendEmail")

const createReferralController = async (req, res) => {
    try {
        const { name, email, phone, altPhone, experience } = req.body
        const file = req.file ? req.file.filename : null
        const refferedBy = req.userId 
        const senderEmail = req.email

        const getAdmin = await userModel.find({role: "admin"})
        const adminEmails = getAdmin.map(admin => admin.email)

        const referral = await referralModel.create({
            name,
            email,
            phone,
            altPhone,
            experience,
            resumUrl: `${process.env.PORT}/uploads/documents/${file}`,
            refferedBy
        })

        await sendReferralEmail(req.body, referral.resumUrl, adminEmails, senderEmail)
        
        res.status(201).json({
            success: true,
            data: referral
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { createReferralController }