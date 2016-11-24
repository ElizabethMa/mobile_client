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

    // android icon & splash
    var source_res = path.join(ctx.opts.projectRoot, 'res/');
    var target_res = path.join(ctx.opts.projectRoot, 'platforms/android/');

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
            // copy android icon & splash
            copyFolderRecursiveSync(source_res, target_res);
            deferral.resolve();

        }
    });

    function copyFileSync( source, target ) {

        var targetFile = target;

        //if target is a directory a new file with the same name will be created
        if ( fs.existsSync( target ) ) {
            if ( fs.lstatSync( target ).isDirectory() ) {
                targetFile = path.join( target, path.basename( source ) );
            }
        }

        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

    function copyFolderRecursiveSync( source, target ) {

        var files = [];

        var targetFolder = path.join( target, path.basename( source ) );

        if ( !fs.existsSync( targetFolder ) ) {
            fs.mkdirSync( targetFolder );
        }

        //copy
        if ( fs.lstatSync( source ).isDirectory() ) {
            files = fs.readdirSync( source );
            files.forEach( function ( file ) {
                var curSource = path.join( source, file );
                if ( fs.lstatSync( curSource ).isDirectory() ) {
                    copyFolderRecursiveSync( curSource, targetFolder );
                } else {
                    copyFileSync( curSource, targetFolder );
                }
            } );
        }
    }
    return deferral.promise;
};