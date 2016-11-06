// myApp is the module object defined in config.js

myApp.controller("ngCtrlDefAyTariff", ["$scope", "ngServiceRESTAPI", function($scope, ngServiceRESTAPI) {
	$scope.defAnatomyObj.tariffObj = {};
	$scope.ngUpdateTariffMdl = [];
	$scope.editFlag = [];

	$scope.defAnatomyObj.tariffObj.view = function() {
		ngServiceRESTAPI("POST", "pages/window/defanatomy/tariff/script.php?task=view", {}).post(function(responseData) {
			if(responseData.statusText == "OK") {
				$scope.tbodyAr = responseData.data;
				$scope.theadAr = $scope.tbodyAr[0].terms.split(', ');

				angular.forEach($scope.tbodyAr, function(obj, ind) {
					$scope.tbodyAr[ind].faresAr = [];
					$scope.tbodyAr[ind].tariff_idsAr = [];
					$scope.ngUpdateTariffMdl[ind] = {};

					$scope.tbodyAr[ind].faresAr = obj.fares.split(', ');
					$scope.tbodyAr[ind].tariff_idsAr = obj.tariff_ids.split(', ');

					angular.forEach($scope.tbodyAr[ind].tariff_idsAr, function(o, i) {
						$scope.ngUpdateTariffMdl[ind][o] = parseInt($scope.tbodyAr[ind].faresAr[i]);
					});
				});
			}
		});
	};
	$scope.defAnatomyObj.tariffObj.view();

	$scope.ngUpdateTariffClick = function(ind) {
		$scope.editFlag[ind] = !$scope.editFlag[ind];
		var inputObj = {
			fares: $scope.ngUpdateTariffMdl[ind] || ""
		};

		ngServiceRESTAPI("POST", "pages/window/defanatomy/tariff/script.php?task=update", inputObj).post(function(responseData) {
			if(responseData.statusText == "OK") {
				if(responseData.data) {
					$scope.defAnatomyObj.tariffObj.view();
					$scope.defAnatomyObj.termObj.view();
				}
			}
		});
	};
}]);