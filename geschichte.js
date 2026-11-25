/* GESCHICHTE: Spielzustand, Zeugen-Gewichtung, Enden und alle Szenen.
   Jede Szene steht im Objekt ST: P(wer, text, naechsteSzene, extra).
   Dialoge ändern: einfach den Text in den Backticks ändern. */
const fresh=()=>({ev:{},w:{},flags:{},topics:{},bond:0,pos:'far',visits:0,maxV:3,visited:{},end:null,tradition:false,silent:false});
let S=fresh();
const EVL={zahn:'Fangzahn',gift:'Giftdrüse',narbe:'Brandnarbe',nysa:'Nysa',stein:'Fels'};
const NM={iolaos:'Iolaos',timon:'Timon',archias:'Archias',demetrios:'Demetrios',thea:'Thea'};
const ENDNAMES={A:'Bezeugt',E:'Gehilfin am Rand',B1:'Das Wunder des Archias',B2:'Das Lied des Herakles',C:'Die Verrückte vom Sumpf',D:'Schuld ohne Ruhm',F:'Der Mythos, wie er war'};
const ENDFIRST={A:'A1',E:'E1',B1:'Ba1',B2:'Bb1',C:'C1',D:'D1',F:'F1'};
const HKNEXT={A:'A4',E:'E3',B1:'Ba3'};
const FOUND=new Set();
const jn=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' und '+a[a.length-1];
const comp=()=>Object.keys(NM).filter(k=>S.w[k]).map(k=>NM[k]);
function TS(){
  const w=S.w,f=S.flags;
  const iol=!!w.iolaos&&S.bond>=1,tim=!!w.timon,dem=!!w.demetrios&&!!f.demFollowed;
  let t=(iol?2:0)+(tim?1:0)+(dem?1:0);
  if(S.pos==='near'&&(iol||tim)&&t>0)t+=1;
  let need=((S.ev.zahn||S.ev.gift)?3:4)+(f.demHostile?1:0)-(S.silent?1:0);
  if(need<1)need=1;
  const men=['iolaos','timon','demetrios','archias'].filter(k=>w[k]);
  return {t,need,iol,tim,dem,men};
}
function pickEnd(){
  const x=TS(),f=S.flags;
  if(!x.men.length&&!f.timonDead)return 'C';
  if(f.timonDead&&x.t<x.need)return 'D';
  if(x.t>=x.need)return 'A';
  if(x.t>=1)return 'E';
  if(S.w.archias)return 'B1';
  return 'B2';
}
const truthSp=()=>{const x=TS();return x.iol?'iolaos':x.tim?'timon':'demetrios'};
const truthNames=()=>{const x=TS();return [x.iol&&'Iolaos',x.tim&&'Timon',x.dem&&'Demetrios'].filter(Boolean)};
const set=k=>()=>{S.ev[k]=true};
const P=(who,text,next,extra)=>Object.assign({sp:who,text,next},extra||{});
const WSK=(k,next,extra)=>Object.assign({skipTo:next,skip:()=>!S.w[k]},extra||{});

