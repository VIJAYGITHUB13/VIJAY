// Application definition with routing technique and initial point
var myApp = angular.module("myApp", ["ui.router", "ds.clock", "angularUtils.directives.uiBreadcrumbs", "angularUtils.directives.dirPagination", "datetimepicker"]);

myApp.config(function($stateProvider, $urlRouterProvider) {
	// StateProvider of public menus at Level-1 View (main > index)
	$stateProvider
	.state("pageIndex", {
		url: "/pageIndex",
		views: {
			"main": {
				templateUrl: "pages/index/template.html",
				controller: "ngCtrlIndex"
			}
		},
		data: {
			displayName: "Index"
		}
	})
	.state("pageIndex.pageHome", {
		url: "/pageHome",
		views: {
			"index@pageIndex": {
				templateUrl: "pages/index/home/template.html",
				controller: "ngCtrlHome"
			}
		},
		data: {
			displayName: "Home"
		}
	})
	.state("pageIndex.pageAboutUs", {
		url: "/pageAboutUs",
		views: {
			"index@pageIndex": {
				templateUrl: "pages/index/aboutus/template.html",
				controller: "ngCtrlAboutUs"
			}
		},
		data: {
			displayName: "About us",
			displayDesc: "Something about us"
		}
	})
	.state("pageIndex.pageTariffPlans", {
		url: "/pageTariffPlans",
		views: {
			"index@pageIndex": {
				templateUrl: "pages/index/tariffplans/template.html",
				controller: "ngCtrlTariffPlans"
			}
		},
		data: {
			displayName: "Tariff Plans"
		}
	})
	.state("pageIndex.pageContactUs", {
		url: "/pageContactUs",
		views: {
			"index@pageIndex": {
				templateUrl: "pages/index/contactus/template.html",
				controller: "ngCtrlContactUs"
			}
		},
		data: {
			displayName: "Contact us",
			displayDesc: "Address and landline details"
		}
	});

	// StateProvider of authenticated menus at Level-1 View (main > window)
	$stateProvider
	.state("pageWindow", {
		url: "/pageWindow",
		views: {
			"main": {
				templateUrl: "pages/window/template.html",
				controller: "ngCtrlWindow"
			}
		},
		data: {
			displayName: "Window"
		}
	})
	.state("pageWindow.pageChangePassword", {
		url: "/pageChangePassword",
		views: {
			"window@pageWindow": {
				templateUrl: "pages/window/changepassword/template.html",
				controller: "ngCtrlChangePassword"
			}
		},
		data: {
			displayName: "Change Password",
			displayDesc: "Security"
		}
	})
	.state("pageWindow.pageUsers", {
		url: "/pageUsers",
		data: {
			displayName: "Users"
		}
	})
	.state("pageWindow.pageUsers.pageUsersView", {
		url: "/pageUsersView",
		views: {
			"window@pageWindow": {
				templateUrl: "pages/window/users/view/template.html",
				controller: "ngCtrlUsersView"
			}
		},
		data: {
			displayName: "View",
			displayDesc: "Innerview of user details"
		}
	})
	.state("pageWindow.pageUsers.pageUsersRegister", {
		url: "/pageUsersRegister",
		views: {
			"window@pageWindow": {
				templateUrl: "pages/window/users/register/template.html",
				controller: "ngCtrlUsersRegister"
			}
		},
		data: {
			displayName: "Register",
			displayDesc: "Enhancing the network"
		}
	})
	.state("pageWindow.pageUsers.pageUsersRegister.pageUsersRegParams", {
		url: "/pageUsersRegParams",
		views: {
			"registerV@pageWindow.pageUsers.pageUsersRegister": {
				templateUrl: "pages/window/users/register/regparams/template.html",
				controller: "ngCtrlUsersRegParams"
			}
		}
	})
	.state("pageWindow.pageUsers.pageUsersRegister.pageUsersRegForm", {
		url: "/pageUsersRegForm",
		views: {
			"registerV@pageWindow.pageUsers.pageUsersRegister": {
				templateUrl: "pages/window/users/register/regform/template.html",
				controller: "ngCtrlUsersRegForm"
			}
		}
	})
	.state("pageWindow.pageUsers.pageUsersRegister.pageUsersRegFormConf", {
		url: "/pageUsersRegFormConf",
		views: {
			"registerV@pageWindow.pageUsers.pageUsersRegister": {
				templateUrl: "pages/window/users/register/regformconf/template.html",
				controller: "ngCtrlUsersRegFormConf"
			}
		}
	})
	.state("pageWindow.pageUsers.pageUsersRegister.pageUsersRegUpload", {
		url: "/pageUsersRegUpload",
		views: {
			"registerV@pageWindow.pageUsers.pageUsersRegister": {
				templateUrl: "pages/window/users/register/regupload/template.html",
				controller: "ngCtrlUsersRegUpload"
			}
		}
	})
	.state("pageWindow.pageUsers.pageUsersRegister.pageUsersRegUploadConf", {
		url: "/pageUsersRegUploadConf",
		views: {
			"registerV@pageWindow.pageUsers.pageUsersRegister": {
				templateUrl: "pages/window/users/register/reguploadconf/template.html",
				controller: "ngCtrlUsersRegUploadConf"
			}
		}
	})
	.state("pageWindow.pageDashboard", {
		url: "/pageDashboard",
		views: {
			"window@pageWindow": {
				templateUrl: "pages/window/dashboard/template.html",
				controller: "ngCtrlDBoard"
			}
		},
		data: {
			displayName: "Dashboard",
			displayDesc: "User details"
		}
	})
	.state("pageWindow.pageDefAnatomy", {
		url: "/pageDefAnatomy",
		views: {
			"window@pageWindow": {
				templateUrl: "pages/window/defanatomy/template.html",
				controller: "ngCtrlDefAnatomy"
			},
			"plansV@pageWindow.pageDefAnatomy": {
				templateUrl: "pages/window/defanatomy/plans/template.html",
				controller: "ngCtrlDefAyPlans"
			},
			"speedV@pageWindow.pageDefAnatomy": {
				templateUrl: "pages/window/defanatomy/speed/template.html",
				controller: "ngCtrlDefAySpeed"
			},
			"fupsV@pageWindow.pageDefAnatomy": {
				templateUrl: "pages/window/defanatomy/fups/template.html",
				controller: "ngCtrlDefAyFUPs"
			},
			"postfupsV@pageWindow.pageDefAnatomy": {
				templateUrl: "pages/window/defanatomy/postfups/template.html",
				controller: "ngCtrlDefAyPostFUPs"
			},
			"termsV@pageWindow.pageDefAnatomy": {
				templateUrl: "pages/window/defanatomy/terms/template.html",
				controller: "ngCtrlDefAyTerms"
			},
			"anatomyV@pageWindow.pageDefAnatomy": {
				templateUrl: "pages/window/defanatomy/anatomy/template.html",
				controller: "ngCtrlDefAyAnatomy"
			},
			"tariffV@pageWindow.pageDefAnatomy": {
				templateUrl: "pages/window/defanatomy/tariff/template.html",
				controller: "ngCtrlDefAyTariff"
			}
		},
		data: {
			displayName: "Define Anatomy",
			displayDesc: "Create anatomy"
		}
	})
	.state("pageWindow.pageInbox", {
		url: "/pageInbox",
		views: {
			"window@pageWindow": {
				templateUrl: "pages/window/inbox/template.html",
				controller: "ngCtrlInbox"
			}
		},
		data: {
			displayName: "Inbox",
			displayDesc: "Control flow of the requests"
		}
	});

	$urlRouterProvider.otherwise("/pageIndex/pageHome");
});