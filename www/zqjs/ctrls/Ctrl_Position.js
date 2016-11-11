Ctrls.controller('PositionCtrl', ['$rootScope', '$scope', 'LoginService',
	function ($rootScope, $scope, LoginService) {

		$scope.$on("$ionicView.afterEnter", function (event, data) {
			DM.update_data({'state':{
				page: 'positions'
			}});

			if(LoginService.is_login_server()){
				// 已经登录服务器了
			} else{
				// 需要重新登录服务器
				$rootScope.loginModal.show();
			}

		});

	}])