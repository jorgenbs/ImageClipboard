window.Clipboard = function (selector, callback) {

  var el = document.getElementById(selector, callback);
  
  if (!window.Clipboard) {
    //firefox
    var pasteBox = _makeFFPasteBox();

    document.body.appendChild(pasteBox);

    document.onkeydown = function (e) {
      if (e.keyCode === 17) {
        pasteBox.focus();
      };
    };
  }
  else {
    //chrome
    window.addEventListener('paste', function (e) {
      
      var data = e.clipboardData
        , items = data.items
        , reader = new FileReader()
      
      var blob = items[0].getAsFile();
      
      reader.onload = function(evt) {
        var img = document.createElement("img");
        img.setAttribute("src", evt.target.result);
        el.appendChild(img);

        callback(evt.target.result);
      };
      
      reader.readAsDataURL(blob);
    });
  }

  var _makeFFPasteBox = function() {
    var canvas = document.getElementById("cc")
        , ctx = canvas.getContext("2d")
        , pasteBox = el;

      pasteBox.setAttribute("id", "paste_ff");
      pasteBox.setAttribute("contenteditable", "");
      
      pasteBox.addEventListener("DOMSubtreeModified", function () {
          var img = pasteBox.firstElementChild.src;
              
          var img2 = new Image();
          img2.onload = function(){
            ctx.drawImage(img2, 0, 0);
          }
          img2.src = img;
          pasteBox.innerHTML = '';  

          callback(img);
      });

      return pasteBox;
  };

  var getImage() = function(){};

  return {
    el: el,
    getImage: getImage
  };
}