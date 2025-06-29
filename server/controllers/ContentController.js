const fs = require("fs");
const path = require("path");
const Video = require("../models/VideoModel");
const Image = require("../models/ImageModel");
const Content = require("../models/ContentModel");

const generateId = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 5 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

exports.createVideo = async (req, res) => {
  try {
    const { content_title, content_description } = req.body;
    console.log(req.body);

    const videoFile = req.files?.video_file?.[0];
    const thumbnailFile = req.files?.thumbnail_file?.[0];

    if (!videoFile || !thumbnailFile) {
      return res
        .status(400)
        .json({ message: "Video va Thumbnail fayllar majburiy" });
    }

    const videoId = generateId();
    const imageId = generateId();

    const videoExt = path.extname(videoFile.originalname);
    const imageExt = path.extname(thumbnailFile.originalname);

    const videoFileName = `${videoId}${videoExt}`;
    const imageFileName = `${imageId}${imageExt}`;

    const videosDir = path.join(__dirname, "..", "videos");
    const imagesDir = path.join(__dirname, "..", "images");

    if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

    fs.writeFileSync(path.join(videosDir, videoFileName), videoFile.buffer);
    fs.writeFileSync(path.join(imagesDir, imageFileName), thumbnailFile.buffer);

    const hostname = `${req.protocol}://${req.get("host")}`;

    const newVideo = await Video.create({
      video_name: videoFile.originalname,
      video_type: videoFile.mimetype,
      video_size: videoFile.size,
      video_id: videoId,
    });

    const newImage = await Image.create({
      image_name: thumbnailFile.originalname,
      image_type: thumbnailFile.mimetype,
      image_size: thumbnailFile.size,
      image_id: imageId,
    });

    const newContent = await Content.create({
      video_file_link: `${hostname}/videos/${videoId}`,
      thumbnail_file_link: `${hostname}/images/${imageId}`,
      content_title,
      content_description,
      user_id: req.user.userId,
    });

    return res.status(201).json({
      message: "Yuklash muvaffaqiyatli",
      video: newVideo,
      image: newImage,
      content: newContent,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const { video_id } = req.params;
    const video = await Video.findOne({ video_id });

    if (!video) return res.status(404).json({ message: "Video topilmadi" });

    const videoPath = path.join(
      __dirname,
      "..",
      "videos",
      `${video_id}${path.extname(video.video_name)}`
    );
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": video.video_type,
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": video.video_type,
      });
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server xatosi" });
  }
};

exports.getImageById = async (req, res) => {
  try {
    const { image_id } = req.params;
    const image = await Image.findOne({ image_id });

    if (!image) return res.status(404).json({ message: "Rasm topilmadi" });

    const imagePath = path.join(
      __dirname,
      "..",
      "images",
      `${image_id}${path.extname(image.image_name)}`
    );
    return res.sendFile(imagePath);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server xatosi" });
  }
};

exports.getContents = async (req, res) => {
  try {
    const contents = await Content.find();
    return res.json(contents);
  } catch (err) {
    console.log(err.message);
    return response.error(res, "Serverda xatolik", 500);
  }
};

// const User = require("../models/UserModel");
// const { uploadFile } = require("../utils/googleDrive");

// exports.getPostsByUser = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const posts = await Content.find({ user_id: userId });
//     return res.json(posts);
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.getPostsByFollowings = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const user = User.findById(userId);

//     const posts = await Content.find({
//       user_id: { $in: user.followings },
//     }).sort({ createdAt: -1 });

//     return res.status(200).json(posts);
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.getPostsForFeed = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     const posts = await Content.find({
//       views: { $ne: userId },
//     })
//       .limit(10)
//       .populate("user_id")
//       .populate("comments.user_id")
//       .exec();

//     return res.status(200).json(posts);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.createContent = async (req, res) => {
//   try {
//     const image = await uploadFile(
//       req.file.buffer,
//       req.file.originalname,
//       req.file.mimetype
//     );
//     const { userId } = req.user;
//     req.body.user_id = userId;
//     req.body.image_url = `https://drive.google.com/thumbnail?id=${image.id}&sz=w1000`;

//     await Content.create(req.body);
//     return res.status(201).json({ message: "Post joylandi" });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.editContent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.user;
//     const content = await Content.findOneAndUpdate(
//       { _id: id, user_id: userId },
//       req.body,
//       { new: true }
//     );
//     if (!content) {
//       res.status(404).json({ message: "Bunday post mavjud emas" });
//     }
//     return res.status(200).json({ message: "Post tahrirlandi" });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.deleteContent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.user;
//     await Content.findOneAndDelete({ _id: id, user_id: userId });
//     return res.status(204).send();
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.likeToggle = async (req, res) => {
//   try {
//     const { content_id } = req.query;
//     const { userId } = req.user;
//     const content = await Content.findById(content_id);
//     const isLiked = content.likes.some(
//       (id) => id.toString() === userId.toString()
//     );

//     if (isLiked) {
//       content.likes.filter((item) => item.toString() !== userId.toString());
//     } else {
//       content.likes.push(userId);
//     }
//     await content.save();
//     return res.status(200).json({ ok: true });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.createComment = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const { userId } = req.user;
//     const { content_id } = req.query;
//     await Content.findByIdAndUpdate(content_id, {
//       $push: { comments: { user_id: userId, text } },
//     });
//     return res.status(201).json({ ok: true });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.editComment = async (req, res) => {
//   try {
//     const { content_id, comment_id } = req.query;
//     await Content.updateOne(
//       { _id: content_id, "comments._id": comment_id },
//       { $set: { "comments.$.text": req.body.text } }
//     );
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };

// exports.deleteComment = async (req, res) => {
//   try {
//     const { content_id, comment_id } = req.query;
//     await Content.updateOne(
//       { _id: content_id },
//       { $pull: { comments: { _id: comment_id } } }
//     );
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: "Serverda xatolik" });
//   }
// };
