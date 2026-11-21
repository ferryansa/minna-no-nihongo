/* Collapsible menu: the dock is shown as one small button (bottom left) that opens a list of
   Page / Mode / Chapter / Settings. It closes itself after choosing a page, mode, or
   settings, when you tap outside the menu, or press Esc. The chapter selector stays open
   so you can press ◀ ▶ several times. */
(function(){
  var dock=document.getElementById('dock'), btn=document.getElementById('dockToggle');
  if(!dock||!btn) return;
  function isOpen(){ return dock.classList.contains('open'); }
  function setOpen(o){ dock.classList.toggle('open',o); btn.setAttribute('aria-expanded',String(o)); }
  btn.addEventListener('click',function(){ setOpen(!isOpen()); });
  dock.addEventListener('click',function(e){
    if(e.target.closest&&e.target.closest('.pageswitch button, .dock-tabs button, #dockSet')) setOpen(false);
  });
  /* composedPath is used because the content of #dockAct is often re-rendered (the click target is already detached from the DOM). */
  document.addEventListener('click',function(e){
    var path=e.composedPath?e.composedPath():[];
    if(isOpen()&&path.indexOf(dock)<0) setOpen(false);
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&isOpen()){ setOpen(false); btn.focus(); }
  });
  new MutationObserver(function(){ if(document.body.classList.contains('sheet-open')) setOpen(false); })
    .observe(document.body,{attributes:true,attributeFilter:['class']});
})();
