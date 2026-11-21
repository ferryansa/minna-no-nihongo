
/* ===== Numbers & Conjugation: numbers, time, counters, conjugation ===== */
(function(){
/* "*" before a reading = sound change / irregular */
var rd=s=>String(s).split("、").map(p=>p.startsWith("*")?`<span class="irr">${esc(p.slice(1))}</span>`:esc(p)).join("、");
var rubify=s=>esc(s).replace(/([一-龯々]+)\{([^}]+)\}/g,'<ruby>$1<rt>$2</rt></ruby>');
var N5K="日一国人年大十二本中長出三時行見月分後前生五間上東四今金九入学高円子外八六下来気小七山話女北午百書先名川千水半男西電校語土木聞食車何南万毎白天母火右読友左休父雨会社駅週曜夕冬世代早夜夏朝度春昼秋兄主自体弟妹姉医者親員族私台町地京室家場屋界院野銀館堂店道図画教理究研答習漢意味勉問題計英試験質文字力工牛肉色空音海茶紙鳥服物歌洋風料飯品犬田花魚止去走歩通待持送起転運開集動着帰立切写仕考作売知思住使始発終注映建借貸言買飲正元公広不同近有死明強楽重病別特悪急真少古赤多青安黒新心方用以事業旅口手目足";
function ui(m){ return esc(m).replace(/([一-龯々]+)\{([^}]+)\}/g,(x,k,r)=>[...k].every(c=>N5K.includes(c))?`<ruby>${k}<rt>${r}</rt></ruby>`:r); }
var J=(m,id)=>`${ui(m)}${id?`<i>${esc(id)}</i>`:""}`;
var UR={"～時":"じ","～分":"ふん","～月":"がつ","～日":"にち","～時間":"じかん","～週間":"しゅうかん","～か月":"かげつ","～年":"ねん","～曜日":"ようび","～人":"にん","～番":"ばん","～枚":"まい","～台":"だい","～歳":"さい","～冊":"さつ","～着":"ちゃく","～回":"かい","～個":"こ","～足":"そく","～軒":"けん","～階":"かい","～本":"ほん","～杯":"はい","～匹":"ひき"};
var uR=u=>UR[u]?rubify(u.replace(/([一-龯々]+)/,"$1{"+UR[u]+"}")):esc(u);

var NUM=[
 {t:"0 – 19",rows:[["0","ゼロ、れい"],["1","いち"],["2","に"],["3","さん"],["4","よん、し"],["5","ご"],["6","ろく"],["7","なな、しち"],["8","はち"],["9","きゅう、く"],["10","じゅう"],["11","じゅういち"],["12","じゅうに"],["13","じゅうさん"],["14","じゅうよん、じゅうし"],["15","じゅうご"],["16","じゅうろく"],["17","じゅうなな、じゅうしち"],["18","じゅうはち"],["19","じゅうきゅう、じゅうく"]]},
 {t:"Puluhan",rows:[["20","にじゅう"],["30","さんじゅう"],["40","よんじゅう"],["50","ごじゅう"],["60","ろくじゅう"],["70","ななじゅう、しちじゅう"],["80","はちじゅう"],["90","きゅうじゅう"]]},
 {t:"Ratusan",rows:[["100","ひゃく"],["200","にひゃく"],["300","*さんびゃく"],["400","よんひゃく"],["500","ごひゃく"],["600","*ろっぴゃく"],["700","ななひゃく"],["800","*はっぴゃく"],["900","きゅうひゃく"]]},
 {t:"Ribuan",rows:[["1,000","せん"],["2,000","にせん"],["3,000","*さんぜん"],["4,000","よんせん"],["5,000","ごせん"],["6,000","ろくせん"],["7,000","ななせん"],["8,000","*はっせん"],["9,000","きゅうせん"]]},
 {t:"Puluhan ribu ke atas",rows:[["10,000","いちまん"],["100,000","じゅうまん"],["1,000,000","ひゃくまん"],["10,000,000","せんまん"],["100,000,000","いちおく"]]},
 {t:"Desimal & pecahan",rows:[["17.5","じゅうななてんご"],["0.83","れいてんはちさん"],["½","にぶんの いち"],["¾","よんぶんの さん"]]}
];

var DAY=[["おととい","kemarin lusa","おとといの あさ","kemarin lusa pagi","おとといの ばん（よる）","kemarin lusa malam"],
 ["きのう","kemarin","きのうの あさ","kemarin pagi","きのうの ばん（よる）","kemarin malam"],
 ["きょう","hari ini","けさ","tadi pagi","こんばん（きょうの よる）","malam ini"],
 ["あした","besok","あしたの あさ","besok pagi","あしたの ばん（よる）","besok malam"],
 ["あさって","lusa","あさっての あさ","lusa pagi","あさっての ばん（よる）","lusa malam"],
 ["まいにち","setiap hari","まいあさ","setiap pagi","まいばん","setiap malam"]];
var WMY=[["せんせんしゅう（にしゅうかんまえ）","dua minggu lalu","せんせんげつ（にかげつまえ）","dua bulan lalu","おととし","dua tahun lalu"],
 ["せんしゅう","minggu lalu","せんげつ","bulan lalu","きょねん","tahun lalu"],
 ["こんしゅう","minggu ini","こんげつ","bulan ini","ことし","tahun ini"],
 ["らいしゅう","minggu depan","らいげつ","bulan depan","らいねん","tahun depan"],
 ["さらいしゅう","dua minggu lagi","さらいげつ","dua bulan lagi","さらいねん","dua tahun lagi"],
 ["まいしゅう","setiap minggu","まいつき","setiap bulan","まいとし、まいねん","setiap tahun"]];

