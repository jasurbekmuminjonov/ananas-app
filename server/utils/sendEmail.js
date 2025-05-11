const nodemailer = require("nodemailer");

async function sendEmail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jasurmominjonov2818@gmail.com',
                pass: 'hwwc ymsr gwvi fwtl',
            },
        });
        const mailOptions = {
            from: "ANANAS APP 🍍 <jasurmominjonov2818@gmail.com>",
            to: email,
            subject: "Please verify your account created on Ananas.vercel.app",
            text: `Your verify code: ${otp}`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(result);
        
        return result;

    } catch (error) {
        console.error("📧 Email yuborishda xatolik:", error.message);
        throw new Error("Email yuborilmadi");
    }
}

module.exports = { sendEmail };
