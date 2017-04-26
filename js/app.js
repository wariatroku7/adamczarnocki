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
    $scope.info = [];
    $http({
        method : "GET",
        url : "/json/generalInfo.json"
    }).then(function mySuccess(response) {
        $scope.info = response.data;
    }, function myError(response) {
        $scope.info = response.statusText;
    });

});

app.controller('proExpCtrl', function($scope, $http, $filter) {
    $scope.exps = [];
    $http({
        method : "GET",
        url : "/json/proExp.json"
    }).then(function mySuccess(response) {
        $scope.exps = response.data;
    }, function myError(response) {
        $scope.exps = response.statusText;
    });

    // mark tech as deleted
    $scope.deleteExp = function(id) {
      var filtered = $filter('filter')($scope.exps, {id: id});
      if (filtered.length) {
        filtered[0].isDeleted = true;
      }
    };

    // filter exps to show
    $scope.filterExp = function(exp) {
      return exp.isDeleted !== true;
    };

    // add tech
    $scope.addExp = function() {
      $scope.exps.push({
        id: $scope.exps.length+1,
        position: '',
        company: '',
        start: '',
        end: '',
        tasks: ['']
      });
    };

    $scope.addTask = function(i) {
      $scope.exps[i].tasks.push({
        id: $scope.exps[i].tasks.length,
        desc: ''
      });
    };

});


//Xeditable controller for the table with skills
app.controller('EditableTableCtrl', function($scope, $filter, $http, $q) {

  $http({
      method : "GET",
      url : "/json/skills.json"
  }).then(function mySuccess(response) {
      $scope.techs = response.data.skills["techs"];
      $scope.statuses = response.data.skills["statuses"];
  }, function myError(response) {
      $scope.techs = response.statusText;
      $scope.statuses = response.statusText;
  });

  $scope.showStatus = function(tech) {
    var selected = [];
    if(tech.status) {
      selected = $filter('filter')($scope.statuses, {value: tech.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  // filter techs to show
  $scope.filterTech = function(tech) {
    return tech.isDeleted !== true;
  };

  // mark tech as deleted
  $scope.deleteTech = function(id) {
    var filtered = $filter('filter')($scope.techs, {id: id});
    if (filtered.length) {
      filtered[0].isDeleted = true;
    }
  };

  // add tech
  $scope.addTech = function() {
    $scope.techs.push({
      id: $scope.techs.length+1,
      name: '',
      status: null,
      group: null,
      isNew: true
    });
  };

  // cancel all changes
  $scope.cancel = function() {
    for (var i = $scope.techs.length; i--;) {
      var tech = $scope.techs[i];
      // undelete
      if (tech.isDeleted) {
        delete tech.isDeleted;
      }
      // remove new
      if (tech.isNew) {
        $scope.techs.splice(i, 1);
      }
    };
  };

  // save edits
  $scope.saveTable = function() {
    var results = [];
    for (var i = $scope.techs.length; i--;) {
      var tech = $scope.techs[i];
      // actually delete tech
      if (tech.isDeleted) {
        $scope.techs.splice(i, 1);
      }
      // mark as not new
      if (tech.isNew) {
        tech.isNew = false;
      }

    }

    return $q.all(results);
  };
});
