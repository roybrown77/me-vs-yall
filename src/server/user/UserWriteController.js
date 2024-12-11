const express = require('express');

let router = express.Router();

const userRepository = require('./UserRepository');

const get = require('lodash/get');

router.post('/users/', async function (req, res) {
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

    try {
        const user = await userRepository.findOneAndUpdate(
            { authServiceId: userToUpsert.authServiceId }, // Query filter
            userToUpsert,                                  // Update object
            { upsert: true, new: true }                    // Options: upsert and return updated/created document
        );
        console.log('User upserted:', JSON.stringify(user));
        res.status(200).send(user);
    } catch (error) {
        console.error("Upserting user error:", error);
        res.status(500).send("There was a problem upserting the user");
    }
});

router.put('/users/:id', async function (req, res) {
    try {
        const user = await userRepository.findByIdAndUpdate(
            req.params.id,   // ID of the document
            req.body,        // Update object
            { new: true }    // Return the updated document
        );
        if (!user) {
            console.error("User not found");
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        console.error("Updating user error:", error);
        res.status(500).send("There was a problem updating the user");
    }
});

router.delete('/users/:id', function (req, res) {
});

module.exports = router;