const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');

const router = express.Router();

// endpoint to view a profile
router.post('/view_profile', async (req, res) => {
    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        

        let user = await User.findOne({_id: user_id}).select(['-password']).lean();

        // check if user exists
        if(!user)
          return res.status(404).send({status: 'error', msg: 'user not found'});

        return res.status(200).send({status: 'ok', msg: 'Success', user});
    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});



// endpoint to edit a profile
router.post('/edit', upload.single('profile-img'), async (req, res) => {
    const {user_id, fullname, username} = req.body;

    // if(!token){
    //     return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    // }

    try{
        // let user = jwt.verify(token, process.env.JWT_SECRET);

        const mUser = await User.findOne({_id: user_id}).lean();

        if(!mUser){
            return res.status(404).send({status: 'error', msg: `No user with id ${user_id} found`});
        }

        // check if the user has a previous profile img
        let img;
        let img_id;
        // if(req.file){
        //     let result;
        //     if(mUser.img !== ''){
        //         await cloudinary.uploader.destroy(mUser.img_id);
        //         result = await cloudinary.uploader.upload(req.file.path, {folder: 'profile_imgs'});
        //         img = result.secure_url;
        //         img_id = result.public_id;
        //     }
        // }

        const data = {
            fullname: fullname || mUser.fullname,
            username: username || mUser.username,
            img: img || mUser.img,
            img_id: img_id || mUser.img_id
        };

        const user = await User.findOneAndUpdate(
            {_id: user_id},
            data,
            {new: true}
        );

        return res.status(200).send({status: 'ok', msg: 'Success', user});
    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

module.exports = router;