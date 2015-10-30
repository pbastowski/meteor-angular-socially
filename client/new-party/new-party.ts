// Here we define a controller that is required by the $modalInstance
// service, which opens a modal window.
// I don't really like to use Controllers, but, a controller is in-fact 
// required by the "old fashioned" ui-bootstrap library, so, we support it.
import {Controller, Inject} from "angular2now";

@Controller( 'AddNewPartyCtrl')
@Inject('$scope', '$meteor', '$rootScope', '$state', '$modalInstance', 'parties', '$modal')

class NewPartyController {

    constructor($scope, $meteor, $rootScope, $state, $modalInstance, parties, $modal) {

        $scope.addNewParty = function () {
            $scope.newParty.owner = $rootScope.currentUser._id;
            parties.push($scope.newParty);
            $scope.newParty = '';
            $modalInstance.close();
        }
    }
}

console.log('! AddNewPartyCtrl');
