(function() {
    'use strict';

    angular
        .module('app.head2heads')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/head2heads',
                config: {
                    templateUrl: 'app/head2heads/head2heads.html',
                    controller: 'Head2heads',
                    controllerAs: 'vm',
                    title: 'Me and Yall',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Me and Yall'
                    }
                }
            }
        ];
    }
})();
