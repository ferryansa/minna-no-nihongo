/* Dock otomatis menyingkir saat Anda scroll ke bawah, muncul lagi saat scroll ke atas,
   di puncak/dasar halaman, atau saat ada fokus di dalam dock.
   TIDAK pernah menyembunyikan dock di mode flashcard/latihan (kartu dipusatkan lewat
   scroll otomatis, dan tombol ⚙ ada di dock), maupun tepat setelah Anda menekan tombol dock
   (pindah halaman/mode sering memicu scroll otomatis). */
(function(){
  var dock=document.getElementById('dock'); if(!dock) return;
  var last=window.scrollY, ticking=false, THRESH=10, quietUntil=0;
  function setHidden(h){ dock.classList.toggle('dock-hide',h); }
  function flashcardVisible(){
    return [].some.call(document.querySelectorAll('.fz'),function(el){ return !el.closest('[hidden]'); });
  }
  /* Hanya fokus dari keyboard yang menahan dock; fokus sisa dari ketukan/klik tidak. */
  function keyboardFocusInDock(){
    var a=document.activeElement;
    return !!(a&&dock.contains(a)&&a.matches&&a.matches(':focus-visible'));
  }
  function update(){
    ticking=false;
    var y=window.scrollY, dy=y-last;
    var atTop=y<24, atEnd=window.innerHeight+y>=document.documentElement.scrollHeight-6;
    var sheetOpen=document.body.classList.contains('sheet-open');
    if(atTop||atEnd||sheetOpen||flashcardVisible()||Date.now()<quietUntil||keyboardFocusInDock()){
      setHidden(false); last=y; return;
    }
    if(Math.abs(dy)<THRESH) return;
    setHidden(dy>0); last=y;
  }
  window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(update); } },{passive:true});
  dock.addEventListener('focusin',function(e){ if(e.target.matches&&e.target.matches(':focus-visible')) setHidden(false); });
  dock.addEventListener('click',function(){ setHidden(false); quietUntil=Date.now()+900; });
})();
