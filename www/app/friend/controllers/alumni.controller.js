define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
    'use strict';

    var name = namespace + '.AlumniController';

    module.controller(name, AlumniController);
                
    AlumniController.$inject = ['schoolType'];

    return AlumniController;

    function AlumniController(schoolType) {
        var vm = this;

        angular.extend(vm, {
            alumni: []
            , moreDataCanBeLoaded: moreDataCanBeLoaded
            , loadMore: loadMore
        });

        init();

        function init(){
            console.log('init', schoolType);
            for(var i=0; i<3; i++){
                
                vm.alumni.push({slug: i
                            , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                            , name: ' New Item ' + Math.floor(Math.random() * 1000) + schoolType});
            }
        }
        
        function moreDataCanBeLoaded(){
            return vm.alumni.length>6;
        }

        function loadMore(){
            console.log('loadMore', schoolType);
            for(var i=0; i<3; i++){
                
                vm.alumni.push({slug: i
                            , imgSrc: 'http://ionicframework.com/img/docs/venkman.jpg'
                            , name: ' New Item ' + Math.floor(Math.random() * 1000) + schoolType});
            }
        }
        
    }

});
