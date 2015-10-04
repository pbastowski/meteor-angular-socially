import {State, Component, View, Inject} from "angular2now";

// Do NOT create controllers for the state. Resolves can be declared as 
// usual, see below, and can be accessed in the component's constructor 
// by injecting a service named the same as the component itself, 
// although camel-cased. See the class constructor below.
@State({
    name: 'partyDetails',
    url: '/parties/:partyId',
    resolve: {
        "currentUser": ["$meteor", function ($meteor) {
            return $meteor.requireUser();
        }]
    }
})

@Component({ selector: 'party-details', replace: true })
@View ('client/party/party.ng.html')
@Inject( '$scope', '$stateParams', '$meteor', 'partyDetails' )

class PartyComponent {
    
    constructor($scope, $stateParams, $meteor, partyDetails) {
        // The line below is just an example - it is not part of the app.
        console.log('@ party-details resolved values: ', partyDetails);
        
        $scope.party = $meteor.object(Parties, $stateParams.partyId);
        $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
        $scope.$meteorSubscribe('parties');

        $scope.invite = function (user) {
            $meteor.call('invite', $scope.party._id, user._id).then(
                function (data) {
                    console.log('success inviting', data);
                },
                function (err) {
                    console.log('failed', err);
                }
            );
        };

        $scope.canInvite = function () {
            if (!$scope.party)
                return false;

            return !$scope.party.public &&
                $scope.party.owner === Meteor.userId();
        };

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 8,
            events: {
                click: function (mapModel, eventName, originalEventArgs) {
                    if (!$scope.party)
                        return;

                    if (!$scope.party.location)
                        $scope.party.location = {};

                    $scope.party.location.latitude = originalEventArgs[0].latLng.lat();
                    $scope.party.location.longitude = originalEventArgs[0].latLng.lng();
                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                }
            },
            marker: {
                options: {draggable: true},
                events: {
                    dragend: function (marker, eventName, args) {
                        if (!$scope.party.location)
                            $scope.party.location = {};

                        $scope.party.location.latitude = marker.getPosition().lat();
                        $scope.party.location.longitude = marker.getPosition().lng();
                    }
                }
            }
        };
    }
}

console.log('! party-details');
