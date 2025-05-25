const nodemailer = require("nodemailer");

async function sendEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jasurmominjonov2818@gmail.com",
        pass: "hwwc ymsr gwvi fwtl",
      },
    });

    const mailOptions = {
      from: "ANANAS APP 🍍 <jasurmominjonov2818@gmail.com>",
      to: email,
      subject: "🔐 Verify your account - Ananas.vercel.app",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #333;">Ananas Account Verification</h2>
          <p style="font-size: 16px; color: #555;">
            Please use the following code to verify your account:
          </p>
          <div style="margin: 20px auto; width: fit-content; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px 30px; border-left: 5px solid #00b96b;">
            <h1 style="margin: 0; font-size: 28px; color: #00b96b;">${otp}</h1>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.error("📧 Email yuborishda xatolik:", error.message);
    throw new Error("Email yuborilmadi");
  }
}

module.exports = { sendEmail };
