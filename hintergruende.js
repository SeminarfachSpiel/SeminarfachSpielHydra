/* GRAFIK 1/2: Hintergründe und Hydra
   Alles ist SVG-Code, der im Browser erzeugt wird, es gibt keine Bilddateien.
   bgSVG(name) liefert den Hintergrund: dorf, hof, sumpf, kampf:N[:fire], morgen, rat, nacht.
   hydra(n, fire) zeichnet die Hydra mit n Köpfen. Farben stehen direkt im Code (z. B. '#2a5a3a'). */
/* ---------- Hilfsfunktionen für Grafik ---------- */
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}}
const GR=(id,stops)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
function shade(hex,a){const n=parseInt(hex.slice(1),16),f=1-a;return `rgb(${Math.round(((n>>16)&255)*f)},${Math.round(((n>>8)&255)*f)},${Math.round((n&255)*f)})`}
function hills(col,y,amp,seed){const r=rnd(seed);let d=`M0 450 L0 ${y}`;for(let x=0;x<800;x+=100){d+=` Q ${x+50} ${y-amp*(0.3+r())} ${x+100} ${y-amp*(r()-.5)}`}return `<path d="${d} L800 450Z" fill="${col}"/>`}
function house(x,y,w,h,wall,roof,lit){
  return `<rect x="${x}" y="${y-h}" width="${w}" height="${h}" fill="${wall}"/><rect x="${x+w*.72}" y="${y-h}" width="${w*.28}" height="${h}" fill="rgba(0,0,0,.12)"/>`+
  `<polygon points="${x-9},${y-h+2} ${x+w/2},${y-h-h*.62} ${x+w+9},${y-h+2}" fill="${roof}"/><rect x="${x-9}" y="${y-h-1}" width="${w+18}" height="5" fill="rgba(0,0,0,.22)"/>`+
  `<path d="M${x+w*.12} ${y} v-${h*.46} q${w*.11} -${w*.16} ${w*.22} 0 v${h*.46}Z" fill="#3a2418"/>`+
  `<rect x="${x+w*.55}" y="${y-h*.72}" width="${w*.24}" height="${h*.3}" fill="${lit?'#ffd36a':'#2a2030'}"/><path d="M${x+w*.67} ${y-h*.72} v${h*.3} M${x+w*.55} ${y-h*.57} h${w*.24}" stroke="rgba(60,30,10,.7)" stroke-width="1.5"/>`}
function reeds(n,y0,spread,seed,col,tops){const r=rnd(seed);let s='';for(let i=0;i<n;i++){const x=r()*800,h=40+r()*spread,y=y0+r()*50,lean=(r()-.5)*14;s+=`<path d="M${x} ${y} Q${x+lean/2} ${y-h/2} ${x+lean} ${y-h}" stroke="${col}" stroke-width="${1.5+r()*1.8}" fill="none"/>`;if(tops&&r()>.65)s+=`<ellipse cx="${x+lean}" cy="${y-h}" rx="2.6" ry="9" fill="#5a3b25"/>`}return s}
function mist(seed,n,op){const r=rnd(seed);let s='';for(let i=0;i<n;i++)s+=`<ellipse cx="${r()*800}" cy="${250+r()*150}" rx="${120+r()*140}" ry="${14+r()*22}" fill="#fff" opacity="${op}"/>`;return s}
function tree(x,y,s,col){return `<rect x="${x-3*s}" y="${y-30*s}" width="${6*s}" height="${30*s}" fill="#2a2018"/><circle cx="${x}" cy="${y-42*s}" r="${22*s}" fill="${col}"/><circle cx="${x-14*s}" cy="${y-32*s}" r="${15*s}" fill="${col}"/><circle cx="${x+15*s}" cy="${y-34*s}" r="${16*s}" fill="${col}"/>`}

