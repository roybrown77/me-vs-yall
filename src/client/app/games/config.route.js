(function() {
    'use strict';

    angular
        .module('app.games')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/games',
                config: {
                    templateUrl: 'app/games/games.html',
                    controller: 'Games',
                    controllerAs: 'vm',
                    title: 'Search Games',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Games'
                    }
                }
            }
        ];
    }
})();
