cordova.define("com.cordova.plugin.CertPlugin.Cert", function(require, exports, module) { var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var certExport = {};

certExport.getCsr = function(successCallback, errorCallback, options) {
    argscheck.checkArgs('fFO', 'CertPlugin.getCsr', arguments);
    options = options || {};

    var pwd = argscheck.getValue(options.pwd, "123456");

    var args = [pwd];
    exec(successCallback, errorCallback, "CertPlugin", "getCsr", args);
};

certExport.sign = function(successCallback, errorCallback, options) {
    argscheck.checkArgs('fFO', 'CertPlugin.sign', arguments);
    options = options || {};

    var sn = argscheck.getValue(options.sn, "");
    var cert = argscheck.getValue(options.cert, "");
    var text = argscheck.getValue(options.text, "");

    var args = [sn, cert, text];
    exec(successCallback, errorCallback, "CertPlugin", "sign", args);
};



module.exports = certExport;


});
