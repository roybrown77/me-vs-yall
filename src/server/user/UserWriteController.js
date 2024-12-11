const express = require('express');

let router = express.Router();

const userRepository = require('./UserRepository');

const get = require('lodash/get');

router.post('/users/', function (req, res) {
    const user = req.body;

    if (get(req, 'auth.sub') !== get(user, 'sub')) {
        return res.status(401).send();
    }

    const split = get(user, 'email').split('@')[0];

    const userToUpsert = {
            authServiceId: get(user, 'sub'),
            email: get(user, 'email'),
            firstName: get(user, 'given_name') || split.substring(1, split.length/2),
            lastName: get(user, 'family_name'),
            picture: get(user, 'picture'),
        };

    userRepository.findOneAndUpdate({authServiceId: userToUpsert.authServiceId}, userToUpsert, {upsert: true}, (error, user) => {
        if (error) return res.status(500).send("There was a problem upserting user");
        console.log('user: ' + JSON.stringify(user));
        res.status(200).send(user);
    });
});

router.put('/users/:id', function (req, res) {
    userRepository.findByIdAndUpdate(req.params.id, req.body, {}, function (error, user) {
        if (error) return res.status(500).send("There was a problem updating user");
        res.status(200).send(user);
    });
});

router.delete('/users/:id', function (req, res) {
});

module.exports = router;