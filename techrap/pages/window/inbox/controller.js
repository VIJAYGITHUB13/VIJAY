// myApp is the module object defined in config.js

myApp.controller("ngCtrlInbox", ["$scope", "$state", "$filter", "$interval", "ngServiceMyInfo", "ngServiceInfoMsgs", "ngServiceRESTAPI", "ngServiceDPConf", function($scope, $state, $filter, $interval, ngServiceMyInfo, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceDPConf) {
	$scope.tab_name = $state.current.data.displayName;
	$scope.tab_desc = $state.current.data.displayDesc;

	$scope.reqDetailsObj = {};
	$scope.requestHistoryAr = {};

	$scope.datetimepickerOptions = JSON.stringify(ngServiceDPConf);

	$scope.mycategory = ngServiceMyInfo.ucategory;

	$scope.curInboxMenuId = "";
	$scope.curInboxMenuName = "";

	ngServiceRESTAPI("GET", "pages/window/inbox/script.php?task=user_details", {}).post(function(responseData) {
		if(responseData.statusText == "OK") {
			$scope.userDetailsAr = responseData.data;
		}
	});

	$scope.requestStats = function() {
		var inputObj = {
			mycategory: ngServiceMyInfo.ucategory || "",
			myid: ngServiceMyInfo.uid || ""
		};

		ngServiceRESTAPI("POST", "pages/window/inbox/script.php?task=request_stats", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				$scope.reqStatsAr = responseData.data[0];
				$scope.repStatsAr = responseData.data[1];
			}
		});
	};
	$scope.requestStats();
	var onRequestStats = $interval($scope.requestStats, 2000);

	$scope.$on("$destroy", function() {
		if(angular.isDefined(onRequestStats)) {
			$interval.cancel(onRequestStats);
			onRequestStats = undefined;
		}
	});

	$scope.requestDetails = function(actiontype, input, dname, cname, sid) {
		if(actiontype == "inboxMenu") {
			$scope.curInboxMenuId = input;
			$scope.curInboxMenuName = dname;
			$scope.curInboxMenuClassName = cname;
		}

		$scope.reqDetailsObj["status"] = {};
		$scope.reqDetailsObj["status"].isInfo = {};

		switch(actiontype) {
			case "inboxMenu":
				$scope.requestsAr = [];
			break;

			case "inboxRequest":
				$scope.requestHistoryAr[input] = [];
			break;
		}

		var inputObj = {
			actiontype: actiontype,
			input: input,
			mycategory: ngServiceMyInfo.ucategory || "",
			myid: ngServiceMyInfo.uid || ""
		};

		ngServiceRESTAPI("POST", "pages/window/inbox/script.php?task=view", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				if(responseData.data.length) {
					switch(actiontype) {
						case "inboxMenu":
							$scope.requestsAr = responseData.data;
						break;

						case "inboxRequest":
							$scope.requestHistoryAr[input] = responseData.data;

							if($scope.reqDetailsObj != undefined) {
								if($scope.reqDetailsObj[sid] != undefined) {
									if($scope.reqDetailsObj[sid][input] != undefined) {
										$scope.reqDetailsObj[sid][input] = {};
									} else {
										$scope.reqDetailsObj[sid][input] = {};
									}
								} else {
									$scope.reqDetailsObj[sid] = {};
								}
							}

							setTimeout(function() {
								$('[data-toggle="tooltip"]').tooltip();
							}, 100);
						break;
					}
				} else {
					angular.copy(ngServiceInfoMsgs.info, $scope.reqDetailsObj["status"].isInfo);
					$scope.reqDetailsObj["status"].isInfo.msg = "No records found.";
				}
			} else {
				angular.copy(ngServiceInfoMsgs.danger, $scope.reqDetailsObj["status"].isInfo);
				$scope.reqDetailsObj["status"].isInfo.title += " (" + responseData.status + ")";
				$scope.reqDetailsObj["status"].isInfo.msg = responseData.statusText;
			}
		});
	};

	switch(ngServiceMyInfo.ucategory) {
		case "3":
			$scope.requestDetails("inboxMenu", 2, "Assigned", "primary");
		break;

		default:
			$scope.requestDetails("inboxMenu", 1, "Initiated", "info");
		break;
	}

	$scope.ngPostCommentClick = function(rid, sid) {
		if(!Boolean($scope.reqDetailsObj[sid])) {
			$scope.reqDetailsObj[sid] = {};
			$scope.reqDetailsObj[sid][rid] = {};
		} else {
			if(!Boolean($scope.reqDetailsObj[sid][rid])) {
				$scope.reqDetailsObj[sid][rid] = {};
			}
		}

		$scope.reqDetailsObj[sid][rid].isInfoComments = {};

		if(!Boolean($scope.reqDetailsObj[sid][rid].ngCommentMdl)) {
			angular.copy(ngServiceInfoMsgs.danger, $scope.reqDetailsObj[sid][rid].isInfoComments);
			$scope.reqDetailsObj[sid][rid].isInfoComments.msg = "Invalid inputs.";
		} else {
			var inputObj = {
				comment: $scope.reqDetailsObj[sid][rid].ngCommentMdl || "",
				rid: rid || "",
				sid: sid || "",
				myid: ngServiceMyInfo.uid || ""
			};

			ngServiceRESTAPI("POST", "pages/window/inbox/script.php?task=postcomment", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							$scope.reqDetailsObj[sid][rid].ngCommentMdl = "";
							$scope.requestDetails("inboxRequest", rid);

							angular.copy(ngServiceInfoMsgs.success,$scope.reqDetailsObj[sid][rid].isInfoComments);
							$scope.reqDetailsObj[sid][rid].isInfoComments.msg = "Record saved successfully.";
						break;

						case "ERROR_DB":
							angular.copy(ngServiceInfoMsgs.danger, $scope.reqDetailsObj[sid][rid].isInfoComments);
							$scope.reqDetailsObj[sid][rid].isInfoComments.msg = "Server error.";
						break;
					}
				} else {
					angular.copy(ngServiceInfoMsgs.danger, $scope.reqDetailsObj[sid][rid].isInfoComments);
					$scope.isInfo.title += " (" + responseData.status + ")";
					$scope.reqDetailsObj[sid][rid].isInfoComments.msg = responseData.statusText;
				}
			});
		}
	};

	$scope.ngStatusChangeClick = function(rid, sid) {
		if(!Boolean($scope.reqDetailsObj[sid])) {
			$scope.reqDetailsObj[sid] = {};
			$scope.reqDetailsObj[sid][rid] = {};
		} else {
			if(!Boolean($scope.reqDetailsObj[sid][rid])) {
				$scope.reqDetailsObj[sid][rid] = {};
			}
		}

		$scope.reqDetailsObj[sid][rid].isInfoStatusChange = {};

		var inputObj = {
			myid: ngServiceMyInfo.uid || "",
			assigninputs: $scope.reqDetailsObj[sid][rid].ngStatusChangeInputsMdl || "",
			rid: rid || "",
			sid: sid || "",
			to_status: (parseInt(sid) + 1) || ""
		};

		var isValid = true;
		switch(sid) {
			case "1":
				inputObj.userid = $scope.reqDetailsObj[sid][rid].ngUDetailsMdl || "";
				isValid = Boolean(inputObj.assigninputs && inputObj.userid);
			break;

			case "2":
				inputObj.schedule_on = $filter("date")((new Date($scope.reqDetailsObj[sid][rid].ngScheduleOnMdl)).getTime(), "yyyy-MM-dd HH:mm:ss") || "";
				isValid = Boolean(inputObj.assigninputs && inputObj.schedule_on);
			break;

			case "4":
				inputObj.macaddress = $scope.reqDetailsObj[sid][rid].ngMACAddressMdl || "";
				isValid = Boolean(inputObj.assigninputs && inputObj.macaddress);
			break;

			default:
				isValid = Boolean(inputObj.assigninputs);
			break;
		}

		if(!isValid) {
			angular.copy(ngServiceInfoMsgs.danger, $scope.reqDetailsObj[sid][rid].isInfoStatusChange);
			$scope.reqDetailsObj[sid][rid].isInfoStatusChange.msg = "Invalid inputs.";
		} else {
			ngServiceRESTAPI("POST", "pages/window/inbox/script.php?task=statuschange", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					switch(responseData.data) {
						case "SUCCESS":
							$scope.requestDetails("inboxMenu", rid);
							$scope.requestDetails("inboxRequest", rid);

							angular.copy(ngServiceInfoMsgs.success,$scope.reqDetailsObj[sid][rid].isInfoStatusChange);
							$scope.reqDetailsObj[sid][rid].isInfoStatusChange.msg = "Request assigned successfully.";

							$state.go($state.current, {}, { reload: true });
						break;

						case "ERROR_DB":
							angular.copy(ngServiceInfoMsgs.danger, $scope.reqDetailsObj[sid][rid].isInfoStatusChange);
							$scope.reqDetailsObj[sid][rid].isInfoStatusChange.msg = "Server error.";
						break;
					}
				} else {
					angular.copy(ngServiceInfoMsgs.danger, $scope.reqDetailsObj[sid][rid].isInfoStatusChange);
					$scope.isInfo.title += " (" + responseData.status + ")";
					$scope.reqDetailsObj[sid][rid].isInfoStatusChange.msg = responseData.statusText;
				}
			});
		}
	};
}]);