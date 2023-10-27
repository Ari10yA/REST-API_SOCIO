const express = require('express');
const isAuth = require('../middleware/is-auth');

const feedController = require('../controller/feed')

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.post('/post', isAuth, feedController.createPost);

router.get('/posts/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router