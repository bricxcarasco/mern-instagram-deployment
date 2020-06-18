const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/keys');

const requireLogin = require('../middleware/requireLogin');

const User = mongoose.model('User');

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

module.exports = router;