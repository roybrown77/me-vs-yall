module.exports = function(app) {
    var jsonfileservice = require('./utils/jsonfileservice')();

    app.get('/api/maa', getMaa);

    function getMaa(req, res, next) {
        var json = jsonfileservice.getJsonFromFile('/../../data/maa.json');
        json[0].data.results.forEach(function(character) {
            var pos = character.name.indexOf('(MAA)');
            character.name = character.name.substr(0, pos - 1);
        });
        res.send(json);
    }

    app.get('/api/games', getGames);

    function getGames(req, res, next) {
        var json = [];
        var response = {};
        response.data = {};

        var games = [];
        var game = {};
        
        games.push(game);

        response.data.results = games;
        json.push(response);
        res.send(json);
    }
};