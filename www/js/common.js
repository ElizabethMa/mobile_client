//常量JS
var MESSAGE_TIMEOUT = "网络或服务异常，请检查手机网络情况后重试！";
var MESSAGE_INITFAIL = "初始化失败，请注销后重新登陆再试！";
var MESSAGE_INITUN = "初始化未完成，请稍后再试！";
var MESSAGE_LOGIN_ERROR = "系统登录出错，请稍后重试";
// //////////////////////////////////////////////////////////////////

var CERT = {};
var APP_video = {};
var APP_cert = {};
var mobileNo = "";

function CRHloadPage(url) {
	khApp.showIndicator();
	$$.ajax({
		timeout: 15000,
		type : "POST",
		data : null,
		async : true,
		url : url + "?rnd=" + new Date().getTime(),
		ontimeout:function(){
			khApp.hideIndicator();
			khApp.closeModal();
			khApp.hidePreloader();
			khApp.alert(MESSAGE_TIMEOUT);
		},
		success : function(data) {
			khApp.hideIndicator();
			khApp.closeModal();
			khApp.hidePreloader();
			mainView.loadContent(data);
		},
		error : function(xhr) {
			if(xhr.status == '0'){
				khApp.hideIndicator();
				khApp.closeModal();
				khApp.hidePreloader();
				khApp.alert(MESSAGE_TIMEOUT);
			}else{
				khApp.hideIndicator();
				khApp.closeModal();
				khApp.hidePreloader();
				khApp.alert('出现错误，请稍后再试');
			}
			
		},
	});
}

//
function CRHloadPageWithPar(url,nextPath) {
	khApp.showIndicator();
	$$.ajax({
		timeout: 15000,
		method : "POST",
		data : null,
		async : true,
		url : url +"?next="+nextPath+"&rnd=" + new Date().getTime(),
		timeout: 15000,
		ontimeout:function(){
			khApp.hideIndicator();
			khApp.closeModal();
			khApp.hidePreloader();
			khApp.alert(MESSAGE_TIMEOUT);
		},
		success : function(data) {
			khApp.hideIndicator();
			khApp.closeModal();
			khApp.hidePreloader();
			mainView.loadContent(data);
		},
		error : function(xhr) {
			if(xhr.status == '0'){
				khApp.hideIndicator();
				khApp.closeModal();
				khApp.hidePreloader();
				khApp.alert(MESSAGE_TIMEOUT);
			}else{
				khApp.hideIndicator();
				khApp.closeModal();
				khApp.hidePreloader();
				khApp.alert('出现错误，请稍后再试');
			}
		}
	});
}
// 判断浏览器
var browser = {
	versions : function() {
		var u = navigator.userAgent, app = navigator.appVersion;
		return { // 移动终端浏览器版本信息
			trident : u.indexOf('Trident') > -1, // IE内核
			presto : u.indexOf('Presto') > -1, // opera内核
			webKit : u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
			gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
			mobile : !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
			ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
			android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
			iPhone : u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
			iPad : u.indexOf('iPad') > -1, // 是否iPad
			webApp : u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
			YiXin : u.indexOf('YiXin') > -1, // 是否YiXin手机开户
			WeiXin : u.indexOf('MicroMessenger') > -1, // 是否微信手机开户
			Chrome : u.indexOf('Chrome') > -1
		// Chrome浏览器
		};
	}(),
	language : (navigator.browserLanguage || navigator.language).toLowerCase()
}
// 证书相关操作JS
// 证书操作域对象
/*******************************************************************************
 * 保存密码
 * 
 * @param {Object}
 *            p1
 */
