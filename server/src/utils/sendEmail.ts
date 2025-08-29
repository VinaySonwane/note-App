import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async (options: EmailOptions) => {
  // 1. Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: '"Note App" <no-reply@noteapp.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
