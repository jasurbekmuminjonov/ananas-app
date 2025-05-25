const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const generateOTP = require('../utils/generateOtp');
const { sendEmail } = require('../utils/sendEmail');
const { uploadFile } = require('../utils/googleDrive');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
exports.createUser = async (req, res) => {
    try {
        const otp = generateOTP()
        req.body.otp = otp

        if (req.file) {
            const profilePhoto = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype)

            req.body.user_photo = `https://drive.google.com/thumbnail?id=${profilePhoto.id}&sz=w1000`
        }
        const hashedPassword = await bcrypt.hash(req.body.user_password, 10)
        req.body.user_password = hashedPassword
        const lastUser = await User.findOne().sort({ createdAt: -1 });
        const nextId = lastUser ? parseInt(lastUser.user_id) + 1 : 1;
        req.body.user_id = String(nextId).padStart(6, '0');
        await sendEmail(req.body.user_email, otp)
        await User.create(req.body)
        return res.status(201).json({ message: "Muvaffaqiyatli ro'yhatdan o'tdingiz", email: req.body.user_email })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik", err });
    }
}

exports.continueWithGoogle = async (req, res) => {
    try {
        const { user_email, user_photo, user_nickname } = req.body
        const user = await User.findOne({ user_email })

        if (!user) {
            const lastUser = await User.findOne().sort({ createdAt: -1 });
            const nextId = lastUser ? parseInt(lastUser.user_id) + 1 : 1;
            const newUser = await User.create({
                user_email, user_photo, user_nickname, status: 'verified', user_password: null, user_id: String(nextId).padStart(6, '0'), otp: '000000'
            })
            const payload = {
                userId: newUser._id
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
            return res.status(201).json({ token, email: user_email, user_id: user._id })
        } else {
            const payload = {
                userId: user._id
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
            return res.status(200).json({ token, email: user.user_email, user_id: user._id })
        }

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { user_email, otp } = req.body
        const otpUser = await User.findOne({ user_email })
        if (!otpUser) {
            return res.status(404).json({ message: "Bunday foydalanuvchi topilmadi" });
        }
        if (otpUser.status !== 'unverified') {
            return res.status(409).json({ message: "Sizning hisobingiz allaqachon tasdiqlangan" })
        }
        const isMatch = otpUser.otp === otp
        if (!isMatch) {
            return res.status(400).json({ message: "Xato kod kiritildi" })
        }
        otpUser.status = 'verified'
        await otpUser.save()
        const payload = {
            userId: otpUser._id
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.status(201).json({ token, email: user_email, user_id: otpUser._id })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.resendOtp = async (req, res) => {
    try {
        const { user_email } = req.body;

        const user = await User.findOne({ user_email });

        if (!user) {
            return res.status(404).json({ message: "Bunday foydalanuvchi topilmadi" });
        }

        if (user.status === 'verified') {
            return res.status(409).json({ message: "Bu foydalanuvchi allaqachon tasdiqlangan" });
        }

        const newOtp = generateOTP();
        user.otp = newOtp;
        await user.save();

        await sendEmail(user.user_email, newOtp);

        return res.status(200).json({ message: "Yangi kod yuborildi", email: user.user_email });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { user_email, user_password } = req.body
        const user = await User.findOne({ user_email })
        if (!user) {
            return res.status(400).json({ message: 'Bunday hisob mavjud emas' })
        }
        if (!user.user_password) {
            return res.status(400).json({ message: "Foydalanuvchi google orqali ro'yhatdan o'tgan" })
        }
        const isMatch = await bcrypt.compare(user_password, user.user_password)
        if (!isMatch) {
            return res.status(400).json({ message: "Parol noto'g'ri" });
        }

        const payload = {
            userId: user._id
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.status(201).json({ token, email: user_email, user_id: user._id });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.checkNickname = async (req, res) => {
    try {
        const { nickname } = req.body
        const existUser = await User.findOne({ user_nickname: nickname })
        return res.json({ isSelectable: existUser ? false : true })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.checkGoogle = async (req, res) => {
    try {
        const { user_email } = req.body
        const user = await User.findOne({ user_email })
        return res.send(user ? true : false)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.getOtherUsers = async (req, res) => {
    try {
        const { userId } = req.user
        const users = await User.find({
            _id: { $ne: new mongoose.Types.ObjectId(userId) }
        });
        res.json(users)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.getUserSelf = async (req, res) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId)
        res.json(user)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}