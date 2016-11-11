Ctrls.controller('QuoteCtrl', ['$rootScope', '$scope', '$ionicScrollDelegate','$ionicLoading',
	function ($rootScope, $scope, $ionicScrollDelegate,$ionicLoading) {

		$scope.$on("$ionicView.enter", function (event, data) {
			$scope.listtype = $rootScope.$settings.quote_listtype;
			$scope.title = CONST.ins_type[$scope.listtype];

			DM.update_data({'state':{
				page: 'quotes',
				ins_type: $scope.listtype
			}});
		});

		$scope.showLoading = function(){
			$ionicLoading.show({
				hideOnStateChange: true,
			});
		}

		$scope.followScroll = function () {
			var top = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().top;
			var left = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().left;
			var qt_c = document.querySelector('.inslist_type_' + $scope.listtype + ' table.qt_c');
			var qt_r = document.querySelector('.inslist_type_' + $scope.listtype + ' table.qt_r');
			qt_r.style.left = (left * -1) + 'px';
			qt_c.style.top = (top * -1) + 'px';
		}

		$scope.$watch("$settings.quote_listtype", function (newData, oldData) {
			$scope.listtype = $rootScope.$settings.quote_listtype;
			$scope.title = CONST.ins_type[$scope.listtype];

			var state = {
				page: 'quote',
				ins_type: $scope.listtype
			};

			DM.update_data({'state':state})
		});

	}]);