import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet'
import morgan from 'morgan';
import path from 'path';
import authRoutes from './routes/auth.js';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { verifyToken } from './middleware/auth.js';
import {createPost} from './controllers/posts.js';
import User from './models/User.js';
import Post from './models/posts.js';
import {users,posts} from './data/index.js';

//Configirations :-
const __filename = fileURLToPath(import.meta.url)
const __direname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
app.use(morgan('common'));
app.use(bodyParser.json({limit:'30mb',extended: true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended: true}));
app.use(cors());
app.use("/assets",express.static(path.join(__direname,'public/assets')));

//Filestorage:-
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"public/assets");},
        filename:function(req,file,cb){
            cb(null,file.originalname);
        }
});
const upload = multer({storage});
//Routes with files                                 controller
app.post("/auth/register",upload.single("picture"),register); //
app.post('post',verifyToken,upload.single("picture"),createPost)
//Routes 
app.use('/auth',authRoutes);
app.use("/users",userRoutes);
app.use('/posts',postRoutes);
//Mongoose setup 
const PORT = process.env.PORT || 7000;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true ,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`server is running on port: ${PORT}`))
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error)=> console.log(`${error} didn't connect`));
console.log("Ac-Milan");