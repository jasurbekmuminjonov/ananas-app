const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "video_file", maxCount: 1 },
  { name: "thumbnail_file", maxCount: 1 },
]);

module.exports = uploadFields;
