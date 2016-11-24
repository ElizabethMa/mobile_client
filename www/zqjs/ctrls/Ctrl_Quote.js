Ctrls.controller('QuoteCtrl', ['$rootScope', '$scope', '$ionicScrollDelegate','$ionicLoading',
	function ($rootScope, $scope, $ionicScrollDelegate,$ionicLoading) {

		$scope.$on("$ionicView.afterEnter", function (event, data) {
			DM.update_data({'state':{
				page: 'quotes',
				ins_type: 'main'
			}});

			$scope.qt_c = document.querySelector('.inslist_type_main' + ' table.qt_c');
			$scope.qt_r = document.querySelector('.inslist_type_main' + ' table.qt_r');
			$scope.qt = document.querySelector('.inslist_type_main' + ' table.qt');
		});

		$scope.showLoading = function(){
			$ionicLoading.show({
				hideOnStateChange: true,
			});
		}

		$scope.qt_c = document.querySelector('.inslist_type_main' + ' table.qt_c');
		$scope.qt_r = document.querySelector('.inslist_type_main' + ' table.qt_r');
		$scope.qt = document.querySelector('.inslist_type_main' + ' table.qt');

		$scope.followScroll = function () {
			var top = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().top;
			var left = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().left;
			requestAnimationFrame(function(){
				$scope.qt_r.style.left = (left * -1) + 'px';
				$scope.qt_c.style.top = (top * -1) + 'px';
			});
		}

	}]);