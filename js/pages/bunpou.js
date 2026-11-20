
/* ===== Halaman Bunpou (di dalam halaman yang sama) ===== */
(function(){
var nBab=b=>document.querySelectorAll('#bab'+b+' article.row').length;
var B={mode:"baca"};
var BABS_BP=[...document.querySelectorAll("#bp section.bab")].map(s=>+s.id.slice(3)).filter(n=>n>0), FIRSTB=BABS_BP[0], LASTB=BABS_BP[BABS_BP.length-1];

/* bab dipakai bersama dengan halaman Kotoba (S.ch / S.lastCh di skrip Kotoba) */
var curBab=()=>{ const n=(S.ch==="L"?S.lastCh:S.ch); return BABS_BP.includes(n)?n:FIRSTB; };
function setBab(n){ S.lastCh=n; if(S.ch!=="L") S.ch=n; S.idx=0; S.flipped=false; try{ localStorage.setItem((MK+"bab"),String(n)); }catch(e){} }

/* ---- ringkasan partikel ---- */
var PART=BOOK===2?[
 {p:"は",r:"wa",cls:"wa",u:[["Objek jadi topik (好き・あります)",26,6,"時間{じかん}[は] ありますが、お金{かね}は ありません。","Waktu ada, tapi uang tidak."],["Kontras, partikel + は",27,5,"この 店{みせ}で[は] カードが 使{つか}えません。","Di toko ini tidak bisa pakai kartu."],["Jumlah + は (paling sedikit)",42,4,"[1週間|いっしゅうかん][は] かかります。","Setidaknya perlu seminggu."]]},
 {p:"が",r:"ga",cls:"",u:[["Objek bentuk potensial",27,2,"日本語{にほんご}[が] 話{はな}せます。","Bisa berbicara bahasa Jepang."],["Terlihat / terdengar",27,3,"富士山{ふじさん}[が] 見{み}えます。","Gunung Fuji terlihat."],["Keadaan (自動詞 + ています)",29,1,"窓{まど}[が] 割{わ}れて います。","Jendelanya pecah."],["Hasil disengaja (～て あります)",30,1,"壁{かべ}に 絵{え}[が] 掛{か}けて あります。","Lukisan tergantung di dinding."],["V のが 好き / 上手",38,2,"絵{え}を かくの[が] 好{す}きです。","Saya suka menggambar."],["Indra: N が します",47,3,"いい におい[が] します。","Tercium bau harum."]]},
 {p:"を",r:"o",cls:"",u:[["Objek kata kerja transitif",29,2,"ドア[を] 開{あ}けます。","Membuka pintu."],["V のを 忘れました",38,3,"かぎを かけるの[を] 忘{わす}れました。","Saya lupa mengunci."],["Orang yang disuruh (kausatif, intransitif)",48,2,"娘{むすめ}[を] 買{か}い物{もの}に 行{い}かせました。","Saya menyuruh anak pergi belanja."]]},
 {p:"で",r:"de",cls:"de",u:[["Di suatu tempat (どこかで)",29,6,"どこか[で] 財布{さいふ}を なくしました。","Dompet hilang di suatu tempat."],["Batas jumlah/waktu/uang",32,6,"30分{ぷん}[で] 行{い}けます。","Bisa sampai dalam 30 menit."],["Bahan (masih terlihat)",37,6,"机{つくえ}は 木{き}[で] 作られて います。","Meja dibuat dari kayu."],["Sebab (kejadian)",39,2,"地震{じしん}[で] ビルが 倒{たお}れました。","Gedung roboh karena gempa."]]},
 {p:"に",r:"ni",cls:"",u:[["Titik tiba (pengganti へ)",28,6,"よく この 喫茶店{きっさてん}[に] 来{き}ます。","Sering datang ke kafe ini."],["Ke suatu tempat (どこかに)",29,6,"傘{かさ}を どこか[に] 忘{わす}れました。","Payung tertinggal entah di mana."],["Pelaku dalam kalimat pasif",37,2,"先生{せんせい}[に] ほめられました。","Saya dipuji guru."],["Sebagai (hadiah / oleh-oleh)",41,4,"お祝{いわ}い[に] お皿{さら}を もらいました。","Saya dapat piring sebagai hadiah."],["Memilih: N に します",44,4,"コーヒー[に] します。","Saya pilih kopi."],["Membuat jadi (な-adj / N)",44,3,"部屋{へや}を きれい[に] します。","Membersihkan kamar."],["Orang yang disuruh (kausatif, transitif)",48,3,"学生{がくせい}[に] 作文{さくぶん}を 書{か}かせました。","Menyuruh murid menulis karangan."]]},
 {p:"しか",r:"shika",cls:"",u:[["Hanya (+ negatif)",27,7,"ひらがな[しか] 読{よ}めません。","Hanya bisa membaca hiragana."]]},
 {p:"し",r:"shi",cls:"",u:[["…, lagi pula …",28,3,"安{やす}い[し]、おいしい[し]、よく 来{き}ます。","Murah, enak pula, jadi sering datang."]]},
 {p:"とか",r:"toka",cls:"",u:[["… dan lain-lain (lisan)",30,6,"すし[とか] てんぷら[とか]を 食{た}べました。","Makan sushi, tempura, dan lain-lain."]]},
 {p:"も",r:"mo",cls:"mo",u:[["Menggantikan を/が; partikel + も",27,6,"メキシコ［へ］[も] 行{い}きました。","Juga pergi ke Meksiko."],["Partikel + も (にも・でも・からも)",30,7,"京都{きょうと}に[も] 行{い}きました。","Juga pergi ke Kyoto."],["Jumlah + も (banyak sekali)",42,4,"[10時間|じゅうじかん][も] 寝{ね}ました。","Tidur sampai 10 jam."]]},
 {p:"と",r:"to",cls:"",u:[["Rencana: ～(よ)うと 思って います",31,3,"海{うみ}へ 行{い}こう[と] 思って います。","Saya berencana ke laut."],["Kutipan: と 読みます / と 書いて あります",33,4,"「止{と}まれ」[と] 書{か}いて あります。","Tertulis \"Berhenti\"."],["Menyampaikan ucapan: と 言って いました",33,6,"明日{あした} 休{やす}む[と] 言って いました。","Katanya besok libur."]]},
 {p:"の",r:"no",cls:"no",u:[["N の とおりに",34,1,"説明書{せつめいしょ}[の] とおりに 作{つく}りました。","Saya membuatnya sesuai petunjuk."],["N の あとで",34,2,"仕事{しごと}[の] あとで 飲{の}みに 行{い}きます。","Setelah kerja pergi minum."],["Mengubah V menjadi kata benda",38,1,"歩{ある}く[の]は 体{からだ}に いいです。","Berjalan itu baik untuk badan."],["N の ために",42,2,"家族{かぞく}[の] ために 働{はたら}きます。","Bekerja demi keluarga."],["N の はずです / N の ようです",46,3,"休{やす}み[の] はずです。","Pasti libur."]]},
 {p:"なら",r:"nara",cls:"",u:[["Kalau soal N, …",35,3,"旅行{りょこう}[なら]、秋{あき}が いいですよ。","Kalau untuk jalan-jalan, musim gugur bagus."]]},
 {p:"ほど",r:"hodo",cls:"",u:[["Semakin …, semakin …",35,5,"見{み}れば 見る[ほど] 好{す}きに なります。","Semakin dilihat semakin suka."]]},
 {p:"によって",r:"ni yotte",cls:"",u:[["Pencipta / penemu (pasif)",37,5,"ベル[に よって] 発明{はつめい}されました。","Ditemukan oleh Bell."]]},
 {p:"から",r:"kara",cls:"",u:[["Bahan (berubah bentuk)",37,6,"ワインは ぶどう[から] 作{つく}られます。","Wine dibuat dari anggur."]]},
 {p:"か",r:"ka",cls:"ka",u:[["Pertanyaan di dalam kalimat",40,1,"何時{なんじ}に 着{つ}く[か] 調{しら}べます。","Saya cek jam berapa tiba."],["Apakah … atau tidak",40,2,"行{い}ける[か] どうか わかりません。","Belum tahu bisa pergi atau tidak."]]},
 {p:"のに",r:"noni",cls:"",u:[["Untuk (kegunaan / biaya)",42,3,"切{き}る[のに] 使{つか}います。","Dipakai untuk memotong."],["Padahal",45,2,"約束{やくそく}した[のに] 来{き}ませんでした。","Padahal sudah janji, tidak datang."]]}
]:[
 {p:"は",r:"wa",cls:"wa",u:[["Penanda topik",1,1,"わたし[は] 学生{がくせい}です。","Saya mahasiswa."],["Pertanyaan lokasi benda yang sudah diketahui",10,3,"かぎ[は] どこに ありますか。","Kuncinya ada di mana?"],["Objek dijadikan topik",17,5,"この 本{ほん}[は] 図書館{としょかん}で 借{か}りました。","Buku ini saya pinjam di perpustakaan."]]},
 {p:"が",r:"ga",cls:"",u:[["Tetapi (menyambung kalimat)",8,6,"おいしいです[が]、高{たか}いです。","Enak, tetapi mahal."],["Objek 好き・上手・わかります・あります",9,1,"音楽{おんがく}[が] 好{す}きです。","Saya suka musik."],["Yang ada (あります・います)",10,1,"公園{こうえん}に 子{こ}ども[が] います。","Ada anak-anak di taman."],["Bagian dari topik: N1 は N2 が adj",16,4,"象{ぞう}は 鼻{はな}[が] 長{なが}いです。","Gajah hidungnya panjang."],["Pelaku di dalam klausa",22,2,"母{はは}[が] 作{つく}った ケーキです。","Ini kue yang dibuat ibu."],["Yang langsung dirasakan indera",23,5,"音{おと}[が] 大{おお}きいです。","Suaranya keras."],["Pelaku saat objek jadi topik",24,5,"この 時計{とけい}は 父{ちち}[が] くれました。","Jam ini diberikan oleh ayah."]]},
 {p:"を",r:"o",cls:"",u:[["Objek tindakan",6,1,"パン[を] 食{た}べます。","Makan roti."],["Tempat yang ditinggalkan",16,5,"うち[を] 出{で}ます。","Keluar dari rumah."],["Tempat yang dilalui",23,4,"橋{はし}[を] 渡{わた}ります。","Menyeberangi jembatan."]]},
 {p:"に",r:"ni",cls:"",u:[["Titik waktu",4,3,"6時{じ}[に] 起{お}きます。","Bangun jam 6."],["Kepada (penerima)",7,3,"友達{ともだち}[に] 本{ほん}を 貸{か}しました。","Meminjamkan buku kepada teman."],["Dari (pemberi orang)",7,4,"先生{せんせい}[に] 日本語{にほんご}を 習{なら}います。","Belajar bahasa Jepang dari guru."],["Tempat keberadaan",10,2,"机{つくえ}の 上{うえ}[に] 本{ほん}が あります。","Ada buku di atas meja."],["Per periode (frekuensi)",11,5,"1週間{しゅうかん}[に] 3回{かい} テニスを します。","Main tenis 3 kali seminggu."],["Tujuan pergi untuk V",13,3,"靴{くつ}を 買{か}い[に] 行{い}きます。","Pergi untuk membeli sepatu."],["Tempat masuk, duduk, naik",15,6,"電車{でんしゃ}[に] 乗{の}ります。","Naik kereta."],["Tempat benda berada setelah aksi",15,7,"紙{かみ}[に] 名前{なまえ}を 書{か}きます。","Menulis nama di kertas."],["Perubahan (～に なります)",19,4,"元気{げんき}[に] なりました。","Sudah menjadi sehat."]]},
 {p:"へ",r:"e",cls:"",u:[["Arah tujuan (dibaca \"e\")",5,1,"京都{きょうと}[へ] 行{い}きます。","Pergi ke Kyoto."]]},
 {p:"で",r:"de",cls:"de",u:[["Kendaraan",5,3,"電車{でんしゃ}[で] 行{い}きます。","Pergi naik kereta."],["Sendirian (一人で)",5,4,"一人{ひとり}[で] 行{い}きます。","Pergi sendirian."],["Tempat kegiatan",6,4,"図書館{としょかん}[で] 本{ほん}を 読{よ}みます。","Membaca buku di perpustakaan."],["Alat atau bahasa",7,1,"箸{はし}[で] 食{た}べます。","Makan dengan sumpit."],["Lingkup \"yang paling\"",12,5,"クラス[で] だれが いちばん 若{わか}いですか。","Di kelas, siapa yang paling muda?"],["Tempat acara diadakan",21,4,"東京{とうきょう}[で] 試合{しあい}が あります。","Ada pertandingan di Tokyo."],["Situasi atau kesempatan",21,5,"パーティー[で] 歌{うた}を 歌{うた}いました。","Bernyanyi di pesta."]]},
 {p:"と",r:"to",cls:"",u:[["Dan (antar kata benda)",4,5,"ペン[と] ノートです。","Pena dan buku catatan."],["Bersama (orang)",5,4,"友達{ともだち}[と] 京都{きょうと}へ 行{い}きます。","Pergi ke Kyoto bersama teman."],["Kutipan pendapat/ucapan",21,1,"おもしろい[と] 思{おも}います。","Menurut saya menarik."],["Kalau…, (pasti) — otomatis",23,3,"押{お}す[と]、お釣{つ}りが 出{で}ます。","Kalau ditekan, uang kembalian keluar."]]},
 {p:"の",r:"no",cls:"no",u:[["Afiliasi: N2 dari N1",1,5,"さくら大学{だいがく}[の] 先生{せんせい}です。","Dosen Universitas Sakura."],["Milik / tema",2,5,"わたし[の] かぎです。","Ini kunci saya."],["Asal produk",3,4,"日本{にほん}[の] 車{くるま}です。","Mobil buatan Jepang."],["Posisi (N の 上・下)",10,4,"机{つくえ}[の] 上{うえ}に あります。","Ada di atas meja."]]},
 {p:"も",r:"mo",cls:"mo",u:[["Juga",1,4,"わたし[も] 学生{がくせい}です。","Saya juga mahasiswa."],["Kata tanya + も + negatif",5,2,"どこ[も] 行{い}きません。","Tidak pergi ke mana pun."]]},
 {p:"か",r:"ka",cls:"ka",u:[["Kalimat tanya",1,3,"学生{がくせい}です[か]。","Apakah Anda mahasiswa?"],["Pilihan A atau B",2,4,"コーヒーです[か]、お茶{ちゃ}です[か]。","Kopi atau teh?"],["\"Suatu\" (どこか・何か)",13,4,"何{なに}[か] 飲{の}みたいです。","Ingin minum sesuatu."]]},
 {p:"から",r:"kara",cls:"",u:[["Dari (waktu/tempat)",4,4,"9時{じ}[から] 働{はたら}きます。","Bekerja mulai jam 9."],["Karena (alasan)",9,4,"時間{じかん}が ありません[から]。","Karena tidak ada waktu."],["Setelah (～てから)",16,3,"手{て}を 洗{あら}って[から]、食{た}べます。","Setelah mencuci tangan, (lalu) makan."]]},
 {p:"まで",r:"made",cls:"",u:[["Sampai",4,4,"5時{じ}[まで] 働{はたら}きます。","Bekerja sampai jam 5."],["Paling lambat (までに)",17,6,"明日{あした}[までに] 出{だ}して ください。","Tolong serahkan paling lambat besok."]]},
 {p:"や",r:"ya",cls:"",u:[["Dan lain-lain (sebagian contoh)",10,5,"本{ほん}[や] ノートなどが あります。","Ada buku, buku catatan, dan lain-lain."]]},
 {p:"より",r:"yori",cls:"",u:[["Daripada (perbandingan)",12,3,"東京{とうきょう}は ジャカルタ[より] 寒{さむ}いです。","Tokyo lebih dingin daripada Jakarta."]]},
 {p:"だけ",r:"dake",cls:"",u:[["Hanya",11,6,"休{やす}みは 日曜日{にちようび}[だけ]です。","Liburnya hanya hari Minggu."]]},
 {p:"ね",r:"ne",cls:"",u:[["…, kan? / …, ya? (minta setuju)",4,6,"大変{たいへん}です[ね]。","Berat, ya."]]},
 {p:"よ",r:"yo",cls:"",u:[["…, lho (info baru)",5,6,"明日{あした}は 休{やす}みです[よ]。","Besok libur, lho."]]},
 {p:"けど",r:"kedo",cls:"",u:[["Tapi (santai)",20,5,"辛{から}い[けど]、おいしい。","Pedas, tapi enak."]]},
 {p:"でも",r:"demo",cls:"",u:[["…atau semacamnya (ajakan)",21,6,"お茶{ちゃ}[でも] 飲{の}みませんか。","Bagaimana kalau minum teh atau semacamnya?"]]}
];
var pex=(t,c)=>esc(t).replace(/([\u4e00-\u9fff々]+)\{([^}]+)\}/g,"<ruby>$1<rt>$2</rt></ruby>").replace(/\[([^\]]+)\]/g,`<span class="p ${c||"ka"}">$1</span>`);
var PC=["c-rose","c-green","c-blue","c-orange","c-purple","c-teal","c-yellow"];
$("#bp").insertAdjacentHTML("beforeend",`<section class="bab partsec" id="babP">
  <p class="shint">Gunakan ‹ › di bawah untuk lompat antar partikel. Ketuk label bab untuk membuka materi bunpou-nya.</p>
  <div class="pgrid">${PART.map((x,i)=>`<div class="pcard ${PC[i%PC.length]}" id="p-${x.r}">
    <div class="phead"><span class="pbig">${x.p}</span><span class="pr">${x.r}</span><span class="pn">${x.u.length} fungsi</span></div>
    ${x.u.map(u=>`<div class="puse"><div class="pu-t"><b>${esc(u[0])}</b><button class="pbab" data-bab="${u[1]}" data-card="${u[2]}">Bab ${u[1]}</button></div><div class="pu-ex">${pex(u[3],x.cls)}</div><div class="pu-ar">${esc(u[4])}</div></div>`).join("")}
  </div>`).join("")}</div></section>`);
