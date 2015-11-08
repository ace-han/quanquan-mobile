define([
        'angular', 
        '../module', 
        '../namespace'
    ],
    function(angular, module, namespace) {
        'use strict';

        //var name = namespace + ".nl2br";
        var name = 'nl2br'
        module.filter(name, nl2br);

        nl2br.$inject = ['$filter'];

        return nl2br;

        function nl2br($filter) {

            return func;

            function func(data) {
                if (!data) {
                    return data;
                }
                return data.replace(/\n\r?/g, '<br />');
            }
        }
    });
