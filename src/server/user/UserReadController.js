const express = require('express');
const bodyParser = require('body-parser');

let router = express.Router();

const userRepository = require('./UserRepository');

const get = require('lodash/get');

const censoredIds = ['google-oauth2|105396867324708249567'];
const excludedIds = [];

const vegas = {
    authServiceId: 1,
    firstName: 'Vegas'
};

const mvyKingHomer = {
    authServiceId: 2,
    firstName: 'King Homer'
};

const mvyKingRoad = {
    authServiceId: 3,
    firstName: 'King Offense'
};

const mvyKingDefense = {
    authServiceId: 4,
    firstName: 'King Defense'
};

const mvyKingRoadHome = {
    authServiceId: 5,
    firstName: 'King Road vs Homer'
};

const mvyMonday = {
    authServiceId: 7,
    firstName: 'King Monday'
};

const mvyThursday = {
    authServiceId: 8,
    firstName: 'King Thursday'
};

const mvySaturday = {
    authServiceId: 9,
    firstName: 'King Saturday'
};

const mvyRandomSunday = {
    authServiceId: 10,
    firstName: 'King Don Do it Shark'
};

const mvySundaySingle = {
    authServiceId: 11,
    firstName: 'King Sunday'
};

const mvyMultiVegas= {
    authServiceId: 12,
    firstName: 'Kang Multivegas'
};

const mvyRoadie = {
    authServiceId: 14,
    firstName: 'King Roadie'
};

const mvyKingDefenseHomer = {
    authServiceId: 15,
    firstName: 'King Sunday X'
};

const mvyKingDefenseRoadie = {
    authServiceId: 17,
    firstName: 'King Road vs Homer X'
};

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
        
        res.status(200).send([
            ...goodUsers, 
            vegas, 
            mvyKingHomer, 
            mvyKingRoad, 
            mvyKingDefense, 
            mvyKingRoadHome, 
            mvyMonday, 
            mvyThursday, 
            mvySaturday, 
            mvyRandomSunday,
            mvySundaySingle,
            mvyMultiVegas,
            mvyRoadie,
            mvyKingDefenseHomer,
            mvyKingDefenseRoadie
        ]);
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