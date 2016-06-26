'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'propertiesCtrl'
    });
}])

/*.factory('defaultData', function(){
    var Ball = {
        color:'red'
    };


    return {
       Ball: Ball
    };
})*/

.factory('codeService', [ function(){


    var Ball =  {
        size: {
            id: 0, name: 'Размер', value: 100, check: true
        },
        color: {
            id: 1, name: 'Цвет', value: 'red', check: true
        }
    };

    function addProperties(){
        //тут у некоторого объекта меняем свойства. Хотяяя оно э и так должно после кнопки созхраить
        //прфи сменое родителя, должен меняться и ребенок
    }
    //var ball = new Ball();

    function createObj (parent) {
        console.log(parent);
        var newObj =  Object.create(Ball);
        //сюда передавать свойства
        newObj.color.value = 'blue';
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
        objMethods: {} ,
        Ball: Ball,
        createObj : createObj
    };
}])

.factory('draw', function(){
    var balls= {};
    balls.x = 0;
    balls.y = 700;
    return {
        drawBall:  function(elem, option, redrawing) {
            console.log('option');
            console.log(option);
            var ctx = elem[0].getContext('2d');

            if (redrawing){
                console.log('redrawing');
                ctx.clearRect(0, 0, elem[0].width, elem[0].height);
            }


          /*  ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 15;
            ctx.shadowBlur = 10;
            ctx.shadowColor = option.colorShadow && option.colorShadow.value;*/

           /* var gr = ctx.createRadialGradient(60,60,15,75,75,75);

            gr.addColorStop(0.0,option.color.value);
            gr.addColorStop(1.0,option.colorGr.value);

            ctx.fillStyle = gr;*/

            ctx.beginPath();
            console.log(balls.x, balls.y);
            ctx.arc(balls.x + option.size.value / 2 , balls.y, option.size.value / 2, 0, Math.PI * 2, false);
            balls.x = option.size.value + 10;
            ctx.closePath();

            ctx.fillStyle = option.color.value;
            ctx.fill();
        }
    };
})

.controller('propertiesCtrl', ['$scope', '$rootScope', 'codeService', function($scope, $rootScope, codeService) {
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
        codeService.Ball = selectedProps;
       // codeService.addProperties(selectedProps);
        $rootScope.properties = selectedProps;

    };

}])

.controller('methodsCtrl', ['$scope', '$rootScope', 'codeService', function($scope, $rootScope, codeService) {
    this.saveMethods = function(selectedMethods){
        codeService.Ball = selectedMethods;

        $rootScope.changes = true;
    };

}])


.controller('drawCtrl', ['$scope', '$rootScope', '$element', 'codeService', 'draw', function($scope,  $rootScope, $element, codeService, draw){
    //тут проверяем существование того или иного метода и добавляем фукнционал. Проверяем свойства, перерисовываем шар.
    //нужно получить список свойсвт
    var redrawing = true;
    $rootScope.$watch(
        'properties',
        function handleFooChange() {

            draw.drawBall($element, codeService.Ball, redrawing);
        }
    );

    $rootScope.$watch(
        'newInstance',
        function handleFooChange() {
        console.log(7889);
            if ($rootScope.newInstance){
                draw.drawBall($element, codeService.createObj(codeService.Ball));
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
