'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'SelectProperty'
  });
}])

.factory('defaultData', function(){
    return {
        chooseProperty: {test: 'fg'}
    };
})
.controller('SelectProperty', ['$scope', 'defaultData', function($scope, defaultData) {
    this.saveProperties = function(selectedProperties){
        defaultData.properties = selectedProperties;
        $scope.code =  selectedProperties;
        console.log($scope);
    };
}])



.controller('WriteCode', ['$scope', 'defaultData', function($scope, defaultData){

   // $scope.codes =  $scope.code;
    console.log( $scope.code);
   /* $scope.$watch(
        "code",
        function handleFooChange( newValue, oldValue ) {
            console.log( "WriteCode.code:", newValue );
        }
    );*/

}]);
