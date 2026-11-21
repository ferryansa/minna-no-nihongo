/* Determines the active book (I / II) from the URL hash or localStorage, then marks <html data-book>. Book II colors are in css/themes/book2-blue.css. */
(function(){var b=1,j=null;
try{var m=location.hash.match(/^#b([12])(?:-j(\d+)-(\d+))?$/);if(m){b=+m[1];if(m[2])j=[+m[2],+m[3]];}else b=+(localStorage.getItem("mnnbook")||1);}catch(e){}
if(b!==2)b=1;window.BOOK=b;window.MK=b===2?"mnn2-":"mnn"+"-";window.PENDING_JUMP=j;
try{localStorage.setItem("mnnbook",String(b));if(j)localStorage.setItem("mnn"+"-page","bp");}catch(e){}
document.documentElement.setAttribute("data-book",String(b));
})();
