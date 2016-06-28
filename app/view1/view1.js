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
        console.log('newObj=',newObj);
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


.controller('mainCtrl', ['codeService', '$scope', function(codeService, $scope){
    $scope.count = 0;
    $scope.ObjsArray = [];
    $scope.ObjsArray.push(codeService.objProperties);


}])

.directive('addcanvas', function($compile, $rootScope) {
    console.log('addcanvas');
    return function(scope, element, attrs) {

        element.bind('click', function() {
            scope.count++;
            angular.element(document.querySelector('canvas:last-of-type')).after($compile('<div class="draw-block" data-id="draw-block-'+scope.count+'" ng-controller="btnsCtrl as btnsCtrl" ><canvas  id="canvas'+scope.count+'" width="200px" height="200px" ng-controller="drawCtrl as drawCtrl"></canvas>' +
            '<button ng-click="btnsCtrl.addProperty()" idialog="view1/addProperty.html">Добавить свойство</button>' +
            '<button idialog="view1/addMethod.html">Добавить метод</button>' +
            '<button  addcanvas>Создать экземпляр</button> <inpit type="text" ng-model="scope.parent"/></div>')(scope));
             $rootScope.newInstance =  'canvas' + scope.count;

            //draw.drawBall($element, codeService.createObj(defaultData.Ball));
        });


    };


})

.directive('saveprops', ['$rootScope', '$scope', '$compile', 'defaultData', function($rootScope, $scope, $compile, defaultData ) {
    return function(scope, element, attrs) {

        element.bind('click', function() {
            var selectedProps = [];
            //получить связь с канвасом
            //взять все элементы чье check =  true
            var id = element.parent.id;

            for (var prop in $scope.props){
                if ($scope.props[prop].check){
                    selectedProps[prop] = $scope.props[prop];
                }
            }
            // console.log(selectedProps);
            defaultData.Ball = selectedProps;
            // codeService.addProperties(selectedProps);
            $rootScope.properties = selectedProps;

        });


    };


}])

.controller('propertiesCtrl', ['$scope', '$rootScope', 'codeService', 'defaultData', function($scope, $rootScope, codeService, defaultData) {
    $scope.props = codeService.objProperties;

    $scope.objProperty = codeService.objProperties;
    this.saveProperties = function() {
        var selectedProps = [];
        //получить связь с канвасом
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


.controller('drawCtrl', ['$scope', '$rootScope', '$element', 'codeService', 'draw', 'defaultData', '$attrs', function($scope,  $rootScope, $element, codeService, draw, defaultData,  $attrs){
    //тут проверяем существование того или иного метода и добавляем фукнционал. Проверяем свойства, перерисовываем шар.
    //нужно получить список свойсвт
    var redrawing = true;
    $rootScope.$watch(
        'properties',
        function handleFooChange() {
            draw.drawBall($element, defaultData.Ball, redrawing);
        }
    );

    $rootScope.$watch(
        'newInstance',
        function handleFooChange() {
        console.log('in watch');
            console.log('id=',$attrs.id, '$rootScope.newInstance', $rootScope.newInstance );

            if ($rootScope.newInstance){
                if ($attrs.id == $rootScope.newInstance){
                    draw.drawBall($element, codeService.createObj(defaultData.Ball));
                    $scope.ObjsArray.push(codeService.createObj(defaultData.Ball));
                    console.log('$scope.ObjsArray', $scope.ObjsArray);
                }

            }

        }
    );

}])

.controller('btnsCtrl', [ '$scope', '$rootScope', 'codeService', '$element','$attrs', function($scope, $rootScope, codeService, $element, $attrs) {
    this.addProperty = function(){
        var id = $attrs.id;
       // console.log($attrs);
        id = id.replace(/\D/g, '');
        console.log(id);
        codeService.objProperties = $scope.ObjsArray[id];  //получить свойства конкретного объекта
        console.log($scope.ObjsArray);
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
