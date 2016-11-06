// myApp is the module object defined in config.js

myApp.controller("ngCtrlDefAySpeed", ["$scope", "ngServiceRESTAPI", function($scope, ngServiceRESTAPI) {
	$scope.defAnatomyObj.speedObj = {};

	$scope.defAnatomyObj.speedObj.view = function() {
		ngServiceRESTAPI("POST", "pages/window/defanatomy/speed/script.php?task=view", {}).post(function(responseData) {
			if(responseData.statusText == "OK") {
				$scope.speedAr = responseData.data;
			}
		});
	};
	$scope.defAnatomyObj.speedObj.view();

	$scope.ngUpdateSpeedClick = function(id, dname) {
		if($("#sname_" + id).val() && $("#sunits_" + id).val()) {
			var inputObj = {
				sid: id || "",
				sdisplayname: ($("#sname_" + id).val() + " " + $("#sunits_" + id).val()) || ""
			};

			ngServiceRESTAPI("POST", "pages/window/defanatomy/speed/script.php?task=update", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					if(responseData.data) {
						$scope.defAnatomyObj.speedObj.view();
						$scope.defAnatomyObj.anatomyObj.view();
					}
				}
			});
		} else {
			$("#sname_" + id).val(dname.split(' ')[0]);
			$("#sunits_" + id).val(dname.split(' ')[1]);
		}
	};

	$scope.ngSUnitsMdl = "Kbps";
	$scope.ngAddSpeedClick = function() {
		var inputObj = {
			sdisplayname: $scope.ngSNameMdl + " " + $scope.ngSUnitsMdl || ""
		};

		ngServiceRESTAPI("POST", "pages/window/defanatomy/speed/script.php?task=add", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				$scope.ngSNameMdl = "";

				if(responseData.data) {
					$scope.defAnatomyObj.speedObj.view();
					$scope.defAnatomyObj.anatomyObj.view();
				}
			}
		});
	};
}]);

myApp.directive("ngSpeedDir", ["ngServiceRESTAPI", function(ngServiceRESTAPI) {
	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			$(elem).data("toggle", "confirmation").confirmation({
				onConfirm: function(e) {
					var inputObj = {
						sid: scope.speed.id
					};

					ngServiceRESTAPI("POST", "pages/window/defanatomy/speed/script.php?task=remove", inputObj).post(function(responseData) {
						if(responseData.statusText == "OK") {
							if(responseData.data) {
								scope.defAnatomyObj.speedObj.view();
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