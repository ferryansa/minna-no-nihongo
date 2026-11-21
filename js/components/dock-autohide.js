/* The dock collapses automatically while you scroll down and comes back when you scroll up,
   at the top/bottom of the page, or when focus is inside the dock.
   It NEVER collapses in flashcard/practice mode (the card is centered by an automatic
   scroll, and the ⚙ button lives in the dock), nor right after you press a dock button
   (switching page/mode often triggers an automatic scroll). */
(function(){
  var dock=document.getElementById('dock'); if(!dock) return;
  var last=window.scrollY, ticking=false, THRESH=10, quietUntil=0;
  function setHidden(h){ dock.classList.toggle('dock-hide',h); }
  function flashcardVisible(){
    return [].some.call(document.querySelectorAll('.fz'),function(el){ return !el.closest('[hidden]'); });
  }
  /* Only keyboard focus keeps the dock open; leftover focus from a tap/click does not. */
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
