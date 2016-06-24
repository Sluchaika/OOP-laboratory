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

    function Ball () {
        this.size = {
            id: 0, name: 'Размер', value: 100, check: true
        };
        this.color =  {
            id: 1, name: 'Цвет', value: 'red', check: true
        };
    }


    function createObj (parent) {
        console.log(parent);
        return Object.create(parent);
    }
    function createNewObj (parent){
        return object(parent);
    }


    function addProperties(props){
        defaultData.Ball.prototype = props;
      //  console.log(props);
        code += 'Ball.prototype' + props;
    }

    return {
        addProperties: addProperties,
        objProperties: {
            size: {
                id: 0, name: 'Размер', value: 100, check: true
            },
            color: {
                id: 1, name: 'Цвет', value: 'red', check: true
            },
            colorGr: {
                id: 2, name: 'Цвет для градиента', value: '#A60000', check: true
            },
            colorShadow: {
                id: 3, name: 'Цвет для тени', value: 'gray', check: true
            }
        },
        createNewObj: {

        },
        objMethods: {} ,
        createObj : createObj
    };
}])

.factory('draw', function(){

    return {
        drawBall:  function(elem, option) {
            console.log('option');
            console.log(option);
            var ctx = elem[0].getContext('2d');
            ctx.clearRect(0, 0, elem[0].width, elem[0].height);

          /*  ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 15;
            ctx.shadowBlur = 10;
            ctx.shadowColor = option.colorShadow && option.colorShadow.value;*/

           /* var gr = ctx.createRadialGradient(60,60,15,75,75,75);

            gr.addColorStop(0.0,option.color.value);
            gr.addColorStop(1.0,option.colorGr.value);

            ctx.fillStyle = gr;*/

            ctx.beginPath();
            ctx.arc(option.size.value, option.size.value, option.size.value / 2, 0, Math.PI * 2, false);
            ctx.closePath();

            ctx.fillStyle = option.color.value;
            ctx.fill();
        }
    };
})
.directive('checklistModel', function() {
    return {
        restrict : 'E',
        require: 'ngModel',
        link:function(scope, element, attrs, model) {

            scope.toggle = function(){
               // console.log('j'+element);
                scope.check = !scope.ckeck;

                model.$setViewValue(scope.isChecked);
            };

        }
    };
})
.controller('propertiesCtrl', ['$scope', '$rootScope', 'codeService',  'defaultData', function($scope, $rootScope, codeService, defaultData) {
    $scope.props = codeService.objProperties;


    $scope.toggle =  function(id){
        //это не надо )))
      // console.log( $scope.props[id].check);
    };
    $scope.objProperty = codeService.objProperties;
    this.saveProperties = function(){
        var selectedProps = [];

        //взять все элементы чье check =  true
        for (var prop in $scope.props){
            if ($scope.props[prop].check){
                selectedProps[prop] = $scope.props[prop];
            }
        }
       // console.log(selectedProps);
        codeService.objProperties = selectedProps;
        codeService.addProperties(selectedProps);
        $rootScope.properties = selectedProps;

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
            draw.drawBall($element, codeService.objProperties);
        }
    );

    $rootScope.$watch(
        'newInstance',
        function handleFooChange() {
        console.log(7889);
            if ($rootScope.newInstance){
                draw.drawBall($element, $rootScope.newInstance);
            }

        }
    );

}])

.controller('btnsCtrl', [ '$scope', '$rootScope', 'codeService', function($scope, $rootScope, codeService){
    this.createInstance = function(){
        console.log('In btns');
        //var childBall = codeService.createObj($scope.parentObj);
        $rootScope.newInstance =  codeService.createObj($scope.parentObj);


        //нужно как-то дать знать контроллеру рисовалке
        //отправляем в функция

    };
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
