(function() {
    'use strict';

    angular
        .module('app.games')
        .controller('Games', Games);

    /* @ngInject */
    function Games(dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.gameDays = [];
        vm.title = 'Games';
        vm.makePick = makePick;

        activate();

        function activate() {
            //return getGames().then(function() {
            //    logger.info('Activated Games View');
            //});

            var gameday = {};
            gameday.date = 'Sunday, June 12th';
            gameday.matchups = [];

            var matchup = {};
            matchup.id = 1;
            matchup.date = 'Sun';
            matchup.time = '8:30 pm ET';
            matchup.station = 'NBC';
            matchup.competitors = [];
            matchup.pickselected = 'Panthers';

            var competitor = {};
            competitor.name = 'Panthers';
            competitor.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/car.png';

            var competitor2 = {};
            competitor2.name = 'Broncos';
            competitor2.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/den.png';

            matchup.competitors.push(competitor);
            matchup.competitors.push(competitor2);

            gameday.matchups.push(matchup);

            vm.gameDays.push(gameday);

            var gameday2 = {};
            gameday2.date = 'Monday, June 13th';
            gameday2.matchups = [];

            var matchup = {};
            matchup.id = 2;
            matchup.date = 'Mon';
            matchup.time = '6:30 pm ET';
            matchup.station = 'ESPN';
            matchup.competitors = [];
            matchup.pickselected = 'Packers';

            var competitor = {};
            competitor.name = 'Packers';
            competitor.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/gb.png';

            var competitor2 = {};
            competitor2.name = 'Jaguars';
            competitor2.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/jax.png';

            matchup.competitors.push(competitor);
            matchup.competitors.push(competitor2);

            var matchup2 = {};
            matchup2.id = 3;
            matchup2.date = 'Mon';
            matchup2.time = '8:30 pm ET';
            matchup2.station = 'ESPN';
            matchup2.competitors = [];
            matchup2.pickselected = 'Redskins';

            var competitor = {};
            competitor.name = 'Steelers';
            competitor.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/pit.png';

            var competitor2 = {};
            competitor2.name = 'Redskins';
            competitor2.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/wsh.png';

            matchup2.competitors.push(competitor);
            matchup2.competitors.push(competitor2);

            gameday2.matchups.push(matchup);
            gameday2.matchups.push(matchup2);

            vm.gameDays.push(gameday2);
        }

        function getGames() {
            //return dataservice.getGames().then(function(data) {
            //    vm.games = data;
            //    return vm.games;
            //});
        }

        function makePick(matchup, competitorId) {
            matchup.pickselected =  competitorId;
        }
    }
})();
