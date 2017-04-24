var app = angular.module('upToWork',["xeditable"]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

app.directive('generalInfo', function(){
  return {
    restrict: 'E',
    templateUrl: './tpl/generalInfo.html'
  };
});
app.directive('proExp', function(){
  return {
    restrict: 'E',
    templateUrl: './tpl/proExp.html'
  };
});
app.directive('skills', function(){
  return {
    restrict: 'E',
    templateUrl: './tpl/skills.html'
  };
});

app.controller('generalInfoCtrl', function($scope, $http) {
    $http({
        method : "GET",
        url : "/json/generalInfo.json"
    }).then(function mySuccess(response) {
        $scope.info = response.data;
    }, function myError(response) {
        $scope.info = response.statusText;
    });

    $scope.editorEnabled = false;

    $scope.enableEditor = function() {
      $scope.editorEnabled = true;
      $scope.editableTitle = $scope.info.name;
      $scope.editablePosition = $scope.info.position;
      $scope.editablePhone = $scope.info.phone;
      $scope.editableMail = $scope.info.mail;
      $scope.editableBirthday = $scope.info.birthday;
      $scope.editableLocation = $scope.info.location;
    };

    $scope.disableEditor = function() {
      $scope.editorEnabled = false;
    };

    $scope.save = function() {
      $scope.info.name = $scope.editableTitle;
      $scope.info.position = $scope.editablePosition;
      $scope.info.phone = $scope.editablePhone;
      $scope.info.mail = $scope.editableMail;
      $scope.info.birthday = $scope.editableBirthday;
      $scope.info.location = $scope.editableLocation;
      $scope.disableEditor();
    };
});

app.controller('proExpCtrl', function($scope, $http) {
    $http({
        method : "GET",
        url : "/json/proExp.json"
    }).then(function mySuccess(response) {
        $scope.exps = response.data;
    }, function myError(response) {
        $scope.exps = response.statusText;
    });

    $scope.editorEnabled = false;

    $scope.enableEditor = function() {
      $scope.editorEnabled = true;
      $scope.editablePosition = $scope.exps.position;
      $scope.editableCompany = $scope.exps.company;
      $scope.editableStart = $scope.exps.start;
      $scope.editableEnd = $scope.exps.end;
      $scope.editableTask0 = $scope.exps.tasks[0].desc;
      $scope.editableTask1 = $scope.exps.tasks[1].desc;
      $scope.editableTask2 = $scope.exps.tasks[2].desc;
      $scope.editableTask3 = $scope.exps.tasks[3].desc;
      $scope.editableTask4 = $scope.exps.tasks[4].desc;
    };

    $scope.disableEditor = function() {
      $scope.editorEnabled = false;
    };

    $scope.save = function() {
      $scope.exps.position = $scope.editablePosition;
      $scope.exps.company = $scope.editableCompany;
      $scope.exps.start = $scope.editableStart;
      $scope.exps.end = $scope.editableEnd;
      $scope.exps.tasks[0].desc = $scope.editableTask0;
      $scope.exps.tasks[1].desc = $scope.editableTask1;
      $scope.exps.tasks[2].desc = $scope.editableTask2;
      $scope.exps.tasks[3].desc = $scope.editableTask3;
      $scope.exps.tasks[4].desc = $scope.editableTask4;
      $scope.disableEditor();
    };
});


//Xeditable controller for the table with skills
app.controller('EditableTableCtrl', function($scope, $filter, $http, $q) {
  $scope.users = [
    {id: 1, name: 'HTML5 & SASS & CSS3 & Bootstrap', status: 1},
    {id: 2, name: 'jQuery & Javascript & AngularJS', status: 2},
    {id: 3, name: 'PHP & MySQL & Wordpress', status: 3}
  ];

  $scope.statuses = [
    {value: 1, text: 'Advanced'},
    {value: 2, text: 'Intermediate'},
    {value: 3, text: 'Basic'}
  ];

  $scope.showStatus = function(user) {
    var selected = [];
    if(user.status) {
      selected = $filter('filter')($scope.statuses, {value: user.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  // filter users to show
  $scope.filterUser = function(user) {
    return user.isDeleted !== true;
  };

  // mark user as deleted
  $scope.deleteUser = function(id) {
    var filtered = $filter('filter')($scope.users, {id: id});
    if (filtered.length) {
      filtered[0].isDeleted = true;
    }
  };

  // add user
  $scope.addUser = function() {
    $scope.users.push({
      id: $scope.users.length+1,
      name: '',
      status: null,
      group: null,
      isNew: true
    });
  };

  // cancel all changes
  $scope.cancel = function() {
    for (var i = $scope.users.length; i--;) {
      var user = $scope.users[i];
      // undelete
      if (user.isDeleted) {
        delete user.isDeleted;
      }
      // remove new
      if (user.isNew) {
        $scope.users.splice(i, 1);
      }
    };
  };

  // save edits
  $scope.saveTable = function() {
    var results = [];
    for (var i = $scope.users.length; i--;) {
      var user = $scope.users[i];
      // actually delete user
      if (user.isDeleted) {
        $scope.users.splice(i, 1);
      }
      // mark as not new
      if (user.isNew) {
        user.isNew = false;
      }

    }

    return $q.all(results);
  };
});
