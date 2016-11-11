angular.module('starter.services', [])
	.service('QueryService', ['$http', function ($http) {
		var _baseUrl = SETTING.server_base_url;
		var queryService = {
			history: function (dstart, dend) {
				var _baseUrl = SETTING.server_base_url;
				// NOTE : 接口 page 从 0 开始 ; per_page 默认写个很大的数字 100000
//				var url = "http://api.shinnytech.com/t/sim/accounts/09885ec19f454951a34f0150ba466012/reports/account_change_log?page=0&per_page=100000&dstart="+dstart+"&dend="+dend;

				var promise = $http({
					method: 'GET',
					url: _baseUrl + '/t/'+localStorage.getItem('broker_id')+'/accounts/'
					+ DM.datas.account_id + '/reports/account_change_log?'
					+ 'page=0&per_page=100000'
					+ '&dstart=' + dstart + '&dend=' + dend,
				})
					.success(function (response) {
						return response;
					}).error(function (response, status) {
						console.log("response:" + response + ",status:" + status);
						return status;
					});
				return promise;
			}
		}
		return queryService;
	}])
	.service('LoginService', ['$rootScope', '$http', function ($rootScope, $http) {
		var _baseUrl = SETTING.server_base_url;
//		var _baseUrl = "http://api.shinnytech.com";
		var loginService = {
			is_login_server: function(){
				if(DM.datas.account_id) return true;
				return false;
			},

			do_http_login: function (param) {
				// 测试账户
				console.log(param);
				//param = {"account_id": "41007684", "password": "1"};
				//login
				var promise = $http.post(
					_baseUrl + '/account_sessions',
					param,
					{withCredentials: true});
				return promise;
			},
			do_http_register: function (param) {
				var promise = $http.post(_baseUrl + '/sim_accounts', param);
				return promise;
			},
			do_http_mobilestatus: function (mobile) {
				var promise = $http.get(_baseUrl + '/mobiles/' + mobile);
				return promise;
			},
			do_http_resetPassword: function (param) {
				var promise = $http.post(_baseUrl + '/account_password', param);
				return promise;
			},

			last_login_state: function () {
				if(localStorage.getItem('broker_id') == null){
					return 'none';
				}else {
					return localStorage.getItem('broker_id');
				}
			},
			get_login_state: function () {
				if(localStorage.getItem('broker_id') == null){
					return 'none';
				}else {
					return localStorage.getItem('broker_id');
				}
			}
		}
		return loginService;
	}])

	.service('CustomListService', ['$q', function ($q) {
		var getAll = function(){
			var s = localStorage.getItem('CustomList');
			// var s = DM.datas.custom_ins_list || '';
			if (s.length > 0) {
				return s.split(',');
			} else {
				return [];
			}
		}
		var CustomList = {
			"init": function () {
				if (localStorage.getItem('CustomList') === null) {
					localStorage.setItem('CustomList', '');
				}
			},

			"add": function (insid) {
				var s = localStorage.getItem('CustomList');
				if (s.indexOf(insid) == -1) {
					if (s.length > 0) {s += (',' + insid);}
					else {s += insid;}
					localStorage.setItem('CustomList', s);
					WS.send({
						aid: "subscribe_quote",
						ins_list: s
					});
				}
				return s.split(',');
			},
			"delete": function (insid) {
				var list = getAll();
				var index = list.indexOf(insid);
				if(index > -1){
					list.splice(index, 1);
					var s = list.join(',');
					localStorage.setItem('CustomList', s);
					WS.send({
						aid: "subscribe_quote",
						ins_list: s
					});
				}
				return list;
			},
			"isCustom": function (insid) {
				return localStorage.getItem('CustomList').indexOf(insid) > -1;
			},
			"getAll": getAll
		}
		return CustomList;
	}])