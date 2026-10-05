const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const omit = require('lodash/omit');

const pickRepository = require('../pick/PickRepository');
const userRepository = require('./UserRepository');

let router = express.Router();

const get = require('lodash/get');

const censoredIds = ['google-oauth2|105396867324708249567', 'google-oauth2|116142512598652278859'];
const excludedIds = [];
const adminUsers = [
    'google-oauth2|114172296334563495985', // me
    'google-oauth2|105181436400264546077', // me vs yall
];

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
        const gameType = req.query?.gameType;
        const leagueId = req.query?.leagueId;
        const year = req.query?.year;
        
        const search = {
            leagueId: new mongoose.Types.ObjectId(leagueId),
            userId: req.query?.userId,
            year: year,
            gameType: gameType === "1" ? 1 : { $ne: 1 },
            createDateTime: {
                $gte: new Date(moment(req.query?.beginDateTime)),
                $lte: new Date(moment(req.query?.endDateTime))
            }
            };
            
        const finalSearch = omit(search, 
            [
                req.query?.userId ?? 'userId', 
                !(req.query?.beginDateTime && req.query?.endDateTime) || req.query?.beginDateTime === '-1' ? 'createDateTime' : undefined
            ]
        );

        const picks = await pickRepository.find(finalSearch);

        const authServiceIds = [
            ...new Set(
                (picks || [])
                    .map((pick) => pick.userId)
                    .filter((id) => id != null && String(id).includes('|'))
            ),
        ];

        const users = authServiceIds.length
            ? await userRepository.find({ authServiceId: { $in: authServiceIds } })
            : [];

        const filteredUsers = users.filter((user) =>
            picks.some((pick) => pick.userId === user.authServiceId)
        );
        const finalUsers = [];
        filteredUsers.forEach(user=>{
            const x = user;
            x.email = undefined;
            x.picture = censoredIds.includes(x.authServiceId) ? null : x.picture;
            x.lastName = !!get(user,'lastName') ? (get(user,'lastName')[0] + '.' + (excludedIds.includes(user.authServiceId) ? ' - excluded' : '')) : '';
            finalUsers.push(x);
        });

        const kingsAndQueens = [ 
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
        ];

        console.log('Request by:', req.query?.authId);

        res.status(200).send([
            ...finalUsers, 
            vegas,
            mvyKingHomer,
            ...(adminUsers.includes(req.query?.authId) ? kingsAndQueens : []),
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