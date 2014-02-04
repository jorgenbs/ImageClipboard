###Paste images from clipboard to your site.

```html
<div id="box"></div>
<script type="text/javascript" src="ImageClipBoard.js"></script>
<script type="text/javascript">
  var box = new ImageClipboard('#box', callback)
    , img;

  function callback(clipboard) {
    console.log('got image!');
    img = clipboard.getImage();
  }
</script>
```

Tested on the latest versions of Chrome, Firefox and Opera. Not tested on Safari.