/* patterned number table: {key, t (title), u (kanji unit), q (question for "?"), rows:[[label, reading]]} */
var n10=(arr,q)=>arr.map((r,i)=>[i<arr.length-1?String(i+1):"?",r]);
var JAM={key:"jam",t:"Jam",u:"～時",q:"何時",rows:[["1","いちじ"],["2","にじ"],["3","さんじ"],["4","*よじ"],["5","ごじ"],["6","ろくじ"],["7","*しちじ"],["8","はちじ"],["9","*くじ"],["10","じゅうじ"],["11","じゅういちじ"],["12","じゅうにじ"],["?","なんじ"]]};
var MENIT={key:"menit",t:"Menit",u:"～分",q:"何分",rows:[["1","*いっぷん"],["2","にふん"],["3","*さんぷん"],["4","*よんぷん"],["5","ごふん"],["6","*ろっぷん"],["7","ななふん"],["8","*はっぷん"],["9","きゅうふん"],["10","*じゅっぷん、*じっぷん"],["15","じゅうごふん"],["30","*さんじゅっぷん、*さんじっぷん、はん"],["?","*なんぷん"]]};
var HARI=[["日曜日","にちようび","Minggu"],["月曜日","げつようび","Senin"],["火曜日","かようび","Selasa"],["水曜日","すいようび","Rabu"],["木曜日","もくようび","Kamis"],["金曜日","きんようび","Jumat"],["土曜日","どようび","Sabtu"],["何曜日","なんようび","hari apa"]];
var BULAN={key:"bulan",t:"Bulan",u:"～月",q:"何月",rows:[["1","いちがつ"],["2","にがつ"],["3","さんがつ"],["4","*しがつ"],["5","ごがつ"],["6","ろくがつ"],["7","*しちがつ"],["8","はちがつ"],["9","*くがつ"],["10","じゅうがつ"],["11","じゅういちがつ"],["12","じゅうにがつ"],["?","なんがつ"]]};
var TGL={key:"tanggal",t:"Tanggal",u:"～日",q:"何日",rows:[["1","*ついたち"],["2","*ふつか"],["3","*みっか"],["4","*よっか"],["5","*いつか"],["6","*むいか"],["7","*なのか"],["8","*ようか"],["9","*ここのか"],["10","*とおか"],["11","じゅういちにち"],["12","じゅうににち"],["13","じゅうさんにち"],["14","*じゅうよっか"],["15","じゅうごにち"],["16","じゅうろくにち"],["17","*じゅうしちにち"],["18","じゅうはちにち"],["19","*じゅうくにち"],["20","*はつか"],["21","にじゅういちにち"],["22","にじゅうににち"],["23","にじゅうさんにち"],["24","*にじゅうよっか"],["25","にじゅうごにち"],["26","にじゅうろくにち"],["27","*にじゅうしちにち"],["28","にじゅうはちにち"],["29","*にじゅうくにち"],["30","さんじゅうにち"],["31","さんじゅういちにち"],["?","なんにち"]]};
var LJAM={key:"ljam",t:"… jam (lamanya)",u:"～時間",q:"何時間",rows:n10(["いちじかん","にじかん","さんじかん","*よじかん","ごじかん","ろくじかん","ななじかん、しちじかん","はちじかん","*くじかん","じゅうじかん","なんじかん"])};
var LMENIT={key:"lmenit",t:"… menit (lamanya)",u:"～分",q:"何分",rows:n10(["*いっぷん","にふん","*さんぷん","*よんぷん","ごふん","*ろっぷん","ななふん","*はっぷん","きゅうふん","*じゅっぷん、*じっぷん","*なんぷん"])};
var LHARI={key:"lhari",t:"… hari",u:"～日",q:"何日",rows:n10(["*いちにち","*ふつか","*みっか","*よっか","*いつか","*むいか","*なのか","*ようか","*ここのか","*とおか","なんにち"])};
var LMGG={key:"lmgg",t:"… minggu",u:"～週間",q:"何週間",rows:n10(["*いっしゅうかん","にしゅうかん","さんしゅうかん","よんしゅうかん","ごしゅうかん","ろくしゅうかん","ななしゅうかん","*はっしゅうかん","きゅうしゅうかん","*じゅっしゅうかん、*じっしゅうかん","なんしゅうかん"])};
var LBLN={key:"lbln",t:"… bulan",u:"～か月",q:"何か月",rows:n10(["*いっかげつ","にかげつ","さんかげつ","よんかげつ","ごかげつ","*ろっかげつ、*はんとし","ななかげつ","はちかげつ、*はっかげつ","きゅうかげつ","*じゅっかげつ、*じっかげつ","なんかげつ"])};
var LTHN={key:"lthn",t:"… tahun",u:"～年",q:"何年",rows:n10(["いちねん","にねん","さんねん","*よねん","ごねん","ろくねん","ななねん、しちねん","はちねん","きゅうねん","じゅうねん","なんねん"])};

