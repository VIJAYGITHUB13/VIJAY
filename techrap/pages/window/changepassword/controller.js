// myApp is the module object defined in config.js

myApp.controller("ngCtrlChangePassword", ["$rootScope", "$scope", "$state", "ngServiceMyInfo", "ngServiceInfoMsgs", "ngServiceRESTAPI", "ngServiceDPConf", "ngServiceUserReg", function($rootScope, $scope, $state, ngServiceMyInfo, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceDPConf, ngServiceUserReg) {
	$scope.tab_name = $state.current.data.displayName;
	$scope.tab_desc = $state.current.data.displayDesc;
	
	$scope.formChangePasswordObj = {};

	$scope.formChangePasswordObj.ngUsernameMdl = ngServiceMyInfo.username;

	$scope.ngChangePasswordSbmt = function() {
		if($scope.formChangePassword.$valid) {
			var inputObj = {};
			inputObj.myid = ngServiceMyInfo.uid;
			inputObj.password = $scope.formChangePasswordObj.ngPasswordMdl;

			$scope.isInfo = {};
			ngServiceRESTAPI("POST", "pages/window/changepassword/script.php?task=changepassword", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							angular.copy(ngServiceInfoMsgs.success, $scope.isInfo);
							$scope.isInfo.msg = "Password changed successfully.";
						break;

						case "ERROR_DB":
							angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
							$scope.isInfo.msg = "Server error.";
						break;
					}
				} else {
					angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
					$scope.isInfo.title += " (" + responseData.status + ")";
					$scope.isInfo.msg = responseData.statusText;
				}
			});
		}
	};

	$scope.ngResetClick = function() {
		$scope.formChangePassword.$setPristine();
		$scope.formChangePasswordObj = {};
	};
}]);