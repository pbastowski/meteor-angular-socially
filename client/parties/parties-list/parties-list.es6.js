//angular.module("socially").controller("PartiesListCtrl", ['$scope',

var {Component, Template, Inject, SetModuleName} = angular2;

SetModuleName('socially');

@Component({selector: 'parties-list', transclude: true})
@Template({url: 'client/parties/parties-list/parties-list.html'})
@Inject(['$meteor', '$rootScope', '$state'])
class PartiesList {
    page = 1;
    perPage = 3;
    sort = {name: 1};
    orderProperty = '1';
    users = $meteor.collection(Meteor.users, false).subscribe('users');
    parties = $meteor.collection( () => Parties.find({}, {sort: $scope.getReactively('sort') }) );

    constructor($meteor, $rootScope, $state) {
        var that = this;

        $meteor.autorun(that, function () {
            $meteor.subscribe('parties', {
                limit: parseInt(that.getReactively('perPage')),
                skip:  (parseInt(that.getReactively('page')) - 1) * parseInt(that.getReactively('perPage')),
                sort:  that.getReactively('sort')
            }, that.getReactively('search')).then(function () {
                that.partiesCount = $meteor.object(Counts, 'numberOfParties', false);

                that.parties.forEach(function (party) {
                    party.onClicked = function () {
                        onMarkerClicked(party);
                    };
                });

                that.map = {
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
        });

        that.$watch('orderProperty', function () {
            if (this.orderProperty)
                this.sort = {name: parseInt(this.orderProperty)};
        });

    }

    remove(party) {
        this.parties.splice(this.parties.indexOf(party), 1);
    }

    pageChanged(newPage) {
        this.page = newPage;
    }

    getUserById(userId) {
        return Meteor.users.findOne(userId);
    }

    creator(party) {
        if (!party)
            return;
        var owner = this.getUserById(party.owner);
        if (!owner)
            return "nobody";

        if ($rootScope.currentUser)
            if ($rootScope.currentUser._id)
                if (owner._id === $rootScope.currentUser._id)
                    return "me";

        return owner;
    }

    rsvp(partyId, rsvp) {
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