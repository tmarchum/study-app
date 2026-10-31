const {G}=require('./gen.js');const {C}=require('./curriculum.js');
const near=(u,a)=>Math.abs(parseFloat(String(u).replace(/,/g,''))-a);
const norm=x=>String(x).trim().replace(/[\s,]/g,'').toLowerCase();
const isOk=(it,u)=>typeof it.a==='number'?near(u,it.a)<=(it.tol||1e-9):norm(u)===norm(it.a);
let bad=0,n=0;const chk=(name,it)=>{if(it.a===undefined||Number.isNaN(it.a)||it.a===Infinity)throw name+' bad a';if(it.choices&&!it.choices.map(String).includes(String(it.a)))throw name+' a not in choices';if(!isOk(it,String(it.a)))throw name+' ok-logic rejects a';it.diag('999999');it.diag('abc');if(!it.steps||!it.steps.length)throw name+' no steps'};
for(const g in G){n++;try{for(let i=0;i<500;i++){const it=G[g]();if(it.multi){if(!it.stem||it.parts.length<2)throw g+' multi';it.parts.forEach(p=>chk(g+'/'+p.l,p))}else chk(g,it)}}catch(e){bad++;console.log('FAIL',g,e)}}
for(const k in C)for(const s of['math','eng'])for(const t of C[k][s]){if(!G[t.gen]){bad++;console.log('missing gen',t.gen)}if(!t.b.length){bad++;console.log('no lesson',t.id)}}
console.log(n+' generators',bad?bad+' FAIL':'ALL OK');process.exit(bad?1:0);
