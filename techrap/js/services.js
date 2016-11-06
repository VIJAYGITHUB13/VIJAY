// myApp is the module object defined in config.js

myApp.service("ngServiceInfoMsgs", function() {
	return {
		success: {
			alertname: "alert-success",
			title: "Success",
			msg: ""
		},
		info: {
			alertname: "alert-info",
			title: "Info",
			msg: ""
		},
		warning: {
			alertname: "alert-warning",
			title: "Warning",
			msg: ""
		},
		danger: {
			alertname: "alert-danger",
			title: "Error",
			msg: ""
		}
	};
});

myApp.service("ngServiceMyInfo", function() {
	return {
		uid: "",
		username: "",
		uname: "",
		ucategory: ""
	};
});

myApp.service("ngServicePaginationConf", function() {
	return {
		currentPage: 1,
		noofPages: 10
	};
});

myApp.service("ngServiceDPConf", function() {
	return {
		format: "MM/DD/YYYY HH:mm",
		useCurrent: true,
		icons: {
			time: "glyphicon glyphicon-time",
			date: "glyphicon glyphicon-calendar",
			up: "glyphicon glyphicon-triangle-top",
			down: "glyphicon glyphicon-triangle-bottom",
			previous: "glyphicon glyphicon-triangle-left",
			next: "glyphicon glyphicon-triangle-right",
			today: "glyphicon glyphicon-screenshot",
			clear: "glyphicon glyphicon-trash",
			close: "glyphicon glyphicon-remove"
		},
		calendarWeeks: true,
		showTodayButton: true,
		showClear: true,
		showClose: true,
		tooltips: {
			today: "Go to today",
			clear: "Clear selection",
			close: "Close the picker",
			selectMonth: "Select Month",
			prevMonth: "Previous Month",
			nextMonth: "Next Month",
			selectYear: "Select Year",
			prevYear: "Previous Year",
			nextYear: "Next Year",
			selectDecade: "Select Decade",
			prevDecade: "Previous Decade",
			nextDecade: "Next Decade",
			prevCentury: "Previous Century",
			nextCentury: "Next Century"
		}
	}
});

triggerRESTAPI = function($http, method, url, inputObj) {
	this.post = function(callback) {
		$http({
			method: method,
			url: url,
			data: inputObj
		}).then(function successCallback(responseData) {
			// this callback will be called asynchronously
			// when the response is available

			callback(responseData);
		}, function errorCallback(responseData) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.

			callback(responseData);
		});
	}
};

myApp.service("ngServiceRESTAPI", ["$http", function($http) {
	return function(method, url, inputObj) {
		return new triggerRESTAPI($http, method, url, inputObj);
	}
}]);

myApp.service("ngServiceUserReg", function() {
	return {
		setInfo: function(type, obj) {
			switch(type) {
				case "regparams":
					this.regParamsObj = obj;
				break;

				case "regform":
					this.regFormObj = obj;
				break;

				case "regupload":
					this.regUploadObj = obj;
				break;
			}
		},
		getInfo: function(type) {
			switch(type) {
				case "regparams":
					return this.regParamsObj;
				break;

				case "regform":
					return this.regFormObj;
				break;

				case "regupload":
					return this.regUploadObj;
				break;
			}
		}
	};
});