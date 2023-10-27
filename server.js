const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const port = process.env.PORT || 4000;

const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user')

const app = express();




const corsOptions = {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE, PATCH',
    allowedHeaders: 'Authorization, Content-Type'
  };
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(extname)) {
      cb(null, true); 
    } else {
      cb(new Error('Only jpg, jpeg, and png files are allowed'), false);
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  
  // Use Multer middleware to handle the file upload
app.use(upload.single('image'));



app.use('/feed', feedRouter);
app.use(userRouter);
app.use(authRouter);


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        message: message
    })
})



mongoose.connect(`mongodb+srv://${process.env.MONGO_KEY}@blog-cluster.5tqqzgl.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`)
.then((res) => {
    const server = app.listen(port, () => {
    })
    const io = require('socket.io')(server);
    io.on('connection', socket => {
      console.log('new socket connection');
    })
})
.catch(err => {
    console.log(err);
})


