"use strict";

var {Component, View, Inject, State} = angular2now;

angular.module('socially');

@State({
  name:    'partyDetails', url: '/parties/:partyId',
  resolve: {
    "currentUser": $meteor => { "ngInject"; return $meteor.requireUser() }
  }
})

@Component({selector: 'party-details'})
@View({templateUrl: 'client/party-details/party-details.html'})
@Inject(['$scope', '$meteor', '$stateParams'])

class PartyDetails {

  constructor($scope, $meteor, $stateParams) {
    var self = this;

    // Scope properties
    self.party = $meteor.object(Parties, $stateParams.partyId);
    self.users = $meteor.collection(Meteor.users, false).subscribe('users');
    self.map = getMap();

    // Scope method declarations (API)
    self.invite = invite;
    self.canInvite = canInvite;

    // Tasks to run on directive initialisation
    var subscriptionHandle;
    $meteor.subscribe('parties').then(function (handle) {
      subscriptionHandle = handle;
    });

    $scope.$on('$destroy', function () {
      subscriptionHandle.stop();
    });

    // API and task implementation functions
    function invite(user) {
      $meteor.call('invite', self.party._id, user._id).then(
        function (data) {
          console.log('success inviting', data);
        },
        function (err) {
          console.log('failed', err);
        }
      );
    }

    function canInvite() {
      if (!self.party)
        return false;

      return !self.party.public &&
        self.party.owner === Meteor.userId();
    }

    function getMap() {
      return {
        center: {
          latitude:  45,
          longitude: -73
        },
        zoom:   8,
        events: {
          click: function (mapModel, eventName, originalEventArgs) {
            if (!self.party)
              return;

            if (!self.party.location)
              self.party.location = {};

            self.party.location.latitude = originalEventArgs[0].latLng.lat();
            self.party.location.longitude = originalEventArgs[0].latLng.lng();

            // scope apply required because this event handler is outside of the angular domain
            $scope.$apply();
          }
        },
        marker: {
          options: {draggable: true},
          events:  {
            dragend: function (marker, eventName, args) {
              if (!self.party.location)
                self.party.location = {};

              self.party.location.latitude = marker.getPosition().lat();
              self.party.location.longitude = marker.getPosition().lng();
            }
          }
        }
      }
    }
  }
}
