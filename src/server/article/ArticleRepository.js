const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
	title: String,
    content: String,
    leagueName: String,
    date: 'date',
    author: String,
    lockOfTheWeek: mongoose.Schema.Types.Boolean,
    correct: mongoose.Schema.Types.Boolean
});

module.exports = mongoose.model('Article', ArticleSchema);