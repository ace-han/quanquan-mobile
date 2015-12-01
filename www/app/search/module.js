define([
	'angular'
	, './namespace'
	, 'ngTimeline'
],
function (angular, namespace) {
	'use strict';
	/* 
    	Sepacial for search engine
    	
		diff widgets:
			1. abbr. widgets according to the query string
			2. categoried result page according to the query string with loadMore pager={page:n, pageSize:n, count:n}

		add a state parameter coming from to maintain the indicator for naving page back

		directive indicates with links about which state to go to
		search within each module itself
		$ionicFilterBar.show
		an directive to detect if any go back workable for tab view


		two sets of state but the same templates
    */
	return angular.module(namespace, ['angular-timeline']);
});