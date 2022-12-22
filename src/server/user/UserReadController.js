const express = require('express');
const bodyParser = require('body-parser');

let router = express.Router();

const userRepository = require('./UserRepository');

const get = require('lodash/get');

const censoredIds = ['google-oauth2|105396867324708249567'];
const excludedIds = [];
const vegas = {firstName: 'Vegas',authServiceId: '1'};

router.get('/users', function (req, res) {
    userRepository.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        const goodUsers = [];
        users.forEach(user=>{
            const x = user;
            x.email = undefined;
            x.picture = censoredIds.includes(x.authServiceId) ? null : x.picture;
            x.lastName = !!get(user,'lastName') ? (get(user,'lastName')[0] + '.' + (excludedIds.includes(user.authServiceId) ? ' - excluded' : '')) : '';
            goodUsers.push(x);
        });
        res.status(200).send([...goodUsers,vegas]);
    });
});

router.get('/users/:id', function (req, res) {
    userRepository.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        user.email = undefined;
        user.picture = censoredIds.includes(x.authServiceId) ? null : x.picture;
        user.lastName = !!get(user,'lastName') ? (get(user,'lastName')[0] + '.' + (excludedIds.includes(user.authServiceId) ? ' - excluded' : '')) : '';
        res.status(200).send(user);
    });
});

module.exports = router;