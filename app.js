// ===== מצב =====
const DEF={xp:0,coins:0,streak:0,lastDay:'',bestStreak:0,p:{},badges:[],owned:['t0','a0'],theme:'t0',avatar:'a0',answered:0,bagrutParts:0};
let S=Object.assign({},DEF,JSON.parse(localStorage.study3||'{}'));
const save=()=>{localStorage.study3=JSON.stringify(S);bar()};
const $=id=>document.getElementById(id), app=$('app');
const lvl=xp=>Math.floor(Math.sqrt(xp/40))+1, lvlXp=l=>40*(l-1)**2;
const mastery=key=>{const p=S.p[key];if(!p||!p.h.length)return 0;return Math.round(100*p.h.reduce((a,b)=>a+b,0)/Math.max(p.h.length,6))};
const mLabel=m=>m==0?['טרם התחיל','m0']:m<40?['בהתנסות','m1']:m<70?['מכיר','m2']:m<90?['שולט','m3']:['מומחה ⭐','m4'];
const findT=(k,s,id)=>C[k][s].find(t=>t.id===id);
const THEMES=[['t0','סגול',0,'#6d28d9','#a78bfa'],['t1','אוקיינוס',80,'#0369a1','#38bdf8'],['t2','שקיעה',120,'#c2410c','#fb923c'],['t3','יער',120,'#15803d','#4ade80'],['t4','לילה',200,'#1e293b','#818cf8'],['t5','ורוד',160,'#be185d','#f472b6']];
const AVAS=[['a0','🦉',0],['a1','🦊',50],['a2','🐼',80],['a3','🦁',120],['a4','🐙',150],['a5','🚀',200],['a6','🦄',260],['a7','🐉',350]];
const BADGES={first:['🌟','תשובה נכונה ראשונה'],d3:['🔥','3 ימי תרגול ברצף'],d7:['☄️','שבוע ברצף'],xp500:['💎','500 XP'],master:['🏆','מומחה בנושא'],bag10:['🎓','10 סעיפי בגרות נכונים'],perfect:['💯','סבב מושלם'],shop:['🛍️','קנייה ראשונה בחנות'],persist:['💪','לא ויתר — הצליח בניסיון שלישי'],q100:['🧠','100 תשובות נכונות']};
function badge(id){if(S.badges.includes(id))return;S.badges.push(id);toast(`${BADGES[id][0]} תג חדש: ${BADGES[id][1]}`,'gold')}
function toast(m,c=''){const d=document.createElement('div');d.className='toast '+c;d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),2600)}
function theme(){const t=THEMES.find(x=>x[0]==S.theme)||THEMES[0];document.documentElement.style.setProperty('--p',t[3]);document.documentElement.style.setProperty('--p2',t[4]);document.querySelector('meta[name=theme-color]')?.setAttribute('content',t[3])}
function touchDay(){const d=new Date().toDateString(),y=new Date(Date.now()-864e5).toDateString();if(S.lastDay==d)return;S.streak=S.lastDay==y?S.streak+1:1;S.lastDay=d;S.bestStreak=Math.max(S.bestStreak,S.streak);if(S.streak>=3)badge('d3');if(S.streak>=7)badge('d7')}
function reward(xp,coins){const l0=lvl(S.xp);S.xp+=xp;S.coins+=coins;if(S.xp>=500)badge('xp500');if(lvl(S.xp)>l0)toast(`🎉 עליתם לרמה ${lvl(S.xp)}!`,'gold')}
function bar(){const l=lvl(S.xp),a=lvlXp(l),b=lvlXp(l+1),av=AVAS.find(x=>x[0]==S.avatar)[1];$('top').innerHTML=`<button class=ava onclick="go('progress')">${av}</button><div class=lv><b>רמה ${l}</b><div class=xpbar><i style="width:${100*(S.xp-a)/(b-a)}%"></i></div><small>${S.xp-a}/${b-a} XP</small></div><span class=chip title="רצף ימים">🔥 ${S.streak}</span><span class=chip title="מטבעות">🪙 ${S.coins}</span>`}

