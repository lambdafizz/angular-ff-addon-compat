angular.module('app', ['ngRoute', 'lf.ff-addon-compat'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {
        redirectTo: "/route-1"
    })
    .when("/route-1", {
        templateUrl: "views/route-1.html"
    })
    .when("/route-2", {
        templateUrl: "views/route-2.html"
    })
    .when("/route-3", {
        templateUrl: "views/route-3.html"
    })
}]);
