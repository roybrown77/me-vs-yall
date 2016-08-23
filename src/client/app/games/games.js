(function() {
    'use strict';

    angular
        .module('app.games')
        .controller('Games', Games);

    /* @ngInject */
    function Games(dataservice, logger, $q) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'Search Games';

        vm.gameDays = [];
        vm.weeks = [];
        vm.weekSelected = {};

        vm.pickSheetSelected = { id: '', name: 'Select Pick Sheet' };
        vm.pickSheetSelectedName = 'Select Pick Sheet';
        vm.pickSheets = [];
        vm.showPickSheetEntry = false;
        vm.pickSheetName = "";

        vm.onWeekChange = onWeekChange;
        vm.makePick = makePick;
        vm.getPickSheetName = getPickSheetName;
        vm.createPickSheet = createPickSheet;
        vm.onPickSheetChange = onPickSheetChange;

        activate();

        function activate() {
            getPickSheetsByUserId(null);
            getGames();
            getWeeks();
        }

        function getGames() {
            var promise = dataservice.getGames();

            var all = $q.all([
                promise
            ]);

            all.then(function (data) {
                var games = data[0].data.games;

                _.map(games, function(game) {
                    var item = game;
                    item.date = moment(game.gametimestamp).format('ddd');
                    item.time = moment(game.gametimestamp).format('h:mm a zz');
                    var competitor = {};
                    competitor.name = game.competitor1;
                    competitor.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/car.png';
                    item.competitor1 = competitor;

                    competitor = {};
                    competitor.name = game.competitor2;
                    competitor.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/den.png';
                    item.competitor2 = competitor;
                    return item;
                });

                var formattedDates = _.map(games, function(game) {
                    var item = {};
                    item.formattedDate = moment(game.gametimestamp).format('YYYY-MM-DD HH:mm');
                    return item;
                });

                var uniqueDates = _.uniqBy(formattedDates, 'formattedDate');

                vm.gameDays = _.map(uniqueDates, function(item) {
                    var gameDay = {};
                    gameDay.date = moment(item.formattedDate).format('dddd [, ] MMM Do');
                    gameDay.matchups = _.filter(games, function (game) {
                        var itemDate = game.gametimestamp ? moment(game.gametimestamp).format('YYYY-MM-DD HH:mm') : null;
                        return itemDate === item.formattedDate;
                    });

                    return gameDay;
                }).reverse();
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function (data) {
                vm.loading = true;
            });

            // competitor.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/car.png';
            // competitor2.logo = 'http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/den.png';
        }

        function getPickSheetName(id) {
            if (vm.pickSheets.length === 0) return 'No Pick Sheets Exist';

            if (!id) return 'Select Pick Sheet';

            var pickSheet = _.find(vm.pickSheets, { "id": id });

            if (!pickSheet) return 'Select Pick Sheet';

            return pickSheet.name;
        }

        function createPickSheet() {
            var pickSheet = { name: vm.pickSheetName };
            var promise = dataservice.createPickSheet(pickSheet);

            var all = $q.all([
                promise
            ]);

            all.then(function (response) {
                vm.pickSheetSelected = response[0].data.error ? { id: '', name: 'Select Pick Sheet' } : response[0].data;
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function (data) {
                vm.loading = true;
            }).then(getPickSheetsByUserId(pickSheet));
        }

        function getPickSheetsByUserId(pickSheetSelected) {
            vm.pickSheetName = "";
            vm.showPickSheetEntry = false;
            
            var promise = dataservice.getPickSheetsByUserId();

            var all = $q.all([
                promise
            ]);

            all.then(function (data) {
                vm.pickSheets = data[0].data.pickSheets;

                if (vm.pickSheets.length === 0) {
                    vm.pickSheetSelected = { id: '', name: 'No Pick Sheets Exist' };
                    vm.pickSheetSelectedName = 'No Pick Sheets Exist';
                } else {
                    if (pickSheetSelected) {
                        vm.pickSheetSelected = _.find(vm.pickSheets, { 'name' : pickSheetSelected.name });
                        vm.pickSheetSelectedName = pickSheetSelected.name;
                    } else {
                        vm.pickSheetSelected = { id: '', name: 'Select Pick Sheet' };
                        vm.pickSheetSelectedName = 'Select Pick Sheet';
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function (data) {
                vm.loading = true;
            });
        }

        function onPickSheetChange() {
            if (!vm.pickSheetSelected) {
                var matchupArray = _.map(vm.gameDays, 'matchups');
                var matchups = _.flatten(matchupArray);

                _.map(matchups, function(matchup) {
                    var item = matchup;
                    item.pickselected = undefined;
                    return item;
                });

                return;
            }

            var pickSheet = vm.pickSheetSelected;

            var promise = dataservice.getPicks(pickSheet.id);

            var all = $q.all([
                promise
            ]);

            all.then(function (data) {
                var picks = data[0].data.picks;

                var matchupArray = _.map(vm.gameDays, 'matchups');
                var matchups = _.flatten(matchupArray);

                _.map(matchups, function(matchup) {
                    var item = matchup;
                    var pick =  _.find(picks, { "matchupid": matchup.id });
                    item.pickselected = pick ? pick.selectionid : undefined;
                    return item;
                });
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function (data) {
                vm.loading = true;
            });
        }

        function makePick(matchup, competitorId) {
            if (!vm.pickSheetSelected ||
                !vm.pickSheetSelected.id) {
                toastr.info("Select a Pick Sheet");
                return;
            }

            matchup.pickselected = competitorId;

            var pick = {
                matchupId: matchup.id,
                selectionId: competitorId
            };

            var promise = dataservice.makePick(vm.pickSheetSelected.id, pick);

            var all = $q.all([
                promise
            ]);

            all.then(function (data) {

            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function (data) {
                vm.loading = true;
            });
        }

        function getWeeks() {
            var promise = dataservice.getWeeks();

            var all = $q.all([
                promise
            ]);

            all.then(function (data) {
                vm.weeks = data[0].data.weeks;

                _.map(vm.weeks, function(week) {
                    var item = week;
                    item.name = 'Week ' + week.number;
                    return item;
                });

                vm.weekSelected = vm.weeks[0];
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function (data) {
                vm.loading = true;
            });
        }

        function onWeekChange() {

        }
    }
})();
