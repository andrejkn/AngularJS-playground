/**
 * Created by aknezevs on 12/03/15.
 */
angular.module('underscore', [])
  .factory('_', function() {
    return window._;
  });

angular.module('OrganizerApp', ['ui.router', 'underscore', 'ngResource']);

angular.module('OrganizerApp')
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

  .factory('Contacts', function($resource) {
    var dbName = 'organizer-app';
    var collectionName = 'contacts';
    var apiKey = '';

    // https://api.mongolab.com/api/1/databases/{database}/collections/{collection}?apiKey=myAPIKey
    var resourceUrl = 'https://api.mongolab.com/api/1/databases/' + dbName + '/collections/' + collectionName + '/:id';
    return $resource(resourceUrl, {
      apiKey: apiKey,
      id:'@_id$.oid'
    }, {
      update: {method:'PUT'}
    });
  })

  .factory('contactsService', [function() {
    var contactsService = {};

    contactsService.getContacts = function(Contacts) {
      var contacts = Contacts.query();
      return contacts;
    };

    contactsService.findContacts = function(properties) {
      return _.findWhere(contacts, properties);
    };

    contactsService.isValidContact = function(contact) {
      return (contact.hasOwnProperty('name') &&
        contact.hasOwnProperty('phoneNumber'));
    };

    contactsService.addContact = function(contact, Contacts) {
      if( !contactsService.isValidContact(contact) ) {
        throw new Error('Error: Trying to add an invalid contact');
      }
      Contacts.save(contact);
    };

    contactsService.modifyContact = function(properties, newContact) {
      var toBeModified = contactsService.findContacts({contactId: properties.contactId});
      toBeModified.name = newContact.name;
      toBeModified.phoneNumber = newContact.phoneNumber;
    };

    return contactsService;
  }])

  .controller('ContactsListCtrl', function(contactsService, Contacts) {
    var vm = this;
    vm.contacts = contactsService.getContacts(Contacts);
  })
  .controller('ContactAddCtrl', function(contactsService, Contacts) {
    var vm = this;
    vm.addContact = function () {
      console.log('adding new contact ' + vm.newContact.name);
      if(contactsService.isValidContact(vm.newContact)) {
        contactsService.addContact(vm.newContact, Contacts);
      }
    };
  });