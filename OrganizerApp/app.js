/**
 * Created by aknezevs on 12/03/15.
 */
angular.module('underscore', [])
	.factory('_', function() {
		return window._;
	});

angular.module('uiRouterPlay1', ['ui.router', 'underscore']);

angular.module('uiRouterPlay1')
	.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise("/contacts");

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
			})
			.state('contacts.add', {
				url: "/add",
				templateUrl: "partials/contacts.add.template.html"
			});
	})

	.factory('contactsService', [function() {
		var contactsService = {};

		var contacts = [
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
		];

		contactsService.getContacts = function() {
			return contacts;
		};

		contactsService.findContacts = function(properties) {

			return _.findWhere(contacts, properties);
		};

		contactsService.isValidContact = function(contact) {
			return (contact.hasOwnProperty('contactId') &&
				contact.hasOwnProperty('name') &&
				contact.hasOwnProperty('phoneNumber'));
		};

		contactsService.addContact = function(contact) {
			if( !contactsService.isValidContact(contact) ) {
				throw new Error('Error: Trying to add an invalid contact');
			}
			contacts.push(contact);
		};

		contactsService.modifyContact = function(properties, newContact) {
			var toBeModified = contactsService.findContacts({contactId: properties.contactId});
			toBeModified.name = newContact.name;
			toBeModified.phoneNumber = newContact.phoneNumber;
		};

		return contactsService;
	}])
	.controller('ContactsListCtrl', function(contactsService) {
		var vm = this;
		vm.contacts = contactsService.getContacts();
	})
	.controller('ContactAddCtrl', function(contactsService) {
		var vm = this;
		vm.addContact = function () {
			console.log('adding new contact ' + vm.newContact.contactId + ' ' + vm.newContact.name);
			if(contactsService.isValidContact(vm.newContact)) {
				contactsService.addContact(vm.newContact);
			}
		};
	});