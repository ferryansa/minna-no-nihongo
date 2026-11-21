/* Global helper functions used by every page. */
var $=s=>document.querySelector(s);
var $$=s=>[...document.querySelectorAll(s)];
/* escape text before inserting it into innerHTML */
var esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
