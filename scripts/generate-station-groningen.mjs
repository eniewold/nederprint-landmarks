// Gosschalk's stationsgebouw: BAG 0014100010938997, AHN en RCE 18691.
// Mansardes uit vier doorlopende vlakken; galerijen, paviljoens en dakkapellen.
import {box,prism,hull,hipRoof,gableRoof,place,circle,spire,union,writeLandmark} from './efteling-kit.mjs';
const slug='station-groningen',base=-.8,origin=[233623.076,581123.967],xAxis=[.997,.077],ground=2.5,p=[],cuts=[];
const mansard=(x0,y0,x1,y1,eave,top,inset)=>{
 p.push(box(x0,y0,base,x1,y1,eave),hull([box(x0,y0,eave-.05,x1,y1,eave),box(x0+inset,y0+inset,top-.05,x1-inset,y1-inset,top)]));
};
// Three high pavilions and two low connecting wings, following the BAG plan.
mansard(-57.9,-12,-40.4,6.9,11.42,19.17,3.1);
mansard(40.5,-12,58,5.9,11.44,19.13,3.1);
mansard(-10.5,-12,10.6,9.2,16.58,22.07,3.6);
for(const [a,b] of [[-40.5,-10.4],[10.5,40.6]]){
 mansard(a,-12,b,.55,8.88,13.41,2.9);
 p.push(box(a,.4,base,b,6.25,8.96));
}
// Small shoulder blocks of the central hall and west service-end attachment.
for(const [a,b]of [[-16.7,-10.3],[10.4,16.9]])mansard(a,-12,b,6.1,14.05,19.27,1.0);
p.push(box(-60.8,-11.7,base,-57.7,-6.4,6.28),box(57.8,-12.1,base,60.7,-5.2,6.08));
// Fronton and clock finial on the central pavilion; side frontons and oriels.
const fronton=(x,y,w,shoulder,peak)=>prism([[x-w/2,shoulder],[x+w/2,shoulder],[x,peak]],-y-.6,-y+.6).rotate([90,0,0]);
p.push(fronton(0,9.05,9.0,16.6,24.16),box(-1.35,8.3,23.6,1.35,9.9,25.33),spire([0,9.1],.75,25.2,26.07,4,Math.PI/4));
for(const x of [-49.1,49.2]){
 p.push(fronton(x,6.7,5.6,12.0,21.6),box(x-1,6.0,20.4,x+1,7.4,22.2),spire([x,6.7],.7,22.1,23.04,8));
 p.push(prism(circle([x,6.1],1.65,8,Math.PI/8),base,10.9),place(hipRoof(3.6,3.6,10.85,13.34,1.8),{at:[x,6.1,0]}));
}
// Pilasters, corner finials and masonry parapets; no free-standing iron cresting.
for(const [a,b,y,top]of [[-58,-40.4,7.0,13.5],[40.5,58,6.0,13.6],[-10.5,10.6,9.2,18.3]])for(const x of [a,a+3,b-3,b]){
 p.push(box(x-.45,y-.1,base,x+.45,y+.5,top),spire([x,y+.2],.65,top-.1,top+1.35,4,Math.PI/4));
}
for(const [a,b]of [[-40.4,-16.7],[16.9,40.5]])for(let x=a+1;x<b;x+=4.7){p.push(box(x-.5,5.9,base,x+.5,6.6,9.7),spire([x,6.2],.65,9.6,10.8,4,Math.PI/4));}
const arch=(x,y,w,z,spring,top)=>{
 const q=[[x-w/2,z],[x+w/2,z],[x+w/2,spring]];
 for(let i=0;i<=12;i++){const a=i*Math.PI/12;q.push([x+w/2*Math.cos(a),spring+(top-spring)*Math.sin(a)]);}q.push([x-w/2,z]);
 return prism(q,-y-.38,-y+.38).rotate([90,0,0]);
};
// Blind gallery arches, paired upper windows, rear rhythm and entrance fanlight.
for(const [a,b]of [[-40.4,-16.7],[16.9,40.5]])for(let x=a+2.7;x<b-1;x+=4.7)cuts.push(arch(x,6.25,3.65,1.1,5.6,7.45));
for(const [a,b,y]of [[-58,-40.4,6.9],[40.5,58,5.9]])for(let x=a+2.5;x<b-1;x+=4.7){cuts.push(arch(x,y,2.1,1.1,4.7,6.3),box(x-1,y-.36,8.0,x+1,y+.36,10.5));}
cuts.push(arch(0,9.2,7.7,10.0,12.8,16.5),arch(0,9.2,5.4,1.0,5.1,6.8));
for(let x=-55;x<58;x+=4.7){cuts.push(arch(x,-12,2.5,1.1,4.9,6.6));if(Math.abs(x)>40)cuts.push(box(x-1,-12.36,8,x+1,-11.64,10.2));}
for(const x of [-57.9,58])for(let y=-8;y<5;y+=4.5)for(const z of [1.3,8.0])cuts.push(box(x-.36,y-1,z,x+.36,y+1,z+(z<2?4.8:2.5)));
// Entrance canopy is a supported wedge, with the actual sloping front roof.
p.push(prism([[7.0,5.7],[13.1,4.1],[13.1,base],[7.0,base]],-7.0,7.0).rotate([90,0,90]));
// Dormers on each pavilion and connector, individual pointed roofs.
for(const [a,b,y,z]of [[-55,-43,4.1,15.4],[43,55,3.1,15.4],[-7,8,5.1,19.0],[-37,-17,-.5,10.5],[18,39,-.5,10.5]])for(let x=a;x<b;x+=5.8){
 p.push(box(x-.55,y-.65,z-2,x+.55,y+.65,z+1.0),place(gableRoof(1.6,1.4,z+.95,z+2.25),{at:[x,y,0],deg:90}));
}
for(const x of [-47.3,47.5])p.push(box(x-.7,-3,18.8,x+.7,-1.4,22.0));
p.push(box(-1.1,-1.8,22,1.1,1.4,23.12));
// Attached platform canopy: curved transverse profile, interpolated from photos
// because glass leaves AHN gaps; solid core and recessed end fascias for print.
const cap=[[-19.2,5.82],[-18,6.8],[-16.4,7.65],[-14.8,8.08],[-13.3,8.25],[-12,8.14]];
p.push(prism([[cap[0][0],base],...cap,[cap.at(-1)[0],base]],-60.8,60.7).rotate([90,0,90]));
for(let x=-56;x<59;x+=5)cuts.push(box(x-1.7,-19.55,1.2,x+1.7,-18.88,4.9));
const shells=union(p).subtract(union(cuts)).decompose(),outer=shells.filter(s=>s.volume()>0);
if(outer.length!==1||shells.some(s=>s.volume() < -20))throw Error('Los bouwdeel of grote holte: '+shells.map(s=>s.volume().toFixed(2)).join(','));
await writeLandmark({slug,base,nodes:[['building:stationsgebouw, galerijen en aangebouwde perronkap',outer[0]]],catalog:{name:'Station Groningen (Groningen)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-50,12],[48,12],[-15,11],[15,11]],replacesBuildings:['NL.IMBAG.Pand.0014100010938997'],description:'Voorkant naar +Y aan Stationsplein; drie mansardepaviljoens, lage galerijen, frontons en aangebouwde perronkap. Volle kern met blinde glasnissen voor 1:1000.',realWorld:{groundNapM:ground,centralRoofM:22.07,centralFinialM:26.07,sideRoofM:[19.17,19.13],wingRoofM:13.41,schattingen:['frontons, bekroningen, blind venster- en galerijreliëf en dakkapellen naar fotos; cresting en vlaggenmasten onder .9m weggelaten','aangebouwde perronkap gebogen profiel uit fotos wegens glasgaten in AHN, winkels onder kap als printkern','geen kopie van oude traverse of lange vrijstaande perronkappen tijdens emplacementverbouwing; BAG 2025 achter station blijft apart']},sources:['PDOK BAG 0014100010938997, AHN DSM/DTM .5m en Actueel_orthoHR bbox 233480,580960,233780,581190; 2026-10-09','https://monumentenregister.cultureelerfgoed.nl/monumenten/18691','https://commons.wikimedia.org/wiki/File:Groningen_Hauptbahnhof_01.jpg','https://commons.wikimedia.org/wiki/File:Groningen_Hauptbahnhof_05.jpg','https://commons.wikimedia.org/wiki/File:Groningen,_perron_(1)_station,_RM-18691-WLM.jpg','https://commons.wikimedia.org/wiki/File:Groningen,_perron_(2)_station,_RM-18691-WLM.jpg']}});
