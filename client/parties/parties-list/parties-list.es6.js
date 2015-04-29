var {Component, View, Inject, SetModuleName} = angular2;

SetModuleName('socially');

@Component({selector: 'parties-list'})
@View({templateUrl: 'client/parties/parties-list/parties-list.ng.html'})
@Inject(['$scope', '$meteor', '$rootScope', '$state'])

class PartiesList {

  constructor($scope, $meteor, $rootScope, $state) {

    // Scope properties
    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = {name: 1};
    $scope.orderProperty = '1';

    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

    $scope.parties = $meteor.collection(function () {
      return Parties.find({}, {
        sort: $scope.getReactively('sort')
      });
    });

    // Scope method declarations (API)
    $scope.creator = creator;
    $scope.rsvp = rsvp;
    $scope.getUserById = getUserById;
    $scope.pageChanged = pageChanged;
    $scope.remove = remove;

    // Tasks to run on directive initialisation
    $meteor.autorun($scope, autorun);
    $scope.$watch('orderProperty', watchOrderProperty);

    // API and task implementation functions
    function autorun() {
      $meteor.subscribe('parties', {
        limit: parseInt($scope.getReactively('perPage')),
        skip:  (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
        sort:  $scope.getReactively('sort')
      }, $scope.getReactively('search')).then(function () {
        $scope.partiesCount = $meteor.object(Counts, 'numberOfParties', false);

        $scope.parties.forEach(function (party) {
          party.onClicked = function () {
            onMarkerClicked(party);
          };
        });

        $scope.map = {
          center: {
            latitude:  45,
            longitude: -73
          },
          zoom:   8
        };

        var onMarkerClicked = function (marker) {
          $state.go('partyDetails', {partyId: marker._id});
        }

      });
    }

    function watchOrderProperty() {
      if ($scope.orderProperty)
        $scope.sort = {name: parseInt($scope.orderProperty)};
    }

    function remove(party) {
      $scope.parties.splice($scope.parties.indexOf(party), 1);
    }

    function pageChanged(newPage) {
      $scope.page = newPage;
    }

    function getUserById(userId) {
      return Meteor.users.findOne(userId);
    }

    function creator(party) {
      if (!party)
        return;
      var owner = $scope.getUserById(party.owner);
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