(function () {
	var isDebug = 1;

	var ws;
	var server_url = '';
	var queue = [];

	var req_id = 0;

	// 自动重连开关
	var reconnect = true;
	var reconnectTask;
	var reconnectInterval = 2000;

	var CONNECTING = 0;
	var OPEN = 1;
	var CLOSING = 2;
	var CLOSED = 3;

	var notification_index = 0;

	function showNotifications(notifications, index) {
		var msg = notifications[index].content;
		var code = notifications[index].code;
		var type = notifications[index].type;
		// 如果账号在其他位置
		if (type == 'T' && window.plugins) {
			window.plugins.toast.showWithOptions({
				message: msg,
				duration: "long",
				position: "bottom",
				addPixelsY: -40
			},
			function (a) {
				console.log('toast success: ' + a);
			},
			function (b) {
				console.log('toast error: ' + b);
			});
		}
		
		if(type == 'N'){
			if(cordova.plugins.notification){
				cordova.plugins.notification.local.schedule({
					id: ++notification_index,
				    title: "众期货提醒您", // 默认 app name
				    text: msg,
				});
			}
		}

		if(code == '1'){
			reconnect = false;
		}

		if(code == '2'){
			var arr = msg.split(':');
			if(arr.length > 0){
				var m = {};
				m[arr[0]] = arr[1];
				DM.update_data({
					'mapping' : m
				});
			}
		}

		if(notifications[++index]){
			showNotifications(notifications, index)
		};
	}

	function reinit(url){
		if (typeof ws === 'undefined') {
			init(url);
		} else {
			server_url = url;
			ws.close();
		}
	}

	function init(url) {
		if (typeof url == 'string' && url != server_url) {
			server_url = url;
		}
		ws = new WebSocket(server_url);
		ws.onmessage = function (message) {
			var decoded = JSON.parse(message.data);
			// update datamanager
			if (decoded.aid == "rtn_data") {
				for (var i = 0; i < decoded.data.length; i++) {
					var temp = decoded.data[i];
					if (temp.notify) {
						console.log(JSON.stringify(temp.notify) );
						showNotifications(temp.notify, 0);

					}
					DM.update_data(temp);
				}
			} else if (decoded.aid == "rsp_login") {
				DM.update_data({
					account_id: decoded.account_id,
					session_id: decoded.session_id
				});
			}
			// send peek_message
			if (isReady()) ws.send('{"aid":"peek_message"}');
		};
		ws.onclose = function (event) {
			console.info(JSON.stringify(event));
			// 清空 datamanager
			DM.clear_data();
			// 自动重连
			if (reconnect) {
				reconnectTask = setInterval(function () {
					if (ws.readyState === CLOSED) init();
				}, reconnectInterval);
			}
		};
		ws.onerror = function (error) {
			console.error(JSON.stringify(error));
			ws.close();
		};
		ws.onopen = function () {
			req_id = 0;

			if (reconnectTask) {
				clearInterval(reconnectTask);
			}

			if (queue.length > 0) {
				while (queue.length > 0) {
					if (isReady()) send(queue.shift());
					else break;
				}
			}
		};
	}

	function isReady() {
		if (typeof ws === 'undefined') return false;
		else return ws.readyState === OPEN;
	}

	function send(message) {
		if (isReady()) {
			ws.send(JSON.stringify(message));
		}
		else queue.push(message);

		if (isDebug) console.log("send : " + JSON.stringify(message))

	}

	this.WS = {
		init: init,
		send: send,
		reinit: reinit,
		getReqid: function () {
			return (req_id++).toString(36);
		}
	}
}());
