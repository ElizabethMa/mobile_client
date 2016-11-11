Ctrls.controller('PosdetailCtrl', ['$rootScope', '$scope','$ionicHistory','$ionicPopup', '$ionicLoading', 'CustomListService','LoginService',
	function ($rootScope, $scope,$ionicHistory,$ionicPopup, $ionicLoading, CustomListService, LoginService) {

		$scope.title = $rootScope.$state.params.insid;

		$scope.$on("$ionicView.afterEnter", function (event, data) {
			DM.update_data({state:{
				page : "posdetail",
				req_id: ""
			}});

			if($ionicHistory.backView().stateParams && $ionicHistory.backView().stateParams.posid){
				var last_posid = $ionicHistory.backView().stateParams.posid;
				console.log($ionicHistory.backView().stateParams.posid);
				if($rootScope.$state.params.posid == 'new' && DM.datas.positions[last_posid].position_id == null){
					// 历史记录中的 posid 已经不存在
					console.log('历史记录中的 posid 已经不存在');
					$ionicHistory.removeBackView();
				}
			}

			$scope.iscustom = CustomListService.isCustom($rootScope.$state.params.insid);
		});

		var myPopup;

		$scope.changeCustom = function () {
			// 添加/删除自选合约
			
			if (!$scope.iscustom) {
				CustomListService.add($rootScope.$state.params.insid);
				$scope.iscustom = !$scope.iscustom;
			} else {
				CustomListService.delete($rootScope.$state.params.insid);
				$scope.iscustom = !$scope.iscustom;
			}

		}

		$scope.changePos = function(pos_id){
			myPopup.close();

			$rootScope.$state.go('app.posdetail',{
				insid: $rootScope.$state.params.insid,
				posid: pos_id
			});
		}

		$scope.select_other_pos = function () {
			$scope.pos_list = DM.datas.quotes[$rootScope.$state.params.insid].pos_list;
			if($scope.pos_list) {
				$scope.pos_list = $scope.pos_list.split(',')
			} else {
				$scope.pos_list = [];
			}

			var tpl = '<div class="list popup-other-pos">';
			for(var i=0; i< $scope.pos_list.length; i++){
				var pos_id = $scope.pos_list[i];
				if(pos_id != $rootScope.$state.params.posid){
					var pos = DM.datas.positions[pos_id];

					tpl += '<a class="item button-block ' + pos.direction + '" '
						+ 'ng-click="changePos(\'' + pos_id + '\')"> ';
					if(pos.direction == "BUY"){
						tpl += '看涨持仓';
					}else if(pos.direction == "SELL"){
						tpl += '看跌持仓';
					}
					tpl += pos.volume + '手 浮动盈亏 <span class="';
					var val = pos.float_profit;
					var arr = val.split('|');

					tpl += arr[1] + '">';
					tpl += arr[0];
					tpl += '<span></a>';
				}
			}
			console.log($rootScope.$state.params.pos_id)

			if($rootScope.$state.params.posid != 'new'){
				tpl += '<a class="item button-block" ng-click="changePos(\'new\')">新建持仓</a>';
			}

			tpl += '</div>';

			// An elaborate, custom popup
			myPopup = $ionicPopup.show({
				template: tpl,
				cssClass: "full-block",
				title: '请选择持仓',
				subTitle: '选择持仓,查看行情。',
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

							myPopup.close();
						}
					}
				]
			});

			myPopup.then(function (res) {
				console.log('end');
			});
		}

		// 1.未登录
		// 2.登录
		// 2.1.有持仓
		// 2.2.无持仓


		$scope.makeorder = {}

		$scope.insert_order = function (direction) {

			if(!LoginService.is_login_server()){
				// 未登录 弹出登录页面
				$rootScope.loginModal.show();
				return;
			}

			if (!$scope.makeorder.hands) {
				$scope.makeorder.hands = 1;
			}

			if($rootScope.$state.params.posid != 'new'){
				var pos_id = $rootScope.$state.params.posid; // 持仓 id
				var already_direction = DM.datas.positions[pos_id].direction;
				var exchange_id = DM.datas.positions[pos_id].exchange_id;
				if(already_direction == direction){
					// 开仓方向和持仓方向一致
					$scope.send_insert_order(direction, 'OPEN', $scope.makeorder.hands);
				}else {
					if($scope.makeorder.hands > DM.datas.positions[pos_id].available){
						// 检查平仓手数
						navigator.notification.alert(
							'平仓手数不足!',  // message
							function(){return;},         // callback
							'手数不足',            // title
							'确定'                  // buttonName
						);
					} else{
						// 上期所 区分平今 平昨
						if(exchange_id == 'SHFE'){
							var available_today = DM.datas.positions[pos_id].available_today;
							var available_yesterday = DM.datas.positions[pos_id].available_yesterday;
							if($scope.makeorder.hands <= available_today){
								$scope.send_insert_order(direction, 'CLOSETODAY', $scope.makeorder.hands);
							}else if($scope.makeorder.hands <= available_yesterday){
								$scope.send_insert_order(direction, 'CLOSE', $scope.makeorder.hands);
							}else{
								$scope.send_insert_order(direction, 'CLOSETODAY', available_today );
								var hands_remain = $scope.makeorder.hands - available_today;
								$scope.send_insert_order(direction, 'CLOSE', hands_remain );
							}
						}else{
							$scope.send_insert_order(direction, 'CLOSE', $scope.makeorder.hands);
						}
					}
				}
			}else{
				$scope.send_insert_order(direction, 'OPEN', $scope.makeorder.hands);
			}
		}

		//$scope.onSwipeUp = function (e) {
		//	$ionicLoading.show({
		//		template: 'Loading...',
		//		noBackdrop: false,
		//		hideOnStateChange: true
		//	}).then(function () {
		//		$rootScope.$state.go('app.posdetail', {insid: 'ui2342'});
		//		console.log("The loading indicator is now displayed");
		//	});
		//}
		//$scope.onSwipeDown = function (e) {
		//	console.log('onSwipeDown');
		//	$ionicLoading.show({
		//		template: 'Loading...',
		//		noBackdrop: false,
		//		hideOnStateChange: true
		//	}).then(function () {
		//		$rootScope.$state.go('app.posdetail', {insid: '上一页'});
		//		console.log("The loading indicator is now displayed");
		//	});
		//}

		$scope.send_insert_order = function (direction, offset, hands) {

			var price_type = 'MARKET';
			var price = 0;

			if ($scope.makeorder.price) {
				price_type = 'LIMIT';
				price = $scope.makeorder.price;
			}

			if($rootScope.$state.params.posid == 'new'){
				var req_id = WS.getReqid();
				DM.update_data({state:{
					'req_id': req_id
				}});

				WS.send({
					aid: "req_insert_order", // 下单请求
					req_id: req_id,
					instrument_id: $scope.title,
					direction: direction,
					offset: offset,// OPEN | CLOSE | CLOSETODAY
					volume: hands,
					price_type: price_type, // 报单类型
					price: price
				});

			}else{
				WS.send({
					aid: "req_insert_order", // 下单请求
					req_id: WS.getReqid(),
					instrument_id: $scope.title,
					position_id: $rootScope.$state.params.posid,
					direction: direction,
					offset: offset,// OPEN | CLOSE | CLOSETODAY
					volume: hands,
					price_type: price_type, // 报单类型
					price: price
				});
			}
		}
	}])
