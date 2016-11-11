Ctrls.controller('UserinfoCtrl', ['$rootScope', '$scope','LoginService',
	function ($rootScope, $scope, LoginService) {

		$scope.$on("$ionicView.afterEnter", function (event, data) {
			DM.update_data({'state':{
				page: 'userinfo'
			}});

		});

		$scope.$on("$ionicView.afterEnter", function (event, data) {
			if(LoginService.is_login_server()){
				// 已经登录服务器了

			} else{
				// 需要重新登录服务器
				$rootScope.login_states.type = 'none';
				$rootScope.login_params.type = 'sim';
				$rootScope.loginModal.show();
			}
		});
	}])