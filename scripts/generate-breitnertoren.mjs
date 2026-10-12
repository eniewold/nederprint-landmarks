// Breitnertoren / Breitner Center, Peter Ellis (SOM) met ZZDP, 2001.
// BAG 0363100012070861 en AHN DSM/DTM 0,5 m: PDOK, CC0.
// Dakvlakken: 3D BAG TU Delft/3DGI, CC BY 4.0, opname 2023.
// Gevels, erker, entree en kroon: Ceescamel, Breitnertoren in 2019 (1..4),
// Wikimedia Commons, CC BY-SA 4.0. Voorbeeld: generate-achmeatoren.mjs.
// Benoemde bouwdelen en prisma's; geen gestapelde DSM-hoogtelagen.
import {Manifold,CrossSection,prism,rect,box,union,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='breitnertoren',ORIGIN=[122927,484158],ANGLE=20.1,rad=ANGLE*Math.PI/180;
const GROUND=1.2228,BASE=-1,AXIS=[Math.cos(rad),Math.sin(rad)],z=h=>h-GROUND;
const H={west:61.132,westCore:64.876,east:82.78,glass:92.022,spine:94.528,frame:94.693,plant:96.271,low:16.782,oriel:15.696,hall:14.42};
const B=(x0,y0,x1,y1,h)=>box(x0,y0,BASE,x1,y1,z(h));
const cs=p=>new CrossSection([p],'NonZero');
// Blinde glasnis, buitennormaal van een CCW-gevel a→b.
function niche(a,b,s0,s1,h0,h1,d=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),v=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[v[1],-v[0]];return Manifold.hull([z(h0),z(h1)].flatMap(zz=>[[s0,-d],[s1,-d],[s1,.3],[s0,.3]].map(([s,t])=>[a[0]+v[0]*s+n[0]*t,a[1]+v[1]*s+n[1]*t,zz])));}
function facade(poly,top,{first=5.4,pitch=3.85,wide=2.4,step=3.45,skip=[]}={}){
 let p=poly.map(a=>[...a]);if(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0)<0)p.reverse();const cuts=[];
 for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  if(L<1||skip.includes(i))continue;
  for(let h=first;h+2.8<top-.5;h+=pitch)for(let s=.6;s+wide<L-.5;s+=step)cuts.push(niche(a,b,s,s+wide,h,h+2.65));
 }
 return prism(p,BASE,z(top)).subtract(union(cuts));
}
const westPlan=rect(-13.62,-12.36,-6.4,22.99),westCorePlan=rect(-6.55,-4.09,-2.65,27.91),glassPlan=rect(-6.4,-12.36,5.6,15.83),spinePlan=rect(-4.47,-17.02,5.56,.94);
const west=facade(westPlan,H.west),westCore=facade(westCorePlan,H.westCore,{wide:1.8,step:2.9});
let glass=facade(glassPlan,H.glass,{skip:[3]}),spine=facade(spinePlan,H.spine,{skip:[3]});
// De Amstelzijde is boven de lage glasvleugel wit en overwegend dicht,
// met kleine vensters aan de randen en één brede roosterband (HeadPhilips).
const backCuts=[];
const backA=glassPlan[3],backB=glassPlan[0];
for(let h=63.8;h<85.8;h+=3.85)for(const s of [1.6,4.7,24.8])backCuts.push(niche(backA,backB,s,s+1.1,h,h+1.4));
backCuts.push(niche(backA,backB,6.5,23.0,86.6,88.4,.35));
glass=glass.subtract(union(backCuts));
const spineBackA=spinePlan[3],spineBackB=spinePlan[0],spineBackCuts=[];
for(let h=63.8;h<85.8;h+=3.85)for(const s of [1.4,14.2])spineBackCuts.push(niche(spineBackA,spineBackB,s,s+1.1,h,h+1.4));
spineBackCuts.push(niche(spineBackA,spineBackB,1,15.2,86.6,88.4,.35));
spine=spine.subtract(union(spineBackCuts));
// De middenschijf staat vooruit aan de zuidzijde; op het dak de hogere
// onderhoudskasten. Het penthouse is een diepe blinde nis; het dakframe
// ligt naast het glasdak en krijgt blinde velden tussen de kolommen.
spine=spine.subtract(union([niche(spinePlan[0],spinePlan[1],.9,9.1,86.8,91.9,1.2),niche(spinePlan[1],spinePlan[2],2,16.9,92.25,93.72,.4)]));
const crownColumns=[];
for(const v of [1.5,8.0,15.0])for(const u of [-4.45,5.54])crownColumns.push(Manifold.cylinder(z(H.frame)-z(91.6),.55,.55,20).translate([u,v,z(91.6)]));
const frame=union([box(5.04,.9,z(H.frame)-.9,6.04,15.7,z(H.frame)),box(-4.95,.9,z(H.frame)-.9,-3.95,15.7,z(H.frame)),box(-4.95,14.8,z(H.frame)-.9,6.04,15.8,z(H.frame))]);
// Permanente ondersnede en achterwand in plaats van een plat vrij
// overspannend dakframe: ook de losse STL print zonder losse ondersteuning.
let frameBack=union([box(4.70,.9,z(H.glass)-.1,5.60,15.7,z(H.frame)-1.35),Manifold.hull([...ring3(rect(4.70,.9,5.60,15.7),z(H.frame)-1.35),...ring3(rect(5.04,.9,6.04,15.7),z(H.frame)-.9)]),box(-4.95,.9,z(H.glass)-.1,-3.95,15.7,z(H.frame)-.89),box(-4.95,14.8,z(H.glass)-.1,5.60,15.8,z(H.frame)-.89)]);
const frameNiches=[];
for(const [a,b] of [[[6.04,.9],[6.04,15.7]],[[-4.95,15.7],[-4.95,.9]]])for(const s of [1.8,8.4])frameNiches.push(niche(a,b,s,s+4.8,H.glass+.3,H.frame-1.05,.35));
frameBack=frameBack.subtract(union(frameNiches));
const parapet=prism(rect(-6.4,-12.36,5.6,15.83),z(H.glass)-.1,z(H.glass)+.5).subtract(prism(rect(-5.5,-11.46,4.7,14.93),z(H.glass)-.2,z(H.glass)+.7));
const plant=union([box(-.9,-11.33,z(H.spine)-.1,.35,-7.2,z(H.plant)),box(1.25,-11.01,z(H.spine)-.1,2.67,-7.2,z(H.plant))]);
// Het lagere dakframe op de glasvleugel aan de Amstelzijde, eveneens
// blinde velden en ronde pilaren in plaats van onprintbare balkoverspanning.
let westFrame=box(-13.62,-12.36,z(H.west)-.1,-12.62,22.99,z(H.westCore));
const westFrameCuts=[];
for(const s of [1.8,8.8,15.8,22.8,29.8])westFrameCuts.push(niche([-13.62,22.99],[-13.62,-12.36],s,s+5.4,H.west+.35,H.westCore-1,.35));
westFrame=westFrame.subtract(union(westFrameCuts));
const westPosts=[-10.6,-3.6,3.4,10.4,17.4,22.2].map(v=>Manifold.cylinder(z(H.westCore)-z(H.west)+.1,.55,.55,20).translate([-13.3,v,z(H.west)-.1]));
// Oostvleugel: afgeronde zuidhoek en licht scheve kopgevel uit de BAG.
const eastPlan=[[5.69,-18.02],[9.64,-17.456],[10.71,-17.156],[11.67,-16.597],[12.45,-15.815],[13.02,-14.86],[13.325,-13.793],[13.375,-13.055],[12.45,13.46],[5.56,15.92]];
let east=facade(eastPlan,H.east);
// Rond glazen trappenhuis (BAG uitstulping bij u=13,76, v=1,76) en de
// afgeronde hoek krijgen horizontale, blinde voegen per verdieping.
let stair=Manifold.cylinder(z(H.east)-BASE,1.32,1.32,40).translate([13.76,1.76,BASE]);
const ringCuts=[];
for(let h=5.6;h<H.east-.8;h+=3.85){const outer=Manifold.cylinder(.28,1.5,1.5,40),inner=Manifold.cylinder(.30,1.05,1.05,40).translate([0,0,-.01]);ringCuts.push(outer.subtract(inner).translate([13.76,1.76,z(h)]));}
stair=stair.subtract(union(ringCuts));
const eastCap=box(8.1,-14.9,z(H.east)-.1,12,-13.0,z(84.3));
// Entreehal en doorlopende lage noordvleugel, met een afgerond blad.
const hallPlan=[[-2.43,15.7],[8.04,15.4],[8.05,23.86],[5.47,23.03],[5.45,25.15],[4.08,26.51],[-2.64,26.64]];
const hall=facade(hallPlan,H.hall,{first:2.5,pitch:4.2,wide:1.4,step:2.5});
const southLowPlan=rect(-13.51,26.64,8.84,51.70);
const northLowPlan=[[-13.54,61.64],[8.79,61.64],[8.79,65.68],[7.99,67.45],[5.63,67.46],[5.49,71.34],[1.43,70.10],[1.17,74.56],[.81,76.77],[.407,78.503],[-.1,80.206],[-.707,81.876],[-1.753,84.171],[-3.646,87.412],[-5.115,89.43],[-6.741,91.323],[-8.631,93.185],[-9.329,93.495],[-10.112,93.584],[-10.771,93.347],[-11.392,92.774],[-11.696,92.039],[-11.725,91.72],[-11.717,86.66],[-13.54,86.66]];
const southLow=facade(southLowPlan,H.low,{first:2.8,pitch:3.65,wide:1.8,step:2.9});
let northLow=facade(northLowPlan,H.low,{first:2.8,pitch:3.65,wide:1.8,step:2.9});
// Horizontale voegen langs de gebogen bladgevel, zoals op de noordfoto.
const curvedCuts=[];
for(let h=5;h<H.low-.5;h+=3.65){const outline=cs(northLowPlan),wall=outline.subtract(outline.offset(-.25,'Round',32));curvedCuts.push(Manifold.extrude(wall,.25).translate([0,0,z(h)]));}
northLow=northLow.subtract(union(curvedCuts));
// Het glas tussen beide lage daken is donker/transparant in het AHN:
// interpoleer het dak tussen de twee gemeten aansluitranden, geen gat.
let atrium=B(-11.68,51.7,8.84,61.64,H.low);
const roofGlazing=[];
for(let u=-10.6;u<7.8;u+=3.1)for(let v=52.65;v<60.5;v+=2.75)roofGlazing.push(box(u,v,z(H.low)-.3,u+2.05,v+1.8,z(H.low)+.2));
atrium=atrium.subtract(union(roofGlazing));
// Erker in de oostgevel van de lage zuidvleugel, op +5,3; geen recht
// zwevende doos. 2,7 m uitkraging met een 45° kraag, blinde puien en pilaren.
const orielPlan=rect(8.74,26.78,11.52,51.42);
const orielBody=facade(orielPlan,H.oriel,{first:5.8,pitch:3.65,wide:1.8,step:2.9});
const underside=Manifold.hull([...ring3(rect(8.74,26.78,8.9,51.42),z(2.5)),...ring3(orielPlan,z(5.3))]);
const oriel=orielBody.intersect(union([prism(orielPlan,z(5.3),z(H.oriel)+.1),underside]));
// Entree in de zuidgevel: glazen luifel op twee kolommen met een blinde
// achterwand. Dak en steun minstens 0,9 m, ondersnede onder 45°.
const canopyPlan=rect(-11.7,-15.0,4.1,-12.25),canopyInner=rect(-11.7,-14.0,4.1,-12.25);
const canopy=union([Manifold.hull([...ring3(canopyInner,z(6.3)-1),...ring3(canopyPlan,z(6.3))]),prism(canopyPlan,z(6.3),z(7.2)),B(-11.7,-13.4,4.1,-12.25,6.4),...[-10.3,2.8].map(u=>Manifold.cylinder(z(6.4)-BASE,.6,.6,24).translate([u,-14.3,BASE]))]);
let model=union([west,westCore,westFrame,...westPosts,glass,spine,east,stair,eastCap,...crownColumns,frame,frameBack,parapet,plant,hall,southLow,northLow,atrium,oriel,canopy]);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0));
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Breitnertoren niet verbonden: '+model.status());
await writeLandmark({slug,nodes:[['building:breitnertoren-met-dakframe-erker-en-noordvleugel',model]],base:BASE,catalog:{name:'Breitnertoren',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:44.3471287,groundSamplePoints:[[27.761,-2.705],[-22.242,-14.222],[9.418,51.926],[-4.049,67.503]],replacesBuildings:['NL.IMBAG.Pand.0363100012070861'],description:'Breitnertoren (SOM/ZZDP, 2001): westvleugel +61,132 NAP, kern +64,876, afgeronde oostvleugel +82,78, glasvolume +92,022, middenschijf +94,528 en dakinstallatie +96,271; lage noordvleugel met erker, glazen tussenhal en gebogen blad tot +16,782. Oorsprong RD (122927,484158), X langs 20,1 graden; glaspuien, dakframe en entree vereenvoudigd met blinde nissen voor 1:1000.',realWorld:{groundNapM:GROUND,westNapM:H.west,westCoreNapM:H.westCore,eastNapM:H.east,glassNapM:H.glass,spineNapM:H.spine,frameNapM:H.frame,plantNapM:H.plant,lowWingNapM:H.low,orielNapM:H.oriel,axisDegrees:ANGLE,storeyPitchM:3.85,nicheDepthM:.35,estimates:['gevelraster op 3,85 m vloersteek en 3,45 m travees uit Commons-foto’s','glazen atriumdak lineair tussen aangrenzende gemeten daken op NAP +16,782, waar AHN door glas meet','dakframe en penthouse als blinde nissen met ronde kolommen voor 1:1000','erkeronderkant, entreeluifel, pilaren en 45° printkragen uit foto’s vereenvoudigd']},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012070861 (TU Delft/3DGI, CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://www.zzdp.nl/nl/artikel/Ongeevenaard-ensemble (SOM Peter Ellis met ZZDP)','https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(1).jpg (Ceescamel, CC BY-SA 4.0)','https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(2).jpg (Ceescamel, CC BY-SA 4.0)','https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(3).jpg (Ceescamel, CC BY-SA 4.0)','https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(4).jpg (Ceescamel, CC BY-SA 4.0)']}});
