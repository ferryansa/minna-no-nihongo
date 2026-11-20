/* ===== Halaman Kanji N5 =====
   Data goresan: KanjiVG (c) Ulrich Apel, CC BY-SA 3.0 — https://kanjivg.tagaini.net */
(function(){
var GC=["rose","blue","green","orange","teal","purple","yellow","rose","blue","green"];
var KJ=KJ_D.map((r,i)=>({i,k:r[0],on:r[1],kun:r[2],arti:r[3],bf:r[4],bn:r[5],ba:r[6],g:r[7],ly:r[8],la:r[9],s:KVG[r[0]]}));
var KEY=(MK+"kanji-v1"); let learned=new Set();
try{ learned=new Set(JSON.parse(localStorage.getItem(KEY)||"[]")); }catch(e){}
var save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify([...learned])); }catch(e){} };
var K={mode:"list", idx:0, front:"kanji", groups:new Set(KJ_G.map((_,i)=>i)), shuffle:false, unlearned:false, order:null, cidx:0, flipped:false, guide:true, nums:false};
try{ const v=+localStorage.getItem((MK+"kanji-idx")); if(v>=0&&v<KJ.length) K.idx=v; }catch(e){}

/* contoh kata dari kosakata Minna */
var EX={};
function examples(k){
  if(EX[k]) return EX[k];
  const seen=new Set(), out=[];
  CHAPTERS.forEach(ch=>ch.groups.forEach(g=>g.items.forEach(x=>{
    if(!x.kanji||!x.kanji.includes(k)) return; const key=x.kanji+"|"+x.kana; if(seen.has(key)) return; seen.add(key);
    out.push({kanji:x.kanji,kana:x.kana,arti:x.arti,ch:x.ch,main:/^Kosakata/.test(g.name)?0:1});
  })));
  out.sort((a,b)=>a.main-b.main||(a.kanji.length>8)-(b.kanji.length>8)||a.ch-b.ch);
  return EX[k]=out.slice(0,6);
}
/* bacaan: titik = okurigana */
var kun=s=>s?s.split("、").map(p=>{ const [a,b]=p.split("."); return esc(a)+(b?`<span class="oku">${esc(b)}</span>`:""); }).join("・"):"–";
var on=s=>s?s.split("、").map(esc).join("・"):"–";

var yomi=x=>{ const ks=x.kun?x.kun.split("、"):[]; let k=ks[0]||""; if(x.g===0){ const d=ks.filter(p=>p.includes(".")); if(d.length) k=d[d.length-1]; } return [x.on.split("、")[0],k.replace(".","")].filter(Boolean).join("・"); };
/* ---- SVG ---- */
function svgKanji(x,o={}){
  const s=x.s, r=new Set(s.r), cur=o.upto==null?-1:o.upto;
  const paths=s.d.map((d,i)=>{
    if(o.upto!=null&&i>o.upto) return "";
    let c="kp"; if(o.rad&&r.has(i)) c+=" rad"; if(i===cur) c+=" now";
    return `<path class="${c}" d="${d}"/>`;
  }).join("");
  let extra="";
  if(o.upto!=null){ const m=s.d[cur].match(/^M\s*([\d.]+)[ ,]([\d.]+)/); if(m) extra=`<circle class="kstart" cx="${m[1]}" cy="${m[2]}" r="4.5"/>`; }
  const nums=o.nums?s.n.map((p,i)=>`<text x="${p[0]}" y="${p[1]}">${i+1}</text>`).join(""):"";
  return `<svg viewBox="0 0 109 109" class="ksvg ${o.cls||""}" aria-hidden="true">${o.grid?'<path class="kgrid" d="M54.5 0V109M0 54.5H109"/>':""}<g class="kstrokes">${paths}</g>${extra}<g class="knums">${nums}</g></svg>`;
}
var animTok=0;
function play(svg){
  const tok=++animTok; const ps=[...svg.querySelectorAll(".kstrokes path")];
  ps.forEach(p=>{ const L=p.getTotalLength(); p.style.transition="none"; p.style.strokeDasharray=L; p.style.strokeDashoffset=L; });
  let t=150;
  ps.forEach(p=>{ const L=p.getTotalLength(), dur=Math.max(260,L*9);
    setTimeout(()=>{ if(tok!==animTok) return; p.style.transition=`stroke-dashoffset ${dur}ms linear`; p.style.strokeDashoffset=0; },t);
    t+=dur+180; });
  setTimeout(()=>{ if(tok!==animTok) return; ps.forEach(p=>{ p.style.transition=""; p.style.strokeDasharray=""; p.style.strokeDashoffset=""; }); },t+100);
}

