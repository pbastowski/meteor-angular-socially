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
    var that = this;

    // Scope properties
    that.party = $meteor.object(Parties, $stateParams.partyId);
    that.users = $meteor.collection(Meteor.users, false).subscribe('users');
    that.map = getMap();

    // Scope method declarations (API)
    that.invite = invite;
    that.canInvite = canInvite;

    // Tasks to run on directive initialisation
    var subscriptionHandle;
    $meteor.subscribe('parties').then(function (handle) {
      subscriptionHandle = handle;
    });

    $scope.$on('$destroy', function () {
      console.log('$destroy');
      subscriptionHandle.stop();
    });

    // API and task implementation functions
    function invite(user) {
      $meteor.call('invite', that.party._id, user._id).then(
        function (data) {
          console.log('success inviting', data);
        },
        function (err) {
          console.log('failed', err);
        }
      );
    }

    function canInvite() {
      if (!that.party)
        return false;

      return !that.party.public &&
        that.party.owner === Meteor.userId();
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
            if (!that.party)
              return;

            if (!that.party.location)
              that.party.location = {};

            that.party.location.latitude = originalEventArgs[0].latLng.lat();
            that.party.location.longitude = originalEventArgs[0].latLng.lng();

            // scope apply required because this event handler is outside of the angular domain
            $scope.$apply();
          }
        },
        marker: {
          options: {draggable: true},
          events:  {
            dragend: function (marker, eventName, args) {
              if (!that.party.location)
                that.party.location = {};

              that.party.location.latitude = marker.getPosition().lat();
              that.party.location.longitude = marker.getPosition().lng();
            }
          }
        }
      }
    }
  }
}
