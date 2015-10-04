import {State, Component, View, Inject} from "angular2now";

// @State os used to associate ui-router states with our components.
// Notice that there is no "config" function anywhere in the app.
// "defaultRoute: true" indicates that this route that will be displayed 
// by default. You may know this as ".otherwise('/parties')".
// The default route should also set html5Mode, if required.
// Do NOT create controllers for the state. Resolves can be declared as 
// usual and can be accessed in the component's constructor by injecting
// a service named the same as the component itself, although camel-cased.
@State({ name: 'parties', url: '/parties', defaultRoute: true, html5Mode: true })

@Component( 'parties-list' )
@View( 'client/parties/parties.ng.html' )
@Inject('$scope', '$meteor', '$rootScope', '$state', '$modal')

class PartiesComponent {

    constructor($scope, $meteor, $rootScope, $state, $modal)
    {
        $scope.page = 1;
        $scope.perPage = 3;
        $scope.sort = { name: 1 };
        $scope.orderProperty = '1';

        $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

        $scope.parties = $meteor.collection(function () {
            return Parties.find({}, {
                sort: $scope.getReactively('sort')
            });
        });

        $meteor.autorun($scope, function () {
            $meteor.subscribe(
                'parties', 
                {
                    limit: parseInt($scope.getReactively('perPage')),
                    skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
                    sort: $scope.getReactively('sort')
                }, 
                $scope.getReactively('search')
            ).then(function () {
                $scope.partiesCount = $meteor.object(Counts, 'numberOfParties', false);

                $scope.parties.forEach(function (party) {
                    party.onClicked = function () {
                        $state.go('partyDetails', {partyId: party._id});
                    };
                });

                $scope.map = {
                    center: {
                        latitude: 45,
                        longitude: -73
                    },
                    options: {
                        maxZoom: 10
                    },
                    zoom: 8
                };
            });
        });

        $scope.remove = function (party) {
            $scope.parties.splice($scope.parties.indexOf(party), 1);
        };

        $scope.removeAll = function () {
            $scope.parties.remove();
        };

        $scope.pageChanged = function (newPage) {
            $scope.page = newPage;
        };

        $scope.$watch('orderProperty', function () {
            if ($scope.orderProperty)
                $scope.sort = {name: parseInt($scope.orderProperty)};
        });

        $scope.rsvp = function (partyId, rsvp) {
            $meteor.call('rsvp', partyId, rsvp).then(
                function (data) {
                    console.log('success responding', data);
                },
                function (err) {
                    console.log('failed', err);
                }
            );
        };

        $scope.outstandingInvitations = function (party) {
            return _.filter($scope.users, function (user) {
                return (_.contains(party.invited, user._id) && !_.findWhere(party.rsvps, {user: user._id}));
            });
        };

        $scope.getUserById = function (userId) {
            return Meteor.users.findOne(userId);
        };

        $scope.creator = function (party) {
            if (!party)
                return;
            var owner = $scope.getUserById(party.owner);
            if (!owner)
                return 'nobody';

            if ($rootScope.currentUser)
                if ($rootScope.currentUser._id)
                    if (owner._id === $rootScope.currentUser._id)
                        return 'me';

            return owner;
        };

        $scope.openAddNewPartyModal = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'client/new-party/add-new-party-modal.ng.html',
                controller: 'AddNewPartyCtrl',
                resolve: {
                    parties: function () {
                        return $scope.parties;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        };

        $scope.isRSVP = function (rsvp, party) {
            if (!$rootScope.currentUser._id) return false;
            var rsvpIndex = party.myRsvpIndex;
            rsvpIndex = rsvpIndex || _.indexOf(_.pluck(party.rsvps, 'user'), $rootScope.currentUser._id);

            if (rsvpIndex !== -1) {
                party.myRsvpIndex = rsvpIndex;
                return party.rsvps[rsvpIndex].rsvp === rsvp;
            }
        }
    }
}

console.log('! parties-list');
