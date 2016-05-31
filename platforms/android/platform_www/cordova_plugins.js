cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/com.cordova.plugin.CertPlugin/www/Cert.js",
        "id": "com.cordova.plugin.CertPlugin.Cert",
        "pluginId": "com.cordova.plugin.CertPlugin",
        "clobbers": [
            "navigator.Cert"
        ]
    },
    {
        "file": "plugins/com.cordova.plugin.AnyChatPlugin/www/AnyChat.js",
        "id": "com.cordova.plugin.AnyChatPlugin.AnyChat",
        "pluginId": "com.cordova.plugin.AnyChatPlugin",
        "clobbers": [
            "navigator.AnyChat"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-inappbrowser": "1.1.1",
    "cordova-plugin-camera": "1.2.0",
    "com.cordova.plugin.CertPlugin": "0.1.0",
    "com.cordova.plugin.AnyChatPlugin": "0.1.0"
}
// BOTTOM OF METADATA
});