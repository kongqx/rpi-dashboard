/*  Raspberry Pi Dasboard
 *  =====================
 *  Copyright 2014 Domen Ipavec <domen.ipavec@z-v.si>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

rpiDashboard = angular.module('rpiDashboard', ['ngRoute', 'ngCookies', 'googlechart']);

registerPage = function(opt) {
    rpiDashboard.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when(opt.path, opt.route);
    }]);
    rpiDashboard.run(['Navigation', function(Navigation) {
        Navigation.register(opt.path, opt.accessDependencies, opt.title, opt.description);
    }]);
};

backgroundUpdate = function(dependencies, t, f) {
    rpiDashboard.run(['$rootScope', 'User', '$timeout', '$q', function($rootScope, User, $timeout, $q) {
        var update = function() {
            if (!User.checkDependencies(dependencies)) {
                return;
            }
            var done = $q.defer();
            f(done);
            done.promise.then(function() {
                if (t != 0) {
                    $timeout(update, t);
                }
            });
        };

        $rootScope.$on('USER_STATUS_CHANGED', function() {
            update();
        });

        update();
    }]);
};

vObject = function(value, filter) {
    var obj = {v: value};
    if (filter !== undefined) {
        obj.f = filter(value);
    }
    return obj;
};

cObject = function(value) {
    return {"c":value};
};

rpiDashboard.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: "/"
    });
}]);

var bytesFilter = function(value, precision) {
    return $.rpijs.parseNumber(value, {valueType: 'binary', decimals: precision});
};
rpiDashboard.filter('bytes', function() {
    return bytesFilter;
});

var bpsFilter = function(value, precision) {
    return $.rpijs.parseNumber(value, {valueType: 'binary', rate: true, decimals: precision});
};
rpiDashboard.filter('bps', function() {
    return bpsFilter;
});

var procentsFilter = function(value, precision) {
    if (isNaN(parseFloat(value)) || !isFinite(value)) return '-';
    if (typeof precision === 'undefined') precision = 1;
    return (100*value).toFixed(precision) + "%";
};
rpiDashboard.filter('procents', function() {
    return procentsFilter;
});

var celsiusFilter = function(value, precision) {
    if (isNaN(parseFloat(value)) || !isFinite(value)) return '-';
    if (typeof precision === 'undefined') precision = 1;
    return value.toFixed(precision) + "°C";
};

rpiDashboard.filter('time', function() {
    return function(value) {
        return $.rpijs.parseNumber(value, {valueType: 'time', decimals: 0});
    }
});
