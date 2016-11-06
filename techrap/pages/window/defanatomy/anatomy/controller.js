// myApp is the module object defined in config.js

myApp.controller("ngCtrlDefAyAnatomy", ["$scope", "ngServiceRESTAPI", function($scope, ngServiceRESTAPI) {
	$scope.defAnatomyObj.anatomyObj = {};
	$scope.anatomyAr = [];
	$scope.editFlag = [];

	$scope.defAnatomyObj.anatomyObj.view = function() {
		ngServiceRESTAPI("GET", "js/custom/model.json", {}).post(function(jsonData) {
			if(jsonData.statusText == "OK") {
				$scope.theadArMD = jsonData.data[0].pageDefAyAnatomytheadArMD;
				$scope.theadArSM = jsonData.data[0].pageDefAyAnatomytheadArSM;
				
				ngServiceRESTAPI("POST", "pages/window/defanatomy/anatomy/script.php?task=view", {}).post(function(responseData) {
					if(responseData.statusText == "OK") {
						if(responseData.data) {
							$scope.tbodyAr = responseData.data[0];
							$scope.plansAr = responseData.data[1];
							$scope.speedAr = responseData.data[2];
							$scope.fupsAr = responseData.data[3];
							$scope.post_fupsAr = responseData.data[4];
						}
					}
				});
			}
		});
	};
	$scope.defAnatomyObj.anatomyObj.view();

	$scope.ngUpdateStructClick = function(ts_id, ind) {
		var inputObj = {
			ts_id: ts_id || "",
			pid: $scope.anatomyAr[ind].ngPIDMdl || "",
			sid: $scope.anatomyAr[ind].ngSIDMdl || "",
			fid: $scope.anatomyAr[ind].ngFIDMdl || "",
			pfid: $scope.anatomyAr[ind].ngPFIDMdl || ""
		};
		
		ngServiceRESTAPI("POST", "pages/window/defanatomy/anatomy/script.php?task=updatenadd", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				if(responseData.data) {
					$scope.defAnatomyObj.anatomyObj.view();
					$scope.defAnatomyObj.planObj.view();
					$scope.defAnatomyObj.speedObj.view();
					$scope.defAnatomyObj.fupObj.view();
					$scope.defAnatomyObj.pfupObj.view();
				}
			}
		});
	};

	$scope.ngAddStructClick = function() {
		$scope.tbodyAr.push({});
		$scope.editFlag[$scope.tbodyAr.length - 1] = true;
	};
}]);

myApp.directive("ngAnatomyDir", ["ngServiceRESTAPI", function(ngServiceRESTAPI) {
	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			$(elem).data("toggle", "confirmation").confirmation({
				onConfirm: function(e) {
					var inputObj = {
						tsid: scope.tbody.ts_id
					};

					ngServiceRESTAPI("POST", "pages/window/defanatomy/anatomy/script.php?task=remove", inputObj).post(function(responseData) {
						if(responseData.statusText == "OK") {
							if(responseData.data) {
								scope.defAnatomyObj.anatomyObj.view();
								scope.defAnatomyObj.planObj.view();
								scope.defAnatomyObj.speedObj.view();
								scope.defAnatomyObj.fupObj.view();
								scope.defAnatomyObj.pfupObj.view();
							}
						}
					});
				},
				onCancel: function(e) {}
			});
		}
	};
}]);