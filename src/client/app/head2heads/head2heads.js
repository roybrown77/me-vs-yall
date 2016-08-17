(function() {
    'use strict';

    angular
        .module('app.head2heads')
        .controller('Head2heads', Head2heads, '$location', '$timeout');

    /* @ngInject */
    function Head2heads(dataservice, logger, $location, $timeout) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'Me and Yall';

        activate();

        function activate() {
        }
    }
})();
