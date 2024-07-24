import express from 'express';
import Post from '../models/posts.js'
import User from '../models/User.js';
//create
export const createPost = async (req,res)=> {

try {

    const {userId,desciption,picturePath}=req.body;
    const user = await User.findById(userId);
    const newPost = new Post ({
userId,
firstName : user.firstName,
lastName:user.lastName,
location:user.location,
desciption,
userpicturePath:user.picturePath,
picturePath,
likes :{},
comments:[],


    });
    await newPost.save();
    const post = await Post.find();
    res.status(201).json(post)


    
} catch (err) {
    res.status(409).json({message:err.message})
}

}
//read 
export const getFeedPosts = async (req,res )=> {


    try {
        const post = await Post.find();
        res.status(200).json(post)
        
    } catch (err) {
        res.status(404).json({message:err.message})
        
    }
}

export const getUserPosts = async (req,res)=>{

try {
    const {userId}=req.params;
    const post = await Post.find({userId});
    res.status(200).json(post);

} catch (err) {
    res.status(404).json({message:err.message})
    
}

}

//update 
export const likePost =async (req,res)=>{

    try {
        const {id}= req.params;
        const {userId}=req.body;
        const Post = await Post.findById(id);
        const isLiked=post.likes.get(userId);


        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId,true);
        }

        res.status(200).json();
        const updatedPost = await Post.findbyIdAndUpdate(
            id,
            {likes: Post.likes},
            {new:true}
        )
    } catch (error) {
        
    }
}