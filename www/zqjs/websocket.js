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

	var note_index = 0;

	function showNotifications(notifications) {
		var msg = notifications[note_index].title + ' : ' + notifications[note_index].content;
		// 如果账号在其他位置
		//if(notifications[note_index].content == "账号在其他位置登录"){
		//	reconnect = false;
		//}
		if (window.plugins) {
			window.plugins.toast.showWithOptions({
					message: msg,
					duration: "long",
					position: "bottom",
					addPixelsY: -40
				},
				function (a) {
					console.log('toast success: ' + a);
					note_index ++;
				},
				function (b) {
					console.log('toast error: ' + b);
					note_index ++;
				}
			)
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
						note_index = 0;
						showNotifications(temp.notify);

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

			//var a = true;
			//setInterval(function(){
			//	if (isReady()) ws.send('{"aid":"peek_message"}');
				//if (a) {
				//	ws.send('{"aid":"subscribe_quote","ins_type":"CUSTOM","ins_list":"T1612"}');
				//	a = !a;
				//}else{
				//	ws.send('{"aid":"subscribe_quote","ins_type":"CUSTOM","ins_list":"IF1702"}');
				//	a = !a;
				//}
			//}, 1000);

			// send peek_message
			//if (isReady()) ws.send('{"aid":"peek_message"}');
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
		getReqid: function () {
			return (req_id++).toString(36);
		}
	}
}());
