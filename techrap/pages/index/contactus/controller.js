// myApp is the module object defined in config.js

myApp.controller("ngCtrlContactUs", ["$scope", "$state", function($scope, $state) {
	$scope.tab_name = $state.current.data.displayName;
	$scope.tab_desc = $state.current.data.displayDesc;
}]);