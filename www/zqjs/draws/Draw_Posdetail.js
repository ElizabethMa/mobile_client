function draw_page_posdetail() {
	if (DM.get_data("state.page") == "posdetail") {
		var arr = location.hash.split('/');
		if(arr.indexOf('posdetail') < 0){
			return;
		}
		var insid = arr[3], posid = arr[4];

		if (posid == 'new') {

			var positions = DM.get_data('positions');

			if(DM.get_data('session_id') && DM.get_data('state.req_id')){
				var new_order_id = DM.get_data('session_id') + '!' + DM.get_data('state.req_id');

				for(var pos in positions){
					if(positions[pos].instrument_id == insid && positions[pos].orders){
						var orders = positions[pos].orders;
						for(var o in orders){
							if(o == new_order_id){
								console.log("有了新持仓" + pos)
								location.href = "#/app/posdetail/" + insid + '/' + pos;
								return;
							}
						}
					}
				}
			}
		} else {
			// 检查 position_id == null

			if(DM.get_data('positions.' + posid + '.position_id') == null){
				console.log("没有了持仓" + posid)
				location.href = "#/app/posdetail/" + insid + '/new';
				return;
			}

			DM.run(function (posid, insid) {
				return function () {
					draw_page_posdetail_poslist(posid, insid)
				};
			}(posid, insid));
		}

		draw_page_posdetail_content(posid, insid);


		for (var i = 0; i < CONST.pos_detail_quote.length; i++) {
			// 详情页 合约详情
			DM.run(function (insid, p) {
				return function () {
					draw_page_posdetail_quote(insid, p)
				};
			}(insid, CONST.pos_detail_quote[i]));
		}

	}
}

function draw_page_posdetail_content(posid, insid) {
	if (DM.get_data("state.page") == "posdetail" && DM.get_data("account_id")) {
		var containers = document.querySelectorAll('.posdetail .detail');

		var divs = document.querySelectorAll('.posdetail .detail .detail_msg');

		for (var i = 0; i < containers.length; i++) {
			var div = divs[i];
			if(posid == 'new'){
				containers[i].className = addClassName(containers[i].className, 'NEW');
				div.innerText = '新持仓';
			}else{
				var direction = DM.get_data("positions." + posid + '.direction');
				var volume = DM.get_data("positions." + posid + '.volume');
				var float_profit = DM.get_data("positions." + posid + '.float_profit');
				var html = '看'
				if (div && direction && volume && float_profit) {
					containers[i].className = addClassName(containers[i].className, direction);
					html += (direction == 'BUY') ? '涨' : '跌';
					html += '持仓 ' + volume + '手 浮动盈亏 ';
 					html += '<span class="';
					var arr = float_profit.split('|');
					if (arr[1]) {
						html += arr[1];
					}
					html += '">'+arr[0]+'</span>';
					div.innerHTML = html;
				}
			}
			
		}
	}

}

function draw_page_posdetail_quote(insid, param) {
	if (DM.get_data("state.page") == "posdetail") {
		var divs = document.querySelectorAll('.posdetail .quote .' + param);
		var quote = DM.get_data("quotes." + insid);
		for (var i = 0; i < divs.length; i++) {
			var div = divs[i];
			if (div && quote) {
				var val = quote[param];
				var arr = val.split('|');
				if (arr[1]) {
					div.className = addClassName(div.className, arr[1]);
				}
				div.innerText = arr[0];
			}
		}
	}
}



var cancel_order = function (session_id, order_id) {

	navigator.notification.confirm(
		'确认删除挂单?', // message
		function(buttonIndex) {
			console.log('You selected button ' + buttonIndex);

			if (buttonIndex == 1) {
				WS.send({
					aid: "req_cancel_order", // 撤单请求
					req_id: WS.getReqid(),
					order_session_id: session_id,
					order_req_id: order_id
				});
			} else {
				return;
			}
		},            // callback to invoke with index of button pressed
		'删除挂单',           // title
		['删除','取消']     // buttonLabels
	);
}

function draw_page_posdetail_poslist(posid, insid) {
	if (DM.get_data("state.page") == "posdetail") {
		var container = document.querySelector('.posdetail .pos-boxes');

		var orders = DM.get_data("positions." + posid + ".orders");

		var counts = orders ? Object.getOwnPropertyNames(orders).length : 0;

		// TODO cell_height cell_width
		if (container) {
			var restHeight = parseInt(container.style.height);

			var rowNum = Math.floor(restHeight / 60);
			var minColNum = Math.ceil(window.innerWidth / 100);

			var colNum = Math.ceil(counts / rowNum);
			var lastColNum = colNum - counts % rowNum;
			if (minColNum > colNum) {
				document.querySelector('.posdetail .pos-boxes').style.width = (minColNum * 100 ) + 'px';
			} else {
				document.querySelector('.posdetail .pos-boxes').style.width = (colNum * 100 ) + 'px';
			}


			var s = '';

			for (var order_id in orders) {
				var order = orders[order_id];
				if(order.order_id == null){
					continue;
				}
				if (order.direction == 'BUY') {
					s += '<div class="pos-box red" ';
				} else if (order.direction == 'SELL') {
					s += '<div class="pos-box green" ';
				}
				s += ' onclick="cancel_order(\'' + order.session_id + '\',\'' + order.order_id + '\')">';

				if (order.price_type == 'LIMIT') {
					s += order.price + '<br/>';
				} else if (order.price_type == 'MARKET') {
					s += '市价<br/>';
				}
				if (order.direction == 'BUY') {
					s += '买';
				} else if (order.direction == 'SELL') {
					s += '卖';
				}
				if (order.offset == 'OPEN') {
					s += '开仓';
				} else if (order.offset == 'CLOSE' || order.offset == 'CLOSE_TODAY') {
					s += '平仓';
				}
				s += order.volume_left + '手</div>';
			}

			container.innerHTML = s;
		}
	}
}