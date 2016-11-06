// myApp is the module object defined in config.js

myApp.controller("ngCtrlDefAyTerms", ["$scope", "ngServiceRESTAPI", function($scope, ngServiceRESTAPI) {
	$scope.defAnatomyObj.termObj = {};
	$scope.ngUpdateTNameMdl = [];
	$scope.ngUpdateTUnitsMdl = [];

	$scope.defAnatomyObj.termObj.view = function() {
		ngServiceRESTAPI("POST", "pages/window/defanatomy/terms/script.php?task=view", {}).post(function(responseData) {
			if(responseData.statusText == "OK") {
				$scope.termsAr = responseData.data;

				angular.forEach($scope.termsAr, function(obj, ind) {
					if(obj.display_name.split(' ').length >= 2) {
						$scope.ngUpdateTNameMdl[obj.id] = parseInt(obj.display_name.split(' ')[0]);
					}
				});
			}
		});
	};
	$scope.defAnatomyObj.termObj.view();

	$scope.ngUpdateTermClick = function(id, dname) {
		if($scope.ngUpdateTNameMdl[id] && $scope.ngUpdateTUnitsMdl[id]) {

			switch($scope.ngUpdateTUnitsMdl[id]) {
				case "Months":
					switch($scope.ngUpdateTNameMdl[id]) {
						case 1: $scope.keyDisplayname = "Monthly"; break;
						case 3: $scope.keyDisplayname = "Quarterly"; break;
						case 6: $scope.keyDisplayname = "Half-Yearly"; break;
						case 12: $scope.keyDisplayname = "Yearly"; break;
						default: $scope.keyDisplayname = $scope.ngUpdateTNameMdl[id] + " " + $scope.ngUpdateTUnitsMdl[id]; break;
					}
				break;

				case "Years":
					if($scope.ngUpdateTNameMdl[id] == 1) {
							$scope.keyDisplayname = "Yearly";
					} else {
						$scope.keyDisplayname = $scope.ngUpdateTNameMdl[id] + " " + $scope.ngUpdateTUnitsMdl[id];
					}
				break;
			}

			var inputObj = {
				tid: id || "",
				tdisplayname: $scope.keyDisplayname || ""
			};

			ngServiceRESTAPI("POST", "pages/window/defanatomy/terms/script.php?task=update", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					if(responseData.data) {
						$scope.defAnatomyObj.termObj.view();
						$scope.defAnatomyObj.tariffObj.view();
					}
				}
			});
		} else {
			$("#tname_" + id).val(dname.split(' ')[0]);
			$("#tunits_" + id).val(dname.split(' ')[1]);
		}
	};
	
	$scope.ngTUnitsMdl = "Months";
	$scope.ngAddTermClick = function() {
		$scope.keyDisplayname = "";

		switch($scope.ngTUnitsMdl) {
			case "Months":
				switch($scope.ngTNameMdl) {
					case 1: $scope.keyDisplayname = "Monthly"; break;
					case 3: $scope.keyDisplayname = "Quarterly"; break;
					case 6: $scope.keyDisplayname = "Half-Yearly"; break;
					case 12: $scope.keyDisplayname = "Yearly"; break;
					default: $scope.keyDisplayname = $scope.ngTNameMdl + " " + $scope.ngTUnitsMdl; break;
				}
			break;

			case "Years":
				if($scope.ngTNameMdl == 1) {
					$scope.keyDisplayname = "Yearly";
				} else {
					$scope.keyDisplayname = $scope.ngTNameMdl + " " + $scope.ngTUnitsMdl;
				}
			break;
		}

		var inputObj = {
			tdisplayname: $scope.keyDisplayname || ""
		};

		ngServiceRESTAPI("POST", "pages/window/defanatomy/terms/script.php?task=add", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				if(responseData.data) {
					$scope.ngTNameMdl = "";

					$scope.defAnatomyObj.termObj.view();
					$scope.defAnatomyObj.tariffObj.view();
				}
			}
		});
	};
}]);

myApp.directive("ngTermsDir", ["ngServiceRESTAPI", function(ngServiceRESTAPI) {
	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			$(elem).data("toggle", "confirmation").confirmation({
				onConfirm: function(e) {
					var inputObj = {
						tid: scope.terms.id
					};

					ngServiceRESTAPI("POST", "pages/window/defanatomy/terms/script.php?task=remove", inputObj).post(function(responseData) {
						if(responseData.statusText == "OK") {
							if(responseData.data) {
								scope.defAnatomyObj.termObj.view();
								scope.defAnatomyObj.tariffObj.view();
							}
						}
					});
				},
				onCancel: function(e) {}
			});
		}
	};
}]);