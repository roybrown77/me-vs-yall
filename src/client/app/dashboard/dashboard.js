(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$q', 'dataservice', 'logger', '$location', '$timeout'];

    function Dashboard($q, dataservice, logger, $location, $timeout) {

        /*jshint validthis: true */
        var vm = this;

        // vm.news = {
        //     title: 'Marvel Avengers',
        //     description: 'Marvel Avengers 2 is now in production!'
        // };
        // vm.avengerCount = 0;
        // vm.avengers = [];
        vm.games = [];
        vm.title = 'Main Menu';

        vm.gotoMyPicks = gotoMyPicks;
        vm.gotoSearchSports = gotoSearchSports;
        vm.gotoHead2Heads = gotoHead2Heads;

        activate();

        function activate() {
//             var promises = [getAvengerCount(), getAvengersCast()];
// //            Using a resolver on all routes or dataservice.ready in every controller
// //            return dataservice.ready(promises).then(function(){
//             return $q.all(promises).then(function() {
//                 logger.info('Activated Dashboard View');
//             });
        }

        // function getAvengerCount() {
        //     return dataservice.getAvengerCount().then(function(data) {
        //         vm.avengerCount = data;
        //         return vm.avengerCount;
        //     });
        // }
        //
        // function getAvengersCast() {
        //     return dataservice.getAvengersCast().then(function(data) {
        //         vm.avengers = data;
        //         return vm.avengers;
        //     });
        // }

        function gotoMyPicks() {
            $timeout(function() {
                $location.path('/mypicks');
            }, 0);
        }

        function gotoSearchSports() {
            $timeout(function() {
                $location.path('/picksport');
            }, 0);
        }

        function gotoHead2Heads() {
            $timeout(function() {
                $location.path('/head2heads');
            }, 0);
        }
    }
})();