CERT.savePass = function(p1) {
	if (browser.versions.YiXin) {
		YixinJSBridge.invoke("genCSR", {
			"certType" : 3,
			"clientId" : USER.mobile
		}, function(result) {
			if (result.resultCode == 1) {
				APP_cert.setPassCallBack(0, result.csrStr);
			} else {
				APP_cert.setPassCallBack(-1, "");
			}
		}, null);
		return;
	}
	if (browser.versions.ios) { // iphone
		// window.location.href = "objc://callIOSCertPass/?" + p1;
		// var getCsr = function () {
		//     console.log("===== getCsr start =====");
		//     // 生成 privateKey & publicKey
		//     var rsa = forge.pki.rsa;
		//     var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
		//     var pemPrivateKey = forge.pki.privateKeyToPem(keypair.privateKey);
		//     localStorage.pemPrivateKey = pemPrivateKey;
		    
		//     var csr = forge.pki.createCertificationRequest();
		//     csr.publicKey = keypair.publicKey;
		//     csr.sign(keypair.privateKey);
		//     var pem = forge.pki.certificationRequestToPem(csr);
		//     var rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
		//     var match = rMessage.exec(pem);
		//     return match[3];
		// };
		// APP_cert.setPassCallBack(0, getCsr());
	} else if (browser.versions.android) {
		// jtoJHandle.callFunctionCertPass(p1);
		var onSucess = function(s){
            console.log('success : ' + s.resultMsg);
            APP_cert.setPassCallBack(s.resultCode, s.resultMsg);
        };
        var onFail = function(msg){
            console.log('error : ' + msg);
            APP_cert.setPassCallBack(-1, "");
        };
        var options = {pwd:p1};
        navigator.Cert.getCsr(onSucess, onFail, options);
	} else {
	}
}

/*******************************************************************************
 * 保存证书
 * 
 * @param {Object}
 *            sn
 * @param {Object}
 *            cert
 */
CERT.saveCert = function(sn, cert) {
	if (browser.versions.YiXin) {
		YixinJSBridge.invoke("installCert", {
			"certType" : 3,
			"certSN" : sn,
			"clientId" : USER.mobile,
			"certChain" : cert
		}, function(result) {
			if (result.resultCode == 1) {
				APP_cert.downInstalCertCallBack(0);
			} else {
			}
		});
		return;
	}
	if (browser.versions.ios) { // iphone
		// window.location.href = "objc://callIOSSaveCert/?" + sn + "?" + cert;
		window.localStorage.sn = sn;
		window.localStorage.cert = cert;
		console.log("localStorage.sn : " + window.localStorage.sn);
		console.log("localStorage.cert : " + window.localStorage.cert);
		APP_cert.downInstalCertCallBack(0);
	} else {
//		jtoJHandle.callFunctionCertSaveCert(sn, cert);
		window.localStorage.sn = sn;
		window.localStorage.cert = cert;
		console.log("localStorage.sn : " + window.localStorage.sn);
		console.log("localStorage.cert : " + window.localStorage.cert);
		APP_cert.downInstalCertCallBack(0);
	}
}
// 私钥签名
/*******************************************************************************
 * 私钥签名 注意：此方法目前为异步方法， 调用此方法需要实现此方法的回调方法：APP.certSignCallBack(errorNo,
 * errorInfo, signValue) 回调方法的参数为签名值
 * 
 * @param {Object}
 *            pass
 * @param {Object}
 *            text
 */
CERT.sign = function(sn, text, callback) {
	if (browser.versions.YiXin) {
		YixinJSBridge.invoke("signData", {
			"certType" : 3,
			"certSN" : sn,
			"clientId" : USER.mobile,
			"sourceData" : text,
			agreementNo : "1"
		}, function(result) {
			if (result.resultCode == 1) {
				setTimeout(function() {
					eval(callback + "(0, '', '" + result.signStr + "')");
				}, 200);
			} else {
				eval(callback + "(-2, '', '')");
			}
		}, null);
		return;
	}
	if (!callback) {
		callback == "";
	}
	if (browser.versions.ios) { // iphone
		// window.location.href = "objc://callIOSSign/?" + sn + "?" + text + "?"
		// 		+ callback;
		console.log("ios callback error");

	} else if (browser.versions.android) {
		// jtoJHandle.callFunctionCertSign(sn, text, callback);
		var onSucess = function(s){
            console.log('success : ' + s.signStr);
            APP_protocol.certSignCallBack(0, '', s.signStr);
        };

        var onFail = function(msg){
            console.log('error : ' + msg);
            APP_protocol.certSignCallBack(-2, '', '');
        };

        var options = {
        	sn : sn, 
        	cert : window.localStorage.cert, 
        	text : text
        };

        navigator.Cert.sign(onSucess, onFail, options);
	} else {
		eval(callback + "(0, '', '')");
	}
}

