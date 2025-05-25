const express = require('express');
const upload = require('./utils/multer');
const { createUser, continueWithGoogle, verifyOtp, resendOtp, loginUser, checkNickname, checkGoogle, getOtherUsers, getUserSelf } = require('./controllers/UserController');
const { createContent, editContent, getPostsByUser, getPostsByFollowings, getPostsForFeed, likeToggle, createComment, editComment, deleteComment, deleteContent } = require('./controllers/ContentController');
const { authMiddleware } = require('./middlewares/authMiddleware');
const rt = express.Router()


rt.post('/user/create', upload.single('user_photo'), createUser)
rt.post('/user/login', loginUser)
rt.post('/user/google', continueWithGoogle)
rt.post('/user/verify', verifyOtp)
rt.post('/user/resend', resendOtp)
rt.post('/user/check/nickname', checkNickname)
rt.post('/user/check/google', checkGoogle)
rt.get('/user/get/others', authMiddleware, getOtherUsers)
rt.get('/user/get/self', authMiddleware, getUserSelf)

rt.post('/content/create', authMiddleware, upload.single('image_url'), createContent)
rt.put('/content/edit/:id', authMiddleware, editContent)
rt.delete('/content/delete/:id', authMiddleware, deleteContent)
rt.get('/content/my', authMiddleware, getPostsByUser)
rt.get('/content/followings', authMiddleware, getPostsByFollowings)
rt.get('/content/feed', authMiddleware, getPostsForFeed)
rt.put('/content/like', authMiddleware, likeToggle)
rt.post('/content/comment', authMiddleware, createComment)
rt.put('/content/comment', authMiddleware, editComment)
rt.delete('/content/comment', authMiddleware, deleteComment)


module.exports = rt