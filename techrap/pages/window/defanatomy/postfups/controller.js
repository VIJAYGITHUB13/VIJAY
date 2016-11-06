// myApp is the module object defined in config.js

myApp.controller("ngCtrlDefAyPostFUPs", ["$scope", "ngServiceRESTAPI", function($scope, ngServiceRESTAPI) {
	$scope.defAnatomyObj.pfupObj = {};

	$scope.defAnatomyObj.pfupObj.view = function() {
		ngServiceRESTAPI("POST", "pages/window/defanatomy/postfups/script.php?task=view", {}).post(function(responseData) {
			if(responseData.statusText == "OK") {
				$scope.postfupsAr = responseData.data;
			}
		});
	};
	$scope.defAnatomyObj.pfupObj.view();

	$scope.ngUpdatePFUPClick = function(id, dname) {
		if($("#pfname_" + id).val() && $("#pfunits_" + id).val()) {
			var inputObj = {
				pfid: id || "",
				pfdisplayname: ($("#pfname_" + id).val() + " " + $("#pfunits_" + id).val()) || ""
			};

			ngServiceRESTAPI("POST", "pages/window/defanatomy/postfups/script.php?task=update", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					if(responseData.data) {
						$scope.defAnatomyObj.pfupObj.view();
						$scope.defAnatomyObj.anatomyObj.view();
					}
				}
			});
		} else {
			$("#pfname_" + id).val(dname.split(' ')[0]);
			$("#pfunits_" + id).val(dname.split(' ')[1]);
		}
	};

	$scope.ngPFUnitsMdl = "Kbps";
	$scope.ngAddPFUPClick = function() {
		if($scope.ngPFNameMdl) {
			var inputObj = {
				pfdisplayname: $scope.ngPFNameMdl + " " + $scope.ngPFUnitsMdl || ""
			};

			ngServiceRESTAPI("POST", "pages/window/defanatomy/postfups/script.php?task=add", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					if(responseData.data) {
						$scope.defAnatomyObj.pfupObj.view();
						$scope.defAnatomyObj.anatomyObj.view();
					}
				}
			});
		}
	};
}]);

myApp.directive("ngPfupsDir", ["ngServiceRESTAPI", function(ngServiceRESTAPI) {
	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			$(elem).data("toggle", "confirmation").confirmation({
				onConfirm: function(e) {
					var inputObj = {
						pfid: scope.postfups.id
					};

					ngServiceRESTAPI("POST", "pages/window/defanatomy/postfups/script.php?task=remove", inputObj).post(function(responseData) {
						if(responseData.statusText == "OK") {
							if(responseData.data) {
								scope.defAnatomyObj.pfupObj.view();
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