var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

var userRepository = require('./UserRepository');

router.post('/users/', function (req, res) {
    userRepository.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

router.get('/users/', function (req, res) {
    userRepository.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

router.get('/users/:id', function (req, res) {
    userRepository.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

router.delete('/users/:id', function (req, res) {
    userRepository.findByIdAndUpdate(req.params.id, req.body, {deleted: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send(user);
    });
});

router.put('/users/:id', function (req, res) {
    userRepository.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

module.exports = router;