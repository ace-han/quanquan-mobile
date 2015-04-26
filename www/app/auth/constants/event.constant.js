
define([
    '../module',
    '../namespace'
],
function (module, namespace) {
	'use strict';
	var name = namespace + ".EVENTS";

	// let's define belows for the time being, no need to use them all
	var EVENTS = {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	};

    module.constant(name, EVENTS);

    return EVENTS;

})