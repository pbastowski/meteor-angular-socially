var {Filter} = angular2now;

angular.module('socially');

@Filter({name: 'displayName'})
class displayName {
  constructor() {
    return function (user) {
      if (!user)
        return;
      if (user.profile && user.profile.name)
        return user.profile.name;
      else if (user.emails)
        return user.emails[0].address;
      else
        return user;
    }
  }
}
