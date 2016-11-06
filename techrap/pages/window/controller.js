// myApp is the module object defined in config.js

myApp.controller("ngCtrlWindow", ["$scope", "$state", "ngServiceMyInfo", "ngServiceRESTAPI", "ngServiceUserReg", function($scope, $state, ngServiceMyInfo, ngServiceRESTAPI, ngServiceUserReg) {
	ngServiceRESTAPI("POST", "pages/window/script.php?task=app_details", {}).post(function(responseData) {
		if(responseData.statusText == "OK") {
			var app_details = responseData.data[0];
			
			$scope.app_name = app_details.app_name;
			$scope.app_version = (app_details.app_version ? "Version " + app_details.app_version :  "");
		}
	});
	$scope.uname = ngServiceMyInfo.uname;
	$scope.datentime = new Date().getTime();

	var inputObj = {
		ucategory: parseInt(ngServiceMyInfo.ucategory) || 0
	};

	ngServiceRESTAPI("POST", "pages/window/script.php?task=menus", inputObj).post(function(responseData) {
		if(responseData.statusText == "OK") {
			$scope.windowMenusAr = responseData.data;
		}
	});

	$scope.ngMyProfileClick = function() {
		var inputObj = {
			myid: parseInt(ngServiceMyInfo.uid) || 0
		};
		ngServiceRESTAPI("POST", "pages/window/script.php?task=myprofile", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				responseData.data[0].sectionHeader = "My Profile";
				ngServiceUserReg.setInfo("regform", responseData.data[0]);

				$state.go("pageWindow.pageUsers.pageUsersRegister.pageUsersRegFormConf");
			}
		});
	};
}]);