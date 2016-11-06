// myApp is the module object defined in config.js

myApp.controller("ngCtrlUsersRegForm", ["$rootScope", "$scope", "$state", "ngServiceInfoMsgs", "ngServiceRESTAPI", "ngServiceDPConf", "ngServiceUserReg", function($rootScope, $scope, $state, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceDPConf, ngServiceUserReg) {
	$scope.formRegFormObj = {};

	var retainUserRegOnStatesAr = ["pageWindow.pageUsers.pageUsersRegister.pageUsersRegFormConf"];
	if(retainUserRegOnStatesAr.indexOf($rootScope.prevState) == -1) {
		ngServiceUserReg.setInfo("regform", undefined);
	}

	if(ngServiceUserReg.getInfo("regform") != undefined) {
		angular.copy(ngServiceUserReg.getInfo("regform"), $scope.formRegFormObj);
	}
	
	ngServiceDPConf.format = "DD-MM-YYYY";
	$scope.datetimepickerOptions = JSON.stringify(ngServiceDPConf);

	$scope.genderAr = [
		{ code: "0", name: "Male" },
		{ code: "1", name: "Female" }
	];
	$scope.maritalStatusAr = [
		{ code: "0", name: "Unmarried" },
		{ code: "1", name: "Married" }
	];

	ngServiceRESTAPI("POST", "pages/window/users/register/script.php?task=ucategories", {}).post(function(responseData) {
		var userRegInfo = ngServiceUserReg.getInfo("regparams");
		$scope.uCategoryAr = responseData.data;

		var user_type_ar = $scope.uCategoryAr.filter(function(obj) { return (obj.id == userRegInfo.ngUCategoryMdl); });

		$scope.section_header = user_type_ar[0].name + " Registration Form";
		$scope.ngUCategoryMdl = userRegInfo.ngUCategoryMdl;

		if($scope.ngUCategoryMdl != 5) {
			$scope.formRegFormObj.ngGenderMdl = $scope.genderAr[0].code;
			$scope.formRegFormObj.ngMaritalStatusMdl = $scope.maritalStatusAr[0].code;
		}
	});

	ngServiceRESTAPI("POST", "pages/window/users/register/regform/script.php?task=addressinputs", {}).post(function(responseData) {
		$scope.presentAddCountriesAr = responseData.data[0];
		$scope.permanentAddCountriesAr = responseData.data[0];
		var statesAr = responseData.data[1];
		var districtsAr = responseData.data[2];

		$scope.ngPresentAddCountryChng = function() {
			$scope.presentAddStatesAr = statesAr.filter(function(obj) { return (obj.country_id == $scope.formRegFormObj.ngPresentAddCountryMdl); });
		};

		$scope.ngPresentAddStateChng = function() {
			$scope.presentAddDistrictsAr = districtsAr.filter(function(obj) { return (obj.state_id == $scope.formRegFormObj.ngPresentAddStateMdl); });
		};

		$scope.ngPermanentAddCountryChng = function() {
			$scope.permanentAddStatesAr = statesAr.filter(function(obj) { return (obj.country_id == $scope.formRegFormObj.ngPermanentAddCountryMdl); });
		};

		$scope.ngPermanentAddStateChng = function() {
			$scope.permanentAddDistrictsAr = districtsAr.filter(function(obj) { return (obj.state_id == $scope.formRegFormObj.ngPermanentAddStateMdl); });
		};

		if(ngServiceUserReg.getInfo("regform") != undefined) {
			$scope.ngPresentAddCountryChng();
			$scope.ngPresentAddStateChng();

			$scope.ngPermanentAddCountryChng();
			$scope.ngPermanentAddStateChng();
		}
	});

	$scope.ngRegFormSbmt = function() {
		if($scope.formRegForm.$valid) {
			ngServiceUserReg.setInfo("regform", $scope.formRegFormObj);

			$state.go("pageWindow.pageUsers.pageUsersRegister.pageUsersRegFormConf");
		}
	};

	$scope.ngResetClick = function() {
		$scope.formRegForm.$setPristine();
		$scope.formRegFormObj = {};
	};

	$scope.ngBackClick = function(path) {
		$state.go(path);
	};
}]);