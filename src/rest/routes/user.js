const express = require('express');
const router = new express.Router();
const ResponseData = require('../../modals/response');
const User = require('../../db/schema/user');

router.post('/users/login', (req, res) => {
    const email = req.body && req.body.email;
    const password = req.body && req.body.password;
    let responseData = new ResponseData();
    if (email && password) {
        User.findByEmail(email, password).then((user) => {
            if (user.password !== password) {
                responseData.setData([], 'Not matching password');
                res.send(responseData);
            } else {
                const token = User.getJWT({
                    id: user._id,
                    email: user.email
                });
                responseData.setData({token}, 'success');
                res.send(responseData);
            }
        }).catch(() => {
            res.status(401);
            responseData.setData([], 'Failed during login');
            res.send(responseData);
        });
    } else {
        res.status(401);
        responseData.setData([], 'Input missings');
        res.send(responseData);
    }
});

router.post('/users/create', (req, res) => {
    const email = req.body && req.body.email;
    const password = req.body && req.body.password;
    let responseData = new ResponseData();
    if (email && password) {
        const user = new User({
            email: email,
            password: password
        })
        user.save().then((me) => {
            res.status(200);
            responseData.setData([], `created ${me.email}`);
            res.send(responseData);
        }).catch(() => {
            res.status(401);
            responseData.setData([], 'Failed during create');
            res.send(responseData);
        });
    } else {
        res.status(401);
        responseData.setData([], 'Input missings');
        res.send(responseData);
    }
});

module.exports = router;