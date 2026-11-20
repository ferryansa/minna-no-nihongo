/* Tombol Pengaturan (⚙) tunggal di dock, paling kanan.
   Halaman yang punya lembar pengaturan menaruh penanda <span class="sheet-flag"> di kontennya;
   tombol aktif bila ada penanda yang sedang terlihat, selain itu redup (tidak hilang) (tidak berada di elemen [hidden]). */
(function(){
  var btn=document.getElementById('dockSet'); if(!btn) return;
  btn.onclick=function(){ if(window.openSheet) window.openSheet(); };
  var raf=0;
  function sync(){
    raf=0;
    var on=[].some.call(document.querySelectorAll('.sheet-flag'),function(m){ return !m.closest('[hidden]'); });
    btn.disabled=!on;   /* tetap terlihat di posisinya; hanya redup bila halaman ini tidak punya pengaturan */
  }
  function queue(){ if(!raf) raf=requestAnimationFrame(sync); }
  new MutationObserver(queue).observe(document.getElementById('app'),{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  sync();
})();