/* ---- daftar ---- */
function listHtml(){
  return KJ_G.map((g,gi)=>{ const its=KJ.filter(x=>x.g===gi), n=its.filter(x=>learned.has(x.k)).length;
    return `<section class="kj-grp g-${GC[gi]}" id="kjg-${gi}"><h2><span class="gj">${ui(g[1])}</span>${esc(g[0])}<small>${n}/${its.length}</small></h2>
    <div class="kj-grid">${its.map(x=>`<button class="kj-tile${learned.has(x.k)?" done":""}" data-k="${x.i}"><b>${x.k}</b><em>${esc(x.ly)}</em><span>${esc(x.la)}</span></button>`).join("")}</div></section>`; }).join("");
}

/* ---- detail / cara menulis ---- */
function writeHtml(){
  const x=KJ[K.idx], ex=examples(x.k), done=learned.has(x.k);
  return `<article class="kj-card g-${GC[x.g]}">
   <div class="kj-top">
     <div class="kj-big">${svgKanji(x,{grid:true,nums:K.nums,cls:"main"})}
       <div class="kj-ctl"><button class="kbtn pri" id="kjPlay">▶ かきじゅん</button><button class="kbtn" id="kjNums" aria-pressed="${K.nums}">1 2 3</button></div></div>
     <div class="kj-info">
       <div class="kj-arti">${esc(x.arti)}</div>
       <div class="kj-row"><span class="kl">おんよみ</span><span class="kv">${on(x.on)}</span></div>
       <div class="kj-row"><span class="kl">くんよみ</span><span class="kv">${kun(x.kun)}</span></div>
       <div class="kj-row"><span class="kl">かくすう</span><span class="kv">${x.s.d.length} goresan</span></div>
       <button class="kj-mark${done?" on":""}" id="kjMark">${done?"✓ おぼえた":"おぼえた？"}</button>
     </div>
   </div>
   <div class="kj-sec"><h3>ぶしゅ<i>Bushu (radikal)</i></h3>
     <div class="kj-bushu"><div class="bsvg">${svgKanji(x,{rad:true})}</div>
       <div><div class="bchar">${esc(x.bf)}</div><div class="bname">${esc(x.bn)}</div><div class="barti">${esc(x.ba)}</div></div></div>
     <p class="kj-note">Bagian berwarna pada kanji adalah ぶしゅ-nya.</p></div>
   <div class="kj-sec"><h3>かきじゅん<i>Urutan goresan</i></h3>
     <div class="kj-steps">${x.s.d.map((_,i)=>`<div class="kstep">${svgKanji(x,{upto:i,grid:true})}<span>${i+1}</span></div>`).join("")}</div>
     <p class="kj-note">Titik menandai awal goresan. Umumnya dari atas ke bawah, dari kiri ke kanan.</p></div>
   <div class="kj-sec"><h3>れんしゅう<i>Latihan menulis</i></h3>
     <div class="kj-pad"><div class="kj-ghost${K.guide?"":" off"}">${svgKanji(x,{})}</div><canvas id="kjCanvas"></canvas></div>
     <div class="kj-ctl"><button class="kbtn" id="kjGuide" aria-pressed="${K.guide}">なぞる<i>Contoh tipis</i></button><button class="kbtn" id="kjClear">けす<i>Hapus</i></button></div></div>
   <div class="kj-sec"><h3>ことば<i>Contoh kata di Minna</i></h3>
     ${ex.length?`<div class="kj-ex">${ex.map(w=>`<div class="kx"><b>${esc(w.kanji).replace(new RegExp(x.k,"g"),`<em>${x.k}</em>`)}</b><span class="kxk">${esc(w.kana)}</span><span class="kxa">${esc(w.arti)}</span><span class="kxb">Bab ${w.ch}</span></div>`).join("")}</div>`
       :`<p class="kj-note">Belum ada kosakata Minna Bab ${BOOK===2?"26–50":"1–25"} yang memakai kanji ini.</p>`}</div>
   <p class="kj-src">Goresan: <a href="https://kanjivg.tagaini.net" target="_blank" rel="noopener">KanjiVG</a> · CC BY-SA 3.0</p>
  </article>`;
}
function setupPad(){
  const c=$("#kjCanvas"); if(!c) return; const pad=c.parentElement;
  const size=pad.clientWidth, dpr=window.devicePixelRatio||1;
  c.width=size*dpr; c.height=size*dpr; c.style.width=c.style.height=size+"px";
  const g=c.getContext("2d"); g.scale(dpr,dpr); g.lineCap="round"; g.lineJoin="round"; g.lineWidth=Math.max(6,size*0.045); g.strokeStyle="#2B2A33";
  let draw=false,last=null;
  const pos=e=>{ const r=c.getBoundingClientRect(); return [e.clientX-r.left,e.clientY-r.top]; };
  c.onpointerdown=e=>{ draw=true; last=pos(e); try{ c.setPointerCapture(e.pointerId); }catch(_){} g.beginPath(); g.arc(last[0],last[1],g.lineWidth/2,0,7); g.fillStyle=g.strokeStyle; g.fill(); };
  c.onpointermove=e=>{ if(!draw) return; const p=pos(e); g.beginPath(); g.moveTo(last[0],last[1]); g.lineTo(p[0],p[1]); g.stroke(); last=p; };
  c.onpointerup=c.onpointercancel=()=>{ draw=false; };
  $("#kjClear").onclick=()=>g.clearRect(0,0,size,size);
}

