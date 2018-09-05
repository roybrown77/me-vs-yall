const express = require('express');
const bodyParser = require('body-parser');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const userRepository = require('./UserRepository');

const get = require('lodash/get');

router.get('/users', function (req, res) {
    userRepository.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        users.map(user=>{
            const x = user;
            x.email = undefined;
            x.lastName = !!get(user,'lastName') ? get(user,'lastName')[0] + '.' : '';
            return x;
        });
        res.status(200).send(users);
    });
});

router.get('/users/:id', function (req, res) {
    userRepository.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        user.email = undefined;
        user.lastName = !!get(user,'lastName') ? get(user,'lastName')[0] + '.' : '';
        res.status(200).send(user);
    });
});

module.exports = router;