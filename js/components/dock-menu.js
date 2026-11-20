/* Menu lipat: dock ditampilkan sebagai satu tombol kecil (kiri bawah) yang membuka daftar
   Halaman / Bab / Mode / Pengaturan. Menutup sendiri setelah memilih halaman, mode, atau
   pengaturan, saat mengetuk di luar menu, atau menekan Esc. Pemilih bab tetap terbuka
   supaya bisa ◀ ▶ beberapa kali. */
(function(){
  var dock=document.getElementById('dock'), btn=document.getElementById('dockToggle');
  if(!dock||!btn) return;
  function isOpen(){ return dock.classList.contains('open'); }
  function setOpen(o){ dock.classList.toggle('open',o); btn.setAttribute('aria-expanded',String(o)); }
  btn.addEventListener('click',function(){ setOpen(!isOpen()); });
  dock.addEventListener('click',function(e){
    if(e.target.closest&&e.target.closest('.pageswitch button, .dock-tabs button, #dockSet')) setOpen(false);
  });
  /* composedPath dipakai karena isi #dockAct sering dirender ulang (target sudah lepas dari DOM). */
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