/* ---- flashcard ---- */
function base(){ return KJ.filter(x=>K.groups.has(x.g)); }
function clist(){
  let it=base();
  if(K.shuffle&&K.order){ const m=new Map(it.map(x=>[x.k,x])); it=K.order.map(k=>m.get(k)).filter(Boolean); }
  if(K.unlearned) it=it.filter(x=>!learned.has(x.k));
  return it;
}
function reorder(){ K.cidx=0; K.flipped=false; if(K.shuffle){ const a=base().map(x=>x.k); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } K.order=a; } else K.order=null; }
function cardHtml(){
  const it=clist(), nAll=base().length, nDone=base().filter(x=>learned.has(x.k)).length;
  const top=`<div class="fz-top">${it.length?`<span class="fz-n">${K.cidx+1} / ${it.length}</span>`:""}<span class="fz-h">${nDone}/${nAll} おぼえた</span><span class="sheet-flag"></span></div>`;
  if(!it.length) return `<div class="cardzone fz">${top}<div class="fz-empty">${!nAll?`<div class="fe-ic n">?</div><b>Belum ada kelompok dipilih</b><p>Pilih kelompok kanji lewat せってい.</p><div class="fe-act"><button class="btn primary" data-open-sheet>⚙ せってい</button></div>`
     :`<div class="fe-ic">✓</div><b>Semua kanji sudah おぼえた</b><p>Kartu yang belum hafal sudah habis.</p><div class="fe-act"><button class="btn primary" id="kjAll">もう いちど<i>Ulangi semua kanji</i></button><button class="btn" data-open-sheet>⚙ せってい</button></div>`}</div></div>`;
  if(K.cidx>=it.length) K.cidx=it.length-1;
  const x=it[K.cidx], done=learned.has(x.k), pct=Math.round((K.cidx+1)/it.length*100), ex=examples(x.k).slice(0,2);
  const front=K.front==="kanji"?`<div class="fc-front kjf">${x.k}</div>`:`<div class="fc-front lat">${esc(x.arti)}</div>`;
  return `<div class="cardzone fz">${top}
   <div class="fc g-${GC[x.g]}${K.flipped?" open":""}" id="kjCard" tabindex="0" role="button" aria-label="Lihat jawaban">
     <div class="sw-tag sw-l">あとで</div><div class="sw-tag sw-r">おぼえた ✓</div>
     <div class="fc-head"><span class="fc-bab">かんじ</span><span class="fc-grp">${esc(KJ_G[x.g][0])}</span>${done?'<button class="fc-done" id="kjUn" aria-label="Batalkan おぼえた">✓ おぼえた ✕</button>':""}<span class="fc-side">${K.front==="kanji"?"KANJI":"ARTI"}</span></div>
     <div class="fc-body">${front}
       ${K.flipped?`<div class="fc-ans">
         ${K.front==="kanji"?`<div class="fc-row"><span class="fc-k">ARTI</span><span class="fc-v lat">${esc(x.arti)}</span></div>`:`<div class="fc-row"><span class="fc-k">KANJI</span><span class="fc-v kj">${x.k}</span></div>`}
         <div class="fc-row"><span class="fc-k">おんよみ</span><span class="fc-v">${on(x.on)}</span></div>
         <div class="fc-row"><span class="fc-k">くんよみ</span><span class="fc-v">${kun(x.kun)}</span></div>
         <div class="fc-row"><span class="fc-k">ぶしゅ</span><span class="fc-v lat">${esc(x.bf)} ${esc(x.bn)} · ${esc(x.ba)}</span></div>
         ${ex.length?`<div class="fc-row"><span class="fc-k">CONTOH</span><span class="fc-v lat">${ex.map(w=>`${esc(w.kanji)}（${esc(w.kana)}）${esc(w.arti)}`).join("<br>")}</span></div>`:""}
       </div>`:`<div class="fc-tap">Ketuk untuk melihat jawaban</div>`}
     </div>
     <div class="fc-prog" aria-hidden="true"><i style="width:${pct}%"></i></div>
   </div>
   <div class="fz-hint"><button class="fz-b l" id="kjNext">← あとで</button><span>geser kartu</span><button class="fz-b r" id="kjOk">おぼえた →</button></div></div>`;
}
function sheetHtml(){
  const gs=KJ_G.map((g,i)=>{ const its=KJ.filter(x=>x.g===i), n=its.filter(x=>learned.has(x.k)).length; return [g,i,n,its.length]; });
  const rows=gs.filter(r=>r[2]>0);
  return `<div class="controls kj-set">
    <div class="ctl"><span class="cl">えらぶ<i>Kelompok</i></span>${gs.map(([g,i,n,t])=>`<button class="chip" data-kg="${i}" aria-pressed="${K.groups.has(i)}">${esc(g[0])}<i>${n}/${t}</i></button>`).join("")}<button class="chip" id="kgAll">ぜんぶ<i>Semua</i></button></div>
    <div class="ctl"><span class="cl">おもて<i>Sisi depan</i></span><button class="chip" data-kf="kanji" aria-pressed="${K.front==="kanji"}">かんじ<i>Kanji</i></button><button class="chip" data-kf="arti" aria-pressed="${K.front==="arti"}">いみ<i>Arti</i></button></div>
    <div class="ctl"><span class="cl">ならび<i>Urutan</i></span><button class="chip" id="kgShuf" aria-pressed="${K.shuffle}">まぜる<i>Acak</i></button><button class="chip" id="kgMada" aria-pressed="${K.unlearned}">まだ<i>Belum hafal saja</i></button></div>
  </div>
  <div class="rst"><div class="rst-h"><b>リセット</b><span>おぼえた</span></div>
    ${rows.length?`<div class="rst-g">${rows.map(([g,i,n])=>window.rstBtn("kj"+i,g[0],n)).join("")}</div>`:`<p class="rst-e">Belum ada kanji yang ditandai おぼえた.</p>`}</div>`;
}