var PI=0, ppLock=0;
function setPI(k){ if(k===PI) return; PI=k; const sel=$("#ppSel"); if(!sel) return; sel.value=String(k); $("#ppPrev").disabled=k<=0; $("#ppNext").disabled=k>=PART.length-1; }
function goPart(k){ if(k<0||k>=PART.length) return; setPI(k); const el=$("#p-"+PART[k].r); if(!el) return; ppLock=Date.now()+900; window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-12,behavior:"smooth"}); }
function syncPart(){ if(window.APP_PAGE!=="bp"||B.mode!=="part"||Date.now()<ppLock||!$("#ppSel")) return;
  const cards=$$("#babP .pcard"); let k=0;
  cards.forEach((c,i)=>{ if(c.getBoundingClientRect().top<=window.innerHeight*0.35) k=i; });
  if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4) k=cards.length-1;
  setPI(k); }
window.addEventListener("scroll",()=>requestAnimationFrame(syncPart),{passive:true});

/* navigasi まとめ: lompat antar bab */
var SB=$$("#babR .sbab");
/* nomor bab sebenarnya dari judul kartu ("BAB 26"); cadangan: bab pertama + urutan */
var sumNo=(el,i)=>{ const h=el.querySelector("h3"), m=h&&h.textContent.match(/\d+/); return m?+m[0]:FIRSTB+i; }; SB.forEach((el,i)=>{ el.id="sum-"+(i+1); el.style.scrollMarginTop="12px"; });
var SI=0, siLock=0;
function setSI(k){ if(k===SI) return; SI=k; const sel=$("#smSel"); if(!sel) return; sel.value=String(k); $("#smPrev").disabled=k<=0; $("#smNext").disabled=k>=SB.length-1; }
function goSum(k){ if(k<0||k>=SB.length) return; setSI(k); siLock=Date.now()+900; window.scrollTo({top:SB[k].getBoundingClientRect().top+window.scrollY-12,behavior:"smooth"}); }
function syncSum(){ if(window.APP_PAGE!=="bp"||B.mode!=="sum"||Date.now()<siLock||!$("#smSel")) return;
  let k=0; SB.forEach((c,i)=>{ if(c.getBoundingClientRect().top<=window.innerHeight*0.35) k=i; });
  if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4) k=SB.length-1;
  setSI(k); }
