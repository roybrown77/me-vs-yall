(function() {
    'use strict';

    angular
        .module('app.head2heads')
        .controller('Head2heads', Head2heads);

    /* @ngInject */
    function Head2heads(dataservice, logger, $q) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'Head 2 Heads';

        vm.games = [];
        vm.competitors = [];

        activate();

        function activate() {
            getGames();
        }

        function getGames() {
            var promise = dataservice.getGames();

            var all = $q.all([
                promise
            ]);

            all.then(function (data) {
                var games = data[0].data.games;

                vm.games = _.map(games, function(game) {
                    var item = game;
                    item.date = moment(game.gametimestamp).format('ddd');
                    item.time = moment(game.gametimestamp).format('h:mm a zz');

                    var competitor = {};
                    competitor.locationShortName = game.competitor1;
                    competitor.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/car.png';
                    item.competitor1 = competitor;

                    competitor = {};
                    competitor.locationShortName = game.competitor2;
                    competitor.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/den.png';
                    item.competitor2 = competitor;
                    return item;
                });

                var competitor = {};
                competitor.name = "Roy";
                competitor.totalWins = 2;

                var competitorSelections = [];

                var competitorSelection = {};
                competitorSelection.matchupid = 'f9cafdf3-3197-4f5e-a6ef-423c392d1547';
                competitorSelection.selectionid = 'Buffalo Bills';
                competitorSelections.push(competitorSelection);

                competitorSelection = {};
                competitorSelection.matchupid = 'ffb71dc5-0201-4b46-bb36-2caaeea81751';
                competitorSelection.selectionid = 'Atlanta Falcons';
                competitorSelections.push(competitorSelection);

                competitorSelection = {};
                competitorSelection.matchupid = 'ffb71dc5-0201-4b46-bb36-2caaeea81752';
                competitorSelection.selectionid = 'No Pick';
                competitorSelections.push(competitorSelection);

                competitor.competitorSelections = competitorSelections;

                vm.competitors.push(competitor);

                competitor = {};
                competitor.name = "Scott";
                competitor.totalWins = 1;

                competitorSelections = [];

                competitorSelection = {};
                competitorSelection.matchupid = 'f9cafdf3-3197-4f5e-a6ef-423c392d1547';
                competitorSelection.selectionid = 'Buffalo Bills';
                competitorSelections.push(competitorSelection);

                competitorSelection = {};
                competitorSelection.matchupid = 'ffb71dc5-0201-4b46-bb36-2caaeea81751';
                competitorSelection.selectionid = 'Atlanta Falcons';
                competitorSelections.push(competitorSelection);

                competitorSelection = {};
                competitorSelection.matchupid = 'ffb71dc5-0201-4b46-bb36-2caaeea81752';
                competitorSelection.selectionid = 'Carolina Panthers';
                competitorSelections.push(competitorSelection);

                competitor.competitorSelections = competitorSelections;

                vm.competitors.push(competitor);

            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function (data) {
                vm.loading = true;
            });
        }
    }
})();