var CTR=[
 {key:"tsu",u:"～つ",t:"benda (umum)",q:"いくつ",rows:n10(["*ひとつ","*ふたつ","*みっつ","*よっつ","*いつつ","*むっつ","*ななつ","*やっつ","*ここのつ","*とお","いくつ"])},
 {key:"nin",u:"～人",t:"orang",q:"何人",rows:n10(["*ひとり","*ふたり","さんにん","*よにん","ごにん","ろくにん","ななにん、しちにん","はちにん","きゅうにん","じゅうにん","なんにん"])},
 {key:"ban",u:"～番",t:"urutan, nomor",q:"何番",rows:n10(["いちばん","にばん","さんばん","よんばん","ごばん","ろくばん","ななばん","はちばん","きゅうばん","じゅうばん","なんばん"])},
 {key:"mai",u:"～枚",t:"benda tipis dan datar",q:"何枚",rows:n10(["いちまい","にまい","さんまい","よんまい","ごまい","ろくまい","ななまい","はちまい","きゅうまい","じゅうまい","なんまい"])},
 {key:"dai",u:"～台",t:"mesin dan kendaraan",q:"何台",rows:n10(["いちだい","にだい","さんだい","よんだい","ごだい","ろくだい","ななだい","はちだい","きゅうだい","じゅうだい","なんだい"])},
 {key:"sai",u:"～歳",t:"umur",q:"何歳",rows:n10(["*いっさい","にさい","さんさい","よんさい","ごさい","ろくさい","ななさい","*はっさい","きゅうさい","*じゅっさい、*じっさい","なんさい"])},
 {key:"satsu",u:"～冊",t:"buku dan buku catatan",q:"何冊",rows:n10(["*いっさつ","にさつ","さんさつ","よんさつ","ごさつ","ろくさつ","ななさつ","*はっさつ","きゅうさつ","*じゅっさつ、*じっさつ","なんさつ"])},
 {key:"chaku",u:"～着",t:"pakaian",q:"何着",rows:n10(["*いっちゃく","にちゃく","さんちゃく","よんちゃく","ごちゃく","ろくちゃく","ななちゃく","*はっちゃく","きゅうちゃく","*じゅっちゃく、*じっちゃく","なんちゃく"])},
 {key:"kai",u:"～回",t:"frekuensi (kali)",q:"何回",rows:n10(["*いっかい","にかい","さんかい","よんかい","ごかい","*ろっかい","ななかい","*はっかい","きゅうかい","*じゅっかい、*じっかい","なんかい"])},
 {key:"ko",u:"～個",t:"benda kecil",q:"何個",rows:n10(["*いっこ","にこ","さんこ","よんこ","ごこ","*ろっこ","ななこ","*はっこ","きゅうこ","*じゅっこ、*じっこ","なんこ"])},
 {key:"soku",u:"～足",t:"sepatu dan kaus kaki",q:"何足",rows:n10(["*いっそく","にそく","*さんぞく","よんそく","ごそく","ろくそく","ななそく","*はっそく","きゅうそく","*じゅっそく、*じっそく","*なんぞく"])},
 {key:"ken",u:"～軒",t:"rumah",q:"何軒",rows:n10(["*いっけん","にけん","*さんげん","よんけん","ごけん","*ろっけん","ななけん","*はっけん","きゅうけん","*じゅっけん、*じっけん","*なんげん"])},
 {key:"gai",u:"～階",t:"lantai bangunan",q:"何階",rows:n10(["*いっかい","にかい","*さんがい","よんかい","ごかい","*ろっかい","ななかい","*はっかい","きゅうかい","*じゅっかい、*じっかい","*なんがい"])},
 {key:"hon",u:"～本",t:"benda kurus dan panjang",q:"何本",rows:n10(["*いっぽん","にほん","*さんぼん","よんほん","ごほん","*ろっぽん","ななほん","*はっぽん","きゅうほん","*じゅっぽん、*じっぽん","*なんぼん"])},
 {key:"hai",u:"～杯",t:"minuman dalam cangkir/gelas",q:"何杯",rows:n10(["*いっぱい","にはい","*さんばい","よんはい","ごはい","*ろっぱい","ななはい","*はっぱい","きゅうはい","*じゅっぱい、*じっぱい","*なんばい"])},
 {key:"hiki",u:"～匹",t:"binatang kecil, ikan, serangga",q:"何匹",rows:n10(["*いっぴき","にひき","*さんびき","よんひき","ごひき","*ろっぴき","ななひき","*はっぴき","きゅうひき","*じゅっぴき、*じっぴき","*なんびき"])}
];

