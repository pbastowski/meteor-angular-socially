"use strict";

var {Component, View, Inject, State} = angular2now;

angular.module('socially');

@State({ name: 'parties', url: '/parties', defaultRoute: true, html5Mode: true })

@Component({selector: 'parties-list'})
@View({templateUrl: 'client/parties-list/parties-list.html'})
@Inject(['$scope', '$meteor', '$rootScope', '$state'])

class PartiesList {
  constructor($scope, $meteor, $rootScope, $state) {
    var self = this;

    // Scope properties
    self.page = 1;
    self.perPage = 3;
    self.sort = {name: 1};
    self.orderProperty = '1';

    self.users = $meteor.collection(Meteor.users, false).subscribe('users');

    self.parties = $meteor.collection(function () {
      return Parties.find({}, {
        sort: $scope.getReactively('vm.sort')
      });
    });

    // Scope method declarations (API)
    self.creator = creator;
    self.rsvp = rsvp;
    self.getUserById = getUserById;
    self.pageChanged = pageChanged;
    self.remove = remove;

    // Tasks to run on directive initialisation
    $meteor.autorun($scope, autorun);
    $scope.$watch('orderProperty', watchOrderProperty);

    // API and task implementation functions
    function autorun() {
      $meteor.subscribe(
        'parties',

        {
          limit: parseInt($scope.getReactively('vm.perPage')),
          skip:  (parseInt($scope.getReactively('vm.page')) - 1) * parseInt($scope.getReactively('vm.perPage')),
          sort:  $scope.getReactively('vm.sort')
        },

        $scope.getReactively('vm.search')).then(function () {
          self.partiesCount = $meteor.object(Counts, 'numberOfParties', false);

          self.parties.forEach( party => {
            party.onClicked = () => $state.go('partyDetails', {partyId: party._id})
          });

          self.map = {
            center: {
              latitude:  45,
              longitude: -73
            },
            zoom:   8
          };

        }

      );
    }

    function watchOrderProperty() {
      if (self.orderProperty)
        self.sort = {name: parseInt(self.orderProperty)};
    }

    function remove(party) {
      self.parties.splice(self.parties.indexOf(party), 1);
    }

    function pageChanged(newPage) {
      self.page = newPage;
    }

    function getUserById(userId) {
      return Meteor.users.findOne(userId);
    }

    function creator(party) {
      if (!party)
        return;
      var owner = self.getUserById(party.owner);
      if (!owner)
        return "nobody";

      if ($rootScope.currentUser)
        if ($rootScope.currentUser._id)
          if (owner._id === $rootScope.currentUser._id)
            return "me";

      return owner;
    }

    function rsvp(partyId, rsvp) {
      $meteor.call('rsvp', partyId, rsvp).then(
        function (data) {
          console.log('success responding', data);
        },
        function (err) {
          console.log('failed', err);
        }
      );
    }
  }
}