/*******************************************************************************
 * 检测本地SN码
 * 
 * @param {Object}
 *            sn
 * @param {Object}
 *            callback
 */
CERT.verifyLocalSn = function(sn) {
	if (browser.versions.YiXin) {
		YixinJSBridge.invoke("isCertExist", {
			"certType" : 3,
			"certSN" : sn,
			"clientId" : USER.mobile
		}, function(result) {
			if (result.resultCode == 1) {
				CERT.checkLocalSnCallBack(sn);
			} else {
				CERT.checkLocalSnCallBack(-10);
			}
		}, null);
		return;
	}
	if (browser.versions.ios) { // iphone
		// window.location.href = "objc://callIOSCheckLocalSn/?" + sn;
		if(sn == localStorage.sn){
			console.log("CERT.checkLocalSnCallBack true" );
		}else{
			console.log("CERT.checkLocalSnCallBack false" );
		}
	} else {
		// jtoJHandle.checkLocalSn(sn, "CERT.checkLocalSnCallBack");
		if(sn == localStorage.sn){
			console.log("CERT.checkLocalSnCallBack true" );
		}else{
			console.log("CERT.checkLocalSnCallBack false" );
		}
	}
}

// 获得版本号
function getAppVersion() {
	if (browser.versions.android) { // android手机
		setTimeout(function() {
			jtoJHandle.checkAppVersion("checkVersion");
		}, 1000);
	} else if (browser.versions.ios) { // iphone手机
		setTimeout(function() {
			window.location.href = "objc://getVersionCode/?checkVersion";
		}, 4000);
	} else {
		return;
	}
}

function getAppVersionCallback(clientId, versionCode) {
	appParams.version = versionCode;
}

