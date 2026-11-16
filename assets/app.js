(function(){
const D = window.RAIDA_DATA, O = D.official, $ = id => document.getElementById(id);
const KEY = "raida_prefs_v1";
let activeType = "course";

// ===== التخزين المحلي في المتصفح فقط (بدون حسابات) =====
function loadPrefs(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } }
function savePrefs(){
  try { localStorage.setItem(KEY, JSON.stringify({stage:$("stage").value, level:$("level").value, subject:$("subject").value, type:activeType})); } catch(e){}
}
function clearPrefs(){ try { localStorage.removeItem(KEY); } catch(e){} location.reload(); }

function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
function link(href, text, alt){ const a = el("a", "btn" + (alt ? " alt" : ""), text); a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; return a; }
const enc = encodeURIComponent;
const google = q => "https://www.google.com/search?q=" + enc(q);
const youtube = q => "https://www.youtube.com/results?search_query=" + enc(q);

function fill(sel, list, label, disabled){
  sel.innerHTML = ""; sel.add(new Option(disabled ? "اختر السلك أولًا" : label, ""));
  list.forEach(v => sel.add(new Option(v, v))); sel.disabled = disabled;
}
Object.keys(D.stages).forEach(s => $("stage").add(new Option(s, s)));
function onStage(){ const s = $("stage").value;
  fill($("level"), s ? D.stages[s] : [], "اختر المستوى", !s);
  fill($("subject"), s ? D.subjects[s] : [], "اختر المادة", !s); }
$("stage").addEventListener("change", () => { onStage(); render(); });
["level","subject","raida"].forEach(id => $(id).addEventListener("change", render));
$("topic").addEventListener("input", render);
$("clearPrefs").addEventListener("click", clearPrefs);

Object.entries(D.types).forEach(([k, t]) => {
  const b = el("button","chip",t.icon+" "+t.label); b.type="button"; b.dataset.type=k; b.setAttribute("aria-pressed", k===activeType);
  b.addEventListener("click", () => { activeType=k; document.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed", c.dataset.type===k)); render(); });
  $("types").append(b);
});

function officialCard(stage, level, subject){
  const c = el("article","card");
  c.append(el("div","emoji","🏛️"), el("span","badge","مصدر حكومي رسمي"), el("h3",null,"دروس "+subject+" — "+level),
    el("p",null,"المصدر: "+O.name+" ("+O.host+"). دروس مصورة وتمارين وامتحانات تجريبية وفق المنهاج الوطني."));
  const id = O.levelIds[level], code = (O.subjectCodes[stage]||{})[subject];
  const b = el("div","btns");
  if (id && code) b.append(link(O.base+"?niveau="+id+"&matiere="+code, "افتح دروس المادة"));
  if (id) b.append(link(O.base+"?niveau="+id, code ? "كل مواد "+level : "افتح مواد "+level+" ثم اختر "+subject, !!code));
  else b.append(link(O.cycleHome[stage], "صفحة المستويات"));
  c.append(b);
  if (!code) c.append(el("p","note","ملاحظة: اختر «"+subject+"» من قائمة المواد داخل صفحة المستوى."));
  return c;
}

function render(){
  const stage=$("stage").value, level=$("level").value, subject=$("subject").value;
  const out=$("results"); out.innerHTML="";
  const ready = stage && level && subject;
  $("hint").classList.toggle("hidden", !!ready);
  renderCurated(stage, level, subject);
  savePrefs();
  if (!ready) return;
  const t = D.types[activeType];
  const q = [D.subjectTerms[subject]||subject, level, $("topic").value.trim(), t.term, $("raida").checked ? "الريادة" : ""].filter(Boolean).join(" ");

  out.append(officialCard(stage, level, subject));

  D.platforms.filter(p => p.site && p.types.includes(activeType)).forEach(p => {
    const c = el("article","card");
    c.append(el("div","emoji",p.icon), el("span","badge alt","موقع خاص (غير حكومي)"), el("h3",null,p.name.split(" (")[0]),
      el("p",null,"المصدر: "+p.site+". نتائج «"+t.label+"» لمادة "+subject+" — "+level+"."));
    const b = el("div","btns"); b.append(link(google("site:"+p.site+" "+q),"ابحث هنا"), link(p.url,"الصفحة الرئيسية",true)); c.append(b); out.append(c);
  });

  if (activeType==="video" || activeType==="course") {
    const c = el("article","card");
    c.append(el("div","emoji","🎬"), el("span","badge alt","موقع خاص (غير حكومي)"), el("h3",null,"فيديوهات على يوتيوب"),
      el("p",null,"المصدر: youtube.com — شروحات يرفعها أساتذة وقنوات مختلفة؛ تحقق من مطابقتها لمقرر الريادة."));
    const b = el("div","btns"); b.append(link(youtube([D.subjectTerms[subject]||subject, level, $("topic").value.trim(), "شرح درس"].filter(Boolean).join(" ")),"شاهد الفيديوهات")); c.append(b); out.append(c);
  }
  const cg = el("article","card");
  cg.append(el("div","emoji","🌐"), el("h3",null,"بحث عام على الويب"), el("p",null,"المصدر: google.com — إن لم تجد ما تريده."));
  const bg = el("div","btns"); bg.append(link(google(q),"بحث في Google")); cg.append(bg); out.append(cg);
}

function renderCurated(stage, level, subject){
  const list = (D.curated||[]).filter(r => (!stage||r.stage===stage)&&(!level||r.level===level)&&(!subject||r.subject===subject)&&r.type===activeType);
  const box=$("curated"); box.innerHTML=""; $("curatedPanel").classList.toggle("hidden", list.length===0);
  list.forEach(r => { const c=el("article","card");
    c.append(el("div","emoji",D.types[r.type].icon), el("h3",null,r.title), el("p",null,r.level+" — "+r.subject+(r.source?" — المصدر: "+r.source:"")));
    const b=el("div","btns"); b.append(link(r.url,"افتح المورد")); c.append(b); box.append(c); });
}

// المنصات
D.platforms.forEach(p => { const c=el("article","card"); c.append(el("div","emoji",p.icon));
  c.append(el("span","badge"+(p.official?"":" alt"), p.official?"رسمي — وزارة التربية الوطنية":"موقع خاص (غير حكومي)"));
  c.append(el("h3",null,p.name), el("p",null,p.desc));
  const b=el("div","btns"); b.append(link(p.url,"زيارة الموقع")); c.append(b); $("platformCards").append(c); });

// بوابة الأساتذة
const tp=D.teacherPortal; $("teacherNote").textContent = tp.name+": "+tp.note;
$("teacherLink").href = tp.url;

// مصادر الريادة
D.raidaInfo.forEach(i => { const li=el("li"); const a=el("a",null,i.title); a.href=i.url; a.target="_blank"; a.rel="noopener noreferrer"; li.append(a); $("infoLinks").append(li); });

// قائمة المصادر أسفل الصفحة
const src=$("sourceList");
[["🏛️ مواقع حكومية رسمية", [[O.name, "https://"+O.host], ["TelmidTICE","https://telmidtice.men.gov.ma"]]],
 ["🌐 مواقع خاصة غير حكومية", D.platforms.filter(p=>!p.official).map(p=>[p.name.split(" (")[0], p.url]).concat([["YouTube","https://www.youtube.com"]])]]
.forEach(([title, items]) => { const li=el("li"); li.append(el("strong",null,title+": "));
  items.forEach((it,i)=>{ const a=el("a",null,it[0]); a.href=it[1]; a.target="_blank"; a.rel="noopener noreferrer"; li.append(a); if(i<items.length-1) li.append(document.createTextNode(" · ")); });
  src.append(li); });

// استرجاع آخر اختيار من المتصفح
const pr = loadPrefs();
if (pr.stage && D.stages[pr.stage]) { $("stage").value=pr.stage; onStage();
  if (pr.level) $("level").value=pr.level; if (pr.subject) $("subject").value=pr.subject; }
if (pr.type && D.types[pr.type]) { activeType=pr.type; document.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed", c.dataset.type===activeType)); }
render();
})();
