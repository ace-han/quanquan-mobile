define([
    'app/app'
],
function (app) {
    'use strict';
    return app.constant('ApiEndpoint', {
			  url: 'http://localhost:8100/api'
			});
});