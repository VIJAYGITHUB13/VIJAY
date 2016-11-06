// myApp is the module object defined in config.js

myApp.controller("ngCtrlDefAyPlans", ["$scope", "ngServiceRESTAPI", function($scope, ngServiceRESTAPI) {
	$scope.defAnatomyObj.planObj = {};

	$scope.defAnatomyObj.planObj.view = function() {
		ngServiceRESTAPI("POST", "pages/window/defanatomy/plans/script.php?task=view", {}).post(function(responseData) {
			if(responseData.statusText == "OK") {
				$scope.plansAr = responseData.data;
			}
		});
	};
	$scope.defAnatomyObj.planObj.view();

	$scope.ngUpdatePlanClick = function(id, dname) {
		if($("#pname_" + id).val()) {
			var inputObj = {
				pid: id || "",
				pdisplayname: $("#pname_" + id).val() || ""
			};

			ngServiceRESTAPI("POST", "pages/window/defanatomy/plans/script.php?task=update", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					if(responseData.data) {
						$scope.defAnatomyObj.planObj.view();
						$scope.defAnatomyObj.anatomyObj.view();
						$scope.defAnatomyObj.tariffObj.view();
					}
				}
			});
		} else {
			$("#pname_" + id).val(dname);
		}
	};

	$scope.ngAddPlanClick = function() {
		var inputObj = {
			pdisplayname: $scope.ngPDnameMdl || ""
		};

		ngServiceRESTAPI("POST", "pages/window/defanatomy/plans/script.php?task=add", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				if(responseData.data) {
					$scope.defAnatomyObj.planObj.view();
					$scope.defAnatomyObj.anatomyObj.view();
				}
			}
		});
	};
}]);

myApp.directive("ngPlanDir", ["ngServiceRESTAPI", function(ngServiceRESTAPI) {
	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			$(elem).data("toggle", "confirmation").confirmation({
				onConfirm: function(e) {
					var inputObj = {
						pid: scope.plan.id
					};

					ngServiceRESTAPI("POST", "pages/window/defanatomy/plans/script.php?task=remove", inputObj).post(function(responseData) {
						if(responseData.statusText == "OK") {
							if(responseData.data) {
								scope.defAnatomyObj.planObj.view();
								scope.defAnatomyObj.anatomyObj.view();
							}
						}
					});
				},
				onCancel: function(e) {}
			});
		}
	};
}]);