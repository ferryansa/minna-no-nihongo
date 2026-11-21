/* Kotoba page: table, flashcard, dock, settings. */

/* Within one chapter, a repeated word is shown only at its first occurrence */
/* group colors (Bunpou page palette): vocabulary pink, expressions green, place names blue, the rest alternate */
var GC_REST=["yellow","purple","teal","orange"];
CHAPTERS.forEach(ch=>{ let ri=0; ch.groups.forEach(g=>{
  g.gc = /^Kosakata/.test(g.name)?(BOOK===2?"blue":"rose") : /^Ungkapan/.test(g.name)?"green" : /Nama|Negara|tempat/i.test(g.name)?(BOOK===2?"rose":"blue") : GC_REST[(ri++)%GC_REST.length];
});});
CHAPTERS.forEach(ch=>{ const seen = new Set(); ch.groups.forEach(g=>{
  g.items = g.items.filter(it=>{ const key=it[0]+"|"+it[1]; if(seen.has(key)) return false; seen.add(key); return true; })
    .map(it=>({id:ch.no+"|"+it[0]+"|"+it[1], ch:ch.no, kana:it[0], kanji:it[1], arti:it[2], note:it[3]||"", group:g.name, gc:g.gc}));
});});

var KEY=(MK+"hafal-v1");
var learned=new Set();
try{ learned=new Set(JSON.parse(localStorage.getItem(KEY)||"[]")); }catch(e){}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify([...learned])); }catch(e){} }

var savedCh=CHAPTERS[0].no; try{ const v=+localStorage.getItem((MK+"bab")); if(CHAPTERS.some(c=>c.no===v)) savedCh=v; }catch(e){}
var savedDeck=[savedCh]; try{ const d=JSON.parse(localStorage.getItem((MK+"deck"))||"null"); if(Array.isArray(d)) savedDeck=d.filter(n=>CHAPTERS.some(c=>c.no===n)); }catch(e){}
var S={deckOpen:true, deck:new Set(savedDeck), ch:savedCh, lastCh:savedCh, mode:"table", hide:{kana:false,kanji:false,arti:false}, front:"kanji", shuffle:false, unlearned:false, order:[], idx:0, flipped:false};
var chapter=()=>CHAPTERS.find(c=>c.no===S.ch);
var allItems=()=>chapter().groups.flatMap(g=>g.items);
var deckItems=()=>CHAPTERS.filter(c=>S.deck.has(c.no)).flatMap(c=>c.groups.flatMap(g=>g.items));
var baseItems=()=>S.mode==="card"?deckItems():allItems();
function saveDeck(){ try{ localStorage.setItem((MK+"deck"),JSON.stringify([...S.deck].sort((a,b)=>a-b))); }catch(e){} }
function deckChanged(){ saveDeck(); S.idx=0; S.flipped=false; if(S.shuffle) S.order=shuffleArr(baseItems().map(x=>x.id)); render(); }

