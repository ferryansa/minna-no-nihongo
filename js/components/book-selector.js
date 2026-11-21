/* Book dropdown + Mt. Fuji illustration color for book II. */
(function(){
      var bs=document.getElementById("bookSel");bs.value=String(BOOK);bs.onchange=function(){var n=+bs.value;if(n!==BOOK)setBook(n);};
      if(BOOK===2){var g=document.querySelectorAll("svg.fuji g");if(g[0])g[0].setAttribute("fill","#A8D2F5");if(g[1])g[1].setAttribute("fill","#2B7CC4");}
    })();
