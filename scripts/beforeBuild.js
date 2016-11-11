/**
 * Created by yanqiong on 11/9/16.
 */
module.exports = function(ctx) {
    // make sure android platform is part of build
    if (ctx.opts.platforms.indexOf('android') < 0) {
        // return;
    }
    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        deferral = ctx.requireCordovaModule('q').defer();

    // android
    var sourceFile = path.join(ctx.opts.projectRoot, 'scripts/SystemWebViewClient.java');
    var targetFile = path.join(ctx.opts.projectRoot, 'platforms/android/CordovaLib/src/org/apache/cordova/engine/SystemWebViewClient.java');

    fs.stat( sourceFile, function( err, st ){
        if (err) {
            deferral.reject('copy file error');
        } else {
            // 创建读取流
            readable = fs.createReadStream( sourceFile );
            // 创建写入流
            writable = fs.createWriteStream( targetFile );
            // 通过管道来传输流
            readable.pipe( writable );
            deferral.resolve();
        }
    });

    return deferral.promise;
};