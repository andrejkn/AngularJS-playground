/**
 * Created by aknezevs on 12/03/15.
 */

angular.module('uiRouterPlay1', ['ui.router']);

angular.module('uiRouterPlay1')
	.config(function($stateProvider, $urlRouterProvider) {

		//$urlRouterProvider.otherwise("/contacts");

		$stateProvider
			.state('contacts', {
				url: "/contacts",
				templateUrl: "partials/contacts.template.html"
			})
			.state('contacts.edit', {
				url: "/edit",
				templateUrl: "partials/contacts.edit.template.html"
			})
			.state('contacts.list', {
				url: "/list",
				templateUrl: "partials/contacts.list.template.html"
			});
	})

	.factory('contactsService', [function() {
		var contactsService = {};

		contactsService.getContacts = function() {
			return [
				{
					name: 'Alexander Graham',
					phoneNumber: '287-145-2125'
				},
				{
					name: 'Peter Griffin',
					phoneNumber: '342-235-6655'
				},
				{
					name: 'Dennis Rodmaan',
					phoneNumber: '445-333-5454'
				},
				{
					name: 'George Hramowski',
					phoneNumber: '345-788-6346'
				}
			]
		};

		return contactsService;
	}])
	.controller('ContactsListCtrl', function(contactsService) {
		var vm = this;
		vm.contacts = contactsService.getContacts();
	});