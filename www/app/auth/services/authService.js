define([
    '../module',
    '../namespace'
],
function (module, namespace) {
    'use strict';

    var name = namespace + ".authService";

    return module.factory(name, 
                ['$log', function($log){
                    return {
                        login : function (v1, v2) {
                            $log.debug("login function");
                            return v1 + v2;
                        }

                    };
                }]);



});