/* ---- Conjugation: [label, ます form without ます, meaning, chapter] ---- */
var V1=[["会います［ともだちに～］","あい","bertemu (teman)",6],["遊びます","あそび","bermain",13],["洗います","あらい","mencuci",18],["あります","あり","ada, mempunyai",9],["あります","あり","ada (benda mati)",10],["あります［おまつりが～］","あり","ada, diadakan (festival)",21],["歩きます","あるき","berjalan kaki",23],["言います","いい","mengatakan, berkata",21],["行きます","いき","pergi",5],["急ぎます","いそぎ","buru-buru",14],["要ります［ビザが～］","いり","memerlukan (visa)",20],["動きます","うごき","bergerak",21],["歌います","うたい","bernyanyi",18],["売ります","うり","menjual",15],["置きます","おき","meletakkan, menaruh",15],["送ります","おくり","mengirim",7],["送ります［ひとを～］","おくり","mengantar (orang)",24],["押します","おし","menekan",16],["思い出します","おもいだし","teringat",15],["思います","おもい","mengira, berpikir",21],["泳ぎます","およぎ","berenang",13],["下ろします［おかねを～］","おろし","mengambil (uang)",16],["終わります","おわり","selesai",4],["買います","かい","membeli",6],["返します","かえし","mengembalikan",17],["帰ります","かえり","pulang",5],["かかります","かかり","memakan, perlu (waktu/uang)",11],["書きます","かき","menulis, menggambar",6],["貸します","かし","meminjamkan",7],["勝ちます","かち","menang",21],["かぶります","かぶり","memakai (topi)",22],["頑張ります","がんばり","berusaha keras",25],["聞きます","きき","mendengar",6],["聞きます［せんせいに～］","きき","bertanya (kepada guru)",23],["切ります","きり","memotong",7],["消します","けし","mematikan",14],["触ります［ドアに～］","さわり","menyentuh (pintu)",23],["知ります","しり","mengetahui",15],["吸います［たばこを～］","すい","merokok",6],["住みます","すみ","tinggal",15],["座ります","すわり","duduk",14],["出します","だし","mengeluarkan, mengirim",16],["立ちます","たち","berdiri",14],["使います","つかい","memakai",14],["着きます","つき","tiba, sampai",25],["作ります、造ります","つくり","membuat",15],["連れて 行きます","つれて いき","mengajak pergi (orang)",24],["手伝います","てつだい","membantu",14],["泊まります［ホテルに～］","とまり","menginap (di hotel)",19],["取ります","とり","mengambil",14],["撮ります［しゃしんを～］","とり","mengambil (foto)",6],["取ります［としを～］","とり","bertambah tua",25],["直します","なおし","mengoreksi",24],["なくします","なくし","kehilangan",17],["習います","ならい","belajar (dari orang)",7],["なります","なり","menjadi",19],["脱ぎます","ぬぎ","melepas (baju, sepatu)",17],["登ります、上ります","のぼり","naik",19],["飲みます","のみ","minum",6],["飲みます","のみ","minum (minuman keras)",16],["飲みます［くすりを～］","のみ","minum (obat)",17],["乗ります［でんしゃに～］","のり","naik (kereta)",16],["入ります［きっさてんに～］","はいり","masuk (kedai kopi)",14],["入ります［だいがくに～］","はいり","masuk (universitas)",16],["入ります［おふろに～］","はいり","mandi berendam",17],["はきます","はき","memakai (sepatu, celana)",22],["働きます","はたらき","bekerja",4],["話します","はなし","berbicara",14],["払います","はらい","membayar",17],["弾きます","ひき","memainkan (piano, gitar)",18],["引きます","ひき","menarik",23],["降ります［あめが～］","ふり","turun (hujan)",14],["曲がります［みぎへ～］","まがり","belok (ke kanan)",23],["待ちます","まち","menunggu",14],["回します","まわし","memutar",23],["持ちます","もち","membawa, memegang",14],["持って 行きます","もって いき","membawa pergi",17],["もらいます","もらい","menerima",7],["役に 立ちます","やくに たち","berguna",21],["休みます","やすみ","beristirahat, libur",4],["休みます［かいしゃを～］","やすみ","tidak masuk (kerja)",11],["呼びます","よび","memanggil",14],["読みます","よみ","membaca",6],["わかります","わかり","mengerti",9],["渡ります［はしを～］","わたり","menyeberang (jembatan)",23]];
var V2=[["開けます","あけ","membuka",14],["あげます","あげ","memberikan",7],["集めます","あつめ","mengumpulkan",18],["浴びます［シャワーを～］","あび","mandi (pancuran)",16],["います","い","ada (makhluk hidup)",10],["います［こどもが～］","い","mempunyai (anak)",11],["います［にほんに～］","い","ada, tinggal (di Jepang)",11],["入れます","いれ","memasukkan",16],["生まれます","うまれ","lahir",22],["起きます","おき","bangun",4],["教えます","おしえ","mengajar",7],["教えます［じゅうしょを～］","おしえ","memberitahukan (alamat)",14],["覚えます","おぼえ","mengingat, menghafal",17],["降ります［でんしゃを～］","おり","turun (dari kereta)",16],["換えます","かえ","menukar, mengganti",18],["変えます","かえ","mengubah",23],["かけます［でんわを～］","かけ","menelepon",7],["かけます［めがねを～］","かけ","memakai (kacamata)",22],["借ります","かり","meminjam",7],["考えます","かんがえ","berpikir",25],["着ます","き","memakai (kemeja)",22],["気を つけます","きを つけ","berhati-hati",21],["くれます","くれ","memberi (kepada saya)",24],["閉めます","しめ","menutup",14],["調べます","しらべ","memeriksa",20],["捨てます","すて","membuang",18],["食べます","たべ","makan",6],["足ります","たり","cukup",25],["疲れます","つかれ","lelah",13],["つけます","つけ","menyalakan",14],["出かけます","でかけ","pergi keluar",17],["できます","でき","dapat, bisa",18],["出ます［おつりが～］","で","keluar (uang kembalian)",23],["出ます［きっさてんを～］","で","keluar (dari kedai kopi)",14],["出ます［だいがくを～］","で","tamat (universitas)",16],["止めます","とめ","menghentikan, memarkir",14],["寝ます","ね","tidur",4],["乗り換えます","のりかえ","ganti kendaraan",16],["始めます","はじめ","memulai",16],["負けます","まけ","kalah",21],["見せます","みせ","memperlihatkan",14],["見ます","み","melihat, menonton",6],["迎えます","むかえ","menjemput",13],["やめます［かいしゃを～］","やめ","berhenti (kerja)",21],["忘れます","わすれ","lupa",17]];
var V3=[["案内します","あんないし","memandu, mengantarkan",24],["運転します","うんてんし","menyetir",18],["買い物します","かいものし","berbelanja",13],["来ます","き","datang",5],["結婚します","けっこんし","menikah",13],["見学します","けんがくし","kunjungan belajar",16],["研究します","けんきゅうし","meneliti",15],["コピーします","コピーし","memfotokopi",14],["散歩します［こうえんを～］","さんぽし","jalan-jalan (di taman)",13],["残業します","ざんぎょうし","lembur",17],["します","し","melakukan, mengerjakan",6],["します［ネクタイを～］","し","memakai (dasi)",22],["修理します","しゅうりし","memperbaiki",20],["出張します","しゅっちょうし","dinas ke luar kota",17],["紹介します","しょうかいし","memperkenalkan",24],["食事します","しょくじし","makan",13],["心配します","しんぱいし","khawatir",17],["説明します","せつめいし","menjelaskan",24],["洗濯します","せんたくし","mencuci pakaian",19],["掃除します","そうじし","membersihkan",19],["連れて 来ます","つれて き","membawa datang (orang)",24],["電話します","でんわし","menelepon",16],["勉強します","べんきょうし","belajar",4],["持って 来ます","もって き","membawa datang",17],["予約します","よやくし","memesan, reservasi",18],["留学します","りゅうがくし","belajar di luar negeri",21]];

var U={"い":"う","き":"く","ぎ":"ぐ","し":"す","ち":"つ","に":"ぬ","び":"ぶ","み":"む","り":"る"};
var A={"い":"わ","き":"か","ぎ":"が","し":"さ","ち":"た","に":"な","び":"ば","み":"ま","り":"ら"};
var T={"い":"って","ち":"って","り":"って","に":"んで","び":"んで","み":"んで","き":"いて","ぎ":"いで","し":"して"};
function conj(g,stemFull){
  const sp=stemFull.lastIndexOf(" "); const pre=sp<0?"":stemFull.slice(0,sp+1); const st=sp<0?stemFull:stemFull.slice(sp+1);
  let f;
  if(g===1){
    const last=st.slice(-1), base=st.slice(0,-1);
    let te=base+T[last], irrTe=false;
    if(st==="いき"){ te="いって"; irrTe=true; }
    const nai = st==="あり" ? {v:"ない",irr:true} : {v:base+A[last]+"ない"};
    f={masu:st+"ます",te:{v:te,irr:irrTe},dict:base+U[last],nai,ta:{v:te.replace(/て$/,"た").replace(/で$/,"だ"),irr:irrTe}};
  } else if(g===2){
    f={masu:st+"ます",te:st+"て",dict:st+"る",nai:st+"ない",ta:st+"た"};
  } else {
    if(st==="き") f={masu:"きます",te:{v:"きて",irr:true},dict:{v:"くる",irr:true},nai:{v:"こない",irr:true},ta:{v:"きた",irr:true}};
    else { const b=st.slice(0,-1); f={masu:st+"ます",te:st+"て",dict:b+"する",nai:st+"ない",ta:st+"た"}; }
  }
  const o={}; for(const k in f){ const x=typeof f[k]==="string"?{v:f[k]}:f[k]; o[k]={v:pre+x.v,irr:!!x.irr}; }
  return o;
}
var VERBS=[].concat(V1.map(v=>({g:1,v})),V2.map(v=>({g:2,v})),V3.map(v=>({g:3,v}))).map(({g,v})=>({g,label:v[0],stem:v[1],arti:v[2],bab:v[3],f:conj(g,v[1])}));
var FORMS=[["masu","ます形{けい}","ます"],["te","て形{けい}","て"],["dict","辞書形{じしょけい}","kamus"],["nai","ない形{けい}","ない"],["ta","た形{けい}","た"]];
window.__VERBS=VERBS;

