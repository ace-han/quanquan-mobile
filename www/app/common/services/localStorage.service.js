define([
        'angular'
        , '../module'
    ]
    , function(angular, module) {
        'use strict';
        var name = 'localStorageService';

        module.factory(name, localStorageService);

        localStorageService.$inject = ['$window'];

        return localStorageService;

        function localStorageService($window) {
            var service = {
                set: set
                , get: get
                , setObject: setObject
                , getObject: getObject
                , remove: remove
            };
            return service;

            function set(key, value) {
                $window.localStorage.setItem(key, value);
            }

            function get(key, defaultValue) {
                return $window.localStorage.getItem(key) || defaultValue;
            }

            function setObject(key, value) {
                $window.localStorage.setItem(key, JSON.stringify(value));
            }

            function getObject(key) {
                // never undefined or null
                return JSON.parse($window.localStorage.getItem(key) || '{}');
            }
            
            function remove(key) {
                return $window.localStorage.removeItem(key);
            }
        }
    }
);
