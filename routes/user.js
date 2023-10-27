const express = require('express');
const isAuth = require('../middleware/is-auth');

const userController = require('../controller/user')

const router = express.Router();

router.get('/users', userController.fetchUsers);

router.post('/user', isAuth,  userController.fetchUser);

router.patch('/updateuser', isAuth,  userController.updateUser);

module.exports = router;