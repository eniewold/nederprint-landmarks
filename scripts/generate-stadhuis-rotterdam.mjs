// Rotterdam: vier buitenvleugels, twee tussenvleugels, open tuin en stadhuistoren.
// BAG 0599100000701897; PDOK AHN/ortho en RCE-register 513763/foto's.
// Een kap is een doorlopend dakvlak, geen verzameling DSM-hoogteplakken.
import {box,prism,circle,spire,dome,hull,gableRoof,hipRoof,place,union,writeLandmark} from './efteling-kit.mjs';
const slug='stadhuis-rotterdam',base=-.8,origin=[92580,437529],xAxis=[.959,.284],ground=.45;
const p=[],cuts=[],EAVE=21.35,RIDGE=31.12;
const wing=(x0,y0,x1,y1,eave,ridge,alongY=false)=>{
 p.push(box(x0,y0,base,x1,y1,eave));
 p.push(place(hipRoof(alongY?y1-y0:x1-x0,alongY?x1-x0:y1-y0,eave-.04,ridge),{at:[(x0+x1)/2,(y0+y1)/2,0],deg:alongY?90:0}));
};
// Contour gemiddeld langs nokken/goten; risalieten blijven afzonderlijk.
wing(-39.5,-30.9,-26.2,53.7,EAVE,RIDGE,true);
wing(49.2,-30.9,61.4,53.1,21.36,31.83,true);
wing(-32.9,-30.9,55.4,-18.65,22.64,31.82);
wing(-32.7,40.35,55.5,53.2,21.46,31.76);
// Voorste tussenvleugel en raadzaal: lagere daken, glas boven de wachthoven.
wing(-8.8,-18.8,3.5,40.7,17.35,27.57,true);
p.push(box(-26.3,-18.7,base,-8.5,40.5,7.7));
wing(-25.0,3.2,7.7,21.6,25.02,33.18);
// Achterste overdekte binnenhof met drie afzonderlijke glazen schildkappen.
p.push(box(34.2,-18.8,base,49.4,40.6,10.85));
for(const y of [-10.9,11.0,32.6])p.push(place(hipRoof(17.1,14.0,10.8,17.23),{at:[42.0,y,0],deg:90}));
// Vier hoekrisalieten, piramidale kappen en twee voorste lantaarns.
for(const [x,y,sx,sy,top] of [[-40.5,-27.4,9.0,9.3,37.85],[-39.3,51.1,9.7,10.3,38.65],[57.1,-27.5,8.5,10.0,37.2],[57.6,48.6,9.0,10.4,38.45]]){
 p.push(box(x-sx/2,y-sy/2,base,x+sx/2,y+sy/2,22.35),place(hipRoof(sy,sx,22.3,top,sy/2),{at:[x,y,0],deg:90}));
 if(x<0)p.push(prism(circle([x,y],1.6,8,Math.PI/8),top-.2,top+2.1),dome([x,y],[[1.7,top+2.0],[1.45,top+2.6],[.7,top+3.0],[.45,top+3.4]],24));
}
// Zijtrappenhuizen op de middenrisalieten; schildkappen op hun eigen hoogte.
for(const [x,y,r] of [[-.4,-30.25,38.67],[.0,51.85,38.76]]){
 p.push(box(x-4.2,y-3.0,base,x+4.2,y+3.0,23.5),place(hipRoof(8.5,6.2,23.45,r,3.1),{at:[x,y,0]}));
}
// Hoofdrisaliet, trapgevel en kleine voorste toren boven het bordes.
p.push(box(-42.7,5.4,base,-26.1,18.5,22.8),place(hipRoof(17.1,13.5,22.75,33.43),{at:[-34.2,11.9,0]}));
const stepped=[[-7,22.7],[7,22.7],[7,27.0],[5.2,27.0],[5.2,30.4],[3.8,30.4],[3.8,34.4],[2.2,34.4],[2.2,36.7],[-2.2,36.7],[-2.2,34.4],[-3.8,34.4],[-3.8,30.4],[-5.2,30.4],[-5.2,27],[-7,27]];
p.push(prism(stepped,-42.5,-41.4).rotate([90,0,90]).translate([0,11.8,0]));
const small=[-34.7,11.8];p.push(prism(circle(small,1.85,8,Math.PI/8),32.8,40.3),dome(small,[[2.15,40.15],[1.85,41.2],[1.2,42.0],[.55,42.6]],24));
// Hoofdtoren: vierkante schacht, hoge galmnissen, achthoekige kloklantaarn,
// vier gebogen klokgevels en koperen koepel; vredesbeeld als vaste romp.
const c=[-15.65,11.5],t=[];
t.push(box(c[0]-5.1,c[1]-5.1,base,c[0]+5.1,c[1]+5.1,51.73));
t.push(box(c[0]-5.5,c[1]-5.5,50.75,c[0]+5.5,c[1]+5.5,52.0));
t.push(prism(circle(c,5.15,8,Math.PI/8),51.95,61.43),prism(circle(c,5.5,8,Math.PI/8),60.85,62.02));
t.push(prism(circle(c,4.22,8,Math.PI/8),61.9,68.57));
const arch=(w,z,h)=>[[-w/2,z],[w/2,z],[w/2,z+h*.7],[0,z+h],[-w/2,z+h*.7]];
const tx=(poly,x0,x1)=>prism(poly,x0,x1).rotate([90,0,90]);
const tc=[];
for(const deg of [0,90,180,270]){
 for(const y of [-2.9,0,2.9])tc.push(place(tx(arch(1.25,35.2,12.8),4.74,5.4).translate([0,y,0]),{at:[...c,0],deg}));
 tc.push(place(tx(arch(2.6,54.0,6.3),4.35,5.6),{at:[...c,0],deg}));
 t.push(place(tx(arch(8.2,62.0,7.3),3.5,4.48),{at:[...c,0],deg}));
 tc.push(place(tx(circle([0,65.0],2.45,32),4.12,4.7),{at:[...c,0],deg}));
}
t.push(dome(c,[[4.15,67.7],[4.10,68.85],[3.55,69.7],[2.45,70.6],[1.1,71.0],[.65,71.25]],32));
t.push(spire(c,.9,71.17,73.65,8),prism(circle(c,.6,16),73.5,74.5));
for(const dx of [-4.6,4.6])for(const dy of [-4.6,4.6]){
 const pin=[c[0]+dx,c[1]+dy];t.push(prism(circle(pin,.65,8),50.7,54.7),spire(pin,.85,54.65,57.0,8));
}
p.push(union(t).subtract(union(tc)));
// Vensters op alle vier buitengevels en de zichtbare tuinwanden: blinde
// nissen .35m diep. Doorzetten tot na union voorkomt dichtgevulde gevels.
for(const x of [-39.5,61.4])for(let y=-20;y<45;y+=3.6)for(const z of [2.0,8.1,15.05])cuts.push(box(x-.35,y-1.05,z,x+.35,y+1.05,z+4.3));
for(const y of [-30.9,53.2])for(let x=-29;x<51;x+=3.9)for(const z of [2.0,8.1,15.05])cuts.push(box(x-1.1,y-.35,z,x+1.1,y+.35,z+4.3));
for(const x of [3.5,34.2])for(let y=-14;y<39;y+=4.2)for(const z of [2.0,9.3])cuts.push(box(x-.35,y-1.05,z,x+.35,y+1.05,z+4.2));
for(const y of [-18.65,40.35])for(let x=9;x<34;x+=4)for(const z of [2,9,16])cuts.push(box(x-1,y-.35,z,x+1,y+.35,z+4.0));
// Hoofdingang met drie boognissen en een gedragen balkon/bordes.
for(const y of [7.8,11.8,15.8])cuts.push(place(tx(arch(3.0,.4,5.7),-43.1,-42.35),{at:[0,y,0]}));
p.push(box(-44.1,5.4,base,-42.2,18.5,1.2),box(-43.6,5.4,5.7,-42.2,18.5,6.7));
// Dakkapellen en schoorstenen als aparte bouwdelen op elk buitenste dak.
const dormer=(x,y,z,deg=0,big=false)=>{
 const w=big?2.7:1.05,h=big?3.3:1.35;
 p.push(place(box(-w/2,-.85,21.2,w/2,.85,z+h),{at:[x,y,0],deg}),place(gableRoof(1.75,w,z+h-.05,z+h+1.2),{at:[x,y,0],deg}));
};
for(const x of [-38.2,59.5])for(let y=-17;y<44;y+=11.5)dormer(x,y,23.9,0,true);
for(const y of [-29.3,51.5])for(let x=-27;x<51;x+=13)dormer(x,y,23.0,90,true);
for(const x of [-38.2,59.5])for(let y=-22;y<46;y+=5.75)dormer(x,y,22.8);
for(const y of [-29.3,51.5])for(let x=-29;x<51;x+=6.5)dormer(x,y,22.6,90);
for(const x of [-33.5,55.75])for(let y=-14;y<42;y+=13)p.push(box(x-.7,y-.7,29.5,x+.7,y+.7,34.0));
for(const y of [-24.7,47.2])for(let x=-25;x<49;x+=15)p.push(box(x-.75,y-.65,30.7,x+.75,y+.65,34.15));
// De tuin blijft werkelijk open; geen grondplaat of terrein in de GLB.
const shells=union(p).subtract(union(cuts)).decompose(),outer=shells.filter(s=>s.volume()>0);
if(outer.length!==1||shells.some(s=>s.volume() < -12))throw Error('Los bouwdeel of grote binnenholte');
await writeLandmark({slug,base,nodes:[['building:stadhuis, binnenhof en stadhuistoren',outer[0]]],catalog:{name:'Stadhuis (Rotterdam)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-49,0],[-20,-36],[35,-35],[66,20]],replacesBuildings:['NL.IMBAG.Pand.0599100000701897'],description:'Coolsingel aan -X; +Y naar Doelwater. Vier vleugels, overkapte hoven, raadzaal en open binnentuin met kloktoren; voet .8m onder straat.',realWorld:{groundNapM:ground,towerTopM:74.5,outerRoofRidgeM:[31.12,31.83,31.82,31.76],schattingen:['geledingen, klokgevels, koepel en vereenvoudigd Vredesbeeld volgens AHN/fotos; spitsachtige beeldenromp ipv dunne armen','dakkapellen, vensters, schoorstenen en risalieten naar fotos met regelmatige travees; kapelvensters blind','balkons en portieken volle kern voor 1:1000; raamroeden, vlaggenmasten, beelden aan gevel en losse tuinsculptuur weggelaten onder .9m','loopbruggen naar afzonderlijke politiebureau/Timmerhuis blijven PDOK; gebouwen niet vervangen']},sources:['PDOK BAG 0599100000701897, Actueel_orthoHR, AHN DSM/DTM .5m bbox 92460,437400,92700,437650; 2026-10-09','https://monumentenregister.cultureelerfgoed.nl/monumenten/513763','https://commons.wikimedia.org/wiki/File:NL-Rotterdam-rathaus.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_achtergevel_-_Rotterdam_-_20377466_-_RCE.jpg','https://commons.wikimedia.org/wiki/Category:City_hall,_Rotterdam']}});