/* ---- state & render ---- */
var L={sec:"bil",grp:"all",bab:BOOK===2?50:25,qset:"ctr",qform:"te",shown:false,idx:0,shuffle:false,unlearned:false,order:null};
/* Called every time the user switches to かず・かつよう: always start from the Numbers section */
window.resetLampiran=function(){ L.sec="bil"; L.idx=0; L.shown=false; };
var QKEY=(MK+"renshuu-v1"); let learnedQ=new Set();
try{ learnedQ=new Set(JSON.parse(localStorage.getItem(QKEY)||"[]")); }catch(e){}
var saveQ=()=>{ try{ localStorage.setItem(QKEY,JSON.stringify([...learnedQ])); }catch(e){} };
var SECS=[["bil","数字{すうじ}","Bilangan"],["waktu","時間{じかん}","Waktu"],["ctr","助数詞{じょすうし}","Kata bantu bilangan"],["verb","活用{かつよう}","Konjugasi"],["latihan","練習{れんしゅう}","Latihan"]];

function tblPairs(title,rows,cls){
  return `<div class="ltbox"><table class="lt ${cls||""}"><caption>${title}</caption><tbody>${rows.map(r=>`<tr><td class="n">${esc(r[0])}</td><td>${rd(r[1])}</td></tr>`).join("")}</tbody></table></div>`;
}
function tblPattern(t){ return tblPairs(`${esc(t.t)}<span class="u">${uR(t.u)}</span>`,t.rows); }
function tblCtr(group){
  const head=`<tr><th style="width:2.4em"></th>${group.map(c=>`<th><span class="u">${uR(c.u)}</span>${esc(c.t)}</th>`).join("")}</tr>`;
  const body=group[0].rows.map((r,i)=>`<tr><td class="n">${esc(r[0])}</td>${group.map(c=>`<td>${rd(c.rows[i][1])}</td>`).join("")}</tr>`).join("");
  return `<div class="ltbox"><table class="lt ctr"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}
function tbl3(head,rows){
  return `<div class="ltbox"><table class="lt"><thead><tr>${head.map(h=>`<th><span class="u">${ui(h[0])}</span>${esc(h[1])}</th>`).join("")}</tr></thead><tbody>${
    rows.map(r=>`<tr>${[0,2,4].map(i=>`<td>${rd(r[i])}<span class="id">${esc(r[i+1])}</span></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function secBil(){
  return `<div class="lsec"><h2><span class="hj">${ui("数字{すうじ}")}</span>Kata bilangan</h2><p class="sub">Angka dari 0 sampai ratusan juta. Bunyi yang berubah ada di ratusan dan ribuan.</p>
  <div class="lgrid">${NUM.map(t=>tblPairs(esc(t.t),t.rows,"num")).join("")}</div></div>`;
}
function secWaktu(){
  const hariTbl=`<div class="ltbox"><table class="lt"><caption>Hari<span class="u">${uR("～曜日")}</span></caption><tbody>${HARI.map(h=>`<tr><td>${esc(h[1])}<span class="kj">${esc(h[0])}</span></td><td style="font-family:var(--f-body);font-size:13px;color:var(--muted)">${esc(h[2])}</td></tr>`).join("")}</tbody></table></div>`;
  const tg=TGL.rows, half=Math.ceil(tg.length/2);
  return `<div class="lsec">
  <h2><span class="hj">${ui("時{とき}の 表現{ひょうげん}")}</span>Hari, pagi, malam</h2>
  ${tbl3([["日{ひ}","Hari"],["朝{あさ}","Pagi"],["晩{ばん}","Malam"]],DAY)}
  <h2><span class="hj">${ui("週{しゅう}・月{つき}・年{とし}")}</span>Minggu, bulan, tahun</h2>
  ${tbl3([["週{しゅう}","Minggu"],["月{つき}","Bulan"],["年{とし}","Tahun"]],WMY)}
  <h2><span class="hj">${ui("時刻{じこく}・日付{ひづけ}")}</span>Penanda waktu</h2><p class="sub">Jam, menit, hari, bulan, dan tanggal.</p>
  <div class="lgrid">${tblPattern(JAM)}${tblPattern(MENIT)}${hariTbl}${tblPattern(BULAN)}</div>
  <h2><span class="hj">${ui("日付{ひづけ}")}</span>Tanggal</h2><p class="sub">Tanggal 1–10, 14, 20, dan 24 punya bacaan khusus.</p>
  <div class="lgrid">${tblPairs("1 – 16",tg.slice(0,half))}${tblPairs("17 – 31",tg.slice(half))}</div>
  <h2><span class="hj">${ui("期間{きかん}")}</span>Lama waktu</h2><p class="sub">Untuk menyatakan berapa lama, bukan pukul atau tanggal.</p>
  <div class="lgrid">${[LJAM,LMENIT,LHARI,LMGG,LBLN,LTHN].map(tblPattern).join("")}</div></div>`;
}
function secCtr(){
  const g=[CTR.slice(0,4),CTR.slice(4,8),CTR.slice(8,12),CTR.slice(12,16)];
  return `<div class="lsec"><h2><span class="hj">${ui("助数詞{じょすうし}")}</span>Kata bantu bilangan</h2><p class="sub">Dipakai saat menghitung benda. Pilih kata bantu sesuai jenis bendanya.</p>
  <div class="lgrid wide">${g.map(tblCtr).join("")}</div></div>`;
}
function vfilterHtml(){
  const babs=[...new Set(VERBS.map(v=>v.bab))].sort((a,b)=>a-b);
  return `<div class="vfilters">
   <div class="ctl"><span class="cl">グループ<i>Golongan</i></span>${[["all","ぜんぶ","Semua"],["1","Ⅰ","Gol. I"],["2","Ⅱ","Gol. II"],["3","Ⅲ","Gol. III"]].map(([k,j,t])=>`<button class="chip" data-grp="${k}" aria-pressed="${L.grp===k}">${J(j,t)}</button>`).join("")}</div>
   <div class="ctl"><span class="cl">まで<i>Sampai</i></span><select id="vbab">${babs.map(b=>`<option value="${b}" ${b===L.bab?"selected":""}>だい${b}か · Bab ${b}</option>`).join("")}</select></div>
  </div>`;
}
var verbPool=()=>VERBS.filter(v=>(L.grp==="all"||String(v.g)===L.grp)&&v.bab<=L.bab);
function fmt(x){ return x.irr?`<span class="irr">${esc(x.v)}</span>`:esc(x.v); }
function secVerb(){
  const list=verbPool();
  const gname={1:["Ⅰグループ","Golongan I"],2:["Ⅱグループ","Golongan II"],3:["Ⅲグループ","Golongan III"]};
  let html="", cur=0;
  list.forEach(v=>{
    if(v.g!==cur){ if(cur) html+=`</div>`; cur=v.g; html+=`<h2><span class="hj">${gname[v.g][0]}</span>${gname[v.g][1]}</h2><div class="vlist"><div class="vrow vhrow"><div class="vhl">KATA KERJA<i>Arti · Bab</i></div><div class="vforms">${FORMS.map(([k,j,t])=>`<div class="vf">${ui(j)}<i>${t==="kamus"?"kamus":"bentuk "+t}</i></div>`).join("")}</div></div>`; }
    const m=v.label.match(/^(.*?)(［.*］)?$/);
    html+=`<div class="vrow"><div class="vhead"><div class="vl">${esc(m[1])}${m[2]?` <small>${esc(m[2])}</small>`:""}</div><div class="va">${esc(v.arti)}<span class="vb">Bab ${v.bab}</span></div></div>
     <div class="vforms">${FORMS.map(([k,j])=>`<div class="vf"><i>${ui(j)}</i>${fmt(v.f[k])}</div>`).join("")}</div></div>`;
  });
  if(cur) html+=`</div>`;
  return `<div class="lsec"><h2><span class="hj">${ui("動詞{どうし}の 活用{かつよう}")}</span>Konjugasi kata kerja</h2>
  <p class="sub">Golongan I berubah bunyi di bentuk て dan た. Golongan II cukup buang ます. Golongan III: kata kerja ～します mengikuti pola する, sedangkan 来ます (くる) tidak beraturan.</p>
  ${vfilterHtml()}<p class="vcount">${list.length} kata kerja</p>${list.length?html:`<p class="sub">Tidak ada kata kerja untuk filter ini.</p>`}</div>`;
}

/* ---- Practice ---- */
/* Indonesian meanings for the practice answers */
var SAT=["","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan"];
function idWords(n){
  if(n===0) return "nol";
  const f=(x)=>{ if(x<10) return SAT[x]; if(x===10) return "sepuluh"; if(x===11) return "sebelas"; if(x<20) return SAT[x-10]+" belas";
    if(x<100) return SAT[Math.floor(x/10)]+" puluh"+(x%10?" "+SAT[x%10]:"");
    if(x<200) return "seratus"+(x%100?" "+f(x%100):""); if(x<1000) return SAT[Math.floor(x/100)]+" ratus"+(x%100?" "+f(x%100):"");
    if(x<2000) return "seribu"+(x%1000?" "+f(x%1000):""); if(x<1e6) return f(Math.floor(x/1000))+" ribu"+(x%1000?" "+f(x%1000):"");
    if(x<1e9) return f(Math.floor(x/1e6))+" juta"+(x%1e6?" "+f(x%1e6):""); return String(x); };
  return f(n);
}
function numArti(lbl){
  if(lbl==="½") return "setengah"; if(lbl==="¾") return "tiga perempat";
  if(lbl.includes(".")){ const [i,d]=lbl.split("."); return idWords(+i)+" koma "+[...d].map(c=>c==="0"?"nol":SAT[+c]).join(" "); }
  const n=+lbl.replace(/,/g,""); return idWords(n);
}
var CTR_M={tsu:["buah","berapa buah"],nin:["orang","berapa orang"],ban:["nomor","nomor berapa",1],mai:["lembar","berapa lembar"],dai:["unit (mesin/kendaraan)","berapa unit"],
  sai:["tahun (umur)","umur berapa"],satsu:["buku","berapa buku"],chaku:["potong pakaian","berapa potong"],kai:["kali","berapa kali"],ko:["buah (benda kecil)","berapa buah"],
  soku:["pasang (sepatu/kaus kaki)","berapa pasang"],ken:["rumah","berapa rumah"],gai:["lantai","lantai berapa",1],hon:["batang (benda panjang)","berapa batang"],
  hai:["gelas/cangkir","berapa gelas"],hiki:["ekor","berapa ekor"]};
var BLN=["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
var T_M={jam:[n=>`jam ${n}`,"jam berapa"],menit:[n=>`${n} menit`,"berapa menit"],bulan:[n=>`bulan ${BLN[n]}`,"bulan apa"],tanggal:[n=>`tanggal ${n}`,"tanggal berapa"],
  ljam:[n=>`${n} jam (lamanya)`,"berapa jam"],lhari:[n=>`${n} hari`,"berapa hari"],lmgg:[n=>`${n} minggu`,"berapa minggu"],lbln:[n=>`${n} bulan`,"berapa bulan"],lthn:[n=>`${n} tahun`,"berapa tahun"]};
function poolFor(set){
  const out=[];
  const push=(t,r,ctx,m)=>out.push({p:r[0]==="?"?t.q:r[0]+t.u.replace("～",""),ctx,a:r[1],m});
  if(set==="ctr") CTR.forEach(c=>{ const M=CTR_M[c.key]; c.rows.forEach(r=>push(c,r,`untuk ${c.t}`, r[0]==="?"?M[1]:(M[2]?`${M[0]} ${r[0]}`:`${r[0]} ${M[0]}`))); });
  if(set==="waktu"){
    [JAM,MENIT,BULAN,TGL,LJAM,LHARI,LMGG,LBLN,LTHN].forEach(t=>{ const M=T_M[t.key]; t.rows.forEach(r=>push(t,r,t.t.replace("… ","").replace(" (lamanya)",""),r[0]==="?"?M[1]:M[0](+r[0]))); });
    HARI.forEach(h=>out.push({p:h[0],ctx:"Hari",a:h[1],m:h[2]==="hari apa"?"hari apa":"hari "+h[2]}));
  }
  if(set==="bil") NUM.forEach(t=>t.rows.forEach(r=>out.push({p:r[0],ctx:t.t,a:r[1],m:numArti(r[0])})));
  if(set==="verb"){
    verbPool().forEach(v=>{
      const forms=L.qform==="acak"?["te","dict","nai","ta"]:[L.qform];
      forms.forEach(k=>{ const lbl=FORMS.find(f=>f[0]===k)[2]; out.push({p:v.label.replace(/［.*］/,""),pk:v.f.masu.v,ins:`Ubah ke bentuk ${lbl}`,a:v.f[k].irr?"*"+v.f[k].v:v.f[k].v,m:v.arti}); });
    });
  }
  return out;
}
function shuf(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function qPool(){ return poolFor(L.qset).map(q=>(q.id=[L.qset,q.ctx||q.ins,q.p,q.pk||"",q.m||""].join("|"),q)); }
function qList(){
  const pool=qPool(); let list=pool;
  if(L.shuffle&&L.order){ const m=new Map(pool.map(q=>[q.id,q])); list=L.order.map(id=>m.get(id)).filter(Boolean); }
  if(L.unlearned) list=list.filter(q=>!learnedQ.has(q.id));
  return list;
}
function qRstGroups(){
  const g=[]; const cnt=pre=>[...learnedQ].filter(id=>id.startsWith(pre+"|")).length;
  [["ctr","Kata bantu bilangan"],["waktu","Waktu & tanggal"],["bil","Bilangan"],["verb","Konjugasi"]].forEach(([k,t])=>{ const n=cnt(k); if(n) g.push(["q-"+k,t,n,()=>[...learnedQ].filter(id=>id.startsWith(k+"|"))]); });
  return g;
}
function qRstHtml(){
  const g=qRstGroups();
  return `<div class="rst"><div class="rst-h"><b>リセット</b><span>おぼえた</span></div>
    ${g.length?`<div class="rst-g">${g.map(([k,t,n])=>window.rstBtn(k,t,n)).join("")}</div>`:`<p class="rst-e">Belum ada soal yang ditandai おぼえた.</p>`}</div>`;
}
function resetQ(){ L.idx=0; L.shown=false; L.order=L.shuffle?shuf(qPool().map(q=>q.id)):null; }
function secLatihan(){
  const sets=[["ctr","助数詞{じょすうし}","Kata bantu bilangan"],["waktu","時間{じかん}・日付{ひづけ}","Waktu & tanggal"],["bil","数字{すうじ}","Bilangan"],["verb","活用{かつよう}","Konjugasi"]];
  const all=qPool(), list=qList(), nDone=all.filter(q=>learnedQ.has(q.id)).length;
  if(L.idx>=list.length) L.idx=Math.max(0,list.length-1);
  const q=list[L.idx], done=q&&learnedQ.has(q.id), pct=list.length?Math.round((L.idx+1)/list.length*100):0;
  L._sheet=`<div class="qsets">
    <div class="ctl"><span class="cl">${ui("問題{もんだい}")}<i>Soal</i></span>${sets.map(([k,j,t])=>`<button class="chip" data-qset="${k}" aria-pressed="${L.qset===k}">${J(j,t)}</button>`).join("")}</div>
    ${L.qset==="verb"?`<div class="ctl"><span class="cl">${ui("形{かたち}")}<i>Ubah ke</i></span>${[["te","て形{けい}","て"],["dict","辞書形{じしょけい}","kamus"],["nai","ない形{けい}","ない"],["ta","た形{けい}","た"],["acak","ランダム","acak"]].map(([k,j,t])=>`<button class="chip" data-qform="${k}" aria-pressed="${L.qform===k}">${J(j,t)}</button>`).join("")}</div>${vfilterHtml()}`:""}
    <div class="ctl"><span class="cl">ならび<i>Urutan</i></span>
      <button class="chip" id="qshuf" aria-pressed="${L.shuffle}">${J("まぜる","Acak")}</button>
      <button class="chip" id="qmada" aria-pressed="${L.unlearned}">${J("まだ","Belum hafal saja")}</button>
      </div>
   </div>${qRstHtml()}`;
  L._dock = "";
  return `<div class="quiz fz"><div class="fz-top">${q?`<span class="fz-n">${L.idx+1} / ${list.length}</span>`:""}<span class="fz-h">${nDone}/${all.length} おぼえた</span><span class="sheet-flag"></span></div>
   ${q?`<div class="fc q${L.shown?" open":""}" id="qcard" role="button" tabindex="0" aria-label="Lihat jawaban">
     <div class="sw-tag sw-l">あとで</div><div class="sw-tag sw-r">おぼえた ✓</div>
     <div class="fc-head"><span class="fc-bab">${ui("練習{れんしゅう}")}</span><span class="fc-grp">${esc({ctr:"Kata bantu bilangan",waktu:"Waktu & tanggal",bil:"Bilangan",verb:"Konjugasi"}[L.qset])}</span>${done?'<button class="fc-done" id="qunmark" aria-label="Batalkan おぼえた">✓ おぼえた ✕</button>':""}</div>
     <div class="fc-body">
       ${q.ins?`<div class="fc-ins"><b>${esc(q.ins)}</b></div>`:`<div class="fc-ctx">${esc(q.ctx)}</div>`}
       <div class="fc-front">${esc(q.p)}</div>${q.pk?`<div class="fc-sub">${esc(q.pk)}</div>`:""}
       ${L.shown?`<div class="fc-ans"><div class="fc-row"><span class="fc-k">JAWABAN</span><span class="fc-v big">${rd(q.a)}</span></div><div class="fc-row"><span class="fc-k">ARTI</span><span class="fc-v lat">${esc(q.m||"")}</span></div></div>`
         :`<div class="fc-tap">Ketuk untuk melihat jawaban</div>`}
     </div>
     <div class="fc-prog" aria-hidden="true"><i style="width:${pct}%"></i></div>
   </div>
   <div class="fz-hint"><button class="fz-b l" id="qnext">← あとで</button><span>geser kartu</span><button class="fz-b r" id="qmark">おぼえた →</button></div>
`
   :`<div class="fz-empty">${L.unlearned&&all.length?`<div class="fe-ic">✓</div><b>Semua soal sudah おぼえた</b><p>Soal yang belum hafal sudah habis.</p><div class="fe-act"><button class="btn primary" id="qfeAll">もう いちど<i>Ulangi semua soal</i></button><button class="btn" data-open-sheet>⚙ せってい</button></div>`
       :`<div class="fe-ic n">?</div><b>Tidak ada soal</b><p>Ubah pilihan soal lewat せってい.</p><div class="fe-act"><button class="btn primary" data-open-sheet>⚙ せってい</button></div>`}</div>`}
  </div>`;
}

function renderLampiran(){
  const hadZ=!!document.querySelector("#lampiran .fz");
  const body={bil:secBil,waktu:secWaktu,ctr:secCtr,verb:secVerb,latihan:secLatihan}[L.sec]();
  $("#lampiran").className="g-"+({bil:"blue",waktu:"teal",ctr:"orange",verb:"purple",latihan:"rose"}[L.sec]);
  $("#lampiran").innerHTML=`<div class="lnav">${SECS.map(([k,j,t])=>`<button class="chip" data-sec="${k}" aria-pressed="${L.sec===k}">${J(j,t)}</button>`).join("")}</div>
   ${L.sec!=="latihan"?`<p class="legend"><span class="irr">ろっぴゃく</span> = bunyi berubah atau bacaan khusus, perlu dihafal tersendiri.</p>`:""}${body}`;
  const root=document;
  $("#sheetL").innerHTML = L.sec==="latihan"?L._sheet:"";
  $("#dockAct").innerHTML = L.sec==="latihan"?L._dock:"";
  document.querySelectorAll("[data-open-sheet]").forEach(b=>b.onclick=window.openSheet);
  root.querySelectorAll("[data-sec]").forEach(b=>b.onclick=()=>{ L.sec=b.dataset.sec; renderLampiran(); });
  root.querySelectorAll("[data-grp]").forEach(b=>b.onclick=()=>{ L.grp=b.dataset.grp; if(L.sec==="latihan") resetQ(); renderLampiran(); });
  const sel=root.querySelector("#vbab"); if(sel) sel.onchange=()=>{ L.bab=+sel.value; if(L.sec==="latihan") resetQ(); renderLampiran(); };
  root.querySelectorAll("[data-qset]").forEach(b=>b.onclick=()=>{ L.qset=b.dataset.qset; resetQ(); renderLampiran(); });
  root.querySelectorAll("[data-qform]").forEach(b=>b.onclick=()=>{ L.qform=b.dataset.qform; resetQ(); renderLampiran(); });
  const on=(id,f)=>{ const el=root.querySelector("#"+id); if(el) el.onclick=f; };
  $("#sheetL").querySelectorAll("[data-rst]").forEach(b=>b.onclick=()=>window.armRst(b.dataset.rst,()=>{
    const g=qRstGroups().find(x=>x[0]===b.dataset.rst); if(g) g[3]().forEach(id=>learnedQ.delete(id)); saveQ(); L.idx=0; L.shown=false; },()=>renderLampiran()));
  on("qshuf",()=>{ L.shuffle=!L.shuffle; resetQ(); renderLampiran(); });
  on("qfeAll",()=>{ L.unlearned=false; L.idx=0; L.shown=false; renderLampiran(); });
  on("qmada",()=>{ L.unlearned=!L.unlearned; L.idx=0; L.shown=false; renderLampiran(); });
  const step=d=>{ const n=qList().length; if(!n) return; L.idx=(L.idx+d+n)%n; L.shown=false; renderLampiran(); };
  const markQ=()=>{ const ql=qList(), q=ql[L.idx]; if(!q) return;
    learnedQ.add(q.id); saveQ(); const n=ql.length;
    if(!L.unlearned) L.idx=(L.idx+1)%n; else if(L.idx>=n-1) L.idx=0;
    L.shown=false; renderLampiran(); };
  const skipQ=()=>step(1);
  on("qunmark",e=>{ e.stopPropagation(); const q=qList()[L.idx]; if(q){ learnedQ.delete(q.id); saveQ(); renderLampiran(); } });
  const c=root.querySelector("#qcard"); if(c){ const t=()=>{ L.shown=!L.shown; renderLampiran(); }; c.onclick=t; c.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); t(); } };
    on("qnext",()=>window.flyCard(c,-1,skipQ)); on("qmark",()=>window.flyCard(c,1,markQ));
    window.attachSwipe(c,skipQ,markQ); }
  if(L.sec==="latihan"&&(!hadZ||window.FZ_FORCE)) window.centerZone(document.querySelector("#lampiran .fz"));
  else if(window.FZ_FORCE) window.scrollTo({top:0});
  window.FZ_FORCE=false;
}
window.renderLampiran=renderLampiran;
document.addEventListener("keydown",e=>{ if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft") return; const c=document.querySelector("#qcard"); if(!c||!c.offsetParent||e.target.closest("input,textarea,select")) return; e.preventDefault(); document.querySelector(e.key==="ArrowRight"?"#qmark":"#qnext").click(); });
})();
