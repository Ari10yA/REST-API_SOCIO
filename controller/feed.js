const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs');
const path = require('path');




const getPosts = (req, res, next) => {
    let currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems = 2;
    Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find().populate('creator').skip((currentPage - 1) * perPage).limit(perPage)
    })
    .then(result => {
        res.status(200).json({
            posts: result,
            totalItems: totalItems,
            message: 'posts fetched successfully'
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    })

    
}

const createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    let createdPost;
    const userId = req.userId;
    if(!req.file){
        const error = new Error('No image found')
        error.statusCode = 422;
        throw error;
    }
    const forwardSlashPath = req.file.path.replace(/\\/g, '/');
    const post = new Post({
        title: title,
        content: content,
        creator: userId,
        imageUrl: forwardSlashPath
    })

    post.save()
    .then(result=> {
        createdPost = result;
        return User.findById(userId)

    })
    .then(user => {
        user.posts.push(post);
        return user.save();

    })
    .then(result => {
        return res.json({
            post: createdPost,
            message: 'succesfully created post'
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    })
}

const getPost = (req, res, next) => {
    const postId = req.params.postId

    Post.find({_id: postId})
    .populate('creator')
    .then(post => {
        if(!post){
            const error = new Error('Cound Not found');
            error.statusCode = 404;
            throw error;
        }
        
        res.status(200).json({
            post: post,
            message: 'Post data found'
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

const updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;

    let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path.replace(/\\/g, '/');
    }

    if(!imageUrl){
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error
    }

    Post.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error('post not found');
            err.statusCode = 422;
            throw err;
        }
        if(post.creator.toString() !== req.userId){
            const err = new Error('Not authorized');
            err.statusCode = 403;
            throw err;
        }
        if(imageUrl !==post.imageUrl){
            clearImage(post.imageUrl)
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save()
    })
    .then(result => {
        res.status(201).json({
            message: 'Post Updated',
            post: result
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

const deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then((post) => {
        if(!post){
            const error = new Error('Post Not found!');
            error.statusCode = 404;
            throw error;
        }
        if(post.creator.toString() !== req.userId){
            const err = new Error('Not authorized');
            err.statusCode = 403;
            throw err;
        }
        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(postId)
    })
    .then(result => {
        return User.findById(req.userId);
        
    })
    .then(user => {
        user.posts.pull(postId);
        return user.save();
    })
    .then(result => {
        res.status(200).json({message: 'Deleted Post'})
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

const clearImage = filePath => {
    filePath  = path.join(__dirname, '../', filePath);
    fs.unlink(filePath, err => console.log(err))
}





module.exports = {
    getPosts, createPost, getPost, updatePost, deletePost
}