/* ENGINE: Anzeige, Textmaschine, Auswahl und Enden. Hier muss man für Textänderungen nichts ändern. */
/* ---------- Engine ---------- */
const $=id=>document.getElementById(id);
let curBg='',cur=null,curSp=null,curChoices=null,typing=false,timer=null,fullText='';
const REDUCED=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const val=x=>typeof x==='function'?x():x;

function setBg(name){
  if(!name||name===curBg)return;curBg=name;
  const a=$('bg'),b=$('bg2');b.innerHTML=bgSVG(name);b.style.opacity=1;
  setTimeout(()=>{a.innerHTML=b.innerHTML;b.style.opacity=0},700);
}
function setChars(spec,sp){
  const box=$('chars');box.innerHTML='';
  Object.entries(spec).forEach(([slot,v])=>{
    const [k,m]=v.split(':');const el=document.createElement('div');
    el.className=`slot ${slot} ${CH[k].big?'big':''} ${CH[k].small?'small':''}`;el.dataset.k=k;el.innerHTML=fig(k,m);box.appendChild(el);
  });
  dimTo(sp);
}
function dimTo(sp){document.querySelectorAll('.slot').forEach(e=>e.classList.toggle('dim',!!sp&&sp!=='n'&&e.dataset.k!==sp))}
function hud(){
  const h=$('hud');h.innerHTML='';
  const add=(t,c)=>{const e=document.createElement('span');e.className='chip'+(c?' '+c:'');e.textContent=t;h.appendChild(e)};
  Object.keys(NM).forEach(k=>{if(S.w[k])add((k==='thea'?'Thea (kein Gewicht)':'Zeuge: '+NM[k]),'w')});
  if(S.flags.fire)add('Feuer-Wissen');
  Object.keys(EVL).forEach(k=>{if(S.ev[k])add(EVL[k])});
}
function setMeter(m){
  const el=$('meter');
  if(!m){el.classList.remove('on');return}
  $('mw').textContent=m.w;el.classList.add('on');
  const f=$('mf');f.style.width='0%';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.width=Math.max(m.v,2)+'%';f.style.background=m.v>=100?'#3aa35c':m.v>40?'#d6a33a':'#c0392b'}));
  const v=$('mv');const to=m.v,t0=performance.now();
  (function step(t){const p=Math.min(1,(t-t0)/1100);v.textContent=Math.round(to*p)+' %';if(p<1)requestAnimationFrame(step)})(t0);
}
function go(id){
  const n=ST[id];if(!n){console.error('missing',id);return}
  if(n.skip&&n.skip())return go(n.skipTo);
  cur=n;if(n.fx)n.fx();
  curSp=val(n.sp);
  if(n.bg)setBg(n.bg);
  if(n.chars!==undefined)setChars(val(n.chars),curSp);else dimTo(curSp);
  hud();setMeter(val(n.meter));
  if(n.end){finish(val(n.end));return}
  curChoices=val(n.choices)||null;
  $('name').textContent=curSp==='n'?'':CH[curSp].name;
  const tx=$('text');tx.className=curSp==='n'?'n':'';
  fullText=val(n.text);
  $('choices').innerHTML='';$('more').classList.add('hide');
  type(tx);
}
function type(tx){
  clearInterval(timer);tx.textContent='';let i=0;typing=true;
  if(REDUCED){tx.textContent=fullText;done();return}
  timer=setInterval(()=>{i+=2;tx.textContent=fullText.slice(0,i);if(i>=fullText.length)done()},18);
}
function done(){
  clearInterval(timer);typing=false;$('text').textContent=fullText;
  if(curChoices){
    const c=$('choices');
    curChoices.forEach((ch,i)=>{const b=document.createElement('button');b.textContent=ch.t;b.style.animationDelay=(i*.1)+'s';
      b.onclick=e=>{e.stopPropagation();if(ch.fx)ch.fx();go(ch.go)};c.appendChild(b)});
  }else if(cur.next||cur.nextFn)$('more').classList.remove('hide');
}
function advance(){
  if(typing){done();return}
  if(!curChoices){const nx=cur.nextFn?cur.nextFn():cur.next;if(nx)go(nx)}
}
function finish(t){
  $('name').textContent='';$('text').className='n';fullText='ENDE: '+t;$('text').textContent=fullText;
  $('choices').innerHTML='';$('more').classList.add('hide');
  let found=[];try{found=JSON.parse(localStorage.getItem('hydra-ends2')||'[]')}catch(e){}
  found.forEach(k=>FOUND.add(k));
  if(S.end)FOUND.add(S.end);
  try{localStorage.setItem('hydra-ends2',JSON.stringify([...FOUND]))}catch(e){}
  const x=TS();
  let sum=comp().length?`Zeugen beim Kampf: ${jn(comp())}. `:`Du hattest keine Zeugen. `;
  if(S.end==='F')sum+=S.flags.fire?`Du kanntest das Feuer, aber der Kampf scheiterte.`:`Du kanntest das Feuer nicht: Das erfährt man nur bei Iolaos.`;
  else sum+=`Gewicht der männlichen Zeugen: ${x.t} von ${x.need}.`;
  if(S.flags.timonDead)sum+=` Timon ist gestorben.`;
  if(S.silent)sum+=` Du hast geschwiegen, damit man den Männern glaubt.`;
  const ends=`Enden entdeckt: ${FOUND.size} von 7. `+Object.keys(ENDNAMES).map(k=>FOUND.has(k)?ENDNAMES[k]:'???').join(' · ');
  setTimeout(()=>{$('endTitle').textContent='Ende: '+t;$('sum').textContent=sum;$('ends').textContent=ends;$('after').classList.remove('hide')},1600);
}
function restart(){S=fresh();curBg='';$('after').classList.add('hide');go('a1')}

$('box').addEventListener('click',advance);
$('stage').addEventListener('click',advance);
document.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){if(document.activeElement&&document.activeElement.tagName==='BUTTON')return;e.preventDefault();if(!$('title').classList.contains('hide'))return;advance()}});
$('start').onclick=()=>{$('title').classList.add('hide');go('a1')};
$('again').onclick=restart;
setBg('kampf:7');
