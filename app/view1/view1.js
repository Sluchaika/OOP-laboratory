'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'propertiesCtrl'
    });
}])

.factory('defaultData', function(){
    var Ball = {
        color:'red'
    };


    return {
       Ball: Ball
    };
})

.factory('codeService', ['defaultData', function(defaultData){
    var code = '';
    function add (str) {
        code+=str;
    }
    function addProperties(props){
        defaultData.Ball.prototype = props;
        console.log(props);
        code += 'Ball.prototype' + props;
    }

    return {
        addProperties: addProperties,
        objProperties: {
            size:100,
            color: 'red'},
        objMethods: {}
    };
}])

.factory('draw', function(){


    return {
        drawBall: function(elem, option){

            var ctx = elem[0].getContext('2d');
            ctx.beginPath();
            console.log(option.size);
            ctx.arc(option.size, option.size, option.size/2, 0, Math.PI*2, false);
            ctx.closePath();
            ctx.fillStyle = option.color;
            ctx.fill();
            ctx = elem[0].getContext('2d');
            ctx.beginPath();
            console.log(option.size);
            ctx.arc(200, 200, 100, 0, Math.PI*2, false);
            ctx.closePath();
            ctx.fillStyle = 'blue';
            ctx.fill();
        }
    };
})

.controller('propertiesCtrl', ['$scope', '$rootScope', 'codeService',  'defaultData', function($scope, $rootScope, codeService, defaultData) {
    $scope.objProperty = codeService.objProperties;
    this.saveProperties = function(selectedProperties){
        codeService.objProperties = selectedProperties;
        codeService.addProperties(selectedProperties);
        $rootScope.properties = selectedProperties;

    };

}])

.controller('methodsCtrl', ['$scope', '$rootScope', 'codeService', 'defaultData', function($scope, $rootScope, codeService, defaultData) {
    this.saveMethods = function(selectedMethods){
        codeService.objMethods= selectedMethods;

        $rootScope.changes = true;
    };

}])


.controller('drawCtrl', ['$scope', '$rootScope', '$element', 'codeService', 'draw', function($scope,  $rootScope, $element, codeService, draw){
    //тут проверяем существование того или иного метода и добавляем фукнционал. Проверяем свойства, перерисовываем шар.
    //нужно получить список свойсвт

    $rootScope.$watch(
        'properties',
        function handleFooChange() {
           /* for (var key in codeService.objProperties){
                if (key === 'color') {*/
            draw.drawBall($element, codeService.objProperties);
        /*        }
            }*/

        }
    );

}]);

/*.controller('WriteCode', ['$scope', '$rootScope', 'defaultData', 'codeService', function($scope,  $rootScope, defaultData, codeService){
   //получить данные, выбранные в формах о свойствах, методах, создание новые объектов
    //эти данные нужно добавить в объект и вывести код. Или же код вывести после уже готового всего?

    $rootScope.$watch(
        'properties',
        function handleFooChange() {
            for (var key in codeService.objProperties){
                if (key === 'color'){

                }
            }
        }
    );

}]);*/
