Ctrls.controller('CustomCtrl',
	['$rootScope', '$scope','CustomListService', '$ionicScrollDelegate',
	function ($rootScope, $scope,CustomListService, $ionicScrollDelegate) {

		console.log('CustomCtrl Start');

		$scope.title = '自选合约';
		$scope.listtype = 'custom';

		$scope.$on("$ionicView.enter", function (event, data) {

			delete $scope.followScroll;

			$scope.followScroll = function () {
				var top = $ionicScrollDelegate.$getByHandle('handler_custom').getScrollPosition().top;
				var left = $ionicScrollDelegate.$getByHandle('handler_custom').getScrollPosition().left;
				var qt_c = document.querySelector('.inslist_type_' + $scope.listtype + ' table.qt_c');
				var qt_r = document.querySelector('.inslist_type_' + $scope.listtype + ' table.qt_r');
				qt_r.style.left = (left * -1) + 'px';
				qt_c.style.top = (top * -1) + 'px';
			}

			var customList = CustomListService.getAll();

			DM.update_data({'state':{
				page: 'quotes',
				ins_type: 'custom',
				ins_list: customList.join(',')
			}});

		})


	}])