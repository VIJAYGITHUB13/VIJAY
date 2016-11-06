// myApp is the module object defined in config.js

myApp.controller("ngCtrlUsersRegUpload", ["$scope", "$state", "$http", "ngServiceMyInfo", "ngServiceInfoMsgs", "ngServiceRESTAPI", "ngServiceUserReg", function($scope, $state, $http, ngServiceMyInfo, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceUserReg) {
	$scope.formRegUploadObj = {};

	ngServiceRESTAPI("POST", "pages/window/users/register/script.php?task=ucategories", {}).post(function(responseData) {
		var userRegInfo = ngServiceUserReg.getInfo("regparams");
		$scope.uCategoryAr = responseData.data;

		var user_type_ar = $scope.uCategoryAr.filter(function(obj) { return (obj.id == userRegInfo.ngUCategoryMdl); });

		$scope.section_header = "Upload " + user_type_ar[0].name + " Details";
		$scope.ngUCategoryMdl = userRegInfo.ngUCategoryMdl;
	});

	$scope.ngRegUploadSbmt = function() {
		if($scope.formRegUpload.$valid) {
			ngServiceRESTAPI("POST", "pages/window/script.php?task=app_details", {}).post(function(appData) {
				if(appData.statusText == "OK") {
					var appacronym = appData.data[0].acronym;

					if(appacronym) {
						$scope.isInfo = {};
						
						var formData = new FormData();
						formData.append("file", $("#file")[0].files[0]);
						$scope.formRegUploadObj.ngFileMdl;

						var inputObj = {
							appacronym: appacronym,
							ucategory: ngServiceMyInfo.ucategory,
							uid: ngServiceMyInfo.uid
						};

						// $http({
						// 	method: "POST",
						// 	url: "pages/window/users/register/regupload/parser.php",
						// 	data: inputObj,
						// 	headers: {
						// 		"Content-Type": "multipart/form-data"
						// 	},
						// 	transformRequest: function(data, headersGetter) {
						// 		var formData = new FormData($("form[name=formRegUpload]")[0]);

						// 		angular.forEach(data, function(value, key) {
						// 			formData.append(key, value);
						// 		});

						// 		formData.append("file", $("#file")[0].files[0]);

						// 		var headers = headersGetter();
						// 		delete headers["Content-Type"];

						// 		return formData;
						// 	}
						// }).then(function(responseData) {
						// 	if(responseData == "ALREADY_EXISTS") {
						// 		angular.copy(ngServiceInfoMsgs.info, $scope.isInfo);
						// 		$scope.isInfo.msg = "Please retry after a while.";
						// 	} else {
						// 		console.log(JSON.parse(responseData));
						// 	}
						// }, function(errorData) {
						// 	angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
						// 	$scope.isInfo.title += " (" + errorData.status + ")";
						// 	$scope.isInfo.msg = errorData.statusText;
						// });

						$.ajax({
							url: "pages/window/users/register/regupload/parser.php?appacronym=" + appacronym + "&ucategory=" + ngServiceMyInfo.ucategory + "&uid=" + ngServiceMyInfo.uid,
							type: "POST",
							data: formData,
							processData: false, // restricting jQuery on processing the data
							contentType: false,  // restricting jQuery on setting up contentType
							success: function(responseData) {
								if(responseData == "ALREADY_EXISTS") {
									angular.copy(ngServiceInfoMsgs.info, $scope.isInfo);
									$scope.isInfo.msg = "Please retry after a while.";
								} else {
									// console.log(JSON.parse(responseData));
									ngServiceUserReg.setInfo("regupload", JSON.parse(responseData));

									$state.go("pageWindow.pageUsers.pageUsersRegister.pageUsersRegUploadConf");
								}
							},
							error: function(errorData) {
								angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
								$scope.isInfo.title += " (" + errorData.status + ")";
								$scope.isInfo.msg = errorData.statusText;
							}
						});
					}
				}
			});
		}
	};
	
	setTimeout(function() {
		$('[data-toggle="tooltip"]').tooltip();
	}, 100);

	$scope.ngResetClick = function() {
		$scope.formRegUpload.$setPristine();
		$scope.formRegUploadObj = {};

		$("#file").val("");
	};

	$scope.ngBackClick = function(path) {
		$state.go(path);
	};
}]);