Ctrls.controller('AppCtrl',
	['$rootScope', '$scope', '$timeout', '$ionicPopup', 'LoginService',
	function ($rootScope, $scope, $timeout, $ionicPopup, LoginService) {

		// set menu via CONST -> configuration.js

		$scope.inslist = CONST.ins_type;

		$scope.menuNav = function (state, listtype) {
			if ($rootScope.$settings.quote_listtype != listtype) {
				$rootScope.$settings.quote_listtype = listtype;
			}
			$rootScope.$state.go(state);
		}

		$timeout(function(){
			if(LoginService.is_login_server()){
				if (LoginService.last_login_state() == "sim") {
					$rootScope.login_states.type = 'sim';
					$rootScope.login_params.type = 'act';
				} else {
					$rootScope.login_states.type = 'act';
					$rootScope.login_params.type = 'sim';
					$rootScope.login_states.broker_id = LoginService.get_login_state();
				}
			}else{
				$rootScope.login_states.type = 'none';
				$rootScope.login_params.type = 'sim';
			}
		}, 500);




		// 根据上次登录情况:
		// 显示非登录页面右上角的登录状态 && 登录参数 && 连接 websocket

		// Form data for the login modal
		$scope.loginData = {};

		$scope.search = function () {
			$scope.data = {};

			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				template: '<input type="text" ng-model="data.searchinsid">',
				title: '请输入合约代码',
				subTitle: '输入合约代码,查看合约详情。',
				scope: $scope,
				buttons: [
					{text: '取消'},
					{
						text: '<b>确认</b>',
						type: 'button-positive',
						onTap: function (e) {
							if (!$scope.data.searchinsid) {
								e.preventDefault();
							} else {
								return $scope.data.searchinsid;
							}
						}
					}
				]
			});

			myPopup.then(function (res) {
				// 检查是否有这个合约
				// 1 有 -> 跳转详情页

				// 2 没有 -> popup 提示
				var alertPopup = $ionicPopup.alert({
					title: '未找到合约!',
					template: '未找到合约,请检查输入的合约。',
					okText: '好的',
					okType: 'button-positive'
				});

				alertPopup.then(function (res) {
					console.log('alert end');
				});
			});
		}

	}])