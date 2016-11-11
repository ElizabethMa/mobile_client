/**
 *  DIVISIONS
 */

function draw_page_quote() {
	if (DM.get_data("state.page") == "quotes" ) {
		if(!DM.get_data('state.ins_type')){
			return;
		}

		console.log("draw_page_quote start");

		var ins_type = DM.get_data('state.ins_type').toLowerCase();
		var container = document.querySelector('.inslist_type_' + ins_type + ' table.qt tbody');
		var container_qt_c = document.querySelector('.inslist_type_' + ins_type + ' .qt_cwrapper' + ' tbody');

		if (container) {
			container.innerHTML = '';
			container_qt_c.innerHTML = '';
		}

		var ins_str = DM.get_data("main_ins_list");
		if(ins_type == 'custom'){
			ins_str = DM.get_data("custom_ins_list");
		}

//		var quotes = DM.get_data("quotes");  // 不一定需要

		if (ins_str) {
			var ins_list = ins_str.split(',');
			console.log("quote getlist: " + ins_str);
			if (container) {
				var quotes_showed = container.querySelectorAll('tr');

				for (var i = 0; i < ins_list.length; i++) {
					if (container.querySelectorAll('.' + ins_list[i]).length == 0){
						DM.run(function (insid) {
							return function () {
								draw_page_quote_line(insid)
							};
						}(ins_list[i]));
					}

					DM.run(function (insid) {
						return function () {
							draw_page_quote_detail(insid)
						};
					}(ins_list[i]));
				}
			}
		}

	}
}

function draw_page_quote_line(insid) {
	var ins_type = DM.get_data('state.ins_type').toLowerCase();
	var insid_name = DM.get_data("quotes." + insid + '.instrument_name');
	var container = document.querySelector('.inslist_type_' + ins_type + ' table.qt tbody');
	var container_qt_c = document.querySelector('.inslist_type_' + ins_type + ' .qt_cwrapper' +
		' tbody');
	if (container.querySelectorAll('tr.' + insid).length === 0) {
		// need paint the tr - .insid = quotes_keys[i]
		var tr_odd = document.createElement('tr'),
			tr_even = document.createElement('tr');
		tr_odd.className = 'odd ' + insid;
		tr_even.className = 'even ' + insid;
		tr_odd.addEventListener('click', function () {
			// TODO 判断路由 跳转页面
			if(DM.get_data('account_id') == ''){
				location.href = "#/app/posdetail/" + insid + '/new';
			}else {
				var pos_list = DM.get_data('quotes.'+insid+'.pos_list');
				if(pos_list){
					var pos_id = pos_list.split(',')[0];
					location.href = "#/app/posdetail/" + insid + '/' + pos_id;
				}else{
					location.href = "#/app/posdetail/" + insid + '/new';
				}
			}
		});
		tr_even.addEventListener('click', function () {
			// TODO 判断路由 跳转页面
			if(DM.get_data('account_id') == ''){
				location.href = "#/app/posdetail/" + insid + '/new';
			}else {
				var pos_list = DM.get_data('quotes.'+insid+'.pos_list');
				if(pos_list){
					var pos_id = pos_list.split(',')[0];
					location.href = "#/app/posdetail/" + insid + '/' + pos_id;
				}else{
					location.href = "#/app/posdetail/" + insid + '/new';
				}
			}

		});
		var temp = "<td>" + insid + "</td>";
		for (var i = 0; i < CONST.inslist_cols_odd.length; i++) {
			temp += "<td class='" + insid + "_" + CONST.inslist_cols_odd[i] + "'></td>"
		}
		tr_odd.innerHTML = temp;
		temp = "<td>" + insid_name + "</td>";
		for (var i = 0; i < CONST.inslist_cols_even.length; i++) {
			temp += "<td class='" + insid + "_" + CONST.inslist_cols_even[i] + "'></td>"
		}
		tr_even.innerHTML = temp;
		container.appendChild(tr_odd);
		container.appendChild(tr_even);

		var qt_c_tr_odd = document.createElement('tr'),
			qt_c_tr_even = document.createElement('tr');
		qt_c_tr_odd.className = 'odd ' + insid;
		qt_c_tr_even.className = 'even ' + insid;
		qt_c_tr_odd.addEventListener('click', function () {
			// TODO
			if(DM.get_data('account_id') == ''){
				location.href = "#/app/posdetail/" + insid + '/new';
			}else {
				var pos_list = DM.get_data('quotes.'+insid+'.pos_list');
				if(pos_list){
					var pos_id = pos_list.split(',')[0];
					location.href = "#/app/posdetail/" + insid + '/' + pos_id;
				}else{
					location.href = "#/app/posdetail/" + insid + '/new';
				}
			}
		});
		qt_c_tr_even.addEventListener('click', function () {
			// TODO
			if(DM.get_data('account_id') == ''){
				location.href = "#/app/posdetail/" + insid + '/new';
			}else {
				var pos_list = DM.get_data('quotes.'+insid+'.pos_list');
				if(pos_list){
					var pos_id = pos_list.split(',')[0];
					location.href = "#/app/posdetail/" + insid + '/' + pos_id;
				}else{
					location.href = "#/app/posdetail/" + insid + '/new';
				}
			}
		});
		qt_c_tr_odd.innerHTML = "<td>" + insid + "</td>";
		qt_c_tr_even.innerHTML = "<td>" + insid_name + "</td>";
		container_qt_c.appendChild(qt_c_tr_odd);
		container_qt_c.appendChild(qt_c_tr_even);
	}// 画合约行
}

function draw_page_quote_detail(insid) {
	var ins_type = DM.get_data('state.ins_type').toLowerCase();

	var quote = DM.get_data("quotes." + insid);
	var keys = CONST.inslist_cols_odd.concat(CONST.inslist_cols_even);

	for (var i = 0; i < keys.length; i++) {
		var div = document.querySelector('.inslist_type_' + ins_type + ' table.qt tbody .' + insid + '_' + keys[i]);
//		var div = document.getElementById(insid + '_' + keys[i]);
		if (div) {
			var val = quote[keys[i]] == undefined ? '' : quote[keys[i]];
			var arr = val.split('|');
			if(arr[1]){
				div.className = addClassName(div.className, arr[1]);
			}
			div.innerText = arr[0];
		}
	}
}

