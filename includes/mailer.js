const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to, attachments) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: "587",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  let r = attachments
  let y = r.substring(1).split('#')
  let x = []
  for (let i = 0; i < y.length; i++) {
      x.push({
              filename: y[i],
              path: './uploads/'+y[i]
      })
  }

  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
    attachments: x
  };

  // Send Email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = { sendEmail };