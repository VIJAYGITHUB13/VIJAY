// myApp is the module object defined in config.js

myApp.controller("ngCtrlDefAyFUPs", ["$scope", "ngServiceRESTAPI", function($scope, ngServiceRESTAPI) {
	$scope.defAnatomyObj.fupObj = {};

	$scope.defAnatomyObj.fupObj.view = function() {
		ngServiceRESTAPI("POST", "pages/window/defanatomy/fups/script.php?task=view", {}).post(function(responseData) {
			if(responseData.statusText == "OK") {
				$scope.fupsAr = responseData.data;
			}
		});
	};
	$scope.defAnatomyObj.fupObj.view();

	$scope.ngUpdateFUPClick = function(id, dname) {
		if($("#fname_" + id).val() && $("#funits_" + id).val()) {
			var inputObj = {
				fid: id || "",
				fdisplayname: ($("#fname_" + id).val() + " " + $("#funits_" + id).val()) || ""
			};

			ngServiceRESTAPI("POST", "pages/window/defanatomy/fups/script.php?task=update", inputObj).post(function(responseData) {
				if(responseData.statusText == "OK") {
					if(responseData.data) {
						$scope.defAnatomyObj.fupObj.view();
						$scope.defAnatomyObj.anatomyObj.view();
					}
				}
			});
		} else {
			$("#fname_" + id).val(dname.split(' ')[0]);
			$("#funits_" + id).val(dname.split(' ')[1]);
		}
	};

	$scope.ngFUnitsMdl = "GB";
	$scope.ngAddFUPClick = function() {
		var inputObj = {
			fdisplayname: $scope.ngFNameMdl + " " + $scope.ngFUnitsMdl || ""
		};

		ngServiceRESTAPI("POST", "pages/window/defanatomy/fups/script.php?task=add", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				if(responseData.data) {
					$scope.defAnatomyObj.fupObj.view();
					$scope.defAnatomyObj.anatomyObj.view();
				}
			}
		});
	};
}]);

myApp.directive("ngFupsDir", ["ngServiceRESTAPI", function(ngServiceRESTAPI) {
	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			$(elem).data("toggle", "confirmation").confirmation({
				onConfirm: function(e) {
					var inputObj = {
						fid: scope.fups.id
					};

					ngServiceRESTAPI("POST", "pages/window/defanatomy/fups/script.php?task=remove", inputObj).post(function(responseData) {
						if(responseData.statusText == "OK") {
							if(responseData.data) {
								scope.defAnatomyObj.fupObj.view();
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