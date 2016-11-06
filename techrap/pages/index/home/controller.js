// myApp is the module object defined in config.js

myApp.controller("ngCtrlHome", ["$rootScope", "$scope", "$state", "ngServiceMyInfo", "ngServiceInfoMsgs", "ngServiceRESTAPI", function($rootScope, $scope, $state, ngServiceMyInfo, ngServiceInfoMsgs, ngServiceRESTAPI) {
	$scope.signInObj = {};
	$scope.signUpObj = {};
	$scope.isSignin = true;

	$scope.signInObj.ngUNameMdl = "admin";
	$scope.signInObj.ngPwdMdl = "password";

	$scope.tag_line = "Treasure of Knowledge to empower the Professionalism";
	
	$scope.ngSigninSbmt = function() {
		$scope.isSigninInfo = {};
		
		if($scope.formSignin.$valid) {
			var inputObj = {
				uname: $scope.signInObj.ngUNameMdl || "",
				pwd: $scope.signInObj.ngPwdMdl || ""
			};

			ngServiceRESTAPI("POST", "pages/index/home/script.php?task=signin", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					if(responseData.data.length) {
						ngServiceMyInfo.uid = responseData.data[0].uid;
						ngServiceMyInfo.username = responseData.data[0].username;
						ngServiceMyInfo.uname = responseData.data[0].uname;
						ngServiceMyInfo.ucategory = responseData.data[0].ucategory;
						sessionStorage.setItem("logInFlag", "true");
						
						switch(responseData.data[0].ucategory) {
							case "1":
								$state.go("pageWindow.pageUsers.pageUsersView");
							break;

							case "3":
								$state.go("pageWindow.pageInbox");
							break;

							default:
								$state.go("pageWindow.pageUsers.pageUsersView");
							break;
						}
					} else {
						angular.copy(ngServiceInfoMsgs.info, $scope.isSigninInfo);
						$scope.isSigninInfo.msg = "Please provide valid credentials.";
					}
				} else {
					angular.copy(ngServiceInfoMsgs.danger, $scope.isSigninInfo);
					$scope.isSigninInfo.title += " (" + responseData.status + ")";
					$scope.isSigninInfo.msg = responseData.statusText;
				}
			});
		}
	};
	
	$scope.ngSignupSbmt = function() {
		$scope.isSignupInfo = {};
		
		if($scope.formSignup.$valid) {
			var inputObj = {
				uname: $scope.signUpObj.ngUNameMdl || "",
				mobile_no: $scope.signUpObj.ngMobileNoMdl || "",
				email_id: $scope.signUpObj.ngEmailIDMdl || "",
				comments: $scope.signUpObj.ngUCommentMdl || ""
			};

			ngServiceRESTAPI("POST", "pages/index/home/script.php?task=signup", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					switch(responseData.data) {
						case "ALREADY_EXISTS":
							angular.copy(ngServiceInfoMsgs.info, $scope.isSignupInfo);
							$scope.isSignupInfo.msg = "The user already exists.";
						break;

						case "ERROR_DB":
							angular.copy(ngServiceInfoMsgs.danger, $scope.isSignupInfo);
							$scope.isSignupInfo.msg = "Server error.";
						break;

						case "SUCCESS":
							$scope.signUpObj = {};
							$scope.formSignup.$setPristine();

							angular.copy(ngServiceInfoMsgs.success, $scope.isSignupInfo);
							$scope.isSignupInfo.msg = "Thank you. Record saved, our team will get back to you very soon.";
						break;

						default:
							$scope.signUpObj = {};
							angular.copy(ngServiceInfoMsgs.info, $scope.isSignupInfo);
							$scope.isSignupInfo.msg = responseData.data;
						break;
					}
				} else {
					angular.copy(ngServiceInfoMsgs.danger, $scope.isSignupInfo);
					$scope.isSignupInfo.title += " (" + responseData.status + ")";
					$scope.isSignupInfo.msg = responseData.statusText;
				}
			});
		}
	};

	$scope.refreshModule = function(type) {
		switch(type) {
			case "signin":
				$scope.isSignin = true;
				$scope.formSignup.$setPristine();
				$scope.signUpObj = {};
				$scope.isSignupInfo = {};
			break;

			case "signup":
				$scope.isSignin = false;
				$scope.formSignin.$setPristine();
				$scope.signInObj = {};
				$scope.isSigninInfo = {};
			break;
		}
	};
}]);