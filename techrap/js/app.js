// myApp is the module object defined in config.js

// $rootScope, $scope, $state, $location, $http, $filter, $interval, ngServiceAppInfo, ngServiceMyInfo, ngServiceInfoMsgs, ngServiceRESTAPI, ngServiceDPConf, ngServicePaginationConf
myApp.run(["$rootScope", "$state", "ngServiceRESTAPI", function($rootScope, $state, ngServiceRESTAPI) {
	window.onload = function() {
		if(sessionStorage.getItem("logInFlag") == "true") {
			sessionStorage.removeItem("logInFlag");
			window.location = window.location.origin + window.location.pathname;
		}
	};

	$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
		$rootScope.prevState = fromState.name;
		
		ngServiceRESTAPI("GET", "js/custom/model.json", {}).post(function(jsonData) {
			if(jsonData.statusText == "OK") {
				angular.forEach(jsonData.data[0].statesAr, function(ngVal, ngObjInd) {
					angular.forEach(ngVal.paths, function(val, ind) {
						if(val == toState.name) {
							$state.go(ngVal.default);
						}
					});
				});
			}
		});
	});
}]);

myApp.directive("dirPageHeader", function() {
	return {
		restrict: "E",
		scope: {
			tabname: "=",
			tabdesc: "="
		},
		template: function() {
			var tpl = '';
			tpl += '<div class="page-header" style="margin: 0;">';
				tpl += '<h3>{{ tabname }} <small class="hidden-xs">{{ tabdesc }}</small></h3>';
			tpl += '</div>';

			return tpl;
		}
	}
});

myApp.directive("dirPaginationHeader", ["ngServicePaginationConf", function(ngServicePaginationConf) {
	return {
		restrict: "E",
		link: function(scope) {
			scope.currentPage = ngServicePaginationConf.currentPage;
			scope.noofPages = ngServicePaginationConf.noofPages;
		},
		template: function() {
			var tpl = '';
			tpl += '<form class="form-horizontal">';
				tpl += '<div class="form-group" style="margin-bottom: 0;">';
					tpl += '<div class="col-xs-5 col-sm-3 col-lg-2">';
						tpl += '<h5><strong>Search Result</strong></h5>';
					tpl += '</div>';
					tpl += '<label for="noof_pages" class="hidden-xs col-sm-3 col-md-5 col-lg-7 control-label" style="text-align: right;">No of pages</label>';
					tpl += '<div class="hidden-xs col-sm-2 col-md-1">';
						tpl += '<input type="number" class="form-control input-sm" id="noof_pages" name="noof_pages" min="1" max="100" ng-model="noofPages" />';
					tpl += '</div>';
					tpl += '<div class="col-xs-7 col-sm-4 col-md-3 col-lg-2">';
						tpl += '<input type="text" class="form-control input-sm" placeholder="Search results" ng-model="tableSearch" />';
					tpl += '</div>';
				tpl += '</div>';
			tpl += '</form>';

			return tpl;
		}
	}
}]);

myApp.directive("validFile", function() {
	return {
		require: "ngModel",
		link: function(scope, el, attrs, ngModel) {
			scope.extAr = ["xls"];

			el.bind("change",function() {
				scope.$apply(function() {
					var fname = el.val();

					if(scope.extAr.indexOf(fname.substr(fname.lastIndexOf(".") + 1)) != -1) {
						ngModel.$setViewValue(el.val());
					}

					ngModel.$render();
				});
			});
		}
	}
});