// 检查版本
function checkVersion(clientId, versionCode) {
	// 易信属于网页面版本，只需要更新后台服务
	if (browser.versions.YiXin) {
		return;
	}
	appParams.version = versionCode;
	if($$('#version').length != 0){
		$$('#version').html("<p class='title' style='text-align:center'>Version:"+versionCode+"</p>");		
	}
	$$.ajax({
				timeout:15000,
				url : '/checkVersion.do?rnd=' + new Date().getTime(),
				type : 'POST',
				data : {
					"clientId" : clientId,
					"versionCode" : versionCode
				},
				ontimeout:function(){
					khApp.alert(MESSAGE_TIMEOUT);
				},
				success : function(data) {
					data = JSON.parse(data);
					if (data.errorNo === 0) {
						if (data.versionStatus == "1") { // 提示更新
							if(clientId=="3"){	
								khApp.modal({
									title : "温馨提示",
									text : "版本已滞后，请升级后使用！",
									buttons : [ {
										text : "关闭",
										onClick : function() {
											window.jtoJHandle.closeSJKH();
										}
									} ]
								});
							}else{
							alertDialog({
								title : "温馨提示",
								text : "发现更新版本，建议更新后使用",
								btnText1 : "更新",
								action1 : function() {
									if (browser.versions.ios) { // iphone
										window.location.href = "objc://updateApp/$?"
												+ data.downloadUrl;
									} else {
										window.jtoJHandle.updateApp('1',
												data.downloadUrl);
									}
								},
								btnText2 : "取消",
								action2 : function() {
								}
							});
							}
						} else if (data.versionStatus == "2") { // 强制更新
							if (browser.versions.ios) { // iphone
								khApp
										.modal({
											title : "温馨提示",
											text : "发现更新版本，请更新后使用",
											buttons : [ {
												text : "更新",
												onClick : function() {
													window.location.href = "objc://updateApp/$?"
															+ data.downloadUrl;
												}
											} ]
										});
							} else {
								if(clientId=="3"){	
									khApp.modal({
										title : "温馨提示",
										text : "版本已滞后，请升级后使用！",
										buttons : [ {
											text : "关闭",
											onClick : function() {
												window.jtoJHandle.closeSJKH();
											}
										} ]
									});
								}else{
								alertDialog({
									title : "温馨提示",
									text : "发现更新版本，请更新后使用",
									btnText1 : "更新",
									action1 : function() {
										window.jtoJHandle.updateApp('2',
												data.downloadUrl);
									},
									btnText2 : "关闭",
									action2 : function() {
										window.jtoJHandle.closeSJKH();
									}
								});
								}
							}
						}
					} else {

					}
				},
				error : function(xhr) {
					if(xhr.status == '0'){
						khApp.alert(MESSAGE_TIMEOUT);
					}else{
						khApp.alert('出现错误，请稍后再试');
					}
				},
			});
}
function alertDialogOneButton(dialog) {
	khApp.modal({
		title : dialog["title"],
		text : dialog["text"],
		buttons : [ {
			text : dialog["btnText1"],
			onClick : function() {
				dialog.action1();
			}
		} ]
	});
}
function alertDialog(dialog) {
	khApp.modal({
		title : dialog["title"],
		text : dialog["text"],
		buttons : [ {
			text : dialog["btnText1"],
			onClick : function() {
				dialog.action1();
			}
		}, {
			text : dialog["btnText2"],
			onClick : function() {
				dialog.action2();
			}
		} ]
	});
}

/**
 * 验证密码
 * 
 * @param {Object}
 *            field
 * @return {TypeName}
 */
function devValidatePwd(pwd) {
	if (/^\d{6}$/.test(pwd)) {

		var pass123456 = "01234567890";
		var pass654321 = "9876543210";
		if (pass123456.indexOf(pwd) >= 0) {
			return "密码不能为连续的数字，如123456";
		}

		if (pass654321.indexOf(pwd) >= 0) {
			return "密码不能为连续的数字，如654321";
		}

		var sub5_1 = pwd.substring(0, 4);
		var n6 = parseInt(sub5_1, 10);

		var sub5_2 = pwd.substring(1, 5);
		var n7 = parseInt(sub5_2, 10);

		var sub5_3 = pwd.substring(2, 6);
		var n8 = parseInt(sub5_3, 10);
		if (n6 % 1111 == 0 || n7 % 1111 == 0 || n8 % 1111 == 0) {
			return "相同数字不得连续出现4次，如11112";
		}

		var sub3 = pwd.substring(0, 3);
		var _sub3 = pwd.replace(new RegExp(sub3, "gm"), "");
		if (_sub3 == '' || _sub3.length == 0) {
			return "密码不能过于简单，如123123";
		}

		var sub2 = pwd.substring(0, 2);
		var _sub2 = pwd.replace(new RegExp(sub2, "gm"), "");
		if (_sub2 == '' || _sub2.length == 0) {
			return "密码不能过于简单，如121212";
		}

		var sub2_1 = pwd.substring(0, 2);
		var sub2_2 = pwd.substring(2, 4);
		var sub2_3 = pwd.substring(4, 6);
		var n1 = parseInt(sub2_1, 10);
		var n2 = parseInt(sub2_2, 10);
		var n3 = parseInt(sub2_3, 10);

		if (n1 % 11 == 0 && n2 % 11 == 0 && n3 % 11 == 0) {
			return "密码不能过于简单，如112233";
		}

		var sub3_1 = pwd.substring(0, 3);
		var sub3_2 = pwd.substring(3, 6);
		var n4 = parseInt(sub3_1, 10);
		var n5 = parseInt(sub3_2, 10);

		if (n4 % 111 == 0 && n5 % 111 == 0) {
			return "密码不能过于简单，如111222";
		}

		return "success";
	} else {
		return "密码为6位数字";
	}
}
function getRegistMobileNo() {
	// 易信跳出
	if (browser.versions.YiXin) {
		return;
	}
	if (browser.versions.Chrome) {
		return;
	}
	if (browser.versions.ios) { // iphone
		window.location.href = "objc://callIOSGetRegistMobileNo/";
	} else {
		jtoJHandle.getRegistMobileNo();
	}
}
function getRegistMobileNoCallback(errorNo_, mobile, channel) {
	if (channel != null && channel != "" && channel != "null") {
		$$.ajax({
			url : "/saveChannel.do?rnd=" + new Date().getTime(),
			type : "POST",
			data : {
				"channel" : channel
			},
			success : function(data) {
			}
		})
	}
	if (errorNo_ == 0) {// 有手机号
		mobileNo = mobile;
	} else {// 没有手机号
		mobileNo = "";
	}
}

