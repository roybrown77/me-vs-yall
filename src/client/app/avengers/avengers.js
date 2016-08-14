(function() {
    'use strict';

    angular
        .module('app.avengers')
        .controller('Avengers', Avengers, '$location', '$timeout');

    /* @ngInject */
    function Avengers(dataservice, logger, $location, $timeout) {
        /*jshint validthis: true */
        var vm = this;
        //vm.avengers = [];
        vm.title = 'Pick Sport';

        vm.gotoSportSearch = gotoSportSearch;

        activate();

        function activate() {
// //            Using a resolver on all routes or dataservice.ready in every controller
// //            var promises = [getAvengers()];
// //            return dataservice.ready(promises).then(function(){
//             return getAvengers().then(function() {
//                 logger.info('Activated Avengers View');
//             });
        }

        // function getAvengers() {
        //     return dataservice.getAvengers().then(function(data) {
        //         vm.avengers = data;
        //         return vm.avengers;
        //     });
        // }

        function gotoSportSearch(sport){
            $timeout(function() {
                $location.path('/games');
            }, 0);
        }
    }
})();
