Ctrls.controller('BanktransferCtrl', ['$rootScope', '$scope',
	function ($rootScope, $scope) {

		$scope.$on("$ionicView.afterEnter", function (event, data) {
			DM.update_data({'state':{
				page: 'banktransfer'
			}});

		});


	}])