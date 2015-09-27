define([
        'angular'
        , '../module'
    ]
    , function(angular, module) {
        'use strict';
        // atob or btoa works only acsii world, those strings who are out of 0xff will fail
        // Base64 js online is okay, but I would like a simple version taking advantage of browser's window
        // atob => ascii code to 8-bit byte encode
        var name = 'base64Service';

        module.factory(name, base64Service);

        base64Service.$inject = ['$window'];

        return base64Service;

        function base64Service($window) {
            var service = {
                encode: encode
                , decode: decode
            };
            return service;
            
            function encode(plainStr) {
                return $window.btoa(unescape(encodeURIComponent(plainStr)));
            }

            function decode(encoded) {
                return $window.decodeURIComponent(escape(atob(encoded)));
            }
        }
    }
);
