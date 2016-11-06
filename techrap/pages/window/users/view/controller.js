// myApp is the module object defined in config.js

myApp.controller("ngCtrlUsersView", ["$scope", "$state", "ngServiceInfoMsgs", "ngServiceRESTAPI", "ngServiceDPConf", "ngServiceUserReg", function($scope, $state, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceDPConf, ngServiceUserReg) {
	$scope.tab_name = $state.current.data.displayName;
	$scope.tab_desc = $state.current.data.displayDesc;
	$scope.searchObj = {};
	
	ngServiceDPConf.format = "DD-MM-YYYY";
	$scope.datetimepickerOptions = JSON.stringify(ngServiceDPConf);

	ngServiceRESTAPI("POST", "pages/window/users/view/script.php?task=ucategories", {}).post(function(responseData) {
		$scope.uCategoryAr = responseData.data;
	});

	$scope.ngSearchSbmt = function() {
		ngServiceRESTAPI("GET", "js/custom/model.json", {}).post(function(jsonData) {
			if(jsonData.statusText == "OK") {
				$scope.uSearchColAr = jsonData.data[0].usersTHeadAr;

				$scope.isInfo = {};
				$scope.tbodyAr = [];

				var inputObj = {
					ucategory: $scope.searchObj.ngUCategoryMdl || "",
					uname: $scope.searchObj.ngUNameMdl || "",
					fdate: $scope.searchObj.ngFDateMdl || "",
					tdate: $scope.searchObj.ngTDateMdl || ""
				};
				
				ngServiceRESTAPI("POST", "pages/window/users/view/script.php?task=view", inputObj).post(function(responseData) {
					if(responseData.statusText == "OK") {
						if(responseData.data.length) {
							$scope.tbodyAr = responseData.data;

							$scope.uOrderBy = "name";
							$scope.uOrderByDir = false;
							$scope.ngSortClick = function(e) {
								$scope.uOrderBy = e;
								$scope.uOrderByDir = !$scope.uOrderByDir;
							};
						} else {
							angular.copy(ngServiceInfoMsgs.info, $scope.isInfo);
							$scope.isInfo.msg = "No records found.";
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

	$scope.ngUserProfileClick = function(uid, uname) {
		var inputObj = {
			myid: uid || 0
		};
		ngServiceRESTAPI("POST", "pages/window/script.php?task=myprofile", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				responseData.data[0].sectionHeader = "Profile of " + uname;
				ngServiceUserReg.setInfo("regform", responseData.data[0]);

				$state.go("pageWindow.pageUsers.pageUsersRegister.pageUsersRegFormConf");
			}
		});
	};

	$scope.ngResetClick = function() {
		$state.go($state.current, {}, { reload: true });
	};

	$(function () {
		setTimeout(function() {
			var $fdate = $("#fdate");
			var $tdate = $("#tdate");

			var datetimepickerOptions = (JSON.parse($fdate.attr("datetimepicker-options")) || JSON.parse($fdate.attr("datetimepicker-options")));

			$fdate.datetimepicker(datetimepickerOptions);
			$tdate.datetimepicker(function() {
				var obj = datetimepickerOptions;
				obj.useCurrent = false;
				return obj;
			});

			$fdate.on("dp.change", function (e) {
				$('#tdate').data("DateTimePicker").minDate(e.date);
			});

			$tdate.on("dp.change", function (e) {
				$('#fdate').data("DateTimePicker").maxDate(e.date);
			});
		}, 100);
	});
}]);