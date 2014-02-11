/*jshint boss:true, laxcomma: true*/

!function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition
    else if (typeof define == 'function' && define.amd) define(name, definition)
    else this[name] = definition
}('ImageClipboard', function (selector, callback) {
  'use strict';
  /*
    based on
    http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/  
  */

  var self = {};
  self.el = null;
  self.pasteCatcher = null;
  self.clipImage = null;
  self.callback = null;
  self.onpaste = null;
  
  self.init = function(selector, callback) {
    self.el = document.querySelector(selector)
    self.pasteCatcher = null
    self.clipImage = null;

    self.callback = typeof callback === 'function' ? callback : function(){};

    //pasting not supported, make pastecatcher
    if (!window.Clipboard) {
      pasteCatcher = _makePasteCatcher();
    }

    window.addEventListener('paste', _pasteHandler);

    function _pasteHandler(e) {
      var items;

      if (e.clipboardData && e.clipboardData.items) {
        items = e.clipboardData.items;
        
        if (items) {
          items = Array.prototype.filter.call(items, function (element) {
            return element.type.indexOf("image") >= 0;
          });

          Array.prototype.forEach.call(items, function (item) {
            var blob = item.getAsFile();

            var rdr = new FileReader();
            rdr.onloadend = function () {
              _loadImage(rdr.result);
            }
            rdr.readAsDataURL(blob);
          });
        }
      }
      else if (self.pasteCatcher) {
        //no direct access to clipboardData (firefox)
        //use the pastecatcher
        setTimeout(function () {
        
          var child = self.pasteCatcher.firstElementChild;

          if (child && child.tagName == "IMG") {
            _loadImage(child.src);
          }

        }, 5); 
      }
    }

    function _makePasteCatcher() {
      var pasteBox = document.createElement("div");

      pasteBox.setAttribute("id", "paste_catcher");
      pasteBox.setAttribute("contenteditable", "");
      pasteBox.style.opacity = 0;
      
      document.body.appendChild(pasteBox);

      pasteBox.focus();
      document.addEventListener("click", function() { pasteBox.focus(); });

      return pasteBox;
    }

    function _loadImage(source) {
      var img = new Image();
      self.el.innerHTML = "";

      img.onload = function () {
        //got picture, display it
        var imgContainer = document.createElement("img");
        imgContainer.src = img.src;
        imgContainer.style.maxHeight = "100%";
        imgContainer.style.maxHeight = "100%";
        self.el.appendChild(imgContainer);

        //empty out the ol' pastecatcher
        if (self.pasteCatcher) self.pasteCatcher.innerHTML = "";

        self.clipImage = img; 

        if (typeof self.onpaste === 'function') 
          self.onpaste(img);
      };

      img.src = source;

      var ret = source.split(",");
      callback(ret[1], ret[2]); //callback(base64, file-type)
    }

    return self;
  }

  return self.init(selector, callback);
});