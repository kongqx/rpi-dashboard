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

rpiDashboard.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainController'
    });
});
rpiDashboard.run(function(Navigation) {
    Navigation.registerDependencies('/', ['cpu', 'memory', 'storage', 'logger']);
});

rpiDashboard.controller('MainController', function($scope) {
    $scope.cpuUsage = cpuData.usageGraph;
    $scope.temperatureGauge = cpuData.temperatureGauge;
    $scope.ramChart = memoryData.ramChart;
    $scope.ramTotal = memoryData.memory.total;
    $scope.storageRoot = angular.copy(memoryData.swapChart);
    $scope.storageRoot.data.rows = storageData.rootFS;
    $scope.storageRootTotalSize = storageData.rootTotalSize;
});