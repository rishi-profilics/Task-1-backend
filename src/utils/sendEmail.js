const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
})

const sendReferralEmail = async (data, resumePath, admin, senderEmail) => {
  const adminMail = {
    from: process.env.EMAIL,
    to: admin,
    subject: `New Referral for ${data.name}` ,
    html: `
      <h3>New Referral</h3>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Refered by:</b> ${senderEmail}</p>
    `,
    attachments: [
      {
        filename: `${data.name.replace(/\s+/g, '-')}-resume.pdf`,
        path: resumePath
      }
    ]
  }

    const candidateMail = {
    from: process.env.EMAIL,
    to: data.email,
    subject: "You have been referred for a job opportunity",
    html: `
      <h3>Hello ${data.name},</h3>
      <p>You have been referred for a job opportunity at our company.</p>
      <p>Our HR team will review your profile and contact you if it matches our requirements.</p>
      <br/>
      <p>Best regards</p>
      <p>Recruitment Team</p>
    `
  }

  await Promise.all([
    transporter.sendMail(adminMail),
    transporter.sendMail(candidateMail)
  ])

}

module.exports = sendReferralEmail