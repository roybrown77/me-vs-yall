var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

var pickRepository = require('./PickRepository');

router.post('/', function (req, res) {
    pickRepository.create({
            gameId : req.body.gameId,
            userId : req.body.userId,
            pickId : req.body.pickId
        },
        function (err, pick) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(pick);
        });
});

router.get('/', function (req, res) {
    pickRepository.find({}, function (err, picks) {
        if (err) return res.status(500).send("There was a problem finding the picks.");
        res.status(200).send(picks);
    });
});

router.get('/:id', function (req, res) {
    pickRepository.findById(req.params.id, function (err, pick) {
        if (err) return res.status(500).send("There was a problem finding the pick.");
        if (!pick) return res.status(404).send("No pick found.");
        res.status(200).send(pick);
    });
});

router.delete('/:id', function (req, res) {
    pickRepository.findByIdAndUpdate(req.params.id, req.body, {deleted: true}, function (err, pick) {
        if (err) return res.status(500).send("There was a problem deleting the pick.");
        res.status(200).send(pick);
    });
});

router.put('/:id', function (req, res) {
    pickRepository.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, pick) {
        if (err) return res.status(500).send("There was a problem updating the pick.");
        res.status(200).send(pick);
    });
});

module.exports = router;