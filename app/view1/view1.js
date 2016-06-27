'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'propertiesCtrl'
    });
}])

.factory('defaultData', function(){
    var Ball =  {
        size: {
            id: 0, name: 'Размер', value: 100, check: true
        },
        color: {
            id: 1, name: 'Цвет', value: 'red', check: true
        }
    };
    return {
        Ball : Ball
    };
})

.factory('codeService', [ 'defaultData', function(defaultData){




    function addProperties(){
        //тут у некоторого объекта меняем свойства. Хотяяя оно э и так должно после кнопки созхраить
        //прфи сменое родителя, должен меняться и ребенок
    }
    //var ball = new Ball();

    function createObj (parent) {
     /*   console.log('Ball=', Ball);*/
        var newObj =  Object.create(defaultData.Ball);
        //сюда передавать свойства
       // newObj.color.value = 'blue';
        return newObj;

    }



    return {
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
        objMethods: {},
        createObj : createObj
    };
}])

.factory('draw', function(){
    var balls= {};
    balls.x = 0;
    balls.y = 100;
    balls.lastSize = 0;
    return {
        drawBall:  function(elem, option, redrawing) {
            console.log('option');
            console.log(option);
            var ctx = elem[0].getContext('2d');

            if (redrawing){
                console.log('redrawing');
                //сюда должны поступать координаты чисто прошлого. Можно их хранить

                ctx.clearRect(0, 0, balls.lastSize, balls.lastSize);
                balls.x = 0;
            }

            balls.lastSize =  option.size.value;
            /*  ctx.shadowOffsetX = 10;
              ctx.shadowOffsetY = 15;
              ctx.shadowBlur = 10;
              ctx.shadowColor = option.colorShadow && option.colorShadow.value;*/

           /* var gr = ctx.createRadialGradient(60,60,15,75,75,75);

            gr.addColorStop(0.0,option.color.value);
            gr.addColorStop(1.0,option.colorGr.value);

            ctx.fillStyle = gr;*/
            console.log('options');
            console.log(elem);
            ctx.beginPath();

            ctx.arc(balls.x + option.size.value / 2 , balls.y, option.size.value / 2, 0, Math.PI * 2, false);

            balls.x = Number(option.size.value) + 10;
            ctx.closePath();

            ctx.fillStyle = option.color.value;
            ctx.fill();
        }
    };
})

.directive('addcanvas', function($compile) {
    return function(scope, element, attrs) {
        element.bind('click', function() {
            console.log('addCa');
            scope.count++;
            angular.element(document.querySelector('canvas:last-of-type')).after($compile('<div class="draw-block"><canvas width="200px" height="200px"ng-controller="drawCtrl as drawCtrl"></canvas><div ng-controller="btnsCtrl as btnsCtrl">'
                + '<button idialog="view1/addProperty.html">Добавить свойство</button>' +
            + '<button idialog="view1/addMethod.html">Добавить метод</button>' +
            + '<button  ng-click="btnsCtrl.createInstance()">Создать экземпляр</button> <inpit type="text" ng-model="scope.parent"/></div></div>')(scope));
        });
    };
})

.controller('propertiesCtrl', ['$scope', '$rootScope', 'codeService', 'defaultData', function($scope, $rootScope, codeService, defaultData) {
    $scope.props = codeService.objProperties;


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
        defaultData.Ball = selectedProps;
       // codeService.addProperties(selectedProps);
        $rootScope.properties = selectedProps;

    };

}])

.controller('methodsCtrl', ['$scope', '$rootScope', 'codeService', 'defaultData', function($scope, $rootScope, codeService, defaultData) {
    this.saveMethods = function(selectedMethods){
        defaultData.Ball = selectedMethods;

        $rootScope.changes = true;
    };

}])


.controller('drawCtrl', ['$scope', '$rootScope', '$element', 'codeService', 'draw', 'defaultData', function($scope,  $rootScope, $element, codeService, draw, defaultData){
    //тут проверяем существование того или иного метода и добавляем фукнционал. Проверяем свойства, перерисовываем шар.
    //нужно получить список свойсвт
    var redrawing = true;
    $rootScope.$watch(
        'properties',
        function handleFooChange() {
            console.log('defaultData.Ball', defaultData.Ball);
            draw.drawBall($element, defaultData.Ball, redrawing);
        }
    );

    $rootScope.$watch(
        'newInstance',
        function handleFooChange() {
        console.log(7889);
            if ($rootScope.newInstance){

                draw.drawBall($element, codeService.createObj(defaultData.Ball));
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
