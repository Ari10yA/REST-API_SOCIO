const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    status: {
        type: String,
        default: 'Hi I am new here!'
    }, 
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})


module.exports = mongoose.model('User', userSchema);