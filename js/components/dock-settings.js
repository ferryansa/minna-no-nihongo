/* The single Settings (⚙) button in the dock.
   A page that has a settings sheet puts a <span class="sheet-flag"> marker in its content;
   the button is enabled while a marker is visible (not inside a [hidden] element), otherwise it is dimmed (never removed). */
(function(){
  var btn=document.getElementById('dockSet'); if(!btn) return;
  btn.onclick=function(){ if(window.openSheet) window.openSheet(); };
  var raf=0;
  function sync(){
    raf=0;
    var on=[].some.call(document.querySelectorAll('.sheet-flag'),function(m){ return !m.closest('[hidden]'); });
    btn.disabled=!on;   /* stays visible in place; only dimmed when this page has no settings */
  }
  function queue(){ if(!raf) raf=requestAnimationFrame(sync); }
  new MutationObserver(queue).observe(document.getElementById('app'),{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  sync();
})();
