const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretPass = process.env.SECRET;

module.exports = (req, res, next) => {
    if(!req.get('Authorization')){
        const error = new Error('Not authorized');
        error.statusCode = 401;
        throw error
    }

    const token = req.get('Authorization').split(' ')[1];

    try{
        decodedToken = jwt.verify(token, secretPass);
    }
    catch(err){
        err.statusCode=500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not Authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}