// 退出
function closeSJKH() {
	alertDialog({
		title : "温馨提示",
		text : "确认退出吗",
		btnText1 : "退出",
		action1 : function() {
			if (browser.versions.WeiXin) {
				wx.closeWindow();
				return;
			}
			if (browser.versions.YiXin) {
				window.location.href = "/indexnew";
				return;
			}
			if (browser.versions.android) {
				window.jtoJHandle.closeSJKH();
				return;
			}
			if (browser.versions.ios) { // iphone
				$$.ajax({
					url : "/quitKh.do?rnd=" + new Date().getTime(),
					type : "POST",
					data : {
						"brokerId" : brokerId
					},
					success : function(data) {
						window.location.href = "objc://callIOSOut";
					}
				})
				
			} else if (!isTlephone() && browser.versions.Chrome) {
				window.location.href = "/indexnew";
			}
		},
		btnText2 : "取消",
		action2 : function() {
		}
	});

}

function isTlephone() {
	try {
		if (jtoJHandle == null || jtoJHandle == undefined) {
			return false;
		}
	} catch (e) {
		return false;
	}
	return true;
}

function isEmail(str) { // 是否为邮箱
	var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	return reg.test(str);
}

function isTelephone(str) { // 是否为联系电话
	var reg1 = /^[1][34578]\d{9}$/;
	var reg2 = /^(0(10|2[1-3]|[3-9]\d{2}))?(-|\s)?[1-9]\d{6,7}$/;
	return reg1.test(str) || reg2.test(str);
}
function isQQ(str) {
	var reg = /^[1-9][0-9]{4,}$/;
	return reg.test(str);
}
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
function isCardNo(card) {
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	return (reg.test(card));
}
// 邮政编码
function isPostCode(postCode) {
	var reg = /^[0-9]{6}$/;
	return (reg.test(postCode))
}
function isNull(val) {
	if (val) {
		if (typeof (val) == "string" && val == "null") {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

function isBlank(val) {
	var nullFlag = isNull(val);
	if (nullFlag) {
		return true;
	} else {
		return new String(val).trim() == "";
	}
}
/*
 * 参数设置 传name时用 name ,传class时用 .class,传id时用 #id
 */
function isSelected(selector) {
	var flag = selector.substr(0, 1);// . # 空
	var method = flag == '.' ? 'getElementsByClassName'
			: (flag == '#' ? 'getElementById' : 'getElementsByName');
	var dex = (flag != '.') && (flag != '#') ? '0' : '1';
	var isArr = flag == "#" ? false : true;
	var tag = '';
	if (isArr) {
		tag = document[method](selector.substr(dex))[0];
	} else {
		tag = document[method](selector.substr(dex));
	}
	return (!isBlank(tag.value));
}
/* 判断输入的字符是否为英文字母 */
function isLetter(str) {
	var reg = /^[a-zA-Z]+$/;
	return (reg.test(str))
}
/* 判断输入的字符是否为英文字母 */
function isLetter(str) {
	var reg = /^[a-zA-Z]+$/;
	return (reg.test(str))
}
// 数字
function isNumber(str) {
	var reg = /[^d]/;
	return (reg.test(str))
}
// 数字与字符
function isCharNumber(str) {
	var reg = /[^W]/g;
	return (reg.test(str))
}
// 判断输入的字符是否为中文
function isChinese(str) {
	var reg = /^[\u4E00-\u9FA5]/;
	return (reg.test(str));
}
// 用户名是否只由汉字、字母、数字
function isUserName(str) {
	//var reg = /^[0-9a-za-z\u4e00-\u9fa5]+$/;
	var reg = /^[\u4e00-\u9fa5]+·?[\u4e00-\u9fa5]+$/;
	return (reg.test(str));
}
// 扫描二维码登陆
function QRCodeLogin(decoderContent){
	var arr = new Array();
	arr = decoderContent.split("&");
	var channel = "";
	var brokerId = "";
	if(arr.length > 1){
		var channel_arr = new Array();
		channel_arr = arr[0].split("=");
		if(channel_arr.length > 1){
			channel = channel_arr[1];
		}else{
			khApp.alert('二维码识别有误！');
			return;
		}
		var brokerId_arr = new Array();
		brokerId_arr = arr[1].split("=");
		if(brokerId_arr.length > 1){
			brokerId = brokerId_arr[1];
		}else{
			khApp.alert('二维码识别有误！');
			return;
		}
	}else{
		khApp.alert('二维码识别有误！');
		return;
	}
	brokerId = $$.trim(brokerId);
	if (brokerId.length == 0) {
		khApp.alert('二维码识别有误！');
		return;
	}
	khApp.showIndicator();
	$$.ajax({
		url: '/validateBrokerId.do?rnd=' + new Date().getTime(),
		method: "POST",
		timeout:15000,
		async:true, 
		data:  {brokerId: brokerId}, 
		success: function(data){
			khApp.hideIndicator();
			var data = JSON.parse(data);
			if(data.errorNo == 0){
				//下一步加载登录页面时,关闭切换期货公司提示框 
   				window.location.href ='indexnew?brokerId=' + data.brokerId+"&openType="+appParams.chosenType+"&checkBrokerIdFlag=false&channel="+channel;
			} else {
				khApp.alert("二维码识别有误！无此期货公司,请重新扫描二维码！"); 
			}
   		},
   		error: function(xhr){
   			if(xhr.status == '0'){
				khApp.hideIndicator();
				khApp.closeModal();
				khApp.hidePreloader();
				khApp.alert(MESSAGE_TIMEOUT);
			}else{
				khApp.hideIndicator();
				khApp.closeModal();
				khApp.hidePreloader();
				khApp.alert('出现错误，请稍后再试');
			}
		},
   		ontimeout: function(){
   			khApp.hideIndicator();
   			khApp.alert(MESSAGE_TIMEOUT); 
		}
	});	
}

/******************************************************************
* 获取手机型号及版本
*/
function getInfo(){
	return;
	if (browser.versions.ios){
		window.location.href = "objc://getIphoneInfo";
	 }else if(browser.versions.android){
		 jtoJHandle.getSysInfo();
	 }else{
		 return;
	 }
}
         
function IOSGetSysInfo(s,y){//ios回调
	//手机型号
	phoneType = y;
	//手机系统版本
	phoneVersion = s;
	
}
function getSysInfo(s){//android回调
	var arr = new Array();
	arr = s.split(",");
	//手机型号
	phoneType = arr[0];
	//手机系统版本
	phoneVersion= arr[1];
}
