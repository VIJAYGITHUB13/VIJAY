// myApp is the module object defined in config.js

myApp.controller("ngCtrlTariffPlans", ["$scope", "$state", "ngServiceRESTAPI", function($scope, $state, ngServiceRESTAPI) {
	$scope.tab_name = $state.current.data.displayName;

	ngServiceRESTAPI("GET", "js/custom/model.json", {}).post(function(jsonData) {
		if(jsonData.statusText == "OK") {
			$scope.theadArMD = jsonData.data[0].pageTariffPlanstheadArMD;
			$scope.theadArSM = jsonData.data[0].pageTariffPlanstheadArSM;

			ngServiceRESTAPI("POST", "pages/index/tariffplans/script.php?task=view", {}).post(function(responseData) {
				if(responseData.statusText == "OK") {
					$scope.tbodyAr = responseData.data;
					$scope.theadAr = $scope.tbodyAr[0].terms.split(', ');
				}
			});
		}
	});
}]);