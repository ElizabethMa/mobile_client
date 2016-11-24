# shinny_mobile 文档

## 工程信息

config.xml

```
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.zhongqihuo" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>zhongqihuo</name>
    <description>
        期货交易软件
    </description>
    <author email="mayanqiong@shinnytech.com" href="http://zhongqijiaoyi.com">
        上海信易信息科技有限公司
    </author>
    <content src="index.html" />
    <plugin name="cordova-plugin-whitelist" spec="1" />
    <allow-navigation href="https://appficaos.cfmmc.com/*" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
    <platform name="android">
        <allow-intent href="market:*" />
    </platform>
    <platform name="ios">
        <allow-intent href="itms:*" />
        <allow-intent href="itms-apps:*" />
    </platform>
    
    <!-- 复制文件脚本 -->
    <hook src="scripts/beforeBuild.js" type="before_build" />
    <hook src="scripts/afterBuild.js" type="after_build" />

    <preference name="webviewbounce" value="false"/>
    <preference name="UIWebViewBounce" value="false"/>
    <preference name="DisallowOverscroll" value="true"/>
    <preference name="SplashScreenDelay" value="2000"/>
    <preference name="FadeSplashScreenDuration" value="2000"/>
    <preference name="android-minSdkVersion" value="16"/>
    <preference name="BackupWebStorage" value="none"/>
    <preference name="SplashScreen" value="screen"/>
    <feature name="StatusBar">
        <param name="ios-package" value="CDVStatusBar" onload="true" />
    </feature>
</widget>
```

## 安装环境

```
$ cordova -v  

// 6.4.0
```

     

```
$ cordova platform -l  

// Installed platforms:
//   android 6.0.0
// Available platforms: 
//   amazon-fireos ~3.6.3 (deprecated)
//   blackberry10 ~3.8.0
//   browser ~4.1.0
//   firefoxos ~3.6.3
//   ios ~4.3.0
//   osx ~4.0.1
//   webos ~3.7.0

```

## 插件列表

```
$ cordova plugin -l

// 本地插件
com.cordova.plugin.AnyChatPlugin 0.1.0 "ANYCHAT"
com.cordova.plugin.CertPlugin 0.1.0 "CERT"
// 远程插件
cordova-plugin-camera 2.3.0 "Camera"
cordova-plugin-compat 1.1.0 "Compat"
cordova-plugin-dialogs 1.3.0 "Notification"
cordova-plugin-statusbar 2.2.0 "StatusBar"
cordova-plugin-whitelist 1.3.0 "Whitelist"
cordova-plugin-x-toast 2.5.2 "Toast"
```

## 运行脚本

```
$ cordova prepare && cordova build android
```

## 注意

1. ionic.bundle.js 不要换成 ionic.bundle.min.js
fix blink : line#57952 改过

## 生成秘钥 

记住密码填在 build.json

```
keytool -genkey -v -keystore zhongqihuo-key.jks -keyalg RSA -keysize 2048 -validity 1000000 -alias zhongqihuo-release
```
