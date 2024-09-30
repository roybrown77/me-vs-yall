const express = require('express');

let router = express.Router();

const { articles } = require('./articles');

const get = require('lodash/get');

router.get('/articles', function (req, res) {
    res.status(200).send(articles);
});

module.exports = router;