/* Hydra: Köpfe mit offenem Maul, Hälse als Schwanenbögen, Körper taucht aus dem Wasser */
function hydraHead(x,y,side,big,gold){
  const s=big?1.5:1,rot=side<0?24:-24;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${side<0?-s:s} ${s}) translate(28 0)">`+
  `<path d="M-28 -3 Q-26 -15 -4 -16 Q16 -16 34 -6 L38 0 L-28 3Z" fill="#2f5a3b"/>`+
  `<path d="M-26 3 Q-10 15 16 10 L36 4 L30 8 Q12 23 -14 19 Q-28 14 -26 3Z" fill="#1f4029"/>`+
  `<path d="M-14 -14 L-10 -24 L-5 -15 L2 -25 L6 -15 L13 -22 L14 -12Z" fill="#3d7a4c"/>`+
  `<ellipse cx="-8" cy="-8" rx="4.4" ry="3.6" fill="${gold?'#f2c53d':'#d8e34a'}"/><ellipse cx="-8" cy="-8" rx="1" ry="3.2" fill="#111"/>`+
  `<path d="M12 -5 l2 8 l3 -7Z M24 -3 l1.5 7 l3 -6Z M8 10 l2 -8 l3 8Z M20 7 l2 -6 l2.5 6Z" fill="#f4efd8"/>`+
  `<circle cx="32" cy="-3" r="1.2" fill="#0d1d12"/></g>`;
}
function hydra(n,fire){
  if(!n)return '';
  const cx=400,by=372;let o='';
  if(fire)o+=`<radialGradient id="fg"><stop offset="0" stop-color="#ffb347" stop-opacity=".6"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/></radialGradient><circle cx="400" cy="340" r="300" fill="url(#fg)"/>`;
  o+=`<ellipse cx="${cx}" cy="${by+4}" rx="150" ry="52" fill="#17301f"/><path d="M${cx-130} ${by+10} Q${cx-90} ${by-60} ${cx} ${by-66} Q${cx+90} ${by-60} ${cx+130} ${by+10}Z" fill="#24452f"/>`+
  `<path d="M${cx-90} ${by-20} Q${cx} ${by-60} ${cx+90} ${by-20}" stroke="#3d7a4c" stroke-width="3" fill="none" opacity=".6"/>`;
  for(let i=0;i<9;i++)o+=`<path d="M${cx-84+i*21} ${by-46+Math.abs(i-4)*7} l5 -14 l5 14Z" fill="#3d7a4c"/>`;
  for(let i=0;i<n;i++){
    const t=n===1?.5:i/(n-1);
    const spread=n===1?0:Math.min(340,46*n);
    const x=cx+(t-.5)*spread;
    const hy=n===1?88:96+((i*37)%5)*26;
    const bx=cx+(t-.5)*120;
    const side=n===1?1:(x<cx?-1:1);
    const big=n===1;
    const cxn=bx+(x-bx)*.15+side*28, cyn=hy+(by-hy)*.55;
    o+=`<g class="sway" style="animation-delay:-${(i*.73).toFixed(2)}s"><path d="M${bx} ${by-30} Q${cxn} ${cyn} ${x} ${hy}" stroke="#24452f" stroke-width="${big?40:19}" fill="none" stroke-linecap="round"/>`+
    `<path d="M${bx} ${by-30} Q${cxn} ${cyn} ${x} ${hy}" stroke="#3d7a4c" stroke-width="${big?6:3}" stroke-dasharray="2 9" fill="none" opacity=".7"/>`+
    hydraHead(x,hy,side,big,big)+`</g>`;
  }
  o+=`<path d="M0 ${by-6} Q200 ${by-16} 400 ${by-8} T800 ${by-6} L800 450 L0 450Z" fill="url(#wt2)" opacity=".62"/>`;
  [[120,26,.28],[170,34,.18],[220,42,.1]].forEach(([rx,ry,op])=>{o+=`<ellipse cx="${cx}" cy="${by+2}" rx="${rx}" ry="${ry}" fill="none" stroke="#e8f4ee" stroke-width="2" opacity="${op}"/>`});
  if(fire){const r=rnd(7);for(let i=0;i<14;i++)o+=`<circle cx="${250+r()*300}" cy="${250+r()*130}" r="${1.5+r()*2.5}" fill="#ffd58a"/>`}
  return o;
}

