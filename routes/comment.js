const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken');

// change to returning a list of 10 most recent comments
// instead of just the most recent comment
const router = express.Router();

// endpoint to make a comment on a post
router.post('/comment', async (req, res) => {
    const {comment, post_id, owner_name, owner_img, comment_id, user_id} = req.body;

    if(!post_id || !comment || !owner_name || !user_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

   
    try{
        
        let mComment = new Comment;
        mComment.comment = comment;
        mComment.comment_id = comment_id || '',
        mComment.post_id = post_id;
        mComment.owner_id = user_id;
        mComment.owner_name = owner_name;
        mComment.owner_img = owner_img || '';
        mComment.timestamp = Date.now();
        
        const token = jwt.sign({
            _id: mComment._id,
            ownername: mComment.owner_name
        }, process.env.JWT_SECRET);
        mComment = await mComment.save();

        const post = await Post.findOneAndUpdate(
            {_id: post_id},
            {"$inc": {comment_count: 1}},
            {new: true}
        );
        
        return res.status(200).send({status: 'ok', msg: 'Success', post, comment: mComment, token});

    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to get comments of a post
router.post('/get_comments', async (req, res) => {
    const {token, post_id, pagec} = req.body;

    if(!token || !post_id || !pagec){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const resultsPerPage = 2;
        let page = pagec >= 1 ? pagec : 1;
        page = page -1;

        const comments = await Comment.find({post_id})
        .sort({timestamp: 'desc'})
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .lean();

        return res.status(200).send({status: 'ok', msg: 'Success', comments});
    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to delete a comment

// endpoint to edit a comment

// endpoint to reply a comment

module.exports = router;