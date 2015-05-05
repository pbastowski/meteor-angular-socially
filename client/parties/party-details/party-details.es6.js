var {Component, View, Inject, SetModuleName} = angular2;

SetModuleName('socially');

@Component({selector: 'party-details'})
@View({templateUrl: 'client/parties/party-details/party-details.ng.html'})
@Inject(['$scope', '$meteor', '$stateParams'])

class PartyDetails {

  /* @ngInject */
  constructor($scope, $meteor, $stateParams) {

    // Scope properties
    $scope.party = $meteor.object(Parties, $stateParams.partyId);
    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
    $scope.map = getMap();

    // Scope method declarations (API)
    $scope.invite = invite;
    $scope.canInvite = canInvite;

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
      $meteor.call('invite', $scope.party._id, user._id).then(
        function (data) {
          console.log('success inviting', data);
        },
        function (err) {
          console.log('failed', err);
        }
      );
    }

    function canInvite() {
      if (!$scope.party)
        return false;

      return !$scope.party.public &&
        $scope.party.owner === Meteor.userId();
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
            if (!$scope.party)
              return;

            if (!$scope.party.location)
              $scope.party.location = {};

            $scope.party.location.latitude = originalEventArgs[0].latLng.lat();
            $scope.party.location.longitude = originalEventArgs[0].latLng.lng();

            // scope apply required because this event handler is outside of the angular domain
            $scope.$apply();
          }
        },
        marker: {
          options: {draggable: true},
          events:  {
            dragend: function (marker, eventName, args) {
              if (!$scope.party.location)
                $scope.party.location = {};

              $scope.party.location.latitude = marker.getPosition().lat();
              $scope.party.location.longitude = marker.getPosition().lng();
            }
          }
        }
      }
    }
  }
}
