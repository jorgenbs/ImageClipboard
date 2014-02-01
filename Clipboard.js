window.Clipboard = function (selector) {

  var el = document.getElementById(selector);
  
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
      var data = e.clipboardData;
      var reader = new FileReader();

      reader.onload = function(evt) {

      }
      
      reader.readAsDataURL(file);
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
      });

      return pasteBox;
  };
}