window.addEventListener("scroll",()=>requestAnimationFrame(syncSum),{passive:true});

/* --- pindah halaman --- */
function setPage(p){
  window.APP_PAGE=p; try{ localStorage.setItem("mnn-page",p); }catch(e){}
  ["kt","bp","kj"].forEach(k=>{ $("#ps-"+k).setAttribute("aria-selected",p===k); $("#dockTabs"+k.toUpperCase()).hidden=p!==k; });
  $("#bp").hidden=p!=="bp"; $("#kj").hidden=p!=="kj"; if(p!=="kj"){ $("#kj").innerHTML=""; $("#sheetKJ").innerHTML=""; }
  if(p==="kt"){ $("#controls").style.display=""; window.KT_RENDER&&window.KT_RENDER(); }
  else { ["#view","#lampiran","#foot","#progress"].forEach(s=>$(s).hidden=true); $("#controls").style.display="none"; $("#sheetDeck").innerHTML=""; $("#sheetL").innerHTML="";
    if(p==="bp") render(); else window.KJ_RENDER&&window.KJ_RENDER(); }
  window.scrollTo({top:0});
}
$("#ps-kt").onclick=()=>{ if(window.APP_PAGE==="kt") return; S.mode="table"; S.ch=S.lastCh; S.idx=0; S.flipped=false; setPage("kt"); };
$("#ps-bp").onclick=()=>{ if(window.APP_PAGE==="bp") return; if(S.mode==="card"&&S.ch!=="L"){ const cur=list()[S.idx]; if(cur) setBab(cur.ch); } B.mode="baca"; setPage("bp"); };