const ST={
/* ===== AKT I: DAS DORF ===== */
a1:P('n',`Lerna, am Rand des Sumpfes. Seit dem Frühling verschwinden hier Kinder, elf bisher, dazu zwei Fischer und sieben Ziegenherden. Im Schilf haust die Hydra, die vielköpfige Wasserschlange, von der die Alten nur flüstern.`,'a2',{bg:'dorf',chars:{}}),
a2:P('kallis',`Ich bin Kallis. Ich sammle Kräuter, flicke Netze und kenne jeden Pfad durch den Sumpf. Gefragt hat mich deswegen noch nie jemand.`,'a3',{chars:{c:'kallis:neutral'}}),
a3:P('demetrios',`Hört mich an, Leute von Lerna! König Eurystheus hat Herakles gesandt. Er wird die Hydra töten, die vielköpfige Bestie von Lerna. Das ist Männersache. Geht in eure Häuser.`,'a4',{chars:{l:'kallis:neutral',c:'demetrios:neutral',r:'thea:sad'}}),
a4:P('thea',`Nysa ist seit drei Nächten fort, Kallis. Meine Kleine. Sie sagen, sie hätte sich verirrt.`,'a5'),
a5:P('kallis',`Ich habe die Spuren gesehen. Keine Wölfe. Etwas Schweres hat Furchen gezogen, und im Schlamm liegen Abdrücke von mehr als einem Hals. Das ist die Hydra, und sie ist nah.`,'a6',{chars:{l:'kallis:worry',c:'demetrios:neutral',r:'thea:sad'}}),
a6:P('demetrios',`Kallis. Der Nebel lässt Frauen Dinge sehen. Die Hydra ist Sache des Herakles. Wir warten auf ihn.`,null,{chars:{l:'kallis:angry',c:'demetrios:smile',r:'thea:sad'},choices:[
  {t:`Ich warte auf Herakles.`,go:'w1',fx:()=>{S.flags.waited=true}},
  {t:`Ich gehe nach Tiryns und frage ihn, wann er kommt.`,go:'t1'}]}),
w1:P('kallis',`Ich wartete drei Tage. Am dritten Morgen fehlten zwei weitere Kinder, darunter Pelias, Timons Neffe. Die Dörfler verriegelten ihre Türen. Von Herakles kam kein Wort, nicht einmal Staub auf der Straße. Ich hatte Zeit verloren, und mit der Zeit den Mut der anderen.`,'w2',{chars:{}}),
w2:P('n',`Am vierten Tag kam ein Reiter über die Straße: Iolaos, von seinem Onkel geschickt, um „nach dem Rechten zu sehen“. Herakles selbst kam nicht.`,'w3',{bg:'dorf',chars:{l:'kallis:sad',r:'iolaos:worry'}}),
w3:P('iolaos',`Er will wissen, ob es wirklich so schlimm ist. Ich habe nicht lange, bevor ich zurückreiten muss. Beim König liegen Tafeln, auf denen Reisende aufschreiben ließen, was sie über solche Wesen erzählen.`,'w4'),
w4:P('kallis',`Steht dort auch, wie man sie tötet?`,'w5'),
w5:P('iolaos',`Hals um Hals. Wo einer fällt, wachsen zwei nach, außer man brennt den Stumpf sofort aus, mit Pech und Feuer. Der in der Mitte ist unsterblich. Den kann man nur begraben, unter etwas Schwerem.`,'w6',{fx:()=>{S.flags.fire=true;S.flags.mid=true}}),
w6:P('iolaos',`Hier, Pech, Fackeln, ein Messer. Mehr Zeit habe ich nicht.`,'ia'),

/* ===== AKT I: TIRYNS ===== */
t1:P('n',`Tiryns. Im Festsaal duftet es nach Braten und Lorbeer. Herakles sitzt in der Mitte, das Löwenfell über der Schulter, und ein Sänger übt schon die ersten Verse auf ihn.`,'t2',{bg:'hof',chars:{}}),
t2:P('herakles',`Das Kräuterweib aus Lerna! Komm, setz dich. Nein, steh. Dann kannst du mir Wein nachschenken.`,'t3',{chars:{l:'kallis:neutral',c:'herakles:smile',r:'iolaos:worry'}}),
t3:P('kallis',`Die Hydra, Herakles. Elf Kinder. Der König hat dich geschickt.`,'t4'),
t4:P('herakles',`Ach, die Wasserschlange. Weißt du, der Löwe ist noch frisch, das Lied nicht fertig. Wenn ich jetzt in einen Sumpf steige, ist das schlecht für die Geschichte. Schlamm gibt keine gute Strophe.`,'t5'),
t5:P('kallis',`Es sind Kinder.`,'t5b',{chars:{l:'kallis:sad',c:'herakles:smile',r:'iolaos:worry'}}),
t5b:P('herakles',`Es sind immer irgendwelche Kinder, Schätzchen. Ich kann nicht jedes Dorf retten. Mein Name ist mein Werk.`,null,{choices:[
  {t:`Ihn anschreien.`,go:'t6a',fx:()=>{S.flags.shout=true}},
  {t:`Ruhig bleiben und noch einmal bitten.`,go:'t6b'}]}),
t6a:P('kallis',`Du feiger, aufgeblasener …`,'t7a',{chars:{l:'kallis:angry',c:'herakles:smile',r:'iolaos:worry'}}),
t7a:P('herakles',`Siehst du? Hysterisch. Genau das meine ich. Wachen! Werft sie hinaus.`,'g1'),
t6b:P('kallis',`Bitte. Nur du kannst das. Man sagt, du seist der Stärkste der Welt.`,'t7b'),
t7b:P('herakles',`So höflich! Das gefällt mir. Nächsten Monat, vielleicht. Iolaos, merk dir: Hydra, später. Und hol ihr einen Becher Wasser, sie sieht durstig aus.`,'t8a'),

/* --- Pfad 1: angeschrien, Rauswurf durch Wachen --- */
g1:P('n',`Zwei Wachen packten mich unter den Armen. Der Saal lachte, der Sänger setzte mitten im Vers neu an. Ich flog durch den Torbogen, mein Bündel hinterher.`,'g2',{chars:{}}),
g2:P('n',`Ich saß im Dreck vor dem Tor. Ich hatte kein Pech, keine Fackeln und kein Wissen darüber, wie man etwas tötet, das mehr als einen Kopf hat. Am Fenster des Saals sah ich Iolaos stehen. Er sah weg.`,null,{bg:'dorf',choices:[
  {t:`Vor dem Tor ausharren, bis Iolaos herauskommt. Das kostet eine ganze Nacht.`,go:'g3',fx:()=>{S.flags.gate=true}},
  {t:`Zurück nach Lerna, mit dem Messer und dem, was ich weiß.`,go:'v1'}]}),
g3:P('n',`Ich wartete, bis es dunkel war. Die Wachen sahen mich und taten, als sähen sie mich nicht. Dann kam Iolaos mit zwei Weinkrügen, die er in die Küche brachte, und stellte sie neben mich ab.`,'g4',{chars:{l:'kallis:sad',r:'iolaos:worry'}}),
g4:P('iolaos',`Sprich leise. Ich habe nur den Weg vom Hof zur Küche.`,'g5'),
g5:P('kallis',`Du kennst die Schreiber des Königs. Weiß dort irgendjemand, wie man sie tötet?`,'g6'),
g6:P('iolaos',`Hals um Hals. Wo einer fällt, wachsen zwei nach, außer man brennt den Stumpf sofort aus, mit Pech und Feuer. Der in der Mitte ist unsterblich. Den kann man nur begraben, unter etwas Schwerem.`,'g7',{fx:()=>{S.flags.fire=true;S.flags.mid=true}}),
g7:P('iolaos',`Hier, aus der Schmiede: Pech, Fackeln, ein Messer. Mitkommen kann ich nicht, er lässt mich nicht aus den Augen. Such dir Zeugen, Kallis. In Lerna hört man einem Mann mit Namen zu, auch wenn er nichts gesehen hat. Dir hört man nicht zu, auch wenn du alles gesehen hast.`,'v1',{chars:{l:'kallis:neutral',r:'iolaos:sad'}}),

/* --- Pfad 2: höflich, langes Gespräch mit Iolaos --- */
t8a:P('iolaos',`Es tut mir leid. Mein Onkel ist nicht immer so.`,'t9a',{bg:'dorf',chars:{l:'kallis:sad',r:'iolaos:worry'}}),
t9a:P('kallis',`Doch. Immer.`,'ih'),
ih:P('iolaos',()=>S.topics.n?`Noch etwas? Ich habe nicht lange.`:`Er vergisst mich, solange er trinkt. Aber nicht lange. Was willst du wissen?`,null,{chars:{l:'kallis:neutral',r:'iolaos:worry'},choices:()=>{
  const c=[];
  if(!S.topics.tablet)c.push({t:`Fragen, ob der König etwas über die Hydra weiß.`,go:'it1'});
  if(!S.topics.hera)c.push({t:`Fragen, warum Herakles nicht geht.`,go:'ih1'});
  if(!S.topics.self)c.push({t:`Fragen, warum er ihr überhaupt zuhört.`,go:'is1'});
  c.push({t:`Das Gespräch beenden und ihn um etwas bitten.`,go:'ia'});
  return c;}}),
it1:P('iolaos',`Eurystheus' Schreiber haben aufgeschrieben, was Reisende erzählten. Neun Köpfe. Ein Atem, der das Wasser vergiftet.`,'it2',{fx:()=>{S.topics.n=1}}),
it2:P('kallis',`Und wie tötet man sie?`,'it3'),
it3:P('iolaos',`Hals um Hals. Wo einer fällt, wachsen zwei nach. Es sei denn, man brennt den Stumpf sofort aus, mit Pech und Feuer, bevor die Wunde sich teilt.`,'it4',{fx:()=>{S.flags.fire=true}}),
it4:P('kallis',`Und der in der Mitte?`,'it5'),
it5:P('iolaos',`Unsterblich, sagt die Tafel. Nicht zu töten. Nur zu begraben, unter etwas Schwerem.`,'it6',{fx:()=>{S.flags.mid=true}}),
it6:P('iolaos',`Hier. Pech, Fackeln, ein Schmiedemesser. Ich habe es aus der Schmiede genommen.`,'ih',{fx:()=>{S.topics.tablet=1}}),
ih1:P('iolaos',`Er hat Angst, Kallis. Nicht vor der Hydra. Davor, im Dreck gesehen zu werden, ohne zu gewinnen. Er will nur Taten, die schon fertig sind, wenn er kommt.`,'ih2',{fx:()=>{S.topics.n=1}}),
ih2:P('kallis',`Und wenn jemand anders die Tat tut?`,'ih3'),
ih3:P('iolaos',`Dann nimmt er sie. Er nimmt immer. Den Hirten, der ihm die Spur des Löwen zeigte, hat er im Lied nie erwähnt.`,'ih',{fx:()=>{S.topics.hera=1;S.flags.heraWarn=true}}),
is1:P('kallis',`Und du? Warum hörst du mir zu, wenn er es nicht tut?`,'is2',{fx:()=>{S.topics.n=1}}),
is2:P('iolaos',`Meine Mutter hat mir beigebracht zuzuhören. Mein Onkel hat mir beigebracht, es nicht zu zeigen.`,'ih',{fx:()=>{S.topics.self=1;S.bond++}}),
ia:P('iolaos',`Eins noch. In Lerna wird dir niemand glauben, wenn du allein erzählst. Du brauchst Männer mit Namen, die dabei sind und es sagen. Ich kann einer sein, wenn du willst. Sonst such dir andere.`,null,{chars:{l:'kallis:neutral',r:'iolaos:worry'},choices:[
  {t:`Ehrlich bitten: „Komm mit. Nicht für mich, für die Kinder. Sieh es selbst und sag es später.“`,go:'t11a',fx:()=>{S.w.iolaos=true;S.bond++}},
  {t:`Ihn erinnern: „Du hast gesagt, du bist da. Dann sei da.“`,go:'t11b',fx:()=>{S.w.iolaos=true}},
  {t:`Nichts verlangen und gehen.`,go:'t11c'}]}),
t11a:P('iolaos',`Ich … ja. Mein Onkel wird toben. Aber ich komme. Wir treffen uns am Sumpfrand.`,'v1',{chars:{l:'kallis:neutral',r:'iolaos:smile'}}),
t11b:P('iolaos',`Das ist unfair. Aber gut. Ich komme, ich sehe zu, mehr verspreche ich nicht.`,'v1',{chars:{l:'kallis:angry',r:'iolaos:worry'}}),
t11c:P('iolaos',`Pass auf dich auf, Kallis. Ich wünschte, ich wäre mutiger.`,'v1',{chars:{l:'kallis:sad',r:'iolaos:sad'}}),

/* ===== AKT II: ZEUGEN WERBEN ===== */
v1:P('kallis',()=>(S.flags.waited?`Nachdem Iolaos fort war, wusste ich, was ich brauchte: Zeugen.`:`Auf dem Heimweg wusste ich, was ich brauchte: Zeugen.`)+` Männer, die dabei sind und es sagen, wenn mir niemand glaubt. Wer nicht sieht, wie es geschieht, kann es nicht bezeugen.`+(S.flags.fire?'':` Und ich wusste nicht, wie man ein Wesen tötet, das nachwächst. Vielleicht hatte im Dorf jemand etwas gesehen.`)+` Die Nacht reicht für ${S.maxV} Gespräche${S.maxV<3?' (ich habe Zeit verloren)':''}.`,'hub',{bg:'nacht',chars:{c:'kallis:worry'},fx:()=>{S.maxV=Math.max(1,3-(S.flags.waited?1:0)-(S.flags.gate?1:0))}}),
hub:P('n',()=>`${comp().length?'Mitkommen werden: '+jn(comp())+'.':'Noch hat sich niemand bereit erklärt.'} Gespräche in dieser Nacht: ${S.visits} von ${S.maxV}.`,null,{bg:'nacht',chars:{},skip:()=>S.visits>=S.maxV,skipTo:'dep',choices:()=>{
  const c=[];
  if(!S.visited.timon)c.push({t:`Zu Timon gehen, dem Fischer, dessen Bruder im Sumpf verschwand.`,go:'tm1'});
  if(!S.visited.archias)c.push({t:`Zu Archias gehen, dem Priester.`,go:'ar1'});
  if(!S.visited.demetrios)c.push({t:`Zu Demetrios gehen, dem Dorfältesten.`,go:'dm1'});
  if(!S.visited.thea)c.push({t:`Zu Thea gehen, Nysas Mutter.`,go:'th1'});
  c.push({t:S.visits?`Aufbrechen. Ich habe genug gesprochen.`:`Ohne Zeugen aufbrechen.`,go:'dep'});
  return c;}}),

tm1:P('timon',()=>S.flags.waited?`Mein Bruder Kleitos ist im Sumpf verschwunden. Und vor drei Tagen mein Neffe Pelias. Du hast gewartet, Kallis. Wir alle haben gewartet.`:`Mein Bruder Kleitos ist im Sumpf verschwunden. Alle sagen, er sei ertrunken. Ich sage: Da ist etwas.`,null,{bg:'dorf',chars:{l:'kallis:neutral',r:'timon:sad'},fx:()=>{S.visited.timon=1;S.visits++},choices:[
  {t:`Ehrlich bitten: „Komm mit und sieh es selbst. Sag später, was du gesehen hast.“`,go:'tm2',fx:()=>{S.w.timon=true}},
  {t:`Ihn lieber nicht in Gefahr bringen.`,go:'hub'}]}),
tm2:P('timon',`Ich bin dabei. Aber ich warne dich: Mein Wort gilt wenig in Lerna. Ich bin nur ein Fischer.`,'hub'),

ar1:P('archias',`Eine Frau, ein Sumpf, mitten in der Nacht. Ich diene den Göttern, Kallis, nicht einem Kräuterweib.`,null,{bg:'dorf',chars:{l:'kallis:neutral',r:'archias:smile'},fx:()=>{S.visited.archias=1;S.visits++},choices:[
  {t:`Ihm den Ruhm anbieten: „Wenn du mitkommst, nennt man dich den Retter von Lerna.“`,go:'ar2',fx:()=>{S.w.archias=true}},
  {t:`Auf der Wahrheit bestehen: „Ich brauche keinen Retter. Nur einen Zeugen.“`,go:'ar3',fx:()=>{S.flags.archiasRefused=true}},
  {t:`Gehen.`,go:'hub'}]}),
ar2:P('archias',`Ein Zeichen der Götter! Ich komme. Aus der Ferne, versteht sich. Ein Priester steht nicht im Schlamm.`,'hub',{chars:{l:'kallis:sad',r:'archias:smile'}}),
ar3:P('archias',`Ein Zeuge ohne Ruhm? Das ist ein Narr, und ich bin keiner. Gute Nacht.`,'hub',{chars:{l:'kallis:angry',r:'archias:smile'}}),

dm1:P('demetrios',`Kallis. Der Nebel hat dir den Kopf vernebelt. Geh schlafen. … Ich habe selbst Reusen gesehen, die kein Wolf so zerreißt. Aber wenn ich das sage, fragt der Rat, warum ich nichts getan habe.`,null,{bg:'dorf',chars:{l:'kallis:neutral',r:'demetrios:neutral'},fx:()=>{S.visited.demetrios=1;S.visits++},choices:[
  {t:`Ihm die Führung überlassen: „Du bist der Älteste. Führe uns. Ich helfe.“`,go:'dm2',fx:()=>{S.w.demetrios=true;S.flags.lead=true}},
  {t:`Widersprechen: „Ich führe. Ich kenne den Sumpf.“`,go:'dm3',fx:()=>{S.flags.demHostile=true}},
  {t:`Gehen.`,go:'hub'}]}),
dm2:P('demetrios',`Das ist vernünftig. Ich übernehme die Führung. Du folgst.`,'hub',{chars:{l:'kallis:sad',r:'demetrios:smile'}}),
dm3:P('demetrios',`Dann sieh zu, wie du es allein erklärst, wenn es schiefgeht. Ich sage dem Rat, dass ich dich gewarnt habe.`,'hub',{chars:{l:'kallis:angry',r:'demetrios:angry'}}),

th1:P('thea',`Kallis. Ich habe auf dich gewartet. Frag mich, was du willst.`,'thh',{bg:'dorf',chars:{l:'kallis:neutral',r:'thea:sad'},fx:()=>{S.visited.thea=1;S.visits++}}),
thh:P('thea',()=>S.topics.thea?`Noch etwas?`:`Ich habe nicht viel Zeit, aber ich habe alle Zeit der Welt, wenn es um Nysa geht.`,null,{chars:{l:'kallis:neutral',r:'thea:sad'},choices:()=>{
  const c=[];
  if(!S.topics.sah)c.push({t:`Fragen, was sie in der Nacht gesehen hat.`,go:'thq1'});
  if(!S.topics.how)c.push({t:`Fragen, wie es ihr geht.`,go:'thq4'});
  if(!S.topics.ask)c.push({t:`Sie bitten, mitzukommen.`,go:'thq7'});
  c.push({t:`Das Gespräch beenden.`,go:'hub'});
  return c;}}),
thq1:P('thea',`Es war Nebel, aber ich habe es gehört: ein Zischen, viele Stimmen übereinander. Am Ufer lagen Brasidas' Fischreusen, zerfetzt.`,'thq2',{fx:()=>{S.topics.thea=1;S.topics.sah=1}}),
thq2:P('thea',`Brasidas war am Morgen dort. Er hat mit der Axt auf einen Hals eingeschlagen, der aus dem Wasser kam. Er sagt, es seien zwei nachgewachsen. Er redet nicht mehr darüber. Man hat ihn ausgelacht.`,'thq3',{fx:()=>{S.flags.regrow=true}}),
thq3:P('kallis',`Und danach? Hat jemand versucht, die Stümpfe zu versiegeln, mit irgendetwas?`,'thq3b'),
thq3b:P('thea',`Davon weiß hier niemand etwas, Kallis. Nur, dass die Hälse nicht aufhören.`,'thh'),
thq4:P('thea',`Ich habe geschrien. Ich stand beim Ältesten vor der Tür und habe getobt. Er gab mir einen Becher Mohnmilch und sagte, ich sei überreizt.`,'thq5',{fx:()=>{S.topics.thea=1;S.topics.how=1}}),
thq5:P('kallis',`Ich habe in Tiryns geschrien. Sie haben mich hinausgeworfen.`,'thq6',{skip:()=>!S.flags.shout,skipTo:'thq6'}),
thq6:P('thea',`Als ich vor seiner Tür schrie, bekam ich Mohnmilch. Als Timon letzten Winter vor seiner Tür laut wurde, bekam er Wein und einen Platz am Tisch. Bleib ruhig, Kallis. Es ist unfair, aber es wirkt.`,'thh'),
thq7:P('thea',`Ich komme mit. Nysa ist mein Kind. Mir hört ja keiner zu, wenn ich etwas sage, aber ich kann Fackeln halten.`,null,{chars:{l:'kallis:neutral',r:'thea:sad'},fx:()=>{S.topics.thea=1;S.topics.ask=1},choices:[
  {t:`Sie mitnehmen.`,go:'thq8',fx:()=>{S.w.thea=true}},
  {t:`Zu gefährlich. Bleib im Dorf.`,go:'thh'}]}),
thq8:P('thea',`Ich halte, was du mir gibst. Und ich vergesse nichts.`,'thh',{chars:{l:'kallis:neutral',r:'thea:smile'}}),

/* ===== AKT II: DER KAMPF ===== */
dep:P('n',()=>{
  let s=`Vor dem Morgengrauen brachen wir auf.`;
  s+=comp().length?` Mit mir gingen ${jn(comp())}.`:` Ich ging allein.`;
  const far=['archias','demetrios'].filter(k=>S.w[k]).map(k=>NM[k]);
  if(far.length)s+=` ${jn(far)} blieb${far.length>1?'en':''} auf dem Hügel am Rand: Männer ihres Alters stehen nicht im Schlamm.`;
  return s;},'posq',{bg:'sumpf',chars:{}}),
posq:P('kallis',`Wo sollen die Zeugen stehen? Wer nicht nah genug ist, sieht nur wenig. Wer nah ist, ist in Gefahr.`,null,{skip:()=>{if(!(S.w.iolaos||S.w.timon)){S.pos='far';return true}return false},skipTo:'e1',chars:{c:'kallis:worry'},choices:[
  {t:`Dicht hinter mir: Sie sollen jede Bewegung sehen.`,go:'e1',fx:()=>{S.pos='near'}},
  {t:`Auf dem Hügel: sicher, aber aus der Ferne.`,go:'e1',fx:()=>{S.pos='far'}}]}),
e1:P('n',()=>`Sie stieg aus dem Wasser wie ein Haus, das aufsteht. Neun Hälse. Neun Mäuler. Ein Geruch nach Fäulnis und Metall.`+(comp().length?` Hinter mir atmete jemand scharf ein. Ich war nicht allein, und das änderte etwas.`:` Niemand sah mich an. Niemand würde bezeugen können, was jetzt geschah.`),'ewI',{bg:'kampf:9',chars:{}}),
ewI:P('iolaos',()=>S.flags.fire?`Genau wie auf der Tafel. Nur größer.`:`Das stand auf keiner Tafel, die ich kenne.`,'ewT',WSK('iolaos','ewT')),
ewT:P('timon',`Kleitos … Das ist es also, was dich geholt hat.`,'ewA',WSK('timon','ewA')),
ewA:P('archias',`Die Götter prüfen euch! Geh, Weib, und sei gesegnet. Ich bete von hier aus.`,'ewTh',WSK('archias','ewTh')),
ewTh:P('thea',`Nysa. Bitte, Nysa, sei dort.`,'dmo',WSK('thea','dmo')),
dmo:P('demetrios',`Frontal! Alle Hälse auf einmal, im Namen des Dorfes!`,null,{skip:()=>!(S.w.demetrios&&S.flags.lead),skipTo:'nf1',choices:[
  {t:`Seinem Befehl folgen.`,go:'dmf',fx:()=>{S.flags.demFollowed=true}},
  {t:`Ihn ignorieren.`,go:'dmi',fx:()=>{S.flags.demIgnored=true}}]}),
dmf:P('n',()=>{
  let v=null;
  if(S.pos==='near'){if(S.w.iolaos)v='iolaos';else if(S.w.timon)v='timon'}
  S.flags.injured=v;
  return `Ich befolgte den Befehl. Es war Unsinn. Wo ein Kopf fiel, wuchsen zwei nach. `+(v?`Ein Hals peitschte herum und riss ${NM[v]} an der Schulter auf. Er lebte, aber er blutete.`:`Die Hälse schlugen ins leere Schilf.`)+` Demetrios rief vom Hügel, es laufe nach Plan.`;
},'nf1',{bg:'kampf:10'}),
dmi:P('n',`Ich ignorierte ihn. Demetrios' Stimme überschlug sich: „Weib! Gehorche!“ Dann schwieg er, tief beleidigt.`,'nf1'),

/* Kein Feuerwissen: Scheitern */
nf1:P('n',()=>S.flags.regrow?`Ich hatte weder Pech noch Fackeln. Thea hatte von Brasidas' Axt erzählt: Wo ein Hals fällt, wachsen zwei nach. Ich wusste, was ich nicht tun durfte, und nicht, was ich stattdessen tun sollte.`:`Ich hatte weder Pech noch Fackeln. Ich hatte ein Messer und die Annahme, dass etwas, das einen Hals hat, auch einen Hals verliert.`,null,{skip:()=>!!S.flags.fire,skipTo:'f2',bg:'kampf:9',choices:()=>{
  const c=[{t:`Einen Hals abschlagen.`,go:'nf2'}];
  if(S.flags.regrow)c.push({t:`Zurückziehen, solange es noch geht.`,go:'nf3'});
  return c;}}),
nf2:P('n',()=>`Ich schlug zu. Wo ein Kopf gefallen war, wuchsen zwei nach. Ich schlug noch einmal. Die Hydra schlug zurück. `+(S.flags.nfv==='timon'?`Timon stürzte sich in den Kampf. Ein Hals riss ihn vom Ufer. Ich sah ihn nicht wieder.`:S.flags.nfv==='iolaos'?`Iolaos wurde an der Schulter getroffen und stürzte. Ich schleppte ihn an Land.`:`Ich floh mit zerrissener Schulter.`),'nf4',{bg:'kampf:10',fx:()=>{
  if(S.pos==='near'&&S.w.timon){S.flags.timonDead=true;S.w.timon=false;S.flags.nfv='timon'}
  else if(S.pos==='near'&&S.w.iolaos){S.flags.nfv='iolaos'}
  else S.flags.nfv=null;}}),
nf3:P('n',`Ich rief zum Rückzug. Wir verließen den Sumpf Schritt für Schritt, ohne die Hydra aus den Augen zu lassen. Niemand starb. Nichts war gewonnen.`,'nf4',{bg:'sumpf'}),
nf4:P('n',`Hinter uns hob sich das Wasser noch einmal, dann sank es zurück. Die Bestie lebte. Es war nichts zu bezeugen, außer meinem Scheitern.`,'F1',{bg:'sumpf',chars:{},fx:()=>{S.end='F'}}),

/* Fackel */
f2:P('kallis',`Jetzt das Feuer. Pech auf den Stumpf, Fackel darauf. Aber wer hält die Fackel?`,null,{bg:'kampf:9',chars:{},choices:()=>{
  const c=[{t:`Ich allein. Pech, Fackel, Messer.`,go:'fo'}];
  if(S.w.timon&&S.pos==='near')c.push({t:`Timon die Fackel geben.`,go:'ft'});
  if(S.w.iolaos&&S.pos==='near')c.push({t:`Iolaos die Fackel geben.`,go:'fi'});
  if(S.w.thea)c.push({t:`Thea die Fackel geben.`,go:'fth'});
  return c;}}),
fo:P('n',`Pech auf den Stumpf, Fackel darauf. Es zischte. Der Hals schloss sich und blieb still. Schlag, Feuer, Schlag, Feuer. Ich zählte, um nicht zu denken. Funken fielen auf meinen Arm und brannten sich ein.`,'f3',{bg:'kampf:5:fire',fx:set('narbe')}),
ft:P('n',`Timon hielt die Fackel wie einen Speer. Kopf um Kopf schloss er die Wunden, die ich schlug, und er weinte dabei, ohne einen Laut.`,'f3',{bg:'kampf:5:fire',fx:()=>{S.flags.torch='timon'}}),
fi:P('n',`Iolaos hielt die Fackel und zählte laut mit, als könnte er die Angst so festbinden. Wir waren schnell. Und zum ersten Mal sah er nicht nach seinem Onkel.`,'f3',{bg:'kampf:5:fire',fx:()=>{S.flags.torch='iolaos';S.bond++}}),
fth:P('n',`Thea hielt die Fackel, zitternd, aber sie hielt. Kein Hals kam an ihr vorbei. Ich sah, dass sie dabei an Nysa dachte.`,'f3',{bg:'kampf:5:fire',fx:()=>{S.flags.torch='thea'}}),
f3:P('n',`Dann war nur noch einer übrig, der mittlere, dick wie ein Baumstamm, mit goldenen Augen. Ich schlug ihn ab. Er lebte weiter, auf dem Boden, und sah mich an.`,'tr',{bg:'kampf:1:fire'}),
tr:P('n',()=>S.flags.torch==='timon'?`Timon sah den Kopf. Er sah die goldenen Augen, die seinen Bruder gesehen hatten. Er ließ die Fackel fallen und rannte los.`:`Timon sah den Kopf. Er sah die goldenen Augen, die seinen Bruder gesehen hatten, und das Kind seines Bruders. Er riss sich los und rannte.`,null,{skip:()=>!(S.pos==='near'&&S.w.timon&&(S.flags.torch==='timon'||S.flags.waited)),skipTo:'f4',choices:[
  {t:`Mich auf ihn werfen und zurückreißen.`,go:'tr1',fx:()=>{S.ev.narbe=true}},
  {t:`Zuerst den Fels rollen. Der Kopf muss versiegelt werden.`,go:'tr2',fx:()=>{S.flags.timonDead=true;S.w.timon=false}}]}),
tr1:P('n',`Ich riss ihn zurück. Der Kopf schnappte nach mir und erwischte meinen Unterarm. Das Gift brannte wie Feuer. Timon lag keuchend im Schlamm. Er lebte.`,'f4'),
tr2:P('n',`Ich stemmte die Stange gegen den Fels. Hinter mir hörte ich einen Schrei, der aufhörte. Als der Fels fiel, stand Timon nicht mehr dort, wo er gestanden hatte.`,'f5'),
f4:P('kallis',()=>S.flags.mid?`Der unsterbliche Kopf. Iolaos hatte es gesagt: nicht töten. Begraben.`:`Der Kopf lebt weiter, obwohl er abgeschlagen ist. Mit Feuer ist da nichts zu machen.`,null,{chars:{c:'kallis:worry'},choices:[
  {t:`Mit der Hebelstange den großen Fels über ihn rollen.`,go:'f5'},
  {t:`Den Kopf ins Dorf schleppen, als Beweis.`,go:'f4b'}]}),
f4b:P('n',`Er war zu schwer, und sein Atem fraß sich durch meine Binsenhandschuhe. Ich gab es auf. Der Fels musste her.`,'f5'),
f5:P('n',()=>S.flags.timonDead?`Der Fels hatte den Kopf schon begraben. Ich knotete mein Netzseil um die nächste Weide, mit Händen, die nicht aufhören wollten zu zittern.`:`Der Fels rollte langsam, dann schneller. Dumpf schloss sich der Boden über dem Kopf. Zur Markierung knotete ich mein Netzseil um die nächste Weide.`,'fr',{bg:'kampf:0',fx:set('stein')}),
fr:P('archias',`Im Namen der Götter! Dieser Fels sei gesegnet, und der Kopf unter ihm still, durch mein Gebet und die Gnade des Himmels!`,'fz1',{skip:()=>!S.w.archias,skipTo:'fz1',fx:()=>{S.flags.rite=true}}),
fz1:P('iolaos',()=>S.flags.timonDead?`Timon! Kallis, das … das war nicht nötig.`:(S.pos==='near'?`Ich habe es gesehen, Kallis. Jedes Wort, das ich später sage, wird wahr sein.`:`Von hier sah ich Rauch und Schatten. Aber dich sah ich bis zuletzt.`),'fz2',{skip:()=>!S.w.iolaos,skipTo:'fz2',fx:()=>{if(S.flags.timonDead)S.bond=Math.max(0,S.bond-1)}}),
fz2:P('timon',()=>S.pos==='near'?`Kleitos … Er ist gerächt. Und ich habe es gesehen.`:`Ich habe es vom Hügel gesehen. Mehr sage ich später.`,'fz3',WSK('timon','fz3')),
fz3:P('thea',`Es ist vorbei. Nysa … wo ist Nysa?`,'fz4',WSK('thea','fz4')),
fz4:P('demetrios',()=>S.flags.demFollowed?`Unter meiner Führung! Hat das jeder gesehen?`:S.flags.demIgnored?`Sie hat meinen Befehl missachtet. Aber es ist geschehen. Ich habe es gesehen.`:`Es ist vollbracht.`,'ev1',WSK('demetrios','ev1')),
ev1:P('kallis',`Meine Knie zitterten. Ich wusste schon, wie das klingen würde, wenn ich es erzähle. Ich brauchte etwas, das man anfassen kann.`,null,{chars:{c:'kallis:sad'},choices:[
  {t:`Einen Fangzahn ausbrechen.`,go:'nys',fx:set('zahn')},
  {t:`Die Giftdrüse bergen.`,go:'nys',fx:set('gift')},
  {t:`Beides. Das kostet Zeit und Kraft.`,go:'nys',fx:()=>{S.ev.zahn=true;S.ev.gift=true}},
  {t:`Nichts. Ich habe Zeugen.`,go:'nys'}]}),
nys:P('n',()=>S.flags.waited?`Aus dem Schilf kam kein Wimmern mehr, nur ein Atmen. Nysa. Sie glühte vor Fieber, die Augen halb offen, und sagte kein Wort. Ich nahm sie auf den Arm und trug sie heim.`:`Aus dem Schilf kam ein Wimmern. Nysa. Am Leben, durchgefroren. Ich nahm sie auf den Arm und trug sie heim.`,'r1',{fx:set('nysa')}),

/* ===== AKT III: DER PLATZ ===== */
r1:P('n',()=>`Das ganze Dorf stand auf dem Platz, als wir im Morgenlicht aus dem Nebel kamen, ein Kind auf meinem Arm.`+(comp().length?` Hinter mir gingen ${jn(comp())}.`:''),'r2',{bg:'morgen',chars:{}}),
r2:P('thea',()=>S.flags.waited?`Nysa! Nysa, sieh mich an! … Warum sagt sie nichts?`:`Nysa! Nysa!`,'r3',{chars:()=>({l:'thea:'+(S.flags.waited?'sad':'smile'),c:'kallis:neutral',r:'nysa:'+(S.flags.waited?'sad':'smile')})}),
r3:P('kallis',`Die Hydra ist tot.`,'r4',{chars:{l:'thea:smile',c:'kallis:neutral',r:'kleon:smile'},meter:{v:3,w:`Kallis: „Die Hydra ist tot.“`}}),
r4:P('kleon',`Gut, gut. Und jetzt leg dich hin, Kallis. Du bist fiebrig.`,'r5',{meter:{v:3,w:`Kallis: „Die Hydra ist tot.“`}}),
r5:P('kallis',`Kleon hatte „fiebrig“ gesagt, bevor ich den Mund aufgemacht hatte. Hinter mir standen Männer, die dabei gewesen waren. Wenn sie sprachen, würde man zuhören. Aber dann wären es ihre Worte.`,null,{skip:()=>!TS().men.length,skipTo:'r5b',chars:{l:'thea:sad',c:'kallis:worry'},choices:[
  {t:`Selbst sprechen und die Beweise zeigen.`,go:'r5b'},
  {t:`Schweigen und die Zeugen sprechen lassen. Dann hört man ihnen eher zu.`,go:'pr',fx:()=>{S.silent=true}}]}),
r5b:P('kallis',`Ich habe Beweise.`,'pz',{chars:{l:'kallis:angry',c:'brasidas:smile',r:'kleon:smile'}}),

pz:P('kallis',`Ein Fangzahn. Aus dem Maul der Hydra. Fasst ihn an.`,'pz2',{skipTo:'pg',skip:()=>!S.ev.zahn,meter:{v:2,w:`Kallis zeigt den Fangzahn`},chars:{l:'kallis:angry',c:'brasidas:smile',r:'kleon:smile'}}),
pz2:P('brasidas',`Ein Fischknochen. Hab ich zu Hause zehn Stück.`,'pg'),
pg:P('kallis',`Das Gift. Seht, wie es das Holz zerfrisst.`,'pg2',{skipTo:'pn',skip:()=>!S.ev.gift,meter:{v:4,w:`Kallis zeigt das Gift`}}),
pg2:P('kleon',`Ein Gebräu, Kallis, aus deiner Kräuterküche. Fieberträume, giftige Dämpfe. Sehr verständlich.`,'pn'),
pn:P('kallis',`Seht meinen Arm. Das war das Feuer, mit dem ich die Hälse verschloss.`,'pn2',{skipTo:'ps',skip:()=>!S.ev.narbe,meter:{v:1,w:`Kallis zeigt ihre Brandnarbe`}}),
pn2:P('brasidas',`Ein Herdunfall. Frauen und Feuer, das kennt man.`,'ps'),
ps:P('kallis',`Bei Amymone liegt ein Fels über dem unsterblichen Kopf. Mein Netzseil hängt an der Weide daneben. Geht hin und seht!`,'ps2',{meter:{v:2,w:`Kallis nennt den Ort des Felsens`}}),
ps2:P('kleon',`In den Sumpf? Wegen eines Steins? Im Sumpf liegen viele Steine.`,'py'),
py:P(()=>S.flags.waited?'n':'nysa',()=>S.flags.waited?`Nysa lag in meinen Armen, glühend. Sie konnte nichts sagen. Seit dem Sumpf hatte sie kein Wort gesprochen.`:`Kallis hat mich gerettet! Die Schlange hatte so viele Köpfe!`,'py2',{chars:{l:'kallis:worry',c:'nysa:sad',r:'brasidas:smile'},meter:()=>S.flags.waited?{v:0,w:`Nysa kann nichts bezeugen`}:{v:5,w:`Nysa, ein Kind, bezeugt es`}}),
py2:P('brasidas',()=>S.flags.waited?`Das Kind sagt ja nicht einmal etwas. Und die Frau redet für beide.`:`Das Kind steht unter Schock. Wir sollten ihm nicht zu viel glauben. Der Frau übrigens auch nicht.`,'py3',{chars:{l:'thea:sad',c:'nysa:sad',r:'brasidas:smile'}}),
py3:P('thea',`Ich glaube euch beiden!`,'py4'),
py4:P('kleon',`Thea, du bist ihre Freundin. Du redest ihr zuliebe.`,'pend',{chars:{l:'thea:sad',c:'kleon:smile'}}),
pend:P('kallis',()=>{const l=[S.ev.zahn&&'den Zahn',S.ev.gift&&'das Gift',S.ev.narbe&&'den Arm'].filter(Boolean);return l.length?`Ich legte ihnen alles hin. Sie schauten auf den Boden, auf ${jn(l)}, nur nicht mich an. Als wäre es mein Fehler, dass es da lag.`:`Ich hatte nichts zum Anfassen, nur Worte. Sie schauten auf den Boden und wussten schon vorher, was sie davon hielten.`},'pr',{chars:{c:'kallis:sad'},meter:{v:0,w:`Gewicht von Kallis' Beweisen: null`}}),
pr:P('demetrios',`Ein Ereignis dieser Größe gehört vor den Rat. Mit Zeugen. Männern von Ansehen.`,'pr2',{bg:'rat',chars:{l:'demetrios:neutral',c:'kallis:sad',r:'kleon:neutral'},meter:null}),
pr2:P('kleon',`Wer war dabei? Wer hat es gesehen? Männer, meine ich.`,'wI'),
wI:P('iolaos',()=>TS().iol?`Ich war dabei. Ich habe alles gesehen.`:`Ich … war dabei.`,'wT',{skipTo:'wT',skip:()=>!S.w.iolaos,chars:{l:'kallis:sad',c:'iolaos:worry',r:'kleon:neutral'}}),
wT:P('timon',`Ich auch. Ich stand am Sumpf. Ich habe gesehen, was dort geschah.`,'wA',{skipTo:'wA',skip:()=>!S.w.timon,chars:{l:'kallis:sad',c:'timon:neutral',r:'kleon:neutral'}}),
wA:P('archias',`Auch ich war zugegen, als Diener der Götter. Es war ein Zeichen.`,'wD',{skipTo:'wD',skip:()=>!S.w.archias,chars:{l:'kallis:sad',c:'archias:smile',r:'kleon:neutral'}}),
wD:P('demetrios',`Der Zug stand unter meiner Führung. Das sollte festgehalten werden.`,'rf',{skipTo:'rf',skip:()=>!S.w.demetrios,chars:{l:'kallis:sad',c:'demetrios:smile',r:'kleon:neutral'}}),
rf:P(()=>S.flags.demHostile?'demetrios':'archias',()=>S.flags.demHostile?`Ich habe das Weib gewarnt. Ich hielt das für einen Fiebertraum. Der Rat sollte das bedenken.`:`Ich wurde gefragt und lehnte ab. Ein Zeuge, der keinen Ruhm will, hat meist einen Grund.`,'verd',{skipTo:'verd',skip:()=>!(S.flags.demHostile||(S.flags.archiasRefused&&!S.w.archias)),chars:()=>({l:'kallis:angry',c:(S.flags.demHostile?'demetrios':'archias')+':smile'})}),
verd:P('n',()=>{const x=TS();return (x.men.length?`Der Rat musterte die, die hinter mir standen. Gewogen wurde nicht, was sie gesehen hatten. Sondern wer sie waren.`:`Hinter mir stand niemand, der etwas gesehen hatte, außer einer Frau und einem Kind. Der Rat wog, was das wert war.`)+(S.silent?` Ich hielt den Mund. Das machte es leichter.`:'')+(S.flags.demHostile?` Der Älteste hatte sich gegen mich gestellt. Das machte es schwerer.`:'')},null,{bg:'rat',chars:{l:'kallis:sad'},fx:()=>{S.end=pickEnd()},meter:()=>{const x=TS();return {v:Math.min(100,Math.round(x.t/x.need*100)),w:x.t>=x.need?`Der Rat hört den Zeugen zu`:x.t>0?`Der Rat zögert`:`Der Rat hört nicht zu`}},nextFn:()=>ENDFIRST[S.end]}),

/* Herakles kündigt sich an (vor A, E, B1) */
HK:P('n',`Da öffneten sich die Türen. Fanfaren. Ein Herold trat ein, dann Herakles: sauber, gekämmt, ohne einen einzigen Schlammspritzer. Der Rat sprang auf.`,null,{bg:'morgen',chars:{l:'herakles:smile',c:'herold:neutral'},nextFn:()=>HKNEXT[S.end]}),

/* ===== ENDE A: BEZEUGT ===== */
A1:P(()=>truthSp(),`Ehrenwerte Männer. Ich war dabei. Kallis von Lerna hat die Hydra erschlagen, Hals um Hals. Ich habe es mit eigenen Augen gesehen.`,'A2',{bg:'rat',chars:()=>({l:'kallis:sad',c:truthSp()+':neutral',r:S.w.archias?'archias:neutral':'brasidas:neutral'}),meter:{v:100,w:`Ein Mann bezeugt: Kallis hat es getan`}}),
A2:P('brasidas',()=>`Wenn ein Mann das sagt … dann zeig ${S.ev.zahn?'den Zahn':S.ev.gift?'das Gift':'uns, was du hast'}, Kallis. Und diesmal hören wir zu.`,'A3',{meter:{v:100,w:`Derselbe Satz, ein Mann spricht`}}),
A3:P('kallis',()=>S.silent?`Ich sagte nichts. Das war der Plan. Es schmerzte, wie gut er funktionierte.`:`Derselbe Zahn. Dasselbe Gift. Dieselben Worte wie am Morgen. Diesmal nickte der Rat schon beim ersten Satz.`,'A3a',{chars:{l:'kallis:sad',c:'brasidas:neutral'},meter:{v:100,w:`Derselbe Zahn, dasselbe Gift`}}),
A3a:P('archias',`Die Götter haben ihre Hand geführt, Ehrenwerte. Ich habe den Fels gesegnet. Das sollte nicht vergessen werden.`,'A3b',{skipTo:'A3b',skip:()=>!S.w.archias,chars:{l:'kallis:sad',c:'archias:smile'}}),
A3b:P('n',`Timon hätte hier stehen sollen. Der Rat nickte, als seine Frau aufstand und still den Namen ihres Mannes in den Saal sagte. Ihn zu verlieren, war der Preis dafür gewesen, dass man mir glaubte.`,'HK',{skip:()=>!S.flags.timonDead,skipTo:'HK'}),
A4:P('herakles',`Ich hörte, die Hydra sei tot! Ich bin so stolz auf euer Dorf. Ich hatte Iolaos genau dafür vorbereitet.`,'A5',{chars:{l:'herakles:smile',r:'herold:neutral'},meter:{v:100,w:`Herakles beansprucht die Tat`}}),
A5:P(()=>truthSp(),()=>{const s=truthSp();return s==='iolaos'?`Onkel, du warst nicht dort. Ich war es. Es war Kallis.`:s==='timon'?`Herr Herakles, ich stand am Sumpf. Ihr nicht. Es war Kallis.`:`Herr Herakles, ich war dabei. Ihr nicht. Die Frau hat die Hydra erschlagen.`},'A6',{chars:()=>({l:'herakles:angry',c:truthSp()+':neutral',r:'herold:neutral'})}),
A6:P('herakles',()=>S.flags.heraWarn?`Natürlich, natürlich. Ich habe sie beflügelt. Das ist doch das Wesentliche.`:`Natürlich, natürlich. Ich habe sie beflügelt. Das ist doch das Wesentliche. Das Lied wird meinen Namen nennen.`,'A7',{chars:{l:'herakles:smile',r:'herold:neutral'}}),
A7:P('herold',()=>S.silent?`Auf der Tafel steht: „Zweite Tat: die Hydra. Bezwungen von den Männern von Lerna: ${jn(truthNames())}, mit Hilfe der Kräuterfrau Kallis.“`+(S.w.archias?` Gesegnet von Archias.`:''):`Auf der Tafel steht: „Zweite Tat: die Hydra. Bezwungen von Kallis von Lerna. Bezeugt von ${jn(truthNames())}.“`+(S.w.archias?` Gesegnet von Archias.`:''),'A8',{chars:{l:'herakles:angry',r:'herold:neutral'}}),
A8:P('kallis',()=>S.silent?`Man glaubte uns. Und aus „uns“ wurde schnell „sie“, und aus „sie“ „die Männer“. Ich hatte gewusst, dass es so kommen konnte. Ich hatte es gewählt, weil es sonst gar nichts gegeben hätte.`:`Man glaubte mir. Brasidas nahm den Zahn in die Hand, den er am Morgen nicht hatte anfassen wollen, und drehte ihn lange im Licht. Ich sagte danke und meinte es nur halb.`,'A9',{chars:{c:'kallis:neutral'}}),
A9:P('n',`ENDE`,null,{end:()=>S.silent?'Bezeugt, aber überschrieben':'Bezeugt',chars:{}}),

/* ===== ENDE E: GEHILFIN AM RAND ===== */
E1:P(()=>truthSp(),`Ich war dabei. Kallis hat die Hälse verbrannt. Ich sah es.`,'E2',{bg:'rat',chars:()=>({l:'kallis:sad',c:truthSp()+':worry',r:S.w.archias?'archias:smile':'brasidas:smile'}),meter:()=>{const x=TS();return {v:Math.min(100,Math.round(x.t/x.need*100)),w:`Ein einzelner Zeuge reicht nicht`}}}),
E2:P(()=>S.w.archias?'archias':'brasidas',()=>S.w.archias?`Ein einzelner Zeuge? Ich war ebenfalls dort, und ich sah vor allem das Walten der Götter. Wer könnte da sagen, wer die Fackel hielt?`:`Ein einzelner Zeuge? Und ausgerechnet er? Gegen den Namen des Herakles?`,'HK'),
E3:P('herakles',`Eine Gehilfin. Sicher. Sie hat Fackeln gehalten, ich habe geführt. In Gedanken, aber geführt.`,'E4',{chars:{l:'herakles:smile',r:'herold:neutral'},meter:{v:100,w:`Herakles beansprucht die Tat`}}),
E4:P('demetrios',`Wir halten fest: Herakles bezwang die Hydra, mit Hilfe der Kräuterfrau Kallis.`,'E5',{chars:{l:'herakles:smile',c:'demetrios:smile',r:'herold:neutral'}}),
E5:P('kallis',`Mit Hilfe. Ich hatte jeden Hals verbrannt. Mein Name stand auf der Tafel, in der letzten Zeile, klein.`,'epi',{chars:{c:'kallis:sad'}}),

/* ===== ENDE B1: DAS WUNDER DES ARCHIAS ===== */
Ba1:P('archias',`Ehrenwerte Männer. Ich stand am Sumpf und sah, wie die Götter durch mein Gebet die Bestie niederwarfen. Das Weib hat Fackeln getragen.`,'Ba2',{bg:'rat',chars:{l:'kallis:angry',c:'archias:smile',r:'brasidas:smile'},meter:{v:100,w:`Archias bezeugt: er selbst`}}),
Ba2:P('brasidas',`Der Fels trägt sein Zeichen. Es stimmt!`,'HK'),
Ba3:P('herakles',`Die Götter? Ich war es! Ich hatte Iolaos vorbereitet!`,'Ba4',{chars:{l:'herakles:angry',c:'archias:angry',r:'herold:neutral'},meter:{v:100,w:`Zwei Männer beanspruchen dieselbe Tat`}}),
Ba4:P('archias',`Mein Gebet hat die Bestie gefällt!`,'Ba5'),
Ba5:P('demetrios',`Gebet und Faust. Wir halten fest: Herakles erschlug sie, Archias segnete den Fels.`,'Ba6',{chars:{l:'herakles:smile',c:'demetrios:neutral',r:'archias:smile'}}),
Ba6:P('kallis',`Zwei Männer stritten um ein Werk, das keiner von beiden getan hatte. Ich stand dazwischen, mit dem Geruch von Pech an den Händen. Niemand bat mich, den Streit zu schlichten.`,'epi',{chars:{c:'kallis:sad'}}),

/* ===== ENDE B2: DAS LIED DES HERAKLES ===== */
Bb1:P('n',`Der Rat tagte noch, als die Fanfaren kamen. Die Türen öffneten sich, ein Herold trat ein, dann Herakles: sauber, gekämmt, ohne einen einzigen Schlammspritzer.`,'Bb2',{bg:'morgen',chars:{l:'herakles:smile',c:'herold:neutral'}}),
Bb2:P('herakles',`Ich hörte, die Hydra sei tot! Ich hatte meinen Neffen genau dafür vorbereitet.`,'Bb3',{meter:{v:100,w:`Herakles beansprucht die Tat`}}),
Bb3:P('herakles',()=>S.w.iolaos?`Nicht wahr, mein Junge? Es war mein Plan.`:`Und Demetrios, du hast es doch gesehen. Mein Plan.`,'Bb4',{chars:()=>({l:'herakles:smile',c:(S.w.iolaos?'iolaos':'demetrios')+':worry',r:'kallis:sad'})}),
Bb4:P(()=>S.w.iolaos?'iolaos':'demetrios',()=>S.w.iolaos?`… Ja, Onkel. Dein Plan.`:`Ich führte den Zug, Herakles hat uns beflügelt. Das Weib folgte.`,'Bb5',{meter:{v:100,w:`Ein Mann, der dabei war, bestätigt Herakles`}}),
Bb5:P('kallis',()=>S.flags.heraWarn?`Er hatte den Zahn nicht angesehen. Iolaos hatte es gesagt: Er nimmt immer.`:`Er hatte den Zahn nicht angesehen. Er hatte nicht gefragt, wie. Nicht einmal, wo.`,'Bb6',{chars:{l:'herakles:smile',c:'kallis:sad'}}),
Bb6:P('herakles',`Und du, Kräuterweib, hast so tapfer geholfen. Ich schicke dir einen Krug Öl.`,'epi',{chars:{l:'herakles:smile',c:'kallis:angry'}}),

/* ===== ENDE C: DIE VERRÜCKTE VOM SUMPF ===== */
C1:P('archias',`Zeugen? Eine Mutter und ihr Kind. Beide reden, wie es ihnen ums Herz ist.`,'C2',{bg:'rat',chars:{l:'kallis:angry',c:'archias:smile',r:'demetrios:neutral'},meter:{v:0,w:`Zeugen mit Gewicht: keine`}}),
C2:P('archias',`Kräuterfieber. Man legt sie in ihr Haus, damit sie ruht. Zu ihrem Besten.`,'C3'),
C3:P('demetrios',`Sorgt dafür, dass sie sich nichts antut.`,'C4'),
C4:P('n',()=>`Sie schlossen die Tür von außen. Am Abend hörte ich Fanfaren und Jubel. Herakles war gekommen und hatte die Hydra bezwungen. Er hatte einen Zahn bei sich.` + (S.ev.zahn?` Archias hatte meinen als „Gabe an die Götter“ eingezogen.`:``) + ` Wo er ihn her hatte, fragte niemand.`,'epi',{bg:'dorf',chars:{}}),

/* ===== ENDE D: SCHULD OHNE RUHM ===== */
D1:P('n',`Ich brachte Timon heim. Seine Frau schrie nicht. Sie sah mich nur an.`,'D2',{bg:'morgen',chars:{l:'kallis:sad'},meter:{v:0,w:`Kallis, vor dem Dorf`}}),
D2:P('kleon',`Du hast ihn in den Sumpf gelockt, Kallis. Ihr Kräuterweiber und eure Pläne.`,'D3',{chars:{l:'kallis:angry',c:'kleon:angry'}}),
D3:P('kallis',`Er wollte es. Er hat seinen Bruder gesucht.`,'D4'),
D4:P('demetrios',`Du verlässt Lerna bis zum Frühling.`,'D5',{chars:{l:'kallis:sad',c:'demetrios:neutral'}}),
D5:P('n',`Am nächsten Tag zog Herakles ein, mit Fanfaren, und nahm den Dank für die Hydra entgegen. Er hatte die Bestie getötet, an der Timon gestorben war. So erzählte man es. Ich packte mein Bündel.`,'epi',{chars:{}}),

/* ===== ENDE F: DER MYTHOS, WIE ER WAR ===== */
F1:P('n',()=>`Ich kam ohne Sieg zurück. Die Hydra lebte. Der Rat musste nichts erfinden: Es genügte, dass ich zurückgekommen war und sie nicht besiegt hatte.`+(S.flags.timonDead?` Timon kam nicht zurück. Seine Frau fand mich als Erste.`:''),'F2',{bg:'morgen',chars:{l:'kallis:sad'}}),
F2:P('kleon',`Sie ist hineingegangen und hat die Bestie wütend gemacht. Seht, was sie angerichtet hat.`,'F3',{chars:{l:'kallis:sad',c:'kleon:angry'}}),
F3:P('demetrios',`Das ist Männersache. Herakles wird kommen, wenn die Zeit reif ist.`,'F4',{chars:{l:'kallis:sad',c:'demetrios:neutral'}}),
F4:P('n',`Zwei Wochen später kam Herakles nach Lerna. Iolaos ging neben ihm, mit einem Bündel Fackeln, die er, wie er sagte, in einer Schriftrolle gefunden hatte. Sie brannten der Hydra Hals um Hals aus. Man baute Herakles einen Altar.`,'F5',{bg:'dorf',chars:{}}),
F5:P('kallis',()=>S.flags.shout&&!S.flags.gate?`Iolaos hatte gewusst, wie man sie tötet. Ich hatte ihn nicht gefragt. Ich hatte geschrien, und man hatte mich hinausgeworfen. Er tat es erst, als es sicher war und jemand zusah.`:`Iolaos hätte es mir gesagt. Ich hatte nicht gefragt, was der König über die Hydra wusste. Ich hatte geglaubt, ein Messer reiche.`,'epi',{chars:{c:'kallis:sad'}}),

/* ===== EPILOG ===== */
epi:P('n',()=>({E:`Nacht in Lerna. Der Sänger übte die neue Strophe: „… mit Hilfe der Kräuterfrau.“ Ich hatte Hilfe geleistet.`,B1:`Nacht in Lerna. Zwei Männer stritten noch um den Ruhm, als ich ging.`,B2:`Nacht in Lerna. Herakles feierte im Haus des Ältesten. Wir saßen am Feuer am Dorfrand.`,C:S.flags.waited?`Man hatte mir die Tür verriegelt. Durch den Spalt schob Nysa ein Stück Brot. Sie sagte nichts. Ihre Hand zitterte noch vom Fieber.`:`Man hatte mir die Tür verriegelt. Durch den Spalt schob Nysa ein Stück Brot und flüsterte.`,D:`Am Dorfrand, mit meinem Bündel, begleiteten mich Thea und Nysa bis zum letzten Stein.`,F:`Nacht in Lerna. Man sang schon von Iolaos' Fackeln und vom Helden. Von mir fiel nur der Name des Sumpfes.`})[S.end],'epi1',{bg:'nacht',chars:{l:'kallis:sad',c:'thea:neutral',r:'nysa:neutral'}}),
epi1:P('brasidas',()=>S.end==='F'?`Meine Axt, Kallis. Zwei Hälse für einen. Ich habe es damals gesagt, und man hat gelacht. Seitdem schweige ich. Ich hätte dich warnen können, laut.`:`Ich war am Morgen am Fels. Dein Netzseil hängt an der Weide. Ich habe den Stein angefasst: nass, und er riecht nach Pech.`,'epi1b',{skip:()=>S.end==='C'||S.end==='D',skipTo:'epi2',chars:{l:'kallis:sad',c:'brasidas:neutral'}}),
epi1b:P('kallis',`Und im Rat?`,'epi1c'),
epi1c:P('brasidas',`Im Rat hat Kleon gelacht, und ich habe mitgelacht. Das tut mir seitdem leid. Gesagt habe ich es trotzdem nicht. Das ist schlimmer.`,'epi2'),
epi2:P(()=>S.flags.waited?'thea':'nysa',()=>S.flags.waited?`Nysa kann nicht fragen, Kallis. Also frage ich für sie: Warum haben sie dir nicht geglaubt?`:`Kallis, warum haben sie dir nicht geglaubt?`,'epi3',{chars:{l:'kallis:sad',c:'thea:neutral',r:'nysa:neutral'}}),
epi3:P('kallis',()=>S.end==='F'?`Sie haben mir geglaubt, dass ich gescheitert bin. Das hat gereicht.`:`Weil sie es nicht hören wollten. Nicht, weil es nicht stimmt.`,'epi4'),
epi4:P('thea',`Ich habe dir vom ersten Augenblick an geglaubt.`,'epi5',{chars:{l:'kallis:sad',c:'thea:smile',r:'nysa:neutral'}}),
epi5:P('kallis',`Das hat mir mehr geholfen, als du denkst. Aber es hat die Lieder nicht geändert.`,null,{chars:{l:'kallis:neutral',c:'thea:smile',r:'nysa:neutral'},choices:[
  {t:`Nysa die ganze Geschichte erzählen, jedes Wort, jeden Knoten, und sie bitten, sie weiterzugeben.`,go:'eg1',fx:()=>{S.tradition=true}},
  {t:`Es gut sein lassen. Gegen ein Lied kann man nicht kämpfen.`,go:'eb1'}]}),
eg1:P('n',()=>{const F=S.end==='F';const w=S.flags.waited;
  const a=F?`Ich erzählte ihr, was ich falsch gemacht hatte, und was Iolaos gewusst hatte, und wie man es hätte erfahren können, wenn man nur gefragt hätte. `:`Ich erzählte. `;
  const b=`Ich zeigte ihr den Knoten, mit dem ich ${F?'den Weidenast':'den Fels'} markiert hatte: dreimal herum, einmal durch, nie lösen. `;
  const c=w?`Nysa sagte nichts, sie hatte seit dem Sumpf kein Wort gesprochen. Aber ihre Finger lernten den Knoten allein.`:`Nysa wiederholte ihn, bis ihre Finger ihn allein konnten.`;
  return a+b+c},'eg2',{chars:{}}),
eg2:P('n',`In Lerna gab es von da an zwei Geschichten. Die laute, die man auf den Märkten sang. Und die leise, die Frauen am Feuer von Tochter zu Tochter reichten, mit einem Knoten als Merkzeichen. Die laute hatte die schönere Melodie. Die leise hatte recht.`,'eg3'),
eg3:P('n',`ENDE`,null,{end:()=>ENDNAMES[S.end]+' – und die andere Überlieferung'}),
eb1:P('n',`Ich ließ es gut sein. Nysa schlief an meiner Schulter ein. Am Morgen zog Herakles weiter. Der Sänger fügte eine Strophe hinzu, die „Hydra“ hieß. Der Name Kallis kam darin nicht oder nur am Rand vor.`,'eb2',{chars:{}}),
eb2:P('n',`Jahrhunderte später kennt man die Hydra, die neun Köpfe und den Helden. Wer im Sumpf stand, ist vergessen. Und niemand fragt, wer die Fackeln so gleichmäßig gesetzt hat.`,'eb3'),
eb3:P('n',`ENDE`,null,{end:()=>ENDNAMES[S.end]})
};

