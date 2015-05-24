"use strict";

var {Component, View, Inject, State} = angular2now;

angular.module('socially');

@State({ name: 'parties', url: '/parties', defaultRoute: true, html5Mode: true })

@Component({selector: 'parties-list'})
@View({templateUrl: 'client/parties-list/parties-list.html'})
@Inject(['$scope', '$meteor', '$rootScope', '$state'])

class PartiesList {
  constructor($scope, $meteor, $rootScope, $state) {
    var that = this;

    // Scope properties
    that.page = 1;
    that.perPage = 3;
    that.sort = {name: 1};
    that.orderProperty = '1';

    that.users = $meteor.collection(Meteor.users, false).subscribe('users');

    that.parties = $meteor.collection(function () {
      return Parties.find({}, {
        sort: $scope.getReactively('vm.sort')
      });
    });

    // Scope method declarations (API)
    that.creator = creator;
    that.rsvp = rsvp;
    that.getUserById = getUserById;
    that.pageChanged = pageChanged;
    that.remove = remove;

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
          that.partiesCount = $meteor.object(Counts, 'numberOfParties', false);

          that.parties.forEach( party => {
            party.onClicked = () => $state.go('partyDetails', {partyId: party._id})
          });

          that.map = {
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
      if (that.orderProperty)
        that.sort = {name: parseInt(that.orderProperty)};
    }

    function remove(party) {
      that.parties.splice(that.parties.indexOf(party), 1);
    }

    function pageChanged(newPage) {
      that.page = newPage;
    }

    function getUserById(userId) {
      return Meteor.users.findOne(userId);
    }

    function creator(party) {
      if (!party)
        return;
      var owner = that.getUserById(party.owner);
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
