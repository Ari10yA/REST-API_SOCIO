const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs');
const path = require('path');


const fetchUsers = (req, res, next) => {
    User.find()
    .then(users => {
        if(!users){
            const error = new Error('Users not found!');
            error.statusCode = 404; 
            throw(error);
        }
        return res.status(200).json({
            usersData: users,
            message: 'Users Data Fetched'
        })
    
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = '500';
            }
            next(err);

    })
}

const fetchUser = (req, res, next) => {
    const userId = req.body.userId;
    User.findById({_id: userId})
    .then(user => {
        if(!user){
            const error = new Error('User not found!');
            error.statusCode = 404; 
            throw(error)
        }
        return res.status(200).json({
            userDetails : user,
            message: 'User fetched Successfully'
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = '500';
        }

        next(err)

    })
}

const updateUser = (req, res, next) => {
    const userId = req.body.userId;
    const newStatus = req.body.newStatus;

    User.findByIdAndUpdate({_id: userId})
    .then(user => {
        if(!user){
            const error = new Error('User not found!');
            error.statusCode = 404; 
            throw(error)
        }
        user.status = newStatus;
        return user.save();
    })
    .then((result) => {
        return res.status(201).json({
            result : result,
            message: 'User Saved Successfully'
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = '500';
        }

        next(err)

    })
}

module.exports = {
    fetchUser, updateUser, fetchUsers
}