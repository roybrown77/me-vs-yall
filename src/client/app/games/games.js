(function() {
    'use strict';

    angular
        .module('app.games')
        .controller('Games', Games);

    /* @ngInject */
    function Games(dataservice, logger, $q) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'Games';

        vm.gameDays = [];
        vm.makePick = makePick;

        activate();

        function activate() {
            var promise = dataservice.getGames();

            var all = $q.all([
                promise
            ]);

            all.then(function (response) {
                var games = response[0];
                var game1 = games[0];
                var game2 = games[1];
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function (data) {
                vm.loading = true;
            });
        }

        function makePick(matchup, competitorId) {
            matchup.pickselected =  competitorId;
        }
    }
})();
