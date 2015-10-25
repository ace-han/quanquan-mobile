
define([
    'angular'
    , '../module'
    , '../namespace'
],
function (angular, module, namespace) {
  // the format for interceptors may not look like this exactly, will be more align in the future
  module.run(['$rootScope', 'Restangular', namespace+'.principalService', 
                function ($rootScope, Restangular, principalService) {
            Restangular.addFullRequestInterceptor(
                function(element, operation, route, url, headers, params, httpConfig) {
                  var token = principalService.getJwtToken();
                  // only those needed JWT header has this token
                  if(token 
                      && $rootScope.toState.data
                      && $rootScope.toState.data.loginRequired){
                      headers.Authorization = 'JWT ' + token;
                  }
                  return {
                      headers: headers
                  }
            });
        }])
});