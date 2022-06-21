const express = require('express');
const User = require('../models/user');
const router = express.Router();
// const jwt = require('jsonwebtoken');

// signup endpoint
router.post('/signup', async (req, res) => {
    const {email, password, phone, fullname} = req.body;

    // console.log(req.body);
    // checks
    if(!email || !password){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }

    try{

        const timestamp = Date.now();

        let user = new User;

        user.email = email;
        user.password = password;
        user.fullname = fullname;
        user.phone = phone;
        user.username = `${email}_${timestamp}`;
        user.img = '';
        user.img_id = '';

        user = await user.save();

        // const token = jwt.sign({
        //     _id: user._id,
        //     email: user.email
        // }, process.env.JWT_SECRET);

        // TODO: Debug later
        // console.log(user, 'here 1');
        // user['token'] = token;

        // console.log(user, 'here 2');

        return res.status(200).send({status: 'ok', msg: 'User created', user});

    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occured', e});
    }
});


// login endpoint
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    // checks
    if(!email || !password){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }

    try{

        const user = await User.findOne({email: email}).lean();
        if(!user){
            return res.status(404).send({status: 'error', msg: `No user with email: ${email} found`});
        }

        if(user.password != password){
            return res.status(400).send({status: 'error', msg: 'Email or Password incorrect'});
        }

        delete user.password

        // const token = jwt.sign({
        //     _id: user._id,
        //     email: user.email
        // }, process.env.JWT_SECRET);

        // user['token'] = token;

        return res.status(200).send({status: 'ok', msg: 'Login successful', user})

    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occured', e});
    }
});


// endpoint to delete a user
router.post('/delete_user', async (req, res) => {

    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).send({status: 'error', msg: 'All fields should be filled'});
    }
    try{
        const user = await User.deleteOne({_id: user_id});

        return res.status(200).send({status: 'ok', msg: 'delete successful', user});

    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occured', e});
    }


});

// endpoint to change password

module.exports = router;