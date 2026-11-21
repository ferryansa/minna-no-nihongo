/* Mounts the template + Bunpou content into #app. Must run before the page modules. */
(function(){
  var app=document.getElementById('app');
  app.appendChild(document.getElementById('appTpl').content.cloneNode(true));
  /* Bunpou page content for the active book (data/bunpou-minna-*.js) */
  document.getElementById('bp').innerHTML=(window.BUNPOU_HTML||{})[window.BOOK]||'';
})();

/* Switch book (or jump to a Bunpou chapter): save the choice, then reload the page.
   Reloading is much simpler and safer than re-running every script. */
window.setBook=function(n,jump){
  if(n!==1&&n!==2) return;
  try{
    localStorage.setItem('mnnbook',String(n));
    if(!jump){
      /* Switching book (not a jump from the Bunpou summary): start from Kotoba → Table → first chapter.
         Memorization progress is NOT deleted. */
      var mk=n===2?'mnn2-':'mnn-';
      localStorage.removeItem('mnn-page');
      ['bab','deck','kanji-idx'].forEach(function(k){ localStorage.removeItem(mk+k); });
    }
  }catch(e){}
  location.hash='#b'+n+(jump?'-j'+jump[0]+'-'+jump[1]:'');
  location.reload();
};