function shuffleArr(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function list(){
  const base=baseItems(); let items=base; if(S.shuffle){ const m=new Map(base.map(x=>[x.id,x])); items=S.order.map(id=>m.get(id)).filter(Boolean); }
  if(S.unlearned) items=items.filter(x=>!learned.has(x.id));
  return items;
}

function chapterCount(c){ const all=c.groups.flatMap(g=>g.items); return [all.filter(x=>learned.has(x.id)).length, all.length]; }
function goCh(no){ S.ch=no; S.lastCh=no; try{ localStorage.setItem((MK+"bab"),String(no)); }catch(e){} S.idx=0; S.flipped=false; if(S.shuffle) S.order=shuffleArr(baseItems().map(x=>x.id)); render(); }
function deckLabel(){ const a=[...S.deck].sort((x,y)=>x-y); if(!a.length) return "belum ada bab"; const r=[]; let st=a[0],pv=a[0];
  for(const n of a.slice(1).concat([null])){ if(n===pv+1){ pv=n; continue; } r.push(st===pv?`${st}`:`${st}–${pv}`); st=pv=n; } return "Bab "+r.join(", "); }
function deckHtml(){
  const items=deckItems(), n=items.filter(x=>learned.has(x.id)).length;
  return `<details class="deck" id="deck" ${S.deckOpen?"open":""}>
    <summary class="deckhead"><span class="cl">えらぶ<i>Pilih bab untuk flashcard</i></span><span class="decksum">${deckLabel()} · ${items.length} kata · ${n} hafal</span><span class="dtog">${S.deckOpen?"Tutup ▲":"Ubah ▼"}</span></summary>
    <div class="deckgrid">${CHAPTERS.map(c=>{ const [h,t]=chapterCount(c); return `<button class="chip dk" style="--c:${chCol(c.no)}" data-deck="${c.no}" aria-pressed="${S.deck.has(c.no)}" aria-label="Bab ${c.no}">${c.no}<i>${h}/${t}${h===t&&t?" ✓":""}</i></button>`; }).join("")}</div>
    <div class="deckact">
      <button class="chip" id="deck-upto">${J(CHAPTERS[0].no+"から まで","Bab "+CHAPTERS[0].no+" s.d. "+Math.max(S.lastCh,...S.deck))}</button>
      <button class="chip" id="deck-all">${J("ぜんぶ","Semua bab")}</button>
      <button class="chip" id="deck-clear">${J("けす","Kosongkan")}</button>
    </div></details>${rstHtml()}`;
}
var RST=null, RST_T=0;
function rstBtn(key,label,n){ const arm=RST===key; return `<button class="chip rst-b${arm?" arm":""}" data-rst="${key}">${arm?"Ketuk lagi untuk hapus":label}<i>${arm?label:n+" ✓"}</i></button>`; }
function rstHtml(){
  const rows=CHAPTERS.map(c=>[c,chapterCount(c)[0]]).filter(x=>x[1]>0);
  return `<div class="rst"><div class="rst-h"><b>リセット</b><span>おぼえた</span></div>
    ${rows.length?`<div class="rst-g">${rows.map(([c,n])=>rstBtn("k"+c.no,"Bab "+c.no,n)).join("")}</div>`:`<p class="rst-e">Belum ada kata yang ditandai おぼえた.</p>`}</div>`;
}
function armRst(key,doIt,rerender){
  clearTimeout(RST_T);
  if(RST===key){ RST=null; doIt(); rerender(); return; }
  RST=key; rerender(); RST_T=setTimeout(()=>{ RST=null; rerender(); },3500);
}
window.armRst=armRst; window.rstBtn=rstBtn;
function renderTabs(){
  const isL=S.ch==="L", cur=isL?S.lastCh:S.ch, i=CHAPTERS.findIndex(c=>c.no===cur);
  $("#secbar").innerHTML = `<div class="sectabs" role="tablist" aria-label="Bagian">
      <button role="tab" id="seg-k" aria-selected="${!isL}"><span class="sicon">あ</span><span>${J("ことば","Kosakata per bab")}</span></button>
      <button role="tab" id="seg-l" aria-selected="${isL}"><span class="sicon">１２</span><span>${J("かず・かつよう","Bilangan & Konjugasi")}</span></button></div>`;
  $("#toolbar").hidden=true;
  $("#sheetDeck").innerHTML = (!isL&&S.mode==="card")?deckHtml():"";
  if(!isL&&S.mode==="table") $("#dockAct").innerHTML = `<span class="sheet-flag"></span><div class="babbar">
      <button class="nav" id="prevb" aria-label="Bab sebelumnya" ${i<=0?"disabled":""}>‹</button>
      <select id="babsel" aria-label="Pilih bab">${CHAPTERS.map(c=>{ const [n,t]=chapterCount(c); return `<option value="${c.no}" ${c.no===cur?"selected":""}>Bab ${c.no} · ${n}/${t}${n===t&&t?" ✓":""}</option>`; }).join("")}</select>
      <button class="nav" id="nextb" aria-label="Bab berikutnya" ${i>=CHAPTERS.length-1?"disabled":""}>›</button></div>`;
  $("#seg-k").onclick=()=>{ if(S.ch==="L") goCh(S.lastCh); };
  $("#seg-l").onclick=()=>{ if(S.ch!=="L"){ S.ch="L"; render(); } };
  document.querySelectorAll("[data-open-sheet]").forEach(b=>b.onclick=openSheet);
  $("#dt-table").setAttribute("aria-selected",!isL&&S.mode==="table");
  $("#dt-card").setAttribute("aria-selected",!isL&&S.mode==="card");
  $("#dt-l").setAttribute("aria-selected",isL);
  if(!isL&&S.mode==="card"){
    $("#sheetDeck").querySelectorAll("[data-deck]").forEach(b=>b.onclick=()=>{ const n=+b.dataset.deck; S.deck.has(n)?S.deck.delete(n):S.deck.add(n); deckChanged(); });
    $("#deck-all").onclick=()=>{ S.deck=new Set(CHAPTERS.map(c=>c.no)); deckChanged(); };
    $("#deck-upto").onclick=()=>{ const mx=Math.max(S.lastCh,...S.deck); S.deck=new Set(CHAPTERS.filter(c=>c.no<=mx).map(c=>c.no)); deckChanged(); };
    $("#deck-clear").onclick=()=>{ S.deck=new Set(); deckChanged(); };
    $("#sheetDeck").querySelectorAll("[data-rst]").forEach(b=>b.onclick=()=>armRst(b.dataset.rst,()=>{
      const c=CHAPTERS.find(c=>"k"+c.no===b.dataset.rst); c.groups.forEach(g=>g.items.forEach(x=>learned.delete(x.id))); save(); S.idx=0; S.flipped=false; },()=>render()));
    $("#deck").ontoggle=e=>{ if(S.deckOpen!==e.target.open){ S.deckOpen=e.target.open; renderTabs(); } };
  } else if(!isL){
    $("#babsel").onchange=e=>goCh(+e.target.value);
    $("#prevb").onclick=()=>{ if(i>0) goCh(CHAPTERS[i-1].no); };
    $("#nextb").onclick=()=>{ if(i<CHAPTERS.length-1) goCh(CHAPTERS[i+1].no); };
  }
}
function renderProgress(){
  const all=baseItems(); const n=all.filter(x=>learned.has(x.id)).length;
  $("#prog-text").textContent=`${n} / ${all.length} hafal`;
  $("#prog-bar").style.width=(all.length? n/all.length*100:0)+"%";
  setTitle();
}

function cell(cls,html){ const veil=S.hide[cls]; return `<td class="${cls}${veil?" veil":""}"><div>${html}</div></td>`; }
function row(x){
  const done=learned.has(x.id);
  return `<tr class="${done?"done":""}" data-id="${esc(x.id)}">
   ${cell("kana",esc(x.kana))}
   ${cell("kanji",x.kanji?esc(x.kanji):`<span class="kk">${esc(x.kana)}</span>`)}
   ${cell("arti",esc(x.arti)+(x.note?`<span class="note">${esc(x.note)}</span>`:""))}
   <td><button class="check" aria-pressed="${done}" aria-label="Tandai hafal">✓</button></td></tr>`;
}
var N5K="日一国人年大十二本中長出三時行見月分後前生五間上東四今金九入学高円子外八六下来気小七山話女北午百書先名川千水半男西電校語土木聞食車何南万毎白天母火右読友左休父雨会社駅週曜夕冬世代早夜夏朝度春昼秋兄主自体弟妹姉医者親員族私台町地京室家場屋界院野銀館堂店道図画教理究研答習漢意味勉問題計英試験質文字力工牛肉色空音海茶紙鳥服物歌洋風料飯品犬田花魚止去走歩通待持送起転運開集動着帰立切写仕考作売知思住使始発終注映建借貸言買飲正元公広不同近有死明強楽重病別特悪急真少古赤多青安黒新心方用以事業旅口手目足";
function ui(m){ return esc(m).replace(/([一-龯々]+)\{([^}]+)\}/g,(x,k,r)=>[...k].every(c=>N5K.includes(c))?`<ruby>${k}<rt>${r}</rt></ruby>`:r); }
function J(m,id){ return `${ui(m)}${id?`<i>${esc(id)}</i>`:""}`; }
/* Every chapter uses one color: sakura pink (the theme's main color) */
var chCol=n=>"var(--ai)";
function setTitle(){
  const root=document.documentElement, b=$("#badge");
  if(S.ch==="L"){ root.style.setProperty("--c","var(--ai)"); b.innerHTML=`<small>かず</small><b>12</b>`; }
  else if(S.mode==="card"){ root.style.setProperty("--c","var(--ai)"); b.innerHTML=`<small>MIX</small><b>${S.deck.size}</b><small>bab</small>`; }
  else { root.style.setProperty("--c",chCol(S.ch)); b.innerHTML=`<small>BAB</small><b>${S.ch}</b>`; }
  if(S.ch==="L"){ $("#title").innerHTML=`かず・かつよう`; $("#title-id").textContent="BILANGAN • KONJUGASI • LATIHAN"; return; }
  if(S.mode==="card"){ $("#title").innerHTML=`<span class="ka">フラッシュカード</span>`; $("#title-id").textContent=`FLASHCARD • ${deckLabel().toUpperCase()}`; return; }
  $("#title").innerHTML=`<span class="en">だい${S.ch}か・</span><span class="en">BAB ${S.ch} (${BOOK===2?"N4":"N5"})</span>`;
  $("#title-id").textContent="KOSAKATA • KANJI • ARTI";
}
function rubify(s){ return esc(s).replace(/([一-龯々]+)\{([^}]+)\}/g,'<ruby>$1<rt>$2</rt></ruby>'); }
function refHtml(){
  const ch=chapter(); if(!ch.ref) return "";
  return [].concat(ch.ref).map(oneRef).join("");
}
function oneRef(r){
  const head=`<section class="ref"><h2><span class="rj">${ui(r.jp)}</span>${esc(r.title)}</h2>${r.note?`<p class="refnote">${esc(r.note)}</p>`:""}`;
  if(r.kind==="rows"){
    const cls=r.cls||["rl","rj","ra"];
    return head+`<div class="tablebox"><table class="reftable"><thead><tr>${r.head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${
    r.items.map(x=>`<tr>${x.map((c,i)=>`<td class="${cls[i]||""}">${rubify(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
  }
  return head+`<div class="refgrid">${r.items.map((x,i)=>`<div class="refcell"><span class="rk">${i+1}</span><ruby>${esc(x[1])}<rt>${esc(x[0])}</rt></ruby><span class="ro">${esc(x[2])}</span></div>`).join("")}</div></section>`;
}
function renderTable(){
  const items=list();
  if(!items.length){ $("#view").innerHTML=`<div class="empty">Semua kata di bab ini sudah ditandai hafal. Matikan “Belum hafal saja” untuk melihat semuanya.</div>`; return; }
  let body="";
  if(S.shuffle){ body=items.map(row).join(""); }
  else chapter().groups.forEach(g=>{
    const its=g.items.filter(x=>items.includes(x)); if(!its.length) return;
    body+=`<tr class="group g-${g.gc}"><td colspan="4"><span class="gj">${ui(g.jp)}</span>${esc(g.name)}</td></tr>`+its.map(row).join("");
  });
  $("#view").innerHTML=`<div class="tablebox"><table><colgroup><col class="c-kana"><col class="c-kanji"><col class="c-arti"><col class="c-check"></colgroup><thead><tr><th><span class="tj">ふりがな</span>Furigana</th><th><span class="tj">かんじ</span>Kanji</th><th><span class="tj">いみ</span>Arti</th><th aria-label="Hafal"><span class="tj">✓</span></th></tr></thead><tbody>${body}</tbody></table></div>`+refHtml();
  $("#view").querySelectorAll("td.veil").forEach(td=>td.onclick=()=>td.classList.toggle("shown"));
  $("#view").querySelectorAll(".check").forEach(b=>b.onclick=()=>{ toggleLearned(b.closest("tr").dataset.id); });
}

function renderCard(){
  const items=list();
  if(!S.deck.size||!items.length){
    const noDeck=!S.deck.size, nAll=deckItems().length;
    $("#view").innerHTML=`<div class="cardzone fz"><div class="fz-top"><span class="fz-h">${noDeck?"":`${nAll} / ${nAll} おぼえた`}</span><span class="sheet-flag"></span></div>
      <div class="fz-empty">${noDeck?`<div class="fe-ic n">?</div><b>Belum ada bab dipilih</b><p>Pilih bab untuk flashcard lewat せってい.</p><div class="fe-act"><button class="btn primary" data-open-sheet>⚙ せってい</button></div>`
        :`<div class="fe-ic">✓</div><b>Semua kata sudah おぼえた</b><p>Kartu yang belum hafal sudah habis.</p><div class="fe-act"><button class="btn primary" id="feAll">もう いちど<i>Ulangi semua kata</i></button><button class="btn" data-open-sheet>⚙ せってい</button></div>`}</div></div>`;
    $("#dockAct").innerHTML="";
    document.querySelectorAll("[data-open-sheet]").forEach(b=>b.onclick=openSheet);
    const fa=$("#feAll"); if(fa) fa.onclick=()=>$("#b-unlearned").click();
    if(window.FZ_FORCE){ window.FZ_FORCE=false; window.centerZone($("#view .fz")); }
    return; }
  if(S.idx>=items.length) S.idx=items.length-1;
  const x=items[S.idx]; const done=learned.has(x.id);
  let f=S.front; if(f==="kanji"&&!x.kanji) f="kana";
  const frontText = f==="arti"? x.arti : x[f];
  const LBL={kana:["ふりがな","FURIGANA"],kanji:["かんじ","KANJI"],arti:["いみ","ARTI"]};
  const others=["kana","kanji","arti"].filter(k=>k!==f && !(k==="kanji"&&!x.kanji));
  const val=k=>k==="arti"?esc(x.arti):esc(x[k]);
  const pct=Math.round((S.idx+1)/items.length*100);
  const hadZ=!!$("#view .fz"), nH=items.filter(y=>learned.has(y.id)).length;
  $("#view").innerHTML=`<div class="cardzone fz">
    <div class="fz-top"><span class="fz-n">${S.idx+1} / ${items.length}</span><span class="fz-h">${nH} おぼえた</span><span class="sheet-flag"></span></div>
    <div class="fc g-${x.gc}${S.flipped?" open":""}" id="card" tabindex="0" role="button" aria-label="Balik flashcard">
      <div class="sw-tag sw-l">あとで</div><div class="sw-tag sw-r">おぼえた ✓</div>
      <div class="fc-head"><span class="fc-bab">BAB ${x.ch}</span><span class="fc-grp">${esc(x.group)}</span>${done?'<button class="fc-done" id="unmark" aria-label="Batalkan おぼえた">✓ おぼえた ✕</button>':""}<span class="fc-side">${LBL[f][1]}</span></div>
      <div class="fc-body">
        ${f==="arti"&&x.note?`<p class="fc-note fc-note-f">${esc(x.note)}</p>`:""}
        <div class="fc-front${f==="arti"?" lat":""}">${esc(frontText)}</div>
        ${S.flipped?`<div class="fc-ans">${others.map(k=>`<div class="fc-row"><span class="fc-k">${LBL[k][1]}</span><span class="fc-v${k==="arti"?" lat":""}${k==="kanji"?" kj":""}">${val(k)}</span></div>`).join("")}
          ${x.note&&f!=="arti"?`<p class="fc-note">${esc(x.note)}</p>`:""}</div>`
        :`<div class="fc-tap">Ketuk untuk melihat jawaban</div>`}
      </div>
      <div class="fc-prog" aria-hidden="true"><i style="width:${pct}%"></i></div>
    </div>
    <div class="fz-hint"><button class="fz-b l" id="next">← あとで</button><span>geser kartu</span><button class="fz-b r" id="mark">おぼえた →</button></div>
  </div>`;
  $("#dockAct").innerHTML="";
  document.querySelectorAll("[data-open-sheet]").forEach(b=>b.onclick=openSheet);
  const card=$("#card");
  card.onclick=()=>{ S.flipped=!S.flipped; renderCard(); };
  const un=$("#unmark"); if(un) un.onclick=e=>{ e.stopPropagation(); learned.delete(x.id); save(); renderProgress(); renderTabs(); renderCard(); };
  const go=d=>()=>window.flyCard(card,d,()=>d>0?markNext(x.id,true):step(1));
  $("#next").onclick=go(-1); $("#mark").onclick=go(1);
  window.attachSwipe(card,()=>step(1),()=>markNext(x.id,true));
  if(!hadZ||window.FZ_FORCE){ window.FZ_FORCE=false; window.centerZone($("#view .fz")); }
}
function markNext(id,keep){
  if(learned.has(id)&&!keep){ learned.delete(id); save(); renderProgress(); renderTabs(); renderCard(); return; }
  const n=list().length; learned.add(id); save();
  if(!S.unlearned) S.idx=(S.idx+1)%n; else if(S.idx>=n-1) S.idx=0;
  S.flipped=false; renderProgress(); renderTabs(); renderCard();
}
function step(d){ const n=list().length; if(!n) return; S.idx=(S.idx+d+n)%n; S.flipped=false; renderCard(); }
function toggleLearned(id){ learned.has(id)?learned.delete(id):learned.add(id); save(); if(S.mode==="card"&&S.unlearned) S.flipped=false; renderProgress(); renderTabs(); S.mode==="table"?renderTable():renderCard(); }

function render(){
  if(window.APP_PAGE&&window.APP_PAGE!=="kt") return;
  const isL = S.ch==="L";
  $("#controls").hidden=isL; $("#progress").hidden=isL; $("#view").hidden=isL; $("#foot").hidden=isL; $("#lampiran").hidden=!isL;
  $("#sheetL").innerHTML="";
  if(isL){ renderTabs(); setTitle(); window.renderLampiran&&window.renderLampiran(); return; }
  renderTabs(); renderProgress();
  $("#m-table").setAttribute("aria-pressed",S.mode==="table");
  $("#toolbar").classList.toggle("is-card",S.mode==="card");
  $("#m-card").setAttribute("aria-pressed",S.mode==="card");
  $("#hide-ctl").hidden = S.mode!=="table";
  $("#front-ctl").hidden = S.mode!=="card";
  S.mode==="table"?renderTable():renderCard();
}

/* swipe a card: right = おぼえた (memorized), left = あとで (later) */
window.flyCard=(el,dir,done)=>{ if(el._fly) return; el._fly=1; el.style.transition="transform .22s ease-in, opacity .22s";
  el.style.setProperty(dir>0?"--sr":"--sl",1); el.style.transform=`translateX(${dir*Math.max(window.innerWidth,600)}px) rotate(${dir*18}deg)`; el.style.opacity="0"; setTimeout(done,200); };
window.attachSwipe=(el,onLeft,onRight)=>{
  let x0=0,y0=0,dx=0,on=false,moved=false,pid=null,swiped=false;
  const reset=()=>{ el.style.transition="transform .2s ease-out"; el.style.transform=""; el.style.setProperty("--sl",0); el.style.setProperty("--sr",0); };
  el.addEventListener("pointerdown",e=>{ if(e.button>0||e.target.closest("button")) return; x0=e.clientX; y0=e.clientY; dx=0; on=true; moved=false; pid=e.pointerId; el.style.transition="none"; });
  el.addEventListener("pointermove",e=>{ if(!on||e.pointerId!==pid) return; dx=e.clientX-x0; const dy=e.clientY-y0;
    if(!moved){ if(Math.abs(dx)<10) return; if(Math.abs(dy)>Math.abs(dx)){ on=false; return; } moved=true; try{ el.setPointerCapture(pid); }catch(_){} }
    e.preventDefault(); el.style.transform=`translateX(${dx}px) rotate(${dx/22}deg)`;
    el.style.setProperty("--sl",Math.min(1,Math.max(0,-dx/110))); el.style.setProperty("--sr",Math.min(1,Math.max(0,dx/110))); });
  const end=()=>{ if(!on) return; on=false; if(!moved) return; swiped=true; setTimeout(()=>swiped=false,60);
    const th=Math.min(110,el.offsetWidth*.25);
    if(Math.abs(dx)>th) window.flyCard(el,dx>0?1:-1,dx>0?onRight:onLeft); else reset(); };
  el.addEventListener("pointerup",end); el.addEventListener("pointercancel",()=>{ if(on){ on=false; reset(); } });
  el.addEventListener("click",e=>{ if(swiped){ e.stopImmediatePropagation(); e.preventDefault(); } },true);
};
window.centerZone=z=>{ if(!z) return; requestAnimationFrame(()=>{ const y=z.getBoundingClientRect().top+window.scrollY-8; window.scrollTo({top:y}); }); };
(()=>{ const d=document.getElementById("dock"); const set=()=>document.documentElement.style.setProperty("--dockh",d.offsetHeight+"px"); set(); if(window.ResizeObserver) new ResizeObserver(set).observe(d); })();

function openSheet(){ $("#sheet").hidden=false; document.body.classList.add("sheet-open"); }
function closeSheet(){ $("#sheet").hidden=true; document.body.classList.remove("sheet-open"); }
window.openSheet=openSheet;
$("#sheetBg").onclick=closeSheet; $("#sheetClose").onclick=closeSheet; $("#sheetDone").onclick=closeSheet;
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!$("#sheet").hidden) closeSheet(); });
$("#sheetBody").appendChild($("#controls"));
$("#secbar").hidden=true;
$("#dt-table").onclick=()=>{ if(S.ch==="L"){ S.mode="table"; goCh(S.lastCh); } else if(S.mode!=="table") $("#m-table").click(); window.scrollTo({top:0}); };
$("#dt-card").onclick=()=>{ window.FZ_FORCE=true; if(S.ch==="L"){ S.ch=S.lastCh; } if(S.mode!=="card") $("#m-card").click(); else render(); };
$("#dt-l").onclick=()=>{ if(S.ch!=="L"){ window.FZ_FORCE=true; if(window.resetLampiran) window.resetLampiran(); S.ch="L"; render(); } };
$("#m-table").onclick=()=>{ if(S.mode==="card"){ const cur=list()[S.idx]; if(cur){ S.ch=cur.ch; S.lastCh=cur.ch; try{ localStorage.setItem((MK+"bab"),String(cur.ch)); }catch(e){} } } S.mode="table"; S.idx=0; if(S.shuffle) S.order=shuffleArr(baseItems().map(x=>x.id)); render(); };
$("#m-card").onclick=()=>{ S.mode="card"; S.deck=new Set([S.ch==="L"?S.lastCh:S.ch]); saveDeck(); S.idx=0; S.flipped=false; if(S.shuffle) S.order=shuffleArr(baseItems().map(x=>x.id)); render(); };
document.querySelectorAll("[data-hide]").forEach(b=>b.onclick=()=>{ const k=b.dataset.hide; S.hide[k]=!S.hide[k]; b.setAttribute("aria-pressed",S.hide[k]); renderTable(); });
document.querySelectorAll("[data-front]").forEach(b=>b.onclick=()=>{ S.front=b.dataset.front; document.querySelectorAll("[data-front]").forEach(o=>o.setAttribute("aria-pressed",o===b)); S.flipped=false; renderCard(); });
$("#b-shuffle").onclick=()=>{ S.shuffle=!S.shuffle; $("#b-shuffle").setAttribute("aria-pressed",S.shuffle); if(S.shuffle) S.order=shuffleArr(baseItems().map(x=>x.id)); S.idx=0; S.flipped=false; render(); };
$("#b-unlearned").onclick=()=>{ S.unlearned=!S.unlearned; $("#b-unlearned").setAttribute("aria-pressed",S.unlearned); S.idx=0; S.flipped=false; render(); };
document.addEventListener("keydown",e=>{
  if((window.APP_PAGE&&window.APP_PAGE!=="kt")||S.ch==="L"||S.mode!=="card"||e.target.closest("input,textarea,select")) return;
  if(e.key==="ArrowRight"||e.key==="ArrowLeft"){ const c=$("#card"); if(!c) return; e.preventDefault(); (e.key==="ArrowRight"?$("#mark"):$("#next")).click(); }
  else if(e.key===" "||e.key==="Enter"){ if(e.target.closest(".btn,.chip,.tab")) return; e.preventDefault(); S.flipped=!S.flipped; renderCard(); }
});
window.KT_RENDER=()=>{ $("#foot").hidden=false; render(); };
render();
