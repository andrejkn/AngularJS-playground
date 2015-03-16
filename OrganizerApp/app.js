/**
 * Created by andrej on 12/03/15.
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
    console.log(resourceUrl);
    return $resource(resourceUrl, {
      apiKey: apiKey,
      id:'@_id.$oid'
    }, {
      update: {method:'PUT', isArray: false},
      delete: {method:'DELETE', isArray: false}
    });
  })

  .factory('contactsService', [function() {
    var contactsService = {};

    contactsService.getContacts = function(Contacts) {
      var contacts = Contacts.query()
        .$promise
        .then(function(result) {
          return result;
        });
      return contacts;
    };

    contactsService.isValidContact = function(contact) {
      return (!_.isUndefined(contact) &&
        !_.isNull(contact) &&
        contact.hasOwnProperty('name') &&
        contact.hasOwnProperty('phoneNumber'));
    };

    contactsService.addContact = function(contact, Contacts) {
      if( !contactsService.isValidContact(contact) ) {
        throw new Error('Error: Trying to add an invalid contact');
      }
      Contacts.save(contact);
    };

    contactsService.modifyContact = function(contact) {
      return contact.$update({name: contact.name, phoneNumber: contact.phoneNumber})
        .then(function(modifiedContact) {
          return modifiedContact;
        })
        .then(null, function(error) {
          console.log(error);
          throw new Error('Could not update contact');
        });
    };

    contactsService.deleteContact = function(contact) {
      return contact.$delete()
        .then(function(res) {
          return res;
        })
        .then(null, function(error) {
          console.log(error);
          throw new Error('Could not delete contact');
        });
    };

    return contactsService;
  }])

  .controller('ContactsListCtrl', function($scope, $q,$timeout, contactsService, Contacts) {
    var vm = this;
    var flag = true;

    vm.updateContactListView = function (contactToShow) {
      if (!_.isUndefined(contactToShow)) {
        vm.contacts = [contactToShow];
      } else {
        contactsService.getContacts(Contacts)
          .then(function (contacts) {
            vm.contacts = contacts;
            console.log('update contacts view', vm.contacts);
          });
      }
    };

    vm.deleteContact = function (contact) {
      contactsService.deleteContact(contact, Contacts)
        .then(function () {
          console.log('Delete UPDATED');
          vm.updateContactListView();
          flag = false;
        });
    };

    vm.modifyContact = function (contact) {
      console.log(contact);
      contactsService.modifyContact(contact)
        .then(function () {
          console.log('Modify UPDATED');
          vm.updateContactListView();
          flag = false;
        });
    };

    // update the contacts list view
    vm.updateContactListView();
  })
  .controller('ContactAddCtrl', function(contactsService, Contacts) {
    var vm = this;
    vm.addContact = function () {
      if(contactsService.isValidContact(vm.newContact)) {
        console.log('Adding new contact ' + vm.newContact.name);
        contactsService.addContact(vm.newContact, Contacts);
      } else {
        console.log('Cannot add contact');
      }
    };
  });