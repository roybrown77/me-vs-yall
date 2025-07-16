const express = require('express');

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
    firstName: 'King Doom'
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
    firstName: 'King Sharp'
};

const mvySundaySingle = {
    authServiceId: 11,
    firstName: 'King Sunday'
};

const mvyKang = {
    authServiceId: 12,
    firstName: 'King Kang'
};

const mvyRoadie = {
    authServiceId: 14,
    firstName: 'King Roadie'
};

const mvyKingDefenseHomer = {
    authServiceId: 15,
    firstName: 'King Magneto'
};

const mvyKingDefenseRoadie = {
    authServiceId: 17,
    firstName: 'King Thanos'
};

const mvyQueenRogue = {
    authServiceId: 18,
    firstName: 'Queen Rogue'
};

const mvyQueenStorm = {
    authServiceId: 19,
    firstName: 'Queen Storm'
};

router.get('/users', async function (req, res) {
    try {
        const users = await userRepository.find({});
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
            mvyKang,
            mvyRoadie,
            mvyKingDefenseHomer,
            mvyKingDefenseRoadie,
            mvyQueenRogue,
            mvyQueenStorm,
        ]);
    } catch (error) {
        console.log("Get users error: ", error);
        return res.status(500).send("There was a problem fetching users");
    }
});

router.get('/users/:id', async function (req, res) {
    try {
        const user = await userRepository.findById(req.params.id);
        if (!user) return res.status(404).send("User not found");
        user.email = undefined;
        user.picture = censoredIds.includes(x.authServiceId) ? null : x.picture;
        user.lastName = !!get(user,'lastName') ? (get(user,'lastName')[0] + '.' + (excludedIds.includes(user.authServiceId) ? ' - excluded' : '')) : '';
        res.status(200).send(user);
    } catch (error) {
        console.log("Get user error: ", error);
        return res.status(500).send("There was a problem fetching user");
    }
});

module.exports = router;