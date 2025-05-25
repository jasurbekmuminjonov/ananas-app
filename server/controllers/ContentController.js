const Content = require('../models/ContentModel');
const User = require('../models/UserModel');
const { uploadFile } = require('../utils/googleDrive');



exports.getPostsByUser = async (req, res) => {
    try {
        const { userId } = req.user
        const posts = await Content.find({ user_id: userId })
        return res.json(posts)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.getPostsByFollowings = async (req, res) => {
    try {
        const { userId } = req.user
        const user = User.findById(userId)

        const posts = await Content.find({
            user_id: { $in: user.followings }
        }).sort({ createdAt: -1 });

        return res.status(200).json(posts);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.getPostsForFeed = async (req, res) => {
    try {
        const { userId } = req.user;

        const posts = await Content.find({
            views: { $ne: userId }
        })
            .limit(10)
            .populate("user_id")
            .populate("comments.user_id")
            .exec();

        return res.status(200).json(posts);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}


exports.createContent = async (req, res) => {
    try {
        const image = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype)
        const { userId } = req.user
        req.body.user_id = userId
        req.body.image_url = `https://drive.google.com/thumbnail?id=${image.id}&sz=w1000`

        await Content.create(req.body)
        return res.status(201).json({ message: "Post joylandi" })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.editContent = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.user
        const content = await Content.findOneAndUpdate({ _id: id, user_id: userId }, req.body, { new: true })
        if (!content) {
            res.status(404).json({ message: "Bunday post mavjud emas" })
        }
        return res.status(200).json({ message: "Post tahrirlandi" })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.deleteContent = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.user
        await Content.findOneAndDelete({ _id: id, user_id: userId })
        return res.status(204).send()

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.likeToggle = async (req, res) => {
    try {
        const { content_id } = req.query
        const { userId } = req.user
        const content = await Content.findById(content_id)
        const isLiked = content.likes.some(id => id.toString() === userId.toString())

        if (isLiked) {
            content.likes.filter(item => item.toString() !== userId.toString())
        } else {
            content.likes.push(userId)
        }
        await content.save()
        return res.status(200).json({ ok: true })


    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.createComment = async (req, res) => {
    try {
        const { text } = req.body
        const { userId } = req.user
        const { content_id } = req.query
        await Content.findByIdAndUpdate(content_id, { $push: { comments: { user_id: userId, text } } })
        return res.status(201).json({ ok: true })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.editComment = async (req, res) => {
    try {
        const { content_id, comment_id } = req.query
        await Content.updateOne(
            { _id: content_id, "comments._id": comment_id },
            { $set: { "comments.$.text": req.body.text } }
        )


    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const { content_id, comment_id } = req.query
        await Content.updateOne(
            { _id: content_id },
            { $pull: { comments: { _id: comment_id } } }
        )
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}