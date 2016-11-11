function draw_page_position() {
	if (DM.get_data("state.page") == "positions" && DM.get_data("account_id")) {
		var arr = location.hash.split('/');
		if(arr.indexOf('position') < 0){
			return;
		}
		for (var i = 0; i < CONST.positions_account.length; i++) {
			DM.run(function (p) {
				return function () {
					draw_page_position_account(p)
				};
			}(CONST.positions_account[i]));
		}
		DM.run(draw_page_position_list);
	}
}

function draw_page_position_account(param) {
	var div = document.querySelector('.pos_container .account_info .' + param);
	var val = DM.get_data(param);
	if(val && div){
		var arr = val.split('|');
		if (arr[1]) {
			div.className = addClassName(div.className, arr[1]);
		}
		div.innerText = arr[0];
	}
}

function page_to_posdetail(insid, posid) {
	location.href = "#/app/posdetail/" + insid + '/' + posid;
}

function draw_page_position_list() {
	var poslist = DM.get_data("positions");
	var container = document.querySelector('.pos_container .pos_list');

	var posArr = [];
	if (poslist) {
		posArr = Object.getOwnPropertyNames(poslist);
	}else{
		return;
	}

	var strHtml = '';

	for (var i = 0; i < posArr.length; i++) {
		if(DM.get_data("positions." + posArr[i] + ".position_id") == null){
			if (document.querySelectorAll('.pos_container .pos_list .pos_' + posArr[i]).length > 0) {
				var pos_parent = document.querySelector('.pos_container .pos_list');
				var pos = document.querySelector('.pos_container .pos_list .pos_' + posArr[i]);
				pos_parent.removeChild(pos);
			}
			continue;
		}
		if (document.querySelectorAll('.pos_container .pos_list .pos_' + posArr[i]).length == 0) {
			var p = poslist[posArr[i]];
			// 持仓没有了
			if(p.position_id == null){ continue;}
			strHtml = '<div class="list card pos_' + posArr[i] + '">';
			strHtml += '<a class="item item-divider" onclick="page_to_posdetail(\'' + p.instrument_id + '\',\'' + posArr[i] + '\')">';
			strHtml += '<div class="row">';
			strHtml += '<div class="col">';
			strHtml += p.instrument_id;

			if (p.direction == 'SELL') {
				strHtml += ' <i class="icon ion-arrow-down-c"></i>'
			} else if (p.direction == 'BUY') {
				strHtml += ' <i class="icon ion-arrow-up-c"></i>'
			}

			strHtml += '</div>';

			var val = DM.get_data('quotes.'+p.instrument_id+'.last_price');
			var arr = val.split('|');

			if (arr[1]) {
				strHtml += '<div class="col ' + arr[1] + ' last_price" align="right">' + arr[0] + '</div>';
			} else {
				strHtml += '<div class="col last_price" align="right">' + arr[0] + '</div>';
			}

			strHtml += '</div></a>';
			strHtml += '<a class="item ' + p.direction + '" onclick="page_to_posdetail(\'' + p.instrument_id + '\',\'' + posArr[i] + '\')">';
			strHtml += '<div class="row">';

			if (p.direction == 'SELL') {
				strHtml += '<div class="col">看跌</div>';
			} else if (p.direction == 'BUY') {
				strHtml += '<div class="col">看涨</div>';
			}


			strHtml += '<div class="col volume" align="right">' + p.volume + '手</div>';
			strHtml += '<div class="col col-offset-10">盈亏</div>';

			var val = p.float_profit;
			var arr = val.split('|');

			if (arr[1]) {
				strHtml += '<div class="col float_profit ' + arr[1] + '" align="right">';
			} else {
				strHtml += '<div class="col float_profit" align="right">';
			}
			strHtml += arr[0] + '</div>';

			strHtml += '</div>';
			strHtml += '<div class="row">';
			strHtml += '<div class="col">成本</div>';
			strHtml += '<div class="col open_price" align="right">' + p.open_price + '</div>';
			strHtml += '<div class="col col-offset-10">开未成</div>';
			strHtml += '<div class="col pending_open_volume" align="right">' + p.pending_open_volume + '手</div>';
			strHtml += '</div>';
			strHtml += '<div class="row">';
			strHtml += '<div class="col">占用</div>';
			strHtml += '<div class="col margin" align="right">' + p.margin + '</div>';
			strHtml += '<div class="col col-offset-10">平未成</div>';
			strHtml += '<div class="col frozen_volume" align="right">' + p.frozen_volume + '手</div>';
			strHtml += '</div></a></div>';
			container.innerHTML += strHtml;
		} else {
			DM.run(function (pos_id) {
				return function () {
					draw_page_position_content(pos_id)
				};
			}(posArr[i]));
		}
	}

}

function draw_page_position_content(pos_id) {
	if (location.hash == "#/app/tabs/position" && DM.get_data("account_id")) {
		var classNameStr = '.pos_container .pos_list .pos_' + pos_id;
		for (var i = 0; i < CONST.positions_attrs.length; i++) {
			var div = document.querySelector(classNameStr + ' .' + CONST.positions_attrs[i]);
			var val = DM.get_data("positions." + pos_id + '.' + CONST.positions_attrs[i]);
			if (div && val) {
				var arr = val.split('|');
				if (arr[1]) {
					div.classNmae = addClassName(div.className, arr[1]);
				}
				div.innerText = arr[0];
			}
		}

	}
}