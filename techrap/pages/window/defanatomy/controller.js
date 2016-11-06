// myApp is the module object defined in config.js

myApp.controller("ngCtrlDefAnatomy", ["$scope", "$state", "ngServiceInfoMsgs", "ngServiceRESTAPI", function($scope, $state, ngServiceInfoMsgs, ngServiceRESTAPI) {
	$scope.tab_name = $state.current.data.displayName;
	$scope.tab_desc = $state.current.data.displayDesc;
	$scope.defAnatomyObj = {};

	ngServiceRESTAPI("GET", "js/custom/model.json", {}).post(function(jsonData) {
		if(jsonData.statusText == "OK") {
			$scope.anatomyAr = jsonData.data[0].anatomyAr;
		}
	});
}]);