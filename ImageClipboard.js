/*jshint boss:true, laxcomma: true*/

!function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition
    else if (typeof define == 'function' && define.amd) define(name, definition)
    else this[name] = definition
}('ImageClipboard', function (selector) {
  /*
    based on
    http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/  
  */

  var instance;

  function init(selector, callback) {
    this.prototype.el = document.querySelector(selector)
    this.prototype.pasteCatcher = null
    this.prototype.clipImage = null;

    var callback = callback || null;

    function pasteHandler (e) {
      var items;

      if (e.clipboardData && e.clipboardData.items) {
        items = e.clipboardData.items;
        
        if (items) {
          items = Array.prototype.filter.call(items, function (element) {
            return element.type.indexOf("image") >= 0;
          });

          Array.prototype.forEach.call(items, function (item) {
            var blob = item.getAsFile();
            var urlObj = window.URL || window.webkitURL;
            var source = urlObj.createObjectURL(blob);

            loadImage(source);
          });
        }
      }
      else if (pasteCatcher) {
        //no direct access to clipboardData (firefox)
        //use the pastecatcher
        setTimeout(function () {
        
          var child = pasteCatcher.firstElementChild;

          if (child && child.tagName == "IMG") {
            loadImage(child.src);
          }

        }, 5); 
      }
    }

    function loadImage (source) {
      var img = new Image();
      this.prototype.el.innerHTML = "";

      img.onload = function () {
        //got picture, display it
        var imgContainer = document.createElement("img");
        imgContainer.src = img.src;
        imgContainer.style.maxHeight = "100%";
        imgContainer.style.maxHeight = "100%";
        this.prototype.el.appendChild(imgContainer);

        //empty out the ol' pastecatcher
        if (pasteCatcher) pasteCatcher.innerHTML = "";

        this.prototype.clipImage = img; 
      };

      img.src = src;
    }

    function getBase64 (img) {
      if (img !== null) {
        if (img.src.indexOf("blob://") !== -1) return img.src;

        //convert blob to base64
        var fr = new FileReader();
        fr.onload = function (event) {
          return event.target.result;
        }
        fr.readAsDataURL(img.src);
      }
    }

    return {
      getBase64: getBase64,
    }
  }  

  return instance || (instance = init(selector));
});