/* ---- render ---- */
function setNav(html){ $("#dockAct").innerHTML=html; }
var GI=0, giLock=0;
function syncGrp(){ if(window.APP_PAGE!=="kj"||K.mode!=="list"||Date.now()<giLock||!$("#kgSel")) return;
  const secs=$$("#kj .kj-grp"); let k=0; secs.forEach((c,i)=>{ if(c.getBoundingClientRect().top<=window.innerHeight*0.35) k=i; });
  if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4) k=secs.length-1;
  if(k!==GI){ GI=k; $("#kgSel").value=String(k); $("#kgPrev").disabled=k<=0; $("#kgNext").disabled=k>=secs.length-1; } }
window.addEventListener("scroll",()=>requestAnimationFrame(syncGrp),{passive:true});
function goGrp(k){ const secs=$$("#kj .kj-grp"); if(k<0||k>=secs.length) return; GI=k; $("#kgSel").value=String(k); $("#kgPrev").disabled=k<=0; $("#kgNext").disabled=k>=secs.length-1; giLock=Date.now()+900; window.scrollTo({top:secs[k].getBoundingClientRect().top+window.scrollY-12,behavior:"smooth"}); }

function render(){
  if(window.APP_PAGE!=="kj") return;
  const root=$("#kj");
  $("#kj-list").setAttribute("aria-selected",K.mode==="list"); $("#kj-card").setAttribute("aria-selected",K.mode==="card"); $("#kj-write").setAttribute("aria-selected",K.mode==="write");
  $("#title").innerHTML=`<span class="en">かんじ・</span><span class="en">KANJI ${BOOK===2?"N4":"N5"}</span>`;
  $("#title-id").textContent=K.mode==="write"?"CARA MENULIS • BUSHU":K.mode==="card"?"FLASHCARD KANJI":`${KJ.length} KANJI • BUSHU • CARA MENULIS`;
  const n=KJ.filter(x=>learned.has(x.k)).length;
  $("#progress").hidden=K.mode!=="list"; $("#prog-text").textContent=`${n} / ${KJ.length} hafal`; $("#prog-bar").style.width=(n/KJ.length*100)+"%";
  $("#sheetKJ").innerHTML=K.mode==="card"?sheetHtml():"";
  const hadZ=!!root.querySelector(".fz");
  if(K.mode==="list"){
    root.innerHTML=listHtml();
    setNav(`<div class="babbar"><button class="nav" id="kgPrev" aria-label="Kelompok sebelumnya">‹</button><select id="kgSel" aria-label="Pilih kelompok">${KJ_G.map((g,i)=>`<option value="${i}">${esc(g[0])} · ${KJ.filter(x=>x.g===i).length}</option>`).join("")}</select><button class="nav" id="kgNext" aria-label="Kelompok berikutnya">›</button></div>`);
    $("#kgPrev").onclick=()=>goGrp(GI-1); $("#kgNext").onclick=()=>goGrp(GI+1); $("#kgSel").onchange=e=>goGrp(+e.target.value);
    GI=-1; syncGrp();
    root.querySelectorAll(".kj-tile").forEach(b=>b.onclick=()=>{ K.idx=+b.dataset.k; K.mode="write"; render(); window.scrollTo({top:0}); });
  } else if(K.mode==="write"){
    try{ localStorage.setItem((MK+"kanji-idx"),String(K.idx)); }catch(e){}
    root.innerHTML=writeHtml();
    setNav(`<div class="babbar"><button class="nav" id="kwPrev" aria-label="Kanji sebelumnya" ${K.idx<=0?"disabled":""}>‹</button><select id="kwSel" aria-label="Pilih kanji">${KJ.map(x=>`<option value="${x.i}" ${x.i===K.idx?"selected":""}>${x.k} · ${esc(x.arti.split(";")[0])}</option>`).join("")}</select><button class="nav" id="kwNext" aria-label="Kanji berikutnya" ${K.idx>=KJ.length-1?"disabled":""}>›</button></div>`);
    const go=i=>{ if(i<0||i>=KJ.length) return; K.idx=i; render(); window.scrollTo({top:0}); };
    $("#kwPrev").onclick=()=>go(K.idx-1); $("#kwNext").onclick=()=>go(K.idx+1); $("#kwSel").onchange=e=>go(+e.target.value);
    const big=root.querySelector(".ksvg.main");
    $("#kjPlay").onclick=()=>play(big);
    $("#kjNums").onclick=()=>{ K.nums=!K.nums; render(); };
    $("#kjGuide").onclick=()=>{ K.guide=!K.guide; root.querySelector(".kj-ghost").classList.toggle("off",!K.guide); $("#kjGuide").setAttribute("aria-pressed",K.guide); };
    $("#kjMark").onclick=()=>{ const k=KJ[K.idx].k; learned.has(k)?learned.delete(k):learned.add(k); save(); render(); };
    setupPad();
    setTimeout(()=>play(big),250);
  } else {
    root.innerHTML=cardHtml(); setNav("");
    const it=clist(), x=it[K.cidx];
    const step=()=>{ const n=clist().length; if(!n) return; K.cidx=(K.cidx+1)%n; K.flipped=false; render(); };
    const mark=()=>{ const l=clist(), cur=l[K.cidx]; if(!cur) return; learned.add(cur.k); save(); const n=l.length; if(!K.unlearned) K.cidx=(K.cidx+1)%n; else if(K.cidx>=n-1) K.cidx=0; K.flipped=false; render(); };
    const c=$("#kjCard");
    if(c){ c.onclick=()=>{ K.flipped=!K.flipped; render(); };
      c.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); K.flipped=!K.flipped; render(); } };
      $("#kjNext").onclick=()=>window.flyCard(c,-1,step); $("#kjOk").onclick=()=>window.flyCard(c,1,mark);
      window.attachSwipe(c,step,mark);
      const un=$("#kjUn"); if(un) un.onclick=e=>{ e.stopPropagation(); learned.delete(x.k); save(); render(); }; }
    const all=$("#kjAll"); if(all) all.onclick=()=>{ K.unlearned=false; reorder(); render(); };
    if(!hadZ) window.centerZone(root.querySelector(".fz"));
  }
  bindSheet();
  $$("[data-open-sheet]").forEach(b=>b.onclick=window.openSheet);
}
function bindSheet(){
  const s=$("#sheetKJ"); if(!s.innerHTML) return;
  s.querySelectorAll("[data-kg]").forEach(b=>b.onclick=()=>{ const i=+b.dataset.kg; K.groups.has(i)?K.groups.delete(i):K.groups.add(i); reorder(); render(); });
  const a=$("#kgAll"); if(a) a.onclick=()=>{ K.groups=new Set(KJ_G.map((_,i)=>i)); reorder(); render(); };
  s.querySelectorAll("[data-kf]").forEach(b=>b.onclick=()=>{ K.front=b.dataset.kf; K.flipped=false; render(); });
  $("#kgShuf").onclick=()=>{ K.shuffle=!K.shuffle; reorder(); render(); };
  $("#kgMada").onclick=()=>{ K.unlearned=!K.unlearned; K.cidx=0; K.flipped=false; render(); };
  s.querySelectorAll("[data-rst]").forEach(b=>b.onclick=()=>window.armRst(b.dataset.rst,()=>{ const gi=+b.dataset.rst.slice(2); KJ.filter(x=>x.g===gi).forEach(x=>learned.delete(x.k)); save(); K.cidx=0; K.flipped=false; },()=>render()));
}
document.addEventListener("keydown",e=>{
  if(window.APP_PAGE!=="kj"||K.mode!=="card"||e.target.closest("input,textarea,select")) return;
  if(e.key==="ArrowRight"||e.key==="ArrowLeft"){ const b=$(e.key==="ArrowRight"?"#kjOk":"#kjNext"); if(b){ e.preventDefault(); b.click(); } }
});
$("#kj-list").onclick=()=>{ K.mode="list"; render(); window.scrollTo({top:0}); };
$("#kj-card").onclick=()=>{ K.mode="card"; K.flipped=false; render(); };
$("#kj-write").onclick=()=>{ K.mode="write"; render(); window.scrollTo({top:0}); };
$("#ps-kj").onclick=()=>{ if(window.APP_PAGE==="kj") return; K.mode="list"; window.setPage("kj"); };
window.KJ_RENDER=render;
var start="kt"; try{ start=localStorage.getItem("mnn-page")||"kt"; }catch(e){} if(window.START_PAGE) start=window.START_PAGE;
if(start==="kj") window.setPage("kj");
})();
