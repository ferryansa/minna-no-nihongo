/* Memasang template + isi Bunpou ke #app. Harus jalan sebelum modul halaman. */
(function(){
  var app=document.getElementById('app');
  app.appendChild(document.getElementById('appTpl').content.cloneNode(true));
  /* Isi halaman Bunpou sesuai buku aktif (data/bunpou-minna-*.js) */
  document.getElementById('bp').innerHTML=(window.BUNPOU_HTML||{})[window.BOOK]||'';
})();

/* Ganti buku (atau lompat ke bab Bunpou): simpan pilihan lalu muat ulang halaman.
   Memuat ulang jauh lebih sederhana dan aman dibanding menjalankan ulang semua skrip. */
window.setBook=function(n,jump){
  if(n!==1&&n!==2) return;
  try{
    localStorage.setItem('mnnbook',String(n));
    if(!jump){
      /* Ganti buku (bukan lompat dari ringkasan Bunpou): mulai dari Kotoba → Tabel → bab pertama.
         Progres hafalan TIDAK dihapus. */
      var mk=n===2?'mnn2-':'mnn-';
      localStorage.removeItem('mnn-page');
      ['bab','deck','kanji-idx'].forEach(function(k){ localStorage.removeItem(mk+k); });
    }
  }catch(e){}
  location.hash='#b'+n+(jump?'-j'+jump[0]+'-'+jump[1]:'');
  location.reload();
};
