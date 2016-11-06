// myApp is the module object defined in config.js

myApp.controller("ngCtrlDBoard", ["$scope", "$state", "ngServiceRESTAPI", function($scope, $state, ngServiceRESTAPI) {
	$scope.tab_name = $state.current.data.displayName;
	$scope.tab_desc = $state.current.data.displayDesc;

	ngServiceRESTAPI("GET", "js/custom/data.json", {}).post(function(jsonData) {
		if(jsonData.statusText == "OK") {
			var data = jsonData.data.pageHome;
			$scope.geninfo = data.geninfo;
			$scope.serinfo = data.serinfo;
			$scope.userdetails = data.userdetails;
			$scope.limits_quotas = data.limits_quotas;
			$scope.wifi_details = data.wifi_details;
		}
	});

	$scope.toggleEdit = function() {
		var e = $(".pageHomePersonalData").find("span").eq(1);

		func1 = function(e) {
			e.removeClass("glyphicon-pencil").addClass("glyphicon-eye-open");
			$(".pageHomePersonalData").find("table").find("tbody").find("td").find("span").attr("contenteditable", "true").addClass("editable_span");
		}

		func2 = function(e) {
			e.removeClass("glyphicon-eye-open").addClass("glyphicon-pencil");
			$(".pageHomePersonalData").find("table").find("tbody").find("td").find("span").attr("contenteditable", "false").removeClass("editable_span");
		}

		e.hasClass("glyphicon-pencil") ? func1(e) : func2(e);
	};
}]);