// Ionic Starter App

angular.module('starter', ['ionic', 'datetime', 'ionic-datepicker', 'starter.controllers', 'starter.services'])

	.run(['$rootScope', '$state', '$urlRouter', '$location', '$ionicModal', '$ionicLoading', '$ionicHistory', '$ionicPlatform', 'LoginService', 'CustomListService', '$http',
		function ($rootScope, $state, $urlRouter, $location, $ionicModal, $ionicLoading, $ionicHistory, $ionicPlatform, LoginService, CustomListService, $http) {
			// datamanager init
			DM.init(draw_app);
			CustomListService.init();

			WS.send({
				aid: "subscribe_quote",
				ins_list: CustomListService.getAll().join(',')
			});

			if (LoginService.last_login_state() == "sim" || LoginService.last_login_state() == "none") {
				WS.init(SETTING.sim_server_url);
			} else{
				WS.init(SETTING.act_server_url);
			}

			if (localStorage.getItem('Shinny-Session' )) {
				$http.defaults.headers.common = {
					'Content-Type': 'application/json;charset=utf-8',
					'Accept': 'application/json',
					"Shinny-Session": localStorage.getItem('Shinny-Session')
				};
			}else {
				$http.defaults.headers.common = {
					'Content-Type': 'application/json;charset=utf-8',
					'Accept': 'application/json'
				};
			}

			// 全局设置 angularui-router . state
			$rootScope.$state = $state;

			// 登录状态
			$rootScope.login_states = {
				type: 'none',
				broker_id: '',
			};

			// 登录参数
			$rootScope.login_params = {
				type: 'sim',
			};

			if (localStorage.getItem('mobile' )) {
				$rootScope.login_states.mobile = localStorage.getItem('mobile');
			}

			// 初始化注册开户页面显示内容 [one, two.onlysim, two.all, two.no]
			$rootScope.register_step = 'one';

			// 合约列表参数
			$rootScope.$settings = {
				quote_listtype: 'main',
				posdetail_cell_height: 60, // 同时修改 style.css .posdetail .pos-box
			}

			// 初始化生成 $rootScope.loginModal $rootScope.registerModal $rootScope.changepwdModal
			$ionicModal.fromTemplateUrl('templates/modals/login.html', {
				scope: $rootScope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$rootScope.loginModal = modal;
			});
			$ionicModal.fromTemplateUrl('templates/modals/register.html', {
				scope: $rootScope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$rootScope.registerModal = modal;
			});
			$ionicModal.fromTemplateUrl('templates/modals/changepwd.html', {
				scope: $rootScope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$rootScope.changepwdModal = modal;
			});

			/**
			 * parameters
			 * $rootScope.login_states.mobile - 手机号码
			 * $rootScope.login_states.sim_password - 模拟密码
			 * $rootScope.login_states.account - 实盘账户
			 * $rootScope.login_states.act_password - 实盘密码
			 * $rootScope.login_error - 登录是否出错
			 * $rootScope.login_error_msg - 登录错误提示
			 */

			/**
			 * functions
			 * $rootScope.closeModal - 关闭三个 modal
			 * $rootScope.setParams - 根据登录状态设置登录参数
			 * $rootScope.switchParams - 切换登录参数 sim/act
			 * $rootScope.do_login - 登录
			 * $rootScope.do_register - 注册
			 * $rootScope.do_checkmobile - 检查手机号
			 * $rootScope.do_changepwd -  修改密码
			 */
			$rootScope.closeModal = function () {
				$rootScope.setParams();
				if ($rootScope.loginModal.isShown()) {
					$rootScope.loginModal.hide();
				}
				if ($rootScope.registerModal.isShown()) {
					$rootScope.registerModal.hide();
				}
				if ($rootScope.changepwdModal.isShown()) {
					$rootScope.changepwdModal.hide();
				}
				return;
			};

			$rootScope.switchParams = function () {
				if ($rootScope.login_params.type == 'sim') {
					$rootScope.login_params.type = 'act';
				} else {
					$rootScope.login_params.type = 'sim';
				}
				return ;
			}

			$rootScope.setParams = function(){
				if ($rootScope.login_states.type == 'none') {
					$rootScope.login_params.type = 'sim';
				} else if ($rootScope.login_states.type == "sim") {
					$rootScope.login_params.type = 'act';
				} else {
					$rootScope.login_params.type = 'sim';
				}
			}

			$rootScope.do_login = function () {
				$ionicLoading.show({
					template: '登录中...'
				}).then(function () {
					console.log("The loading indicator is now displayed");
				});

				var account_id = '';
				var password = '';

				if($rootScope.login_params.type == 'sim'){
					account_id = $rootScope.login_states.mobile;
					localStorage.setItem('mobile', $rootScope.login_states.mobile);
					password = $rootScope.login_states.sim_password;
					if(account_id == undefined){
						$ionicLoading.hide().then(function () {
							$rootScope.login_error = true;
							$rootScope.login_error_msg = "请输入手机号";
						});
						return;
					} else if(password == undefined){
						$ionicLoading.hide().then(function () {
							$rootScope.login_error = true;
							$rootScope.login_error_msg = "请输入密码";
						});
						return;
					}
				}else if($rootScope.login_params.type == 'act'){
					account_id = $rootScope.login_states.account;
					password = $rootScope.login_states.act_password;
					if(account_id == undefined){
						$ionicLoading.hide().then(function () {
							$rootScope.login_error = true;
							$rootScope.login_error_msg = "请输入实盘账户";
						});
						return;
					} else if(password == undefined){
						$ionicLoading.hide().then(function () {
							$rootScope.login_error = true;
							$rootScope.login_error_msg = "请输入密码";
						});
						return;
					}
				}
				console.log($rootScope.login_params.type)
				console.log(account_id, password)

				LoginService.do_http_login({
					"account_id": account_id,
					"password": password
				}).then(function (response) {
					if (response.status == 200) {
						var d = response.data;
						// 更新存储数据
						localStorage.setItem('Shinny-Session', d["Shinny-Session"]);
						localStorage.setItem('account_id', d["account_id"]);
						localStorage.setItem('broker_id', d["broker_id"]);
						localStorage.setItem('expire_time', d["expire_time"]);
						localStorage.setItem('user_id', d["user_id"]);

						console.log(d);

						Cookies.set('Shinny-Session', d["Shinny-Session"]);
						Cookies.set('account_id', d["account_id"]);
						Cookies.set('broker_id', d["broker_id"]);
						Cookies.set('user_id', d["user_id"]);

						$http.defaults.headers.common = {
							'Content-Type': 'application/json;charset=utf-8',
							'Accept': 'application/json',
							"Shinny-Session": localStorage.getItem('Shinny-Session')
						};

						// 重连服务器
						if (d["broker_id"] == 'sim') {
							WS.init(SETTING.sim_server_url);
						} else {
							WS.init(SETTING.act_server_url);
						}

						$ionicLoading.hide().then(function () {
							$rootScope.login_states.type = $rootScope.login_params.type;

							$rootScope.login_error = false;
							$rootScope.login_error_msg = "";

							$rootScope.closeModal();
						});

					}else{
						$ionicLoading.hide().then(function () {
							$rootScope.login_error = true;
							$rootScope.login_error_msg = '发生错误  [' + response.status + ']';
						});

					}
				}, function(response){
					if(response.status == 403){
						$ionicLoading.hide().then(function () {
							$rootScope.login_error = true;
							$rootScope.login_error_msg = "用户名或密码错误";
						});
					}else{
						$ionicLoading.hide().then(function () {
							$rootScope.login_error = true;
							$rootScope.login_error_msg = '发生错误  [' + response.status + ']';
						});

					}
				});
			}

			$rootScope.checkMobile = function () {
				console.log($rootScope.login_states.mobile);
				localStorage.setItem('mobile', $rootScope.login_states.mobile);
				LoginService.do_http_mobilestatus($rootScope.login_states.mobile)
					.then(function (response) {
						if (response.status == 200) {
							console.log(response.data)
							if (response.data.sim_account == 0) {
								$rootScope.register_step = 'two.no';
								//无模拟无实盘
								LoginService.do_http_register({
										"mobile": $rootScope.login_states.mobile
									})
									.then(function (response) {
										if (response.status == 201) {
											$rootScope.register_step = 'two.no';
										} else {
											console.log('注册失败')
										}
									});
							} else if (response.data.real_account == 0) {
								//有模拟无实盘
								$rootScope.register_step = 'two.onlysim';
							} else {
								//有模拟有实盘
								$rootScope.register_step = 'two.all';
							}
							console.log($rootScope.register_step)
						} else {
							console.log(response.status)
						}
					});

			}

			$rootScope.openAccount = function () {
				// 东方期货 0127  浏览器&registerWay=2
				window.location.href = 'https://appficaos.cfmmc.com/indexnew?brokerId=0127&openType=9&checkBrokerIdFlag=false';

			}


			$rootScope.register = function () {
				LoginService.do_register();

			}

			$rootScope.send_pwd = function () {

				var broker_id = "";
				if ($rootScope.login_params.type == 'sim') {
					broker_id = $rootScope.login_params.type;
				}
				var d = {"broker_id": broker_id, "mobile": $rootScope.login_states.mobile};

				LoginService.do_http_resetPassword(d).then(function (response) {
					if (response.status == 200) {
						$rootScope.send_pwd_message_result = true;
						$rootScope.send_pwd_message = "重置成功，密码发送到您手机。";
						localStorage.setItem('mobile', $rootScope.login_states.mobile);
					} else if (response.status == 403) {
						$rootScope.send_pwd_message_result = true;
						$rootScope.send_pwd_message = "该手机号未注册。";
					} else {
						$rootScope.send_pwd_message_result = true;
						$rootScope.send_pwd_message = "服务器正忙,请稍后重试!";
					}
				}, function(response){
					if(response.status == 403){
						$rootScope.send_pwd_message_result = true;
						$rootScope.send_pwd_message = "该手机号未注册。";
					}
				});
			}


			$ionicPlatform.ready(function () {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
//				if (window.cordova && window.cordova.plugins.Keyboard) {
//					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//					cordova.plugins.Keyboard.disableScroll(true);
//
//				}
//				if (window.StatusBar) {
//					// org.apache.cordova.statusbar required
//					StatusBar.styleDefault();
//				}
			});
		}
	])

	.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', 'ionicDatePickerProvider',
		function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider) {

			var datePickerObj = {
				inputDate: new Date(),
//				titleLabel: '请选择日期',
				setLabel: '选择',
				todayLabel: '今天',
				closeLabel: '关闭',
				mondayFirst: false,
				weeksList: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
				monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
				templateType: 'popup',
				from: new Date(2012, 8, 1),
				to: new Date(),
				showTodayButton: true,
				dateFormat: 'yyyy MM dd',
				closeOnSelect: false,
				disableWeekdays: []
			};
			ionicDatePickerProvider.configDatePicker(datePickerObj);

			$urlRouterProvider.otherwise('/app/tabs/quote');

			$stateProvider
				.state('app', {
					url: '/app',
					abstract: true,
					templateUrl: 'templates/menu.html',
					controller: 'AppCtrl'
				})

				// tabs
				.state('app.tabs', {
					url: '/tabs',
					abstract: true,
					templateUrl: 'templates/tabs.html',
					controller: 'AppCtrl'
				})

				// 报价
				.state('app.tabs.quote', {
					url: '/quote',
					views: {
						'tab-quote': {
							templateUrl: 'templates/quote.html',
							controller: 'QuoteCtrl'
						}
					}
				})

				// 报价
				.state('app.tabs.custom', {
					url: '/custom',
					views: {
						'tab-custom': {
							templateUrl: 'templates/custom.html',
							controller: 'CustomCtrl'
						}
					}
				})

				// 持仓
				.state('app.tabs.position', {
					url: '/position',
					views: {
						'tab-position': {
							templateUrl: 'templates/position.html',
							controller: 'PositionCtrl'
						}
					}
				})

				// 交易详情
				.state('app.posdetail', {
					url: '/posdetail/:insid/:posid',
					templateUrl: 'templates/posdetail.html',
					controller: 'PosdetailCtrl'
				})

				// 交易历史
				.state('app.tabs.transaction', {
					url: '/transaction',
					views: {
						'tab-transaction': {
							templateUrl: 'templates/transaction.html',
							controller: 'TransactionCtrl'
						}
					}
				})

				// 资金历史
				.state('app.moneyhistory', {
					url: '/moneyhistory',
					templateUrl: 'templates/moneyhistory.html',
					controller: 'MoneyhistoryCtrl'
				})

				// 银期转账
				.state('app.banktransfer', {
					url: '/banktransfer',
					templateUrl: 'templates/banktransfer.html',
					controller: 'BanktransferCtrl'
				})

				// 个人信息
				.state('app.userinfo', {
					url: '/userinfo',
					templateUrl: 'templates/userinfo.html',
					controller: 'UserinfoCtrl'
				});


			$ionicConfigProvider.views.maxCache(5);
			$ionicConfigProvider.views.swipeBackEnabled(false);

			// note that you can also chain configs
			$ionicConfigProvider.backButton.text('返回').icon('ion-chevron-left');

			$ionicConfigProvider.platform.ios.tabs.style('standard');
			$ionicConfigProvider.platform.ios.tabs.position('bottom');
			$ionicConfigProvider.platform.android.tabs.style('standard');
			$ionicConfigProvider.platform.android.tabs.position('bottom');

			$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
			$ionicConfigProvider.platform.android.navBar.alignTitle('center');

			$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
			$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

			$ionicConfigProvider.platform.ios.views.transition('ios');
			$ionicConfigProvider.platform.android.views.transition('android');

		}
	])
	.directive('tableAddon', [function () {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				var table_qt_rc = document.createElement('table');
				table_qt_rc.className = "quote qt_rc";
				table_qt_rc.innerHTML = '<thead> <tr class="odd"> <td>合约代码</td> </tr> <tr class="even"> <td>合约名称</td> </tr> </thead>';

				var div_qt_rwrapper = document.createElement('div');
				div_qt_rwrapper.className = "qt_rwrapper";
				var temp = '<table class="quote qt_r"> <thead> <tr class="odd"> <td>合约代码</td>';
				for (var i = 0; i < CONST.inslist_cols_odd_name.length; i++) {
					temp += '<td>' + CONST.inslist_cols_odd_name[i] + '</td>';
				}
				temp += '</tr> <tr class="even"> <td>合约名称</td>';
				for (var i = 0; i < CONST.inslist_cols_even_name.length; i++) {
					temp += '<td>' + CONST.inslist_cols_even_name[i] + '</td>';
				}
				temp += '</tr> </thead> <tbody> </tbody></table>';

				div_qt_rwrapper.innerHTML = temp;

				var div_qt_cwrapper = document.createElement('div');
				div_qt_cwrapper.className = "qt_cwrapper";
				div_qt_cwrapper.innerHTML = '<table class="quote qt_c"> <thead> <tr class="odd"> <td>合约代码</td> </tr> <tr class="even"> <td>合约名称</td></tr> </thead> <tbody> </tbody></table>';
				ele[0].appendChild(table_qt_rc);
				ele[0].appendChild(div_qt_rwrapper);
				ele[0].appendChild(div_qt_cwrapper);
			}
		}
	}])
	.directive('tableAddonOdd', [function () {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				var temp = ' <td>合约代码</td>';
				for (var i = 0; i < CONST.inslist_cols_odd_name.length; i++) {
					temp += '<td>' + CONST.inslist_cols_odd_name[i] + '</td>';
				}
				ele[0].innerHTML = temp;
			}
		}
	}])
	.directive('tableAddonEven', [function () {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				var temp = ' <td>合约名称</td>';
				for (var i = 0; i < CONST.inslist_cols_even_name.length; i++) {
					temp += '<td>' + CONST.inslist_cols_even_name[i] + '</td>';
				}
				ele[0].innerHTML = temp;
			}
		}
	}])
	.directive('bgOpacity', [function () {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				var div = document.createElement('div');
				div.style.position = 'absolute';
				div.style.top = '0px';
				div.style.left = '0px';
				div.style.width = '100%';
				div.style.height = '100%';
				div.style.opacity = attrs.bgOpacity;
				div.style.backgroundColor = '#333';
				div.style.willChange = 'transform';

				var c = ele[0].querySelector('.scroll');
				ele[0].insertBefore(div, c);
			}
		}
	}])

	.directive('calHeight', ['$rootScope', function ($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				var cell_height = $rootScope.$settings.posdetail_cell_height;
				var contentHeight = ele[0].parentElement.clientHeight;
				var listHeight = ele[0].parentElement.querySelector('.list').clientHeight;
				var restHeight = contentHeight  - listHeight;
				
				var rowNum = Math.floor(restHeight / cell_height);

				var height = rowNum * cell_height;

				if (height < 1) {
					height = cell_height;
				}

				ele[0].style.height = height + 'px';
				ele[0].querySelector('.pos-boxes').style.height = height + 'px';
			}
		};
	}])

	.directive('showTabs', ['$rootScope', function ($rootScope) {
	    return {
	        restrict: 'A',
	        link: function ($scope, $el) {
	            $rootScope.hideTabs = false;
	        }
	    };
	}])
	.directive('hideTabs', ['$rootScope', function ($rootScope) {
	    return {
	        restrict: 'A',
	        link: function ($scope, $el) {
	            $rootScope.hideTabs = true;
	        }
	    };
	}]);

var Ctrls = angular.module('starter.controllers', []);