// ===== הקראה: נרמול לעברית מדוברת =====
const UNITS=[[/סמ"ר/g,'סנטימטר רבוע'],[/מ"ר/g,'מטר רבוע'],[/ס"מ/g,'סנטימטר'],[/ק"מ/g,'קילומטר'],[/יח"ל/g,'יחידות לימוד'],[/תשפ"ז/g,'תשפ"ז'],[/(\d)\s*מ'/g,'$1 מטר'],[/₪/g,' שקלים']];
function sayHe(t){t=String(t).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ');for(const[r,s]of UNITS)t=t.replace(r,s);
return t.replace(/(\d),(?=\d{3}\b)/g,'$1')
.replace(/(\d)([xyt])(?![a-z])/g,'$1 $2').replace(/(sin|cos|tan)(?=\d)/g,'$1 ').replace(/\//g,' חלקי ').replace(/\b(sin|cos|tan)⁻¹/g,(m,f)=>'ה'+{sin:'סינוס',cos:'קוסינוס',tan:'טנגנס'}[f]+' ההפוך של').replace(/\bsin\b/g,'סינוס').replace(/\bcos\b/g,'קוסינוס').replace(/\btan\b/g,'טנגנס')
.replace(/²/g,' בריבוע').replace(/³/g,' בשלישית').replace(/\^(\w+)/g,' בחזקת $1').replace(/ᵗ/g,' בחזקת טי').replace(/ⁿ/g,' בחזקת אן')
.replace(/√/g,' שורש ').replace(/π/g,' פאי ').replace(/[×·]/g,' כפול ').replace(/÷/g,' חלקי ').replace(/(\d)\s*:\s*(\d)/g,'$1 חלקי $2')
.replace(/(^|[\s(=])[−-](?=\d|x)/g,'$1מינוס ').replace(/\s[−-]\s/g,' פחות ').replace(/(\w)\s*[−]\s*(\w)/g,'$1 פחות $2').replace(/\+/g,' ועוד ')
.replace(/≤/g,' קטן או שווה ל ').replace(/≥/g,' גדול או שווה ל ').replace(/</g,' קטן מ ').replace(/>/g,' גדול מ ').replace(/=/g,' שווה ').replace(/≈/g,' בערך ')
.replace(/(\d)\.(\d)/g,'$1 נקודה $2').replace(/%/g,' אחוז').replace(/°/g,' מעלות').replace(/∥/g,' מקביל ל').replace(/Σ/g,'סכום ').replace(/→/g,', ולכן, ')
.replace(/\bP\(/g,'ההסתברות של (').replace(/\bx\b/g,'איקס').replace(/\by\b/g,'וואי').replace(/_{2,}/g,' מה? ').replace(/[()]/g,', ').replace(/[🎯⭐💡✅❌🔊]/gu,'').replace(/\s+/g,' ').trim()}
let VOICE={};function pickVoices(){const vs=speechSynthesis.getVoices(),sc=v=>(/Carmit/i.test(v.name)?5:0)+(/Natural|Online|Neural|Hila|Avri/i.test(v.name)?4:0)+(/Google/i.test(v.name)?3:0)+(/Enhanced|Premium/i.test(v.name)?2:0)+(v.localService?0:1);
for(const L of['he','en']){const c=vs.filter(v=>v.lang.toLowerCase().startsWith(L)).sort((a,b)=>sc(b)-sc(a));VOICE[L]=c[0]}}
if('speechSynthesis'in window){pickVoices();speechSynthesis.onvoiceschanged=pickVoices}
let NOW=null;
function say(btn,text,lang='he'){if(!('speechSynthesis'in window))return toast('הדפדפן לא תומך בהקראה');const ss=speechSynthesis;
if(NOW===btn){if(ss.paused){ss.resume();btn.classList.add('on');btn.textContent='⏸'}else{ss.pause();btn.classList.remove('on');btn.textContent='▶'}return}
ss.cancel();if(NOW){NOW.classList.remove('on');NOW.textContent='🔊'}NOW=btn;btn.classList.add('on');btn.textContent='⏸';
const u=new SpeechSynthesisUtterance(lang=='en'?String(text).replace(/<[^>]+>/g,' ').replace(/_{2,}/g,'blank'):sayHe(text));u.lang=lang=='en'?'en-US':'he-IL';if(VOICE[lang])u.voice=VOICE[lang];u.rate=lang=='en'?.9:.92;
u.onend=u.onerror=()=>{if(NOW===btn){btn.classList.remove('on');btn.textContent='🔊';NOW=null}};ss.speak(u)}
const SAYS=[];const sb=(text,lang='he')=>{SAYS.push([text,lang]);return`<button class=say aria-label="השמעה" onclick="say(this,SAYS[${SAYS.length-1}][0],SAYS[${SAYS.length-1}][1])">🔊</button>`};
function listen(cb,lang='he'){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('זיהוי דיבור לא נתמך — הקלידו');const r=new SR();r.lang=lang=='en'?'en-US':'he-IL';r.onresult=e=>cb(e.results[0][0].transcript);r.start();toast('🎤 מקשיב...')}

// ===== ניווט =====
function go(v,...a){if('speechSynthesis'in window)speechSynthesis.cancel();NOW=null;SAYS.length=0;V[v](...a);scrollTo(0,0);document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('act',b.dataset.v==v||(v!='progress'&&v!='shop'&&b.dataset.v=='home')))}
const back=(f,l='חזרה')=>`<button class=back onclick="${f}">→ ${l}</button>`;
const ring=m=>`<div class=ring style="--m:${m}"><span>${m}%</span></div>`;
const gradeM=(k,s)=>{const ts=C[k][s];return Math.round(ts.reduce((a,t)=>a+mastery(k+t.id),0)/ts.length)};

const V={
home(){app.innerHTML=`<section class=hero><h1>שלום! 👋</h1><p>בחרו שכבה. כל התוכן מבוסס על תכניות הלימודים ומסמכי המיקוד הרשמיים של משרד החינוך (תשפ"ו–תשפ"ז).</p></section>
${Object.entries(C).map(([k,g])=>`<button class="gcard" onclick="go('grade','${k}','math')"><span class=gi>${g.icon}</span><div><h2>${g.name}</h2><small>${g.sub}</small><div class=mini><span>🔢 ${gradeM(k,'math')}%</span><span>🔤 ${gradeM(k,'eng')}%</span></div></div><span class=chev>‹</span></button>`).join('')}
<div class=card><h3>🎯 היעד היומי</h3><p>תרגלו סבב אחד בכל יום כדי לשמור על הרצף 🔥. רצף נוכחי: <b>${S.streak}</b> ימים.</p></div>`},
grade(k,s='math'){const g=C[k],ts=g[s],units=[...new Set(ts.map(t=>t.unit))];
app.innerHTML=`${back("go('home')",'כל השכבות')}<h1 class=title>${g.icon} ${g.name}</h1><div class=seg><button class="${s=='math'?'on':''}" onclick="go('grade','${k}','math')">🔢 מתמטיקה</button><button class="${s=='eng'?'on':''}" onclick="go('grade','${k}','eng')">🔤 אנגלית</button></div>
<div class="card sum">${ring(gradeM(k,s))}<div><b>שליטה כוללת</b><p>${ts.length} נושאים במפה. כל נושא: דף לימוד + תרגול.</p></div></div>
${units.map(u=>`<h3 class=unit>${u}</h3><div class=path>${ts.filter(t=>t.unit==u).map(t=>{const m=mastery(k+t.id),[lb,c]=mLabel(m);return`<button class="tcard ${t.gen.startsWith('bg_')?'bag':''}" onclick="go('topic','${k}','${s}','${t.id}')"><div class=tt><b>${t.name}</b><span class="lab ${c}">${lb}</span></div><div class=mbar><i style="width:${m}%"></i></div></button>`}).join('')}</div>`).join('')}`},
topic(k,s,id){const t=findT(k,s,id),m=mastery(k+id),en=s=='eng';
app.innerHTML=`${back(`go('grade','${k}','${s}')`,'מפת הנושאים')}<div class="card head"><small>${t.unit}</small><h1>${t.name}</h1><div class=mbar><i style="width:${m}%"></i></div><small>שליטה: ${m}% · ${mLabel(m)[0]}</small></div>
${t.b.map(([h,x])=>`<div class="card blk"><div class=bh><h3>${h}</h3>${sb(h+'. '+x)}</div><p>${x}</p></div>`).join('')}
${t.ex.map((e,i)=>`<div class="card ex"><div class=bh><h3>📝 דוגמה פתורה ${i+1}</h3>${sb('דוגמה: '+e.q+'. '+e.s.join('. ')+'. התשובה: '+e.a,en&&/^[A-Za-z]/.test(e.q)?'he':'he')}</div><p class=q>${e.q}</p><ol class=steps id=st${i}>${e.s.map((x,j)=>`<li ${j?'hidden':''}>${x}</li>`).join('')}<li hidden class=ans>✔ תשובה: <b>${e.a}</b></li></ol><button class=sm onclick="nextStep(${i})">הצג את השלב הבא ↓</button></div>`).join('')}
${t.tip?`<div class="card tip">💡 ${t.tip}</div>`:''}
<button class="btn big" onclick="go('practice','${k}','${s}','${id}')">${t.gen.startsWith('bg_')?'🎯 לשאלת בגרות':'✏️ לתרגול (8 שאלות)'}</button>`},
practice(k,s,id){const t=findT(k,s,id);const SES={k,s,id,t,i:0,n:t.gen.startsWith('bg_')?1:8,ok:0,first:0,xp:0};window.SES=SES;
G[t.gen]().multi?multiQ(SES,G[t.gen]()):oneQ(SES)},
progress(){const all=Object.entries(C).flatMap(([k,g])=>['math','eng'].flatMap(s=>g[s].map(t=>({k,g,s,t,m:mastery(k+t.id)})))).filter(x=>S.p[x.k+x.t.id]);
app.innerHTML=`<h1 class=title>📊 ההתקדמות שלי</h1><div class=stats><div><b>${lvl(S.xp)}</b><small>רמה</small></div><div><b>${S.xp}</b><small>XP</small></div><div><b>${S.streak}🔥</b><small>רצף ימים</small></div><div><b>${S.answered}</b><small>תשובות נכונות</small></div></div>
<h3 class=unit>🏅 תגים</h3><div class=badges>${Object.entries(BADGES).map(([id,[e,n]])=>`<div class="bd ${S.badges.includes(id)?'':'lock'}"><span>${S.badges.includes(id)?e:'🔒'}</span><small>${n}</small></div>`).join('')}</div>
<h3 class=unit>📈 שליטה לפי נושא</h3>${all.length?all.map(x=>`<button class=tcard onclick="go('topic','${x.k}','${x.s}','${x.t.id}')"><div class=tt><b>${x.t.name}</b><small>${x.g.name}</small></div><div class=mbar><i style="width:${x.m}%"></i></div></button>`).join(''):'<div class=card>עוד לא תרגלתם. בחרו נושא ותתחילו!</div>'}
<button class="btn ghost" onclick="if(confirm('לאפס את כל ההתקדמות?')){localStorage.removeItem('study3');location.reload()}">איפוס התקדמות</button>`},
shop(){const it=(arr,kind)=>arr.map(a=>{const own=S.owned.includes(a[0]),cur=S.theme==a[0]||S.avatar==a[0],price=kind=='t'?a[2]:a[2];return`<button class="item ${cur?'cur':''}" onclick="buy('${a[0]}',${price},'${kind}')">${kind=='t'?`<span class=sw style="background:linear-gradient(135deg,${a[3]},${a[4]})"></span><small>${a[1]}</small>`:`<span class=em>${a[1]}</span>`}<small>${cur?'✔ בשימוש':own?'בחירה':'🪙 '+price}</small></button>`}).join('');
app.innerHTML=`<h1 class=title>🛍️ חנות הפרסים</h1><div class="card sum"><span class=em>🪙</span><div><b>${S.coins} מטבעות</b><p>מרוויחים מטבעות על כל תשובה נכונה (5 בניסיון ראשון) ובונוס על סיום סבב.</p></div></div><h3 class=unit>🎨 ערכות צבע</h3><div class=shop>${it(THEMES,'t')}</div><h3 class=unit>🧸 דמויות</h3><div class=shop>${it(AVAS,'a')}</div>`}};
function buy(id,price,kind){if(!S.owned.includes(id)){if(S.coins<price)return toast(`חסרים ${price-S.coins} מטבעות 🪙`);S.coins-=price;S.owned.push(id);badge('shop');toast('נקנה! 🎉')}if(kind=='t'){S.theme=id;theme()}else S.avatar=id;save();go('shop')}
function nextStep(i){const h=[...document.querySelectorAll(`#st${i} li[hidden]`)];if(h[0])h[0].hidden=false}

// ===== תרגול =====
const norm=x=>String(x).trim().replace(/[\s,]/g,'').toLowerCase();
const isOk=(it,u)=>typeof it.a==='number'?near(u,it.a)<=(it.tol||1e-9):norm(u)===norm(it.a);
function record(key,ok){const p=S.p[key]??={h:[]};if(!p.h)p.h=[];p.h.push(ok?1:0);if(p.h.length>10)p.h.shift()}
function pbar(ses){return`<div class=phead><button class=x onclick="go('topic','${ses.k}','${ses.s}','${ses.id}')">✕</button><div class=pbar><i style="width:${100*ses.i/ses.n}%"></i></div><span>${ses.i+1}/${ses.n}</span></div>`}
function answerUI(it,pre){return it.choices?`<div class=choices>${it.choices.map(c=>`<button class=ch onclick="${pre}(this,this.dataset.v)" data-v="${String(c).replace(/"/g,'&quot;')}">${c}</button>`).join('')}</div>`:`<div class=inrow><input id=in_${pre} inputmode="${typeof it.a==='number'?'decimal':'text'}" placeholder="התשובה שלכם" autocomplete=off onkeydown="if(event.key=='Enter')${pre}(this,this.value)"><button class=mic onclick="listen(x=>{in_${pre}.value=${typeof it.a==='number'?"x.replace(/[^\\d.\\-]/g,'')":'x'}},'${it.lang||'he'}')">🎤</button></div><button class="btn" onclick="${pre}(this,in_${pre}.value)">בדיקה</button>`}
function oneQ(ses){const it=G[ses.t.gen]();let tries=0,step=0;window.CUR=it;
app.innerHTML=`${pbar(ses)}<div class="card qcard"><div class=bh><small>${ses.t.name}</small>${sb(it.say||it.q,it.lang||'he')}</div><div class=qt ${it.lang=='en'?'dir=ltr':''}>${it.q}</div></div>${answerUI(it,'chk')}<div id=fb></div><div class=row><button class="btn ghost" onclick="hint()">💡 רמז</button></div><div id=hints></div>`;
window.hint=()=>{if(step<it.steps.length){$('hints').insertAdjacentHTML('beforeend',`<div class="card hint">${step+1}. ${it.steps[step]}</div>`);step++}else toast('אין עוד רמזים')};
window.chk=(el,u)=>{if(u===''||u==null||ses.done)return;tries++;const ok=isOk(it,u);touchDay();
if(el&&el.classList.contains('ch'))el.classList.add(ok?'good':'bad');
if(ok){ses.done=1;record(ses.k+ses.id,tries==1);ses.ok++;S.answered++;if(tries==1)ses.first++;const x=tries==1?10:5,c=tries==1?5:2;ses.xp+=x;reward(x,c);badge('first');if(tries==3)badge('persist');if(S.answered>=100)badge('q100');
$('fb').innerHTML=`<div class="fbk good"><b>${P(['מצוין! 🎉','כל הכבוד! ✨','בול! 💪','יפה מאוד! 🌟'])}</b><span>+${x} XP · +${c} 🪙</span><button class="btn" onclick="nextQ()">המשך ←</button></div>`}
else{record(ses.k+ses.id,0);const d=it.diag(u)||'עוד לא. נסו שוב או קחו רמז.';$('fb').innerHTML=`<div class="fbk bad"><b>❌ ${d}</b>${tries>=2?`<div class=sol><p>הפתרון:</p><ol>${it.steps.map(x=>`<li>${x}</li>`).join('')}</ol><p>תשובה: <b>${it.a}</b></p></div><button class="btn" onclick="ses_skip()">המשך ←</button>`:''}</div>`;if(tries>=2){ses.done=1}}
save()};
window.ses_skip=()=>nextQ();window.nextQ=()=>{ses.done=0;ses.i++;if(ses.i>=ses.n)return finish(ses);oneQ(ses)}}
function multiQ(ses,it){ses.n=it.parts.length;const st=it.parts.map(()=>({tries:0,step:0,done:0}));
app.innerHTML=`<div class=phead><button class=x onclick="go('topic','${ses.k}','${ses.s}','${ses.id}')">✕</button><b>🎯 שאלת בגרות · אשכול ${it.cluster}</b></div><div class="card qcard"><div class=bh><small>שאלון 35371 · במתכונת הבחינה</small>${sb(it.stem)}</div><p class=stem>${it.stem}</p></div>
${it.parts.map((p,i)=>`<div class="card part" id=pt${i}><div class=bh><b class=pl>${p.l}</b><p>${p.q}</p>${sb('סעיף '+p.l+'. '+p.q)}</div><div class=inrow><input id=in${i} inputmode=decimal placeholder="תשובה" onkeydown="if(event.key=='Enter')pchk(${i})"></div><div class=row><button class=btn onclick="pchk(${i})">בדיקה</button><button class="btn ghost" onclick="phint(${i})">💡</button></div><div id=pf${i}></div></div>`).join('')}<div id=fin></div>`;
window.phint=i=>{const p=it.parts[i],s=st[i];if(s.step<p.steps.length){$('pf'+i).insertAdjacentHTML('beforeend',`<div class=hint>${s.step+1}. ${p.steps[s.step++]}</div>`)}};
window.pchk=i=>{const p=it.parts[i],s=st[i],u=$('in'+i).value;if(!u||s.done)return;s.tries++;touchDay();const ok=isOk(p,u);
if(ok){s.done=1;record(ses.k+ses.id,s.tries==1);ses.ok++;S.answered++;S.bagrutParts++;const x=s.tries==1?15:8;ses.xp+=x;reward(x,s.tries==1?6:3);badge('first');if(S.bagrutParts>=10)badge('bag10');$('pf'+i).innerHTML=`<div class="fbk good"><b>✅ נכון!</b><span>+${x} XP</span></div>`;$('pt'+i).classList.add('done')}
else{record(ses.k+ses.id,0);const d=p.diag(u)||'לא מדויק — בדקו את החישוב או קחו רמז.';$('pf'+i).innerHTML=`<div class="fbk bad"><b>❌ ${d}</b>${s.tries>=3?`<div class=sol><ol>${p.steps.map(x=>`<li>${x}</li>`).join('')}</ol>תשובה: <b>${p.a}</b></div>`:''}</div>`;if(s.tries>=3)s.done=1}
if(st.every(x=>x.done)){ses.i=ses.n;$('fin').innerHTML=`<button class="btn big" onclick="finish(SES)">סיום ←</button>`}save()}}
function finish(ses){const perfect=ses.ok==ses.n&&(ses.first==ses.n||ses.t.gen.startsWith('bg_'));const bonus=20+(perfect?20:0);reward(bonus,10);if(perfect)badge('perfect');if(mastery(ses.k+ses.id)>=90)badge('master');save();
const m=mastery(ses.k+ses.id);app.innerHTML=`<div class="card done-card"><div class=big-e>${perfect?'🏆':'🎉'}</div><h1>${perfect?'סבב מושלם!':'סיימתם סבב!'}</h1><p>${ses.ok} מתוך ${ses.n} נכונות</p><div class=stats><div><b>+${ses.xp+bonus}</b><small>XP</small></div><div><b>${m}%</b><small>שליטה בנושא</small></div><div><b>${S.streak}🔥</b><small>רצף</small></div></div></div>
<button class="btn big" onclick="go('practice','${ses.k}','${ses.s}','${ses.id}')">עוד סבב</button><button class="btn ghost" onclick="go('topic','${ses.k}','${ses.s}','${ses.id}')">חזרה לדף הלימוד</button><button class="btn ghost" onclick="go('grade','${ses.k}','${ses.s}')">למפת הנושאים</button>`}

theme();bar();go('home');
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
