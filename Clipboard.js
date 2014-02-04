window.Clipboard = function (selector, callback) {
  //http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/

  var el = document.getElementById(selector, callback)
    , pasteCatcher
    , image;
  
  //pasting now supported, make pastecatcher
  //if (!window.Clipboard) {
    pasteCatcher = _makePasteCatcher();
  //}

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
      
      setTimeout(function () {
      
        var child = pasteCatcher.firstElementChild;

        if (child && child.tagName == "IMG") {
          loadImage(child.src);
        }

      }, 1000);
    }
  };

  var loadImage = function (src) {
    var img = new Image();
    el.innerHTML = "";

    img.onload = function () {
      var imgContainer = document.createElement("img");
      imgContainer.src = img.src;
      el.appendChild(imgContainer);
    };

    img.src = src;
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

  var getImage = function(){
    return image;
  };

  return {
    el: el,
    getImage: getImage
  };
}