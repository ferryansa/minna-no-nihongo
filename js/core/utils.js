/* Fungsi bantu global yang dipakai semua halaman. */
var $=s=>document.querySelector(s);
var $$=s=>[...document.querySelectorAll(s)];
/* escape teks sebelum disisipkan ke innerHTML */
var esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
