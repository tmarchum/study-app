global.document={getElementById:()=>({set textContent(v){},set innerHTML(v){}})};global.localStorage={};global.navigator={};global.scrollTo=()=>{};
const {G}=require('./app.js');let bad=0;
for(const [k,f] of Object.entries(G))for(let i=0;i<500;i++){const it=f();if(it.a===undefined||Number.isNaN(it.a)||it.a===Infinity){bad++;console.log(k,it.q,it.a)}if(it.choices&&!it.choices.includes(it.a)){bad++;console.log('choice',k,it.q,it.a)}const u=String(it.a),ok=typeof it.a==='number'?Math.abs(parseFloat(u)-it.a)<=(it.tol||1e-9):u.trim()===String(it.a);if(!ok){bad++;console.log('not-accepted',k,it.q)}try{it.diag('999999');it.diag('abc')}catch(e){bad++;console.log('diag err',k,e.message)}}
console.log(Object.keys(G).length+' generators');console.log(bad?'FAIL '+bad:'ALL OK');
