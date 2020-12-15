const express = require('express');
const bodyParser = require('body-parser');

let router = express.Router();

const { articles } = require('./articles');

const get = require('lodash/get');

router.get('/articles', function (req, res) {
    res.status(200).send(articles);
});

module.exports = router;