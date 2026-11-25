/* GRAFIK 2/2: Zeichnet eine Figur als SVG aus den Angaben in figuren-daten.js
   fig(schluessel, stimmung): stimmung = neutral, smile, sad, worry, angry */
function fig(k,mood){
  const c=CH[k],m=mood||'neutral',br=c.big?9:0,sk=c.skin,rb=c.robe,dk=shade(rb,.24),skd=shade(sk,.2),h=c.hair,T=c.hairType;
  const hc=T==='scarf'?c.scarf:h;
  let s=`<svg viewBox="0 0 120 250" xmlns="http://www.w3.org/2000/svg">`;
  s+=`<ellipse cx="60" cy="244" rx="${44+br}" ry="5" fill="rgba(0,0,0,.38)"/>`;
  if(T==='lion'){let p='';for(let a=0;a<360;a+=20){const r=a%40?26:34,x=60+r*Math.cos(a*Math.PI/180),y=54+r*Math.sin(a*Math.PI/180);p+=`${x.toFixed(1)},${y.toFixed(1)} `}s+=`<polygon points="${p}" fill="#a87a2c"/>`}
  /* Füße und Robe */
  s+=`<ellipse cx="46" cy="240" rx="10" ry="4.5" fill="${skd}"/><ellipse cx="74" cy="240" rx="10" ry="4.5" fill="${skd}"/>`;
  s+=`<path d="M${32-br} 94 Q60 82 ${88+br} 94 L${100+br} 234 Q60 242 ${20-br} 234Z" fill="${rb}"/>`;
  s+=`<path d="M${32-br} 94 Q60 82 ${60} 90 L56 236 Q${36-br} 238 ${20-br} 234Z" fill="rgba(255,255,255,.07)"/>`;
  s+=`<path d="M${21-br} 226 Q60 234 ${99+br} 226 L${100+br} 234 Q60 242 ${20-br} 234Z" fill="${dk}"/>`;
  s+=`<path d="M46 122 Q42 180 38 228 M74 122 Q78 180 82 228 M60 104 L60 230" stroke="rgba(0,0,0,.13)" stroke-width="2" fill="none"/>`;
  if(c.apron)s+=`<path d="M44 108 L76 108 L84 232 L36 232Z" fill="rgba(255,240,210,.55)"/><path d="M44 98 L46 110 M76 98 L74 110" stroke="rgba(255,240,210,.7)" stroke-width="3"/>`;
  s+=`<path d="M${33-br} 138 Q60 145 ${87+br} 138 L${87+br} 147 Q60 154 ${33-br} 147Z" fill="${dk}"/><circle cx="60" cy="146" r="3.2" fill="#e0b45a"/>`;
  /* Arme */
  s+=`<path d="M${33-br} 95 Q${15-br} 126 ${21-br} 160 L${38-br} 163 Q${36-br} 128 48 105Z" fill="${rb}" stroke="${dk}" stroke-width="1"/><path d="M${21-br} 152 L${38-br} 155 L${38-br} 163 L${21-br} 160Z" fill="${dk}"/>`;
  s+=`<path d="M${87+br} 95 Q${105+br} 126 ${99+br} 160 L${82+br} 163 Q${84+br} 128 72 105Z" fill="${rb}" stroke="${dk}" stroke-width="1"/><path d="M${99+br} 152 L${82+br} 155 L${82+br} 163 L${99+br} 160Z" fill="${dk}"/>`;
  if(c.staff)s+=`<rect x="${88+br}" y="46" width="6" height="196" rx="3" fill="#6b4a2a"/><circle cx="${91+br}" cy="46" r="5" fill="#8a6238"/>`;
  if(c.club)s+=`<path d="M${88+br} 182 L${96+br} 182 L${112+br} 76 Q${108+br} 50 ${92+br} 56 Q${84+br} 66 ${88+br} 182Z" fill="#6b4a2a"/><path d="M${96+br} 70 Q${100+br} 100 ${95+br} 150" stroke="#8a6238" stroke-width="3" fill="none"/><circle cx="${100+br}" cy="68" r="2" fill="#3a2418"/><circle cx="${97+br}" cy="88" r="2" fill="#3a2418"/>`;
  if(c.horn)s+=`<path d="M${88+br} 176 Q${110+br} 160 ${116+br} 140 L${126+br} 134 Q${128+br} 150 ${120+br} 156 Q${104+br} 172 ${92+br} 182Z" fill="#e2b84a"/><ellipse cx="${124+br}" cy="142" rx="6" ry="10" transform="rotate(-30 ${124+br} 142)" fill="#f0cc5e"/>`;
  s+=`<ellipse cx="${29-br}" cy="170" rx="6.8" ry="8.5" fill="${sk}"/><ellipse cx="${91+br}" cy="170" rx="6.8" ry="8.5" fill="${sk}"/>`;
  if(k==='kallis'&&S.ev.narbe)s+=`<path d="M${19.5-br} 138 L${37.5-br} 142 L${36-br} 154 L${19-br} 150Z" fill="#efe6d2" stroke="#cdbf9f" stroke-width="1"/><path d="M${21-br} 143 l15 3 M${20-br} 148 l15 3" stroke="#cdbf9f" stroke-width="1.4"/><ellipse cx="${28-br}" cy="146" rx="4" ry="2.6" fill="#b5483a" opacity=".6"/>`;
  /* Löwenfell-Umhang */
  if(T==='lion')s+=`<path d="M${16-br} 96 Q60 78 ${104+br} 96 L${110+br} 134 L${96+br} 128 L${88+br} 144 L72 130 L60 146 L48 130 L${32-br} 144 L${24-br} 128 L${10-br} 134Z" fill="#d8a84a"/><path d="M${30-br} 100 Q60 90 ${90+br} 100 M44 112 l6 12 M70 108 l5 14 M${28-br} 112 l4 11 M${92+br} 112 l-4 11" stroke="#a87a2c" stroke-width="2.4" fill="none"/><ellipse cx="47" cy="111" rx="6" ry="4" fill="#c4923a"/><ellipse cx="73" cy="111" rx="6" ry="4" fill="#c4923a"/>`;
  /* Hals, Kragen */
  s+=`<path d="M52 72 L68 72 L69 92 Q60 99 51 92Z" fill="${skd}"/>`;
  if(T!=='lion')s+=`<path d="M47 90 L60 108 L73 90 L67 88 L60 98 L53 88Z" fill="${dk}"/>`;
  if(T==='bun')s+=`<ellipse cx="60" cy="45" rx="23.5" ry="21" fill="${h}"/><circle cx="60" cy="22" r="9.5" fill="${h}"/><path d="M52 20 Q60 14 68 20" stroke="rgba(255,255,255,.12)" stroke-width="2" fill="none"/>`;
  if(T==='scarf')s+=`<ellipse cx="60" cy="50" rx="21" ry="24" fill="${h}"/>`;
  if(T==='pigtails')s+=`<ellipse cx="60" cy="52" rx="23" ry="24" fill="${h}"/><path d="M40 66 Q30 80 32 98" stroke="${h}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M80 66 Q90 80 88 98" stroke="${h}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M40 66 Q30 80 32 98 M80 66 Q90 80 88 98" stroke="rgba(0,0,0,.28)" stroke-width="8" stroke-dasharray="2.5 3.5" fill="none"/><circle cx="32" cy="99" r="3.4" fill="#c0392b"/><circle cx="88" cy="99" r="3.4" fill="#c0392b"/>`;
  /* Kopf */
  s+=`<circle cx="39.5" cy="58" r="4.2" fill="${sk}"/><circle cx="80.5" cy="58" r="4.2" fill="${sk}"/>`;
  s+=`<ellipse cx="60" cy="56" rx="20.5" ry="23" fill="${sk}"/>`;
  s+=`<path d="M60 56 L57.5 65 Q60 67 62.5 65" stroke="${skd}" stroke-width="1.6" fill="none"/><circle cx="47" cy="65" r="5" fill="rgba(220,90,70,.15)"/><circle cx="73" cy="65" r="5" fill="rgba(220,90,70,.15)"/>`;
  /* Bart */
  if(c.beard){const bY=80+(c.beardLen-70)*.42,cc=2*bY-79;s+=`<path d="M39 58 Q37 74 46 79 Q60 ${cc} 74 79 Q83 74 81 58 Q77 73 60 74 Q43 73 39 58Z" fill="${c.beard}"/>`}
  /* Haare */
  if(T==='bun')s+=`<path d="M39 58 Q37 33 60 31 Q83 33 81 58 Q77 46 70 42 Q64 40 60 40 Q56 40 50 42 Q43 46 39 58Z" fill="${h}"/>`;
  if(T==='scarf')s+=`<path d="M38 60 Q35 29 60 27 Q85 29 82 60 Q80 45 70 41 Q60 38 50 41 Q40 45 38 60Z" fill="${c.scarf}"/><path d="M41 36 Q60 28 79 36" stroke="rgba(150,90,30,.55)" stroke-width="2" fill="none"/><path d="M79 50 Q91 58 90 84 Q82 76 77 62Z" fill="${shade(c.scarf,.15)}"/><circle cx="79" cy="52" r="4" fill="${c.scarf}"/>`;
  if(T==='short'||T==='hat')s+=`<path d="M38 56 Q36 30 60 30 Q84 30 82 56 Q78 42 66 39 Q54 43 46 40 Q40 46 38 56Z" fill="${h}"/>`;
  if(T==='hat')s+=`<path d="M40 36 L44 4 L76 4 L80 36Z" fill="${rb}"/><rect x="40" y="27" width="40" height="7" fill="#e0b45a"/><path d="M44 4 L76 4" stroke="#e0b45a" stroke-width="3"/>`;
  if(T==='bald')s+=`<ellipse cx="53" cy="38" rx="9" ry="3.5" fill="rgba(255,255,255,.18)"/>`;
  if(T==='pigtails')s+=`<path d="M39 56 Q38 34 60 33 Q82 34 81 56 Q76 44 70 42 Q60 45 50 42 Q44 44 39 56Z" fill="${h}"/>`;
  if(T==='lion')s+=`<path d="M37 54 Q34 22 60 20 Q86 22 83 54 Q76 38 60 38 Q44 38 37 54Z" fill="#d8a84a"/><path d="M38 34 L38 14 L52 26Z M82 34 L82 14 L68 26Z" fill="#d8a84a"/><path d="M41 30 L41 20 L48 26Z M79 30 L79 20 L72 26Z" fill="#8a5a1c"/><path d="M48 30 L52 36 M60 26 L60 34 M72 30 L68 36" stroke="#a87a2c" stroke-width="2"/>`;
  /* Gesicht */
  const pd=(m==='sad'||m==='worry')?1:0;
  s+=`<ellipse cx="52" cy="57" rx="3.2" ry="2.6" fill="#fff"/><ellipse cx="68" cy="57" rx="3.2" ry="2.6" fill="#fff"/><circle cx="52.4" cy="${57+pd*.6}" r="1.8" fill="#222"/><circle cx="68.4" cy="${57+pd*.6}" r="1.8" fill="#222"/>`;
  const bc=(T==='scarf'||T==='lion'||T==='hat'||T==='bald')?(c.beard||h):h;
  if(m==='angry')s+=`<path d="M45 50 L57 54 M75 50 L63 54" stroke="${bc}" stroke-width="2.6" stroke-linecap="round"/><path d="M53 71 Q60 65 67 71" stroke="#5a2a22" stroke-width="2" fill="none"/>`;
  else if(m==='sad'||m==='worry')s+=`<path d="M45 53 L57 49 M75 53 L63 49" stroke="${bc}" stroke-width="2.4" stroke-linecap="round"/><path d="M53 71 Q60 66 67 71" stroke="#5a2a22" stroke-width="2" fill="none"/>`;
  else if(m==='smile')s+=`<path d="M46 49 Q52 46 58 49 M62 49 Q68 46 74 49" stroke="${bc}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M52 67 Q61 75 69 66" stroke="#5a2a22" stroke-width="2.2" fill="none"/>`;
  else s+=`<path d="M46 50 Q52 48 58 50 M62 50 Q68 48 74 50" stroke="${bc}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M53 69 L67 69" stroke="#5a2a22" stroke-width="2" fill="none"/>`;
  if(c.mus)s+=`<path d="M49 68 Q55 62 60 66 Q65 62 71 68 Q64 70 60 68 Q56 70 49 68Z" fill="${c.beard}"/>`;
  return s+`</svg>`;
}

