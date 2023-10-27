const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const putSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;


    bcrypt.hash(password, 12)
    .then(pass => {
        const user = new User({
            email: email,
            name: name, 
            password: pass
        })
        return user.save()
    })
    .then(result => {
        res.status(201).json({
            message: 'User Created',
            userId: result._id
        })
    })
    .catch(err => {
        console.log(err);
    })
}

const postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            const error = new Error('No User Found');
            error.statusCode = 404;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
        if(!isEqual){
            const error = new Error('Wrong Password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({email: loadedUser.email, userId: loadedUser._id.toString()}, process.env.SECRET, {expiresIn: '1h'})
        res.status(200).json({token: token, userId: loadedUser._id.toString()})
    
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 404;
        next(err);
    })
}


module.exports = {
    putSignup, postLogin
}