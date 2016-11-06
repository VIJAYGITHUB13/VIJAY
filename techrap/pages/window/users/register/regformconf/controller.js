// myApp is the module object defined in config.js

myApp.controller("ngCtrlUsersRegFormConf", ["$rootScope", "$scope", "$state", "ngServiceMyInfo", "ngServiceInfoMsgs", "ngServiceRESTAPI", "ngServiceDPConf", "ngServiceUserReg", function($rootScope, $scope, $state, ngServiceMyInfo, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceDPConf, ngServiceUserReg) {
	$scope.formRegFormConfObj = ngServiceUserReg.getInfo("regform");

	var prevStatesAr = ["pageWindow.pageUsers.pageUsersRegister.pageUsersRegForm"];

	$scope.readOnly = false;
	if(prevStatesAr.indexOf($rootScope.prevState) == -1) {
		$scope.readOnly = true;
		$scope.ngUCategoryMdl = $scope.formRegFormConfObj.ngUCategoryMdl;
		$scope.section_header = $scope.formRegFormConfObj.sectionHeader;
	}

	if(!$scope.readOnly) {
		ngServiceRESTAPI("POST", "pages/window/users/register/script.php?task=ucategories", {}).post(function(responseData) {
			var userRegInfo = ngServiceUserReg.getInfo("regparams");
			$scope.uCategoryAr = responseData.data;

			var user_type_ar = $scope.uCategoryAr.filter(function(obj) { return (obj.id == userRegInfo.ngUCategoryMdl) ? obj.name : ""; });

			$scope.section_header = user_type_ar[0].name + " Registration Confirm Form";
			$scope.ngUCategoryNameMdl = user_type_ar[0].name;
			$scope.ngUCategoryMdl = userRegInfo.ngUCategoryMdl;
		});
	}

	if($scope.formRegFormConfObj.ngGenderMdl != undefined) {
		var genderAr = [
			{ code: "0", name: "Male" },
			{ code: "1", name: "Female" }
		];
		var bufferAr = genderAr.filter(function(obj) { return (obj.code == $scope.formRegFormConfObj.ngGenderMdl); });
		$scope.formRegFormConfObj.ngGenderNameMdl = bufferAr[0].name;
	}

	if($scope.formRegFormConfObj.ngMaritalStatusMdl != undefined) {
		var maritalStatusAr = [
			{ code: "0", name: "Unmarried" },
			{ code: "1", name: "Married" }
		];
		var bufferAr = maritalStatusAr.filter(function(obj) { return (obj.code == $scope.formRegFormConfObj.ngMaritalStatusMdl); });
		$scope.formRegFormConfObj.ngMaritalStatusNameMdl = bufferAr[0].name;
	}

	ngServiceRESTAPI("POST", "pages/window/users/register/regform/script.php?task=addressinputs", {}).post(function(responseData) {
		var contriesAr = responseData.data[0];
		var statesAr = responseData.data[1];
		var districtsAr = responseData.data[2];

		if($scope.formRegFormConfObj.ngPresentAddCountryMdl && $scope.formRegFormConfObj.ngPresentAddCountryMdl != "0") {
			var bufferAr = contriesAr.filter(function(obj) { return (obj.id == $scope.formRegFormConfObj.ngPresentAddCountryMdl); });
			$scope.formRegFormConfObj.ngPresentAddCountryNameMdl = bufferAr[0].name;
		}
		if($scope.formRegFormConfObj.ngPermanentAddCountryMdl && $scope.formRegFormConfObj.ngPermanentAddCountryMdl != "0") {
			var bufferAr = contriesAr.filter(function(obj) { return (obj.id == $scope.formRegFormConfObj.ngPermanentAddCountryMdl); });
			$scope.formRegFormConfObj.ngPermanentAddCountryNameMdl = bufferAr[0].name;
		}

		if($scope.formRegFormConfObj.ngPresentAddStateMdl && $scope.formRegFormConfObj.ngPresentAddStateMdl != "0") {
			var bufferAr = statesAr.filter(function(obj) { return (obj.id == $scope.formRegFormConfObj.ngPresentAddStateMdl); });
			$scope.formRegFormConfObj.ngPresentAddStateNameMdl = bufferAr[0].name;
		}
		if($scope.formRegFormConfObj.ngPermanentAddStateMdl && $scope.formRegFormConfObj.ngPermanentAddStateMdl != "0") {
			var bufferAr = statesAr.filter(function(obj) { return (obj.id == $scope.formRegFormConfObj.ngPermanentAddStateMdl); });
			$scope.formRegFormConfObj.ngPermanentAddStateNameMdl = bufferAr[0].name;
		}

		if($scope.formRegFormConfObj.ngPresentAddDistrictMdl && $scope.formRegFormConfObj.ngPresentAddDistrictMdl != "0") {
			var bufferAr = districtsAr.filter(function(obj) { return (obj.id == $scope.formRegFormConfObj.ngPresentAddDistrictMdl); });
			$scope.formRegFormConfObj.ngPresentAddDistrictNameMdl = bufferAr[0].name;
		}
		if($scope.formRegFormConfObj.ngPermanentAddDistrictMdl && $scope.formRegFormConfObj.ngPermanentAddDistrictMdl != "0") {
			var bufferAr = districtsAr.filter(function(obj) { return (obj.id == $scope.formRegFormConfObj.ngPermanentAddDistrictMdl); });
			$scope.formRegFormConfObj.ngPermanentAddDistrictNameMdl = bufferAr[0].name;
		}
	});

	$scope.ngRegFormConfSbmt = function() {
		var msg = '';
		switch($scope.ngUCategoryMdl) {
			case "5":
				msg += 'The details for ' + $scope.ngUCategoryNameMdl + ' <strong>' + $scope.formRegFormConfObj.ngFNameMdl + '</strong> will be registered and a request for the new connection auto-triggers. Are you sure to proceed?';
			break;

			default:
				msg += 'Are you sure to register the details for ' + $scope.ngUCategoryNameMdl + ' <strong>' + $scope.formRegFormConfObj.ngFNameMdl + '</strong>?';
			break;
		}
		
		bootbox.confirm(msg, function(actionFlag) {
			if(actionFlag) {
				var inputObj = {};
				angular.copy($scope.formRegFormConfObj, inputObj);
				inputObj.ucategory = $scope.ngUCategoryMdl;
				inputObj.myid = ngServiceMyInfo.uid;

				$scope.isInfo = {};
				ngServiceRESTAPI("POST", "pages/window/users/register/regformconf/script.php?task=register", inputObj).post(function(responseData) {
					if(responseData.statusText == "OK") {
						switch(responseData.data) {
							case "ALREADY_EXISTS":
								angular.copy(ngServiceInfoMsgs.info, $scope.isInfo);
								$scope.isInfo.msg = "The user already exists.";
							break;

							case "ERROR_DB":
								angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
								$scope.isInfo.msg = "Server error.";
							break;

							case "SUCCESS":
								angular.copy(ngServiceInfoMsgs.success, $scope.isInfo);
								$scope.isInfo.msg = "Done with the registration.";
							break;

							default:
								angular.copy(ngServiceInfoMsgs.info, $scope.isInfo);
								$scope.isInfo.msg = responseData.data;
							break;
						}
					} else {
						angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
						$scope.isInfo.title += " (" + responseData.status + ")";
						$scope.isInfo.msg = responseData.statusText;
					}
				});
			}
		});
	};

	$scope.ngBackClick = function(path) {
		$state.go(path);
	};
}]);