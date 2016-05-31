ocr scan
====

use wentong ocr library toscan ID card and return scan result

## Install

```bash
$ cordova plugin add ./hemp-wt-ocr
```

## Usage

The plugin exposes the following methods

```javascript
// Camera.PictureSourceType.PHOTOLIBRARY : 0
// Camera.PictureSourceType.CAMERA : 1
// Camera.PictureSourceType.SAVEDPHOTOALBUM : 2
hemp.plugin.ocr.wt.scan(1 , onSuccess, onError);
```

and return json object:

```

```

#### Parameters:

* __PictureSourceType:__ PHOTOLIBRARY : 0 ; CAMERA : 1 ; SAVEDPHOTOALBUM : 2
* __success:__ Optional success callback
* __error:__ Optional error callback

## Example

#### Default usage

```javascript
// Camera.PictureSourceType.PHOTOLIBRARY : 0
// Camera.PictureSourceType.CAMERA : 1
// Camera.PictureSourceType.SAVEDPHOTOALBUM : 2
hemp.plugin.ocr.wt.scan(0 ,function (content){
	console.log("scan success: " + content);
	alert(content);
}, function (error) {
	console.log("scan error: " + error);
	alert(error);
});
```

## Attention
### iOS Project
should set project build settings in Xcode

* C++ Standard Library : libc++(LLVM C++ standard library with C++11 support)
