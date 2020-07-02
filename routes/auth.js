const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const { JWT_SECRET, SENDGRID_APIKEY } = require('../config/keys');

const requireLogin = require('../middleware/requireLogin');

const User = mongoose.model('User');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: SENDGRID_APIKEY
    }
}));

router.post('/signup', (req, res) => {
    const { name, email, password, imageUrl } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({
            error: "Please add required fields"
        });
    }

    User.findOne({ email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({
                    error: "User already existed with that email"
                });
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        photo: imageUrl,
                        followers: [],
                        following: []
                    });
        
                    user.save()
                        .then(user => {
                            res.json({
                                message: "Successfully signed up"
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });            
        })
        .catch(error => {
            console.log(error);
        });
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            error: "Please input email or password"
        });
    }
    User.findOne({ email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({
                    error: "Invalid email address or password"
                });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doPasswordMatched => {
                    if (doPasswordMatched) {
                        const token = jwt.sign({
                            _id: savedUser._id
                        }, JWT_SECRET);

                        const { _id, name, email, photo, followers, following } = savedUser;

                        res.json({
                            token,
                            user: {
                                _id,
                                name,
                                email,
                                photo,
                                followers,
                                following
                            }
                        });
                    } else {
                        return res.status(422).json({
                            error: "Invalid email address or password"
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        })
});

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            console.log(error);
        }
        const token = buffer.toString('hex');
        User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                return res.status(422).json({
                    error: "User not found"
                });
            }
            user.resetToken = token;
            user.expireTokenDate = Date.now() + 3600000;
            user.save()
                .then((result) => {
                    // transporter.sendMail({
                    //     to: user.email,
                    //     from: "no-repy@sample.com",
                    //     subject: "Reset Password Link",
                    //     html: `
                    //         <p>You requested for password reset</p>
                    //         <h5>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset your password</h5>    
                    //     `
                    // });
                    res.json({
                        message: "Check your email for password reset link"
                    })
                });
        });
    });
});

router.post('/new-password', (req, res) => {
    const { token, password } = req.body;
    User.findOne({
        resetToken: token,
        expireTokenDate: {
            $gt: Date.now()
        }
    })
    .then(user => {
        if (!user) {
            return res.status(422).json({
                error: "Try again, token is expired"
            });
        }
        bcrypt.hash(password, 12)
            .then(hashedPassword => {
                user.password = hashedPassword;
                user.resetToken = undefined;
                user.expireTokenDate = undefined;
                user.save()
                    .then(result => {
                        // transporter.sendMail({
                        //     to: result.email,
                        //     from: "no-repy@sample.com",
                        //     subject: "Password Successfully Changed",
                        //     html: `
                        //         <h2>Bricxtagram</h2>
                        //         <p>Your password successfully changed<p>
                        //     `
                        // });
                        
                        res.json({
                            message: "Password successfully changed"
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
    })
    .catch(error => {
        console.log(error);
    })
});

module.exports = router;