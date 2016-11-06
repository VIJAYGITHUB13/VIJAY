// myApp is the module object defined in config.js

myApp.controller("ngCtrlUsersRegister", ["$scope", "$state", "ngServiceInfoMsgs", "ngServiceRESTAPI", "ngServiceDPConf", function($scope, $state, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceDPConf) {
	$scope.tab_name = $state.current.data.displayName;
	$scope.tab_desc = $state.current.data.displayDesc;
	$scope.searchObj = {};
}]);