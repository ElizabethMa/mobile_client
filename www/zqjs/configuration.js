var DOMAIN = "api.shinnytech.com";

var test_https_url = "https://www.easyqh.com/http/";
var test_wss_url = "wss://www.easyqh.com/ws/";


var SETTING = {
	server_base_url: 'http://' + DOMAIN,
	sim_server_url: 'ws://' + DOMAIN + '/t/sim/front/mobile',
	act_server_url: 'ws://' + DOMAIN + '/t/act/front/mobile',

	posdetail_cellwidth: 100,
	posdetail_cellheight: 60
};
var CONST = {
	// 不包括 自选合约
	ins_type: {
		'main':'主力合约'
	},

	inslist_cols_odd_name: ["最新价", "买价", "卖价", "最高价", "成交量", "昨收盘"],
	inslist_cols_even_name: ["涨跌幅", "买量", "卖量", "最低价", "持仓量", "今开盘"],
	inslist_cols_odd: ['last_price', 'bid_price1', 'ask_price1', 'highest', 'volume', 'pre_close'],
	inslist_cols_even: ['updown_percent', 'bid_volume1', 'ask_volume1', 'lowest', 'open_interest', 'open'],


	// 账户持仓d
	positions_account: ['balance','using','available','risk_ratio','position_volume','float_profit'],
	positions_attrs: ['last_price','volume','float_profit','open_price','pending_open_volume','frozen_volume','margin'],
//	positions_attrs: [
//		{id:'position_id', name: '持仓代码'},
//		{id:'instrument_id', name: '合约代码'},
//		{id:'direction', name: '方向', enum: ['SELL','BUY']},
//		{id:'float_profit', name: '盈亏'},
//		{id:'frozen_volume', name: '平未成'},
//		{id:'last_price', name: '最新价'},
//		{id:'margin', name: '占用资金'},
//		{id:'open_price', name: '成本'},
//		{id:'pending_open_volume', name: '开未成'},
//		{id:'volume', name: '手数'}
//	],

	// 持仓详情
	pos_detail: ['float_profit','volume', 'direction'],
//	pos_detail: ['position_id','direction','float_profit','open_price','volume'],
	pos_detail_quote: ['ask_price1','bid_price1','ask_volume1','bid_volume1','last_price','updown_percent','updown','highest','lowest','lower_limit','upper_limit','open','close','volume','open_interest','pre_close','average'],
	pos_orders_attrs: [
		{id:'order_code', name: '挂单代码'}, // session_id + '!' + order_id
		{id:'order_id', name: '挂单代码'},
		{id:'session_id', name: '挂单代码'},
		{id:'direction', name: '方向', enum: ['SELL','BUY']},
		{id:'offset', name: '操作', enum: ['OPEN','CLOSE','CLOSETODAY'] }, // 开仓 平仓
		{id:'price_type', name: '价格类型', enum: ['MARKET','LIMIT']},
		{id:'price', name: '价格'},
		{id:'volume_left', name: '未成交手数'}
	],
	pos_others: [
		{id:'position_id', name: '持仓代码'},
		{id:'direction', name: '方向', enum: ['SELL','BUY']},
		{id:'float_profit', name: '盈亏'},
		{id:'volume', name: '手数'}
	]
};

var DIVISIONS = {};
