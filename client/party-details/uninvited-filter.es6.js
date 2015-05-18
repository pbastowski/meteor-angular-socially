var {Filter} = angular2now;

angular.module('socially');

@Filter({ name: 'uninvited' })
class uninvited {
  constructor() {
    return function (users, party) {
      if (!party)
        return false;

      return _.filter(users, function (user) {
        if (user._id == party.owner || _.contains(party.invited, user._id))
          return false;
        else
          return true;
      });
    }
  }
}
