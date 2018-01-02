### Install
```
bower install image-clipboard
```

### Paste images from clipboard to your site.


```html
<div id="box"></div>
<script type="text/javascript" src="ImageClipBoard.min.js"></script>
<script type="text/javascript">

  var clipboard = new ImageClipboard('#box', function (base64) {
    //do stuff with pasted image
  });
  
  //onpaste-callback can also be passed as second argument
  //in the constructor above.
  clipboard.onpaste = function (base64) {
    //do stuff with the pasted image
  });

  //you can also pass in single DOM-element instead of 
  //query as the first parameter.

</script>
```

Tested on the latest versions of Chrome, Firefox and Opera. Not tested on Safari.
