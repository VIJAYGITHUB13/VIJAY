// myApp is the module object defined in config.js

myApp.controller("ngCtrlIndex", ["$scope", "ngServiceRESTAPI", function($scope, ngServiceRESTAPI) {
	ngServiceRESTAPI("POST", "pages/index/script.php?task=app_details", {}).post(function(responseData) {
		if(responseData.statusText == "OK") {
			var app_details = responseData.data[0];
			
			$scope.app_name = app_details.app_name;
			$scope.app_version = (app_details.app_version ? "Version " + app_details.app_version :  "");
		}
	});
	$scope.datentime = new Date().getTime();

	ngServiceRESTAPI("POST", "pages/index/script.php?task=menus", {}).post(function(responseData) {
		if(responseData.statusText == "OK") {
			$scope.indexMenusAr = responseData.data;
		}
	});
}]);