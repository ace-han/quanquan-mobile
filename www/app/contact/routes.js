define([
    './module'
    , './namespace'
    , '../namespace'
],
function (contactModule, contactNamespace, appNamespace) {
    'use strict';
    return contactModule.config([
        '$stateProvider'
        , function($stateProvider){
            $stateProvider
              // a abstract view for each module view is necessary for the time being
              .state(contactNamespace, {
                url: '/contact',
                parent: appNamespace,
                abstract: true
              })
              .state(contactNamespace + '.index', {
                url: '',
                views: {
                  '@': {
                    templateUrl: 'app/contact/templates/index.html', 
                  }
                }
              });
        }]);
});