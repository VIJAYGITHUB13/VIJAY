// myApp is the module object defined in config.js

myApp.controller("ngCtrlUsersRegUploadConf", ["$scope", "$state", "ngServiceMyInfo", "ngServiceInfoMsgs", "ngServiceRESTAPI", "ngServiceDPConf", "ngServiceUserReg", function($scope, $state, ngServiceMyInfo, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceDPConf, ngServiceUserReg) {
	$scope.formRegUploadConfObj = {};
	var uploadedUDetailsAr = ngServiceUserReg.getInfo("regupload");
	$scope.isInfo = {};

	ngServiceRESTAPI("POST", "pages/window/users/register/script.php?task=ucategories", {}).post(function(responseData) {
		var userRegInfo = ngServiceUserReg.getInfo("regparams");
		$scope.uCategoryAr = responseData.data;

		var user_type_ar = $scope.uCategoryAr.filter(function(obj) { return (obj.id == userRegInfo.ngUCategoryMdl) ? obj.name : ""; });

		$scope.section_header = "Confirm Uploaded Details of " + user_type_ar[0].name;
		$scope.ngUCategoryNameMdl = user_type_ar[0].name;
		$scope.ngUCategoryMdl = userRegInfo.ngUCategoryMdl;

		ngServiceRESTAPI("GET", "js/custom/model.json", {}).post(function(jsonData) {
			if(jsonData.statusText == "OK") {
				if($scope.ngUCategoryMdl == 5) {
					$scope.theadAr = jsonData.data[0].reguploadGuestTHeadAr;
				} else {
					$scope.theadAr = jsonData.data[0].reguploadTHeadAr;
				}

				$scope.isInfo = {};
				if(!uploadedUDetailsAr.length) {
					angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
					$scope.isInfo.type = "INVALID_TEMPLATE";
					$scope.isInfo.msg = "No records found.";
				} else if($scope.theadAr.length != uploadedUDetailsAr[0].length) {
					angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
					$scope.isInfo.type = "INVALID_TEMPLATE";
					$scope.isInfo.msg = "Please choose suitable template.";
				} else {
					var checkDup = function(checkAr) {
						return checkAr.some(function(val, key){ 
							return checkAr.indexOf(val) != key 
						});
					};

					var tbodyMNoDupAr = uploadedUDetailsAr.map(function(item) { return item[2] } );
					var tbodyEIDDupAr = uploadedUDetailsAr.map(function(item) { return item[4] } );

					if(checkDup(tbodyMNoDupAr) || checkDup(tbodyEIDDupAr)) {
						angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
						$scope.isInfo.type = "INVALID_TEMPLATE";
						$scope.isInfo.msg = "The template consists of similar Mobile No(s) or Email ID(s) for multiple user details. Please modify the same in the template and upload again.";
					} else {
						var tbodyAr = [];
						angular.forEach(uploadedUDetailsAr, function(rowVal, rowKey) {
							var obj = {};

							angular.forEach(rowVal, function(cellVal, cellKey) {
								obj[$scope.theadAr[cellKey].code] = cellVal;
							});

							tbodyAr.push(obj);
						});

						$scope.tbodyAr = [];
						angular.copy(tbodyAr, $scope.tbodyAr);

						$scope.uOrderBy = "fname";
						$scope.uOrderByDir = false;
						$scope.ngSortClick = function(e) {
							$scope.uOrderBy = e;
							$scope.uOrderByDir = !$scope.uOrderByDir;
						};
					}	
				}
			}
		});
	});

	$(document).on("click", "input[name=check]", function(e) {
		$("input[name=checkall]")[0].checked = ($("input[name=check]").length == $("input[name=check]:checked").length);
	});

	$scope.checkall = function() {
		angular.forEach($("input[name=check]"), function(obj, key) {
			obj.checked = $("input[name=checkall]")[0].checked;
		});
	};

	$scope.showConfirm = function() {
		return !$scope.isInfo.type || $scope.isInfo.type == 'ALREADY_EXISTS' || $scope.isInfo.type == 'PARTIAL_SUCCESS';
	};

	$scope.isConfirm = function() {
		return $("input[name=check]:checked").length;
	};

	$scope.ngConfirmClick = function() {
		var msg = '';
		switch($scope.ngUCategoryMdl) {
			case "5":
				msg += 'The user details for <strong>' + $scope.ngUCategoryNameMdl + '</strong> will be registered and the requests for the new connection auto-triggers. Are you sure to proceed?';
			break;

			default:
				msg += 'Are you sure to register the user details for <strong>' + $scope.ngUCategoryNameMdl + '</strong>?';
			break;
		}
		
		bootbox.confirm(msg, function(actionFlag) {
			if(actionFlag) {
				var tbodyAr = [];
				angular.forEach(ngServiceUserReg.getInfo("regupload"), function(rowVal, rowKey) {
					if($("input[name=check]")[rowKey].checked) {
						var obj = {};
						obj.ind = rowKey;

						angular.forEach(rowVal, function(cellVal, cellKey) {
							obj[$scope.theadAr[cellKey].code] = cellVal;
						});

						tbodyAr.push(obj);
					}
				});

				var inputObj = {
					userdetails: tbodyAr,
					ucategory: $scope.ngUCategoryMdl,
					myid: ngServiceMyInfo.uid
				};

				$scope.isInfo = {};
				ngServiceRESTAPI("POST", "pages/window/users/register/reguploadconf/script.php?task=register", JSON.stringify(inputObj)).post(function(responseData) {
					if(responseData.statusText == "OK") {
						var render_udetails = function() {
							var tbodyAr = [];
							angular.forEach(ngServiceUserReg.getInfo("regupload"), function(rowVal, rowKey) {
								var checkRender = function() {
									var check1 = (responseData.data.registered_ar.indexOf(rowKey) != -1 && responseData.data.type == "SUCCESS");
									var check2 = (responseData.data.registered_ar.indexOf(rowKey) == -1 && responseData.data.type == "PARTIAL_SUCCESS");

									return check1 || check2;
								}

								if(checkRender()) {
									var obj = {};

									angular.forEach(rowVal, function(cellVal, cellKey) {
										obj[$scope.theadAr[cellKey].code] = cellVal;
									});

									tbodyAr.push(obj);
								}
							});

							$scope.tbodyAr = [];
							angular.copy(tbodyAr, $scope.tbodyAr);

							$scope.uOrderBy = "fname";
							$scope.uOrderByDir = false;
							$scope.ngSortClick = function(e) {
								$scope.uOrderBy = e;
								$scope.uOrderByDir = !$scope.uOrderByDir;
							};
						};

						switch(responseData.data.type) {
							case "ALREADY_EXISTS":
								angular.forEach(uploadedUDetailsAr, function(rowVal, rowKey) {
									var rowObj = $("#table_users_reguploadconf > tbody").find("tr")[rowKey];

									if(responseData.data.exists_ar.indexOf(rowKey) != -1) {
										$("input[name=check]")[rowKey].checked = false;
										$(rowObj).css("font-weight", "bold");
										$(rowObj).addClass("text-warning");
									}
								});
								
								angular.copy(ngServiceInfoMsgs.warning, $scope.isInfo);
							break;

							case "ERROR_DB":
								angular.copy(ngServiceInfoMsgs.danger, $scope.isInfo);
							break;

							case "SUCCESS":
								render_udetails();
								angular.copy(ngServiceInfoMsgs.success, $scope.isInfo);
							break;

							case "PARTIAL_SUCCESS":
								render_udetails();

								var updateUploadedUDetailsAr = [];
								angular.forEach(uploadedUDetailsAr, function(rowVal, rowKey) {
									if(responseData.data.registered_ar.indexOf(rowKey) == -1) {
										updateUploadedUDetailsAr.push(rowVal);
									}
								});

								ngServiceUserReg.setInfo("regupload", undefined);
								ngServiceUserReg.setInfo("regupload", updateUploadedUDetailsAr);
								
								angular.copy(ngServiceInfoMsgs.info, $scope.isInfo);
							break;

							default:
								angular.copy(ngServiceInfoMsgs.info, $scope.isInfo);
							break;
						}

						$scope.isInfo.type = responseData.data.type;
						$scope.isInfo.msg = responseData.data.response;
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