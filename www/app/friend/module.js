define([
	'angular'
	, './namespace'
	, 'ngElastic'
	, 'ngMoment'
],
function (angular, namespace) {
	'use strict';
	/* 
    	Sepacial for contact management
    */
	return angular.module(namespace, ['monospaced.elastic', 'angularMoment']);
});