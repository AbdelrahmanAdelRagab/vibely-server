import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//Register user 
 export const register = async (req,res)=>{
try{
const {
    firstName ,
    lastName,
    email,
    password,
    pictruePath,
    friends,
    location,
    occupation,
}=req.body;
const salt = await bcrypt.genSalt();
const passwordHash = await bcrypt.hash(password,salt);
const newUser= new User({
    firstName ,
    lastName,
    email,
    password:passwordHash,
    pictruePath,
    friends,
    location,
    occupation,
viewedProfile:Math.floor(Math.random()*1000),
impression:Math.floor(Math.random()*1000),

})
const savedUser = await newUser.saved();
res.status(201).json(savedUser);

}catch(err){res.status(500).json({error : err.message });
}

 };


 //login function 
 export const login = async (req,res)=> {
try {
    const {email,password}=req.body;
    const user =await User.findOne({email:email})
    if (!user)return res.status(400).json({msg:"User doesn't exist. "});
    const isMAtch = await bcrypt.compare(password,user.password);
    if (!user)return res.status(400).json({msg:"Invalid credentials. "});
    const token = jwt.sign({ id:user._id},process.env.JWT_SECRET);
    delete user.password ;
    res.status(200).json({token ,user});

} catch (err) {
    res.status(500).json({error: err.message});
    
}


 }