function setHead(){
  const t=$("#title"), id=$("#title-id"), n=curBab();
  if(B.mode==="baca"){ t.innerHTML=`<span class="en">だい${n}か・</span><span class="en">BAB ${n} (${BOOK===2?"N4":"N5"})</span>`; id.textContent="BUNPOU • RUMUS • ARTI • CONTOH"; }
  else if(B.mode==="sum"){ t.innerHTML="まとめ・RINGKASAN"; id.textContent="BUNPOU BAB "+FIRSTB+"–"+LASTB; }
  else { t.innerHTML="じょし・PARTIKEL"; id.textContent="PARTIKEL BAB "+FIRSTB+"–"+LASTB; }
  $("#progress").hidden=true;
}
function render(){
  if(window.APP_PAGE!=="bp") return;
  const n=curBab();
  $("#bp-baca").setAttribute("aria-selected",B.mode==="baca");
  $("#bp-sum").setAttribute("aria-selected",B.mode==="sum");
  $("#bp-part").setAttribute("aria-selected",B.mode==="part");
  $$('#bp section.bab').forEach(sec=>{ sec.hidden = B.mode==="sum" ? sec.id!=="babR" : B.mode==="part" ? sec.id!=="babP" : sec.id!=="bab"+n; });
  setHead();
  const act=$("#dockAct");
  if(B.mode==="baca"){
    act.innerHTML=`<div class="babbar"><button class="nav" id="bpPrev" aria-label="Bab sebelumnya" ${n<=FIRSTB?"disabled":""}>‹</button>
      <select id="bpSel" aria-label="Pilih bab">${BABS_BP.map(k=>`<option value="${k}" ${k===n?"selected":""}>Bab ${k} · ${nBab(k)} pola</option>`).join("")}</select>
      <button class="nav" id="bpNext" aria-label="Bab berikutnya" ${n>=LASTB?"disabled":""}>›</button></div>`;
    $("#bpPrev").onclick=()=>goBab(n-1); $("#bpNext").onclick=()=>goBab(n+1); $("#bpSel").onchange=e=>goBab(+e.target.value);
  } else if(B.mode==="part"){
    act.innerHTML=`<div class="babbar"><button class="nav" id="ppPrev" aria-label="Partikel sebelumnya" ${PI<=0?"disabled":""}>‹</button>
      <select id="ppSel" aria-label="Pilih partikel">${PART.map((x,i)=>`<option value="${i}" ${i===PI?"selected":""}>${x.p} (${x.r}) · ${x.u.length} fungsi</option>`).join("")}</select>
      <button class="nav" id="ppNext" aria-label="Partikel berikutnya" ${PI>=PART.length-1?"disabled":""}>›</button></div>`;
    $("#ppPrev").onclick=()=>goPart(PI-1); $("#ppNext").onclick=()=>goPart(PI+1); $("#ppSel").onchange=e=>goPart(+e.target.value);
    PI=-1; syncPart();
  } else if(B.mode==="sum"){
    act.innerHTML=`<div class="babbar"><button class="nav" id="smPrev" aria-label="Bab sebelumnya">‹</button>
      <select id="smSel" aria-label="Pilih bab">${SB.map((el,i)=>`<option value="${i}">Bab ${sumNo(el,i)} · ${el.querySelectorAll(".srow").length} pola</option>`).join("")}</select>
      <button class="nav" id="smNext" aria-label="Bab berikutnya">›</button></div>`;
    $("#smPrev").onclick=()=>goSum(SI-1); $("#smNext").onclick=()=>goSum(SI+1); $("#smSel").onchange=e=>goSum(+e.target.value);
    SI=-1; syncSum();
  } else act.innerHTML="";
}
function goBab(k){ if(!BABS_BP.includes(k)) return; setBab(k); render(); window.scrollTo({top:0}); }
function jumpTo(bab,no){
  if(!BABS_BP.includes(bab)){ setBook(bab>25?2:1,[bab,no]); return; }
  B.mode="baca"; setBab(bab); render();
  const art=$$('#bab'+bab+' .row')[no-1];
  if(art){ art.scrollIntoView({behavior:'smooth',block:'start'}); art.classList.remove('flash'); void art.offsetWidth; art.classList.add('flash'); }
}
$$('#bp .srow, #bp .pbab').forEach(r=>r.addEventListener('click',()=>jumpTo(+r.dataset.bab,+r.dataset.card)));
if(window.PENDING_JUMP&&BABS_BP.includes(window.PENDING_JUMP[0])){ const pj=window.PENDING_JUMP; window.PENDING_JUMP=null; setTimeout(()=>{ jumpTo(pj[0],pj[1]); },350); }
$("#bp-baca").onclick=()=>{ B.mode="baca"; render(); window.scrollTo({top:0}); };
$("#bp-sum").onclick=()=>{ B.mode="sum"; render(); window.scrollTo({top:0}); };
$("#bp-part").onclick=()=>{ B.mode="part"; render(); window.scrollTo({top:0}); };
window.APP_PAGE="kt"; window.setPage=setPage;
var start="kt"; try{ start=localStorage.getItem("mnn-page")||"kt"; }catch(e){} if(window.START_PAGE) start=window.START_PAGE;
if(start==="bp") setPage("bp");
})();
