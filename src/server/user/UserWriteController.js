const express = require('express');
const bodyParser = require('body-parser');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const userRepository = require('./UserRepository');

const get = require('lodash/get');

router.post('/users/', function (req, res) {
    const user = req.body;
    const userToUpsert = {
            authServiceId: get(user, 'sub'),
            email: get(user, 'email'),
            firstName: get(user, 'given_name'),
            lastName: get(user, 'family_name'),
            picture: get(user, 'picture'),
        };

    console.log('userToUpsert: ' + JSON.stringify(userToUpsert));

    userRepository.findOneAndUpdate({authServiceId: userToUpsert.authServiceId}, userToUpsert, {upsert: true}, (err, user) => {
        if (err) return res.status(500).send("There was a problem upserting the user to the database.");
        console.log('user: ' + JSON.stringify(user));
        res.status(200).send(user);
    });
});

router.put('/users/:id', function (req, res) {
    userRepository.findByIdAndUpdate(req.params.id, req.body, {}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

router.delete('/users/:id', function (req, res) {
    // userRepository.findByIdAndUpdate(req.params.id, req.body, {}, function (err, user) {
    //     if (err) return res.status(500).send("There was a problem deleting the user.");
    //     res.status(200).send(user);
    // });
});

module.exports = router;