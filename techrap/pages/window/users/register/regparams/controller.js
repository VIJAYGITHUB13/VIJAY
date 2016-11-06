// myApp is the module object defined in config.js

myApp.controller("ngCtrlUsersRegParams", ["$rootScope", "$scope", "$state", "ngServiceRESTAPI", "ngServiceUserReg", function($rootScope, $scope, $state, ngServiceRESTAPI, ngServiceUserReg) {
	$scope.formRegParamsObj = {};

	var retainUserRegOnStatesAr = [
		"pageWindow.pageUsers.pageUsersRegister.pageUsersRegForm",
		"pageWindow.pageUsers.pageUsersRegister.pageUsersRegUpload"
	];
	if(retainUserRegOnStatesAr.indexOf($rootScope.prevState) == -1) {
		ngServiceUserReg.setInfo("regparams", undefined);
	}

	if(ngServiceUserReg.getInfo("regparams") != undefined) {
		angular.copy(ngServiceUserReg.getInfo("regparams"), $scope.formRegParamsObj);
	}

	ngServiceRESTAPI("POST", "pages/window/users/register/script.php?task=ucategories", {}).post(function(responseData) {
		$scope.uCategoryArSM = responseData.data;
		$scope.uCategoryArXS = [
			{ id: "5", name: "Guest" }
		];
	});

	$scope.regTypeArSM = [
		{ code: "form", name: "Form" },
		{ code: "upload", name: "Upload" }
	];

	$scope.regTypeArXS = [
		{ code: "form", name: "Form" }
	];

	$scope.ngRegParamsSbmt = function() {
		ngServiceUserReg.setInfo("regparams", $scope.formRegParamsObj);
		
		var obj = {
			ucategory: $scope.formRegParamsObj.ngUCategoryMdl,
			regtype: $scope.formRegParamsObj.ngRegTypeMdl
		}

		switch($scope.formRegParamsObj.ngRegTypeMdl) {
			case "form":
				$state.go("pageWindow.pageUsers.pageUsersRegister.pageUsersRegForm");
			break;

			case "upload":
				$state.go("pageWindow.pageUsers.pageUsersRegister.pageUsersRegUpload");
			break;
		}
	};

	$scope.ngResetClick = function() {
		ngServiceUserReg.setInfo("regparams", undefined, undefined);
		$state.go($state.current, {}, { reload: true });
	};
}]);