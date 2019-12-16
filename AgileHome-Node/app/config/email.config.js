const nodemailer = require("nodemailer");
const tp={}

tp.email="" //Your e-mail
tp.transporter = nodemailer.createTransport({
	host: "smtp.live.com",
	port: 25,
	secure: false, // true for 465, false for other ports
	auth: {
		user: tp.email,
		pass: "" //Your password
	},
	tls: { rejectUnauthorized: false }
  })

  module.exports = tp;