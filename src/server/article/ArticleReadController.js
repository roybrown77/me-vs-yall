const express = require('express');
const bodyParser = require('body-parser');

let router = express.Router();

const articleRepository = require('./ArticleRepository');
const { articles } = require('./articles');

const get = require('lodash/get');

router.get('/articles', function (req, res) {
    // articleRepository.find({}, function (err, articles) {
    //     if (err) return res.status(500).send("There was a problem finding the articles.");
    //     res.status(200).send(articles);
    // });

    res.status(200).send(articles);
});

module.exports = router;