function bgSVG(name){
  const [kind,a,b]=name.split(':');let d='',body='';
  if(kind==='dorf'){
    d=GR('sk',[[0,'#f5b46a'],[.45,'#b05a7a'],[1,'#3a2a52']]);
    body=`<rect width="800" height="450" fill="url(#sk)"/><circle cx="520" cy="268" r="62" fill="#ffd49a" opacity=".35"/><circle cx="520" cy="268" r="48" fill="#ffe2a0"/>`+
    `<ellipse cx="200" cy="120" rx="150" ry="9" fill="#fff" opacity=".13"/><ellipse cx="560" cy="170" rx="190" ry="8" fill="#fff" opacity=".12"/>`+
    `${hills('#5a4468',300,34,3)}${hills('#3d2e4d',350,26,9)}`+
    `<path d="M0 372 Q200 360 400 372 T800 372 L800 450 L0 450Z" fill="#2b2238"/>`+
    `${tree(450,376,1.1,'#2d3d3a')}${tree(40,380,.9,'#2d3d3a')}`+
    `${house(70,388,96,66,'#d7b389','#8c4a35',1)}${house(220,392,108,78,'#cfa97f','#7e3d2c',0)}${house(372,388,86,60,'#d9b88e','#8c4a35',1)}`+
    `<path d="M300 450 Q330 420 360 392 L400 392 Q380 430 410 450Z" fill="#6a5238" opacity=".7"/>`+
    `${[0,1,2,3,4,5].map(i=>`<rect x="${12+i*20}" y="414" width="4" height="26" fill="#4a3426"/>`).join('')}<path d="M10 424 H132 M10 434 H132" stroke="#4a3426" stroke-width="3"/>`+
    `<ellipse cx="116" cy="268" rx="12" ry="7" fill="#fff" opacity=".2"/><ellipse cx="128" cy="248" rx="16" ry="8" fill="#fff" opacity=".13"/>`+
    `<path d="M520 410 Q590 372 690 382 Q770 374 800 392 L800 450 L500 450Z" fill="#26443f"/><path d="M540 430 Q640 418 760 430" stroke="#5f8f86" stroke-width="2" fill="none" opacity=".4"/>`+
    `${reeds(34,404,60,5,'#16302b',1)}${mist(4,5,.16)}`;
  }else if(kind==='hof'){
    d=GR('wl',[[0,'#6a2a28'],[1,'#2b1414']])+`<radialGradient id="gl"><stop offset="0" stop-color="#ffb84a" stop-opacity=".7"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient>`;
    let cols='';[70,300,500,730].forEach(x=>{cols+=`<rect x="${x-22}" y="30" width="44" height="330" fill="#e6d6b2"/><rect x="${x+4}" y="30" width="18" height="330" fill="#cbb98f"/>${[-12,-4,4,12].map(o=>`<line x1="${x+o}" y1="44" x2="${x+o}" y2="350" stroke="rgba(0,0,0,.08)" stroke-width="2"/>`).join('')}<rect x="${x-30}" y="22" width="60" height="14" fill="#f1e4c4"/><rect x="${x-28}" y="352" width="56" height="12" fill="#f1e4c4"/>`});
    const torch=x=>`<circle cx="${x}" cy="150" r="48" fill="url(#gl)"/><rect x="${x-2}" y="150" width="4" height="26" fill="#3a2418"/><path d="M${x} 118 q-9 14 0 30 q9 -16 0 -30Z" fill="#ffb347"/><path d="M${x} 130 q-4 8 0 17 q4 -9 0 -17Z" fill="#ffe08a"/>`;
    const banner=x=>`<rect x="${x-34}" y="46" width="68" height="132" fill="#8e1f1f"/><path d="M${x-34} 178 l17 -14 l17 14 l17 -14 l17 14Z" fill="#8e1f1f"/><circle cx="${x}" cy="94" r="20" fill="#d8a84a"/><circle cx="${x}" cy="94" r="10" fill="#8e1f1f"/><rect x="${x-34}" y="46" width="68" height="6" fill="#d8a84a"/>`;
    body=`<rect width="800" height="450" fill="url(#wl)"/><path d="M336 362 V168 Q400 92 464 168 V362Z" fill="#190c0c"/><path d="M336 168 Q400 92 464 168" stroke="#d8c394" stroke-width="6" fill="none"/>${cols}${banner(185)}${banner(615)}${torch(92)}${torch(322)}${torch(522)}${torch(752)}`+
    `<rect y="362" width="800" height="88" fill="#3b2a22"/><path d="M0 362 H800" stroke="#d8c394" stroke-width="4"/>${[0,1,2,3,4,5,6,7,8].map(i=>`<line x1="${i*100}" y1="362" x2="${400+(i*100-400)*2.2}" y2="450" stroke="#2a1c16" stroke-width="3"/>`).join('')}<path d="M0 392 H800 M0 420 H800" stroke="#2a1c16" stroke-width="2"/>`+
    `<rect x="220" y="318" width="360" height="16" fill="#7a5232"/><rect x="240" y="334" width="10" height="40" fill="#5a3a22"/><rect x="550" y="334" width="10" height="40" fill="#5a3a22"/>${[270,340,410,480,530].map(x=>`<rect x="${x}" y="300" width="14" height="18" rx="3" fill="#e2b84a"/>`).join('')}`+
    `<g transform="translate(0 40)"><path d="M126 322 q-20 -10 -16 -40 q6 -12 20 -12 q14 0 20 12 q4 30 -16 40Z" fill="#b8663a"/><rect x="122" y="260" width="16" height="12" fill="#b8663a"/><path d="M114 292 q16 8 32 0" stroke="#7a3a1a" stroke-width="3" fill="none"/></g>`;
  }else if(kind==='sumpf'||kind==='kampf'){
    const fight=kind==='kampf';
    d=GR('sk',fight?[[0,'#4a3b3a'],[1,'#241c20']]:[[0,'#b6c9b0'],[1,'#6f8c7a']])+GR('wt',fight?[[0,'#26413a'],[1,'#121f1d']]:[[0,'#4a6e63'],[1,'#22403b']])+GR('wt2',fight?[[0,'#2a4a42'],[1,'#0f1a18']]:[[0,'#4a6e63'],[1,'#22403b']]);
    const r=rnd(11);let trees='';for(let i=0;i<7;i++){const x=40+i*115+r()*40,h=120+r()*80;trees+=`<path d="M${x} 300 L${x+4} ${300-h} M${x+3} ${300-h*.6} L${x-30} ${300-h*.85} M${x+4} ${300-h*.75} L${x+34} ${300-h*.95}" stroke="${fight?'#17110f':'#3a4a3d'}" stroke-width="5" fill="none" stroke-linecap="round"/>`}
    const r2=rnd(5);let lil='';if(!fight)for(let i=0;i<9;i++)lil+=`<ellipse cx="${r2()*800}" cy="${330+r2()*90}" rx="${14+r2()*14}" ry="${4+r2()*3}" fill="#3f6b4a"/>`;
    body=`<rect width="800" height="450" fill="url(#sk)"/>${fight?'':'<circle cx="610" cy="120" r="40" fill="#f2f0d8" opacity=".55"/>'}${trees}<rect y="296" width="800" height="154" fill="url(#wt)"/>${lil}${reeds(70,350,90,2,fight?'#0f1d17':'#2d4a3b',1)}${fight?hydra(+a,b==='fire'):''}${reeds(24,440,110,21,fight?'#0a120e':'#1d3328',0)}${mist(6,fight?4:8,fight?.07:.2)}`;
  }else if(kind==='morgen'){
    d=GR('sk',[[0,'#ffe0a8'],[.6,'#cfe0e0'],[1,'#a9c4d4']]);
    body=`<rect width="800" height="450" fill="url(#sk)"/><circle cx="400" cy="300" r="64" fill="#fff3cf" opacity=".85"/><ellipse cx="160" cy="90" rx="90" ry="14" fill="#fff" opacity=".5"/><ellipse cx="620" cy="130" rx="120" ry="12" fill="#fff" opacity=".45"/>${hills('#9bb6a0',290,22,5)}${hills('#7e9a84',330,18,8)}${tree(290,372,.9,'#5f8a62')}${tree(520,374,1,'#5f8a62')}<rect y="360" width="800" height="90" fill="#9c8660"/>${house(30,366,100,70,'#e5d2a8','#b0583a',0)}${house(160,360,86,58,'#ead9b0','#a24c32',0)}${house(580,366,98,72,'#e3cfa6','#b0583a',0)}${house(700,360,84,56,'#ead9b0','#a24c32',0)}<ellipse cx="400" cy="372" rx="52" ry="10" fill="#7d7a74"/><rect x="360" y="336" width="80" height="36" rx="6" fill="#8d8a84"/><rect x="360" y="326" width="80" height="12" rx="6" fill="#a9a59c"/><path d="M366 338 h68 M366 350 h68" stroke="rgba(0,0,0,.18)" stroke-width="2"/><rect x="364" y="280" width="6" height="50" fill="#5b3a22"/><rect x="430" y="280" width="6" height="50" fill="#5b3a22"/><path d="M356 282 L400 262 L444 282Z" fill="#8c4a35"/><path d="M0 416 Q400 380 800 416 L800 450 L0 450Z" fill="#8a7650"/>`;
  }else if(kind==='rat'){
    d=GR('wl',[[0,'#d5c9b0'],[1,'#a89a7e']])+GR('sk2',[[0,'#a9d2e8'],[1,'#f6ecd2']]);
    let blocks='';for(let y=20;y<350;y+=44){blocks+=`<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="rgba(0,0,0,.07)" stroke-width="2"/>`;for(let x=((y/44)%2)*60;x<800;x+=120)blocks+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+44}" stroke="rgba(0,0,0,.06)" stroke-width="2"/>`}
    const arch=i=>{const x=70+i*250;return `<clipPath id="ar${i}"><path d="M${x} 340 V170 Q${x+80} 70 ${x+160} 170 V340Z"/></clipPath><g clip-path="url(#ar${i})"><rect x="${x}" y="60" width="160" height="290" fill="url(#sk2)"/><path d="M${x} 300 Q${x+50} 250 ${x+90} 290 Q${x+130} 262 ${x+160} 296 V340 H${x}Z" fill="#9bb6a0"/></g><path d="M${x} 340 V170 Q${x+80} 70 ${x+160} 170 V340" fill="none" stroke="#8c7f66" stroke-width="9"/>`};
    body=`<rect width="800" height="450" fill="url(#wl)"/>${blocks}${[0,1,2].map(arch).join('')}${[30,285,535,780].map(x=>`<rect x="${x-20}" y="70" width="40" height="285" fill="#b7ad98"/><rect x="${x-20}" y="70" width="12" height="285" fill="rgba(255,255,255,.12)"/><rect x="${x-27}" y="60" width="54" height="14" fill="#cfc5ae"/><rect x="${x-27}" y="348" width="54" height="12" fill="#cfc5ae"/>`).join('')}`+
    `<polygon points="150,200 230,200 330,450 120,450" fill="#fff" opacity=".09"/><polygon points="400,200 480,200 580,450 370,450" fill="#fff" opacity=".07"/>`+
    `<rect y="356" width="800" height="94" fill="#7b705f"/>${[-4,-3,-2,-1,0,1,2,3,4,5,6,7,8].map(i=>`<line x1="${400+(i*100-400)*.25}" y1="356" x2="${i*100}" y2="450" stroke="rgba(0,0,0,.18)" stroke-width="2"/>`).join('')}<path d="M0 376 H800 M0 404 H800 M0 436 H800" stroke="rgba(0,0,0,.15)" stroke-width="2"/>`+
    `<rect x="20" y="372" width="200" height="24" fill="#5b3f26"/><rect x="20" y="406" width="220" height="26" fill="#4a3320"/><rect x="580" y="372" width="200" height="24" fill="#5b3f26"/><rect x="560" y="406" width="220" height="26" fill="#4a3320"/><rect x="300" y="392" width="200" height="22" fill="#9a8c74"/><rect x="320" y="378" width="160" height="14" fill="#b3a68c"/>`;
  }else{ /* nacht */
    d=GR('sk',[[0,'#070b25'],[1,'#2e2b5c']])+`<mask id="mn"><rect width="800" height="450" fill="#fff"/><circle cx="658" cy="82" r="30" fill="#000"/></mask>`;
    const r=rnd(13);let st='';for(let i=0;i<80;i++)st+=`<circle cx="${r()*800}" cy="${r()*260}" r="${.5+r()*1.4}" fill="#fff" opacity="${.4+r()*.6}"/>`;
    body=`<rect width="800" height="450" fill="url(#sk)"/>${st}<circle cx="640" cy="90" r="34" fill="#f4ecd0" mask="url(#mn)"/>${hills('#141a38',300,30,4)}${house(30,336,90,52,'#0e1230','#0a0e24',1)}${house(150,340,70,44,'#0e1230','#0a0e24',0)}${house(620,338,100,56,'#0e1230','#0a0e24',1)}<rect y="344" width="800" height="106" fill="#0c0f26"/>${reeds(24,404,70,17,'#05071a',1)}<radialGradient id="ff"><stop offset="0" stop-color="#ffb347" stop-opacity=".8"/><stop offset="1" stop-color="#ff7a1f" stop-opacity="0"/></radialGradient><circle cx="400" cy="396" r="150" fill="url(#ff)"/><rect x="370" y="418" width="60" height="7" rx="3" fill="#3a2418" transform="rotate(-8 400 421)"/><rect x="370" y="418" width="60" height="7" rx="3" fill="#2e1c12" transform="rotate(8 400 421)"/><polygon points="380,420 392,372 400,396 410,364 424,420" fill="#ff9a2f"/><polygon points="390,420 400,388 412,420" fill="#ffe08a"/>`;
  }
  return `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>${d}</defs>${body}</svg>`;
}

