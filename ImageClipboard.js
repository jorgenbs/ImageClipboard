window.ImageClipboard = function (selector, callback) {
  //based on 
  //http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/

  var el = document.querySelector(selector)
    , pasteCatcher
    , clipImage
    , self = this;
  
  //pasting not supported, make pastecatcher
  if (!window.Clipboard) {
    pasteCatcher = _makePasteCatcher();
  }

  window.addEventListener('paste', pasteHandler);

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
  };

  var loadImage = function (src) {
    var img = new Image();
    el.innerHTML = "";

    img.onload = function () {
      //got picture, embed it
      var imgContainer = document.createElement("img");
      imgContainer.src = img.src;
      imgContainer.style.maxHeight = "100%";
      imgContainer.style.maxHeight = "100%";
      el.appendChild(imgContainer);

      if (pasteCatcher) pasteCatcher.innerHTML = "";

      clipImage = img;

      if (callback) callback(self);
    };

    img.src = src;
  };

  var getImage = function(){
    return clipImage;
  };

  var destroy = function() {
    var child;
    
    while (child = el.lastChild) el.removeChild(child);
    
    if (pasteCatcher) {
      while (child = pasteCatcher.lastChild)
        pasteCatcher.removeChild(child);
      document.body.removeChild(pasteCatcher);
    }
    
    clipImage = null;
  };

  function _makePasteCatcher() {
    var pasteBox = document.createElement("div");

    pasteBox.setAttribute("id", "paste_catcher");
    pasteBox.setAttribute("contenteditable", "");
    pasteBox.style.opacity = 0;
    
    document.body.appendChild(pasteBox);

    pasteBox.focus();
    document.addEventListener("click", function() { pasteBox.focus(); });

    return pasteBox;
  };

  return {
    el: el,
    getImage: getImage,
    destroy: destroy
  };
}