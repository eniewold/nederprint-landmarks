// Per rij volledig gelezen: generate-amsterdam-centraal.mjs en generate-domtoren.mjs.
// BAG-grondplan, benoemde bouwdelen en doorlopende dakvlakken; geen hoogtelagen.
import {Manifold,CrossSection,box,prism,circle,hull,union,hipRoof,writeLandmark} from './efteling-kit.mjs';
const slug='hotel-new-york',origin=[92885,435458],angle=38.5,ground=3.45,base=-.4;
const z=n=>n-ground,a=angle*Math.PI/180,xAxis=[Math.cos(a),Math.sin(a)],parts=[],cuts=[];
const outline=[[26.395,-17.226],[26.407,-16.456],[26.535,-16.455],[26.582,-12.334],[26.609,-10.083],[26.823,8.61],[26.85,10.925],[26.897,14.971],[26.769,14.971],[26.76,15.731],[14.465,15.647],[14.45,16.592],[10.7,16.52],[10.643,20.706],[-10.471,20.442],[-10.739,20.409],[-10.998,20.331],[-11.239,20.209],[-11.456,20.047],[-11.641,19.851],[-11.791,19.626],[-11.9,19.378],[-11.964,19.116],[-11.983,18.846],[-11.973,15.951],[-20.89,15.825],[-20.891,15.391],[-25.751,15.321],[-29.225,11.836],[-29.28,9.197],[-29.693,9.192],[-29.751,5.324],[-29.795,2.413],[-32.394,2.422],[-32.405,1.767],[-32.709,1.753],[-32.763,-1.897],[-32.443,-1.896],[-32.446,-2.558],[-29.825,-2.573],[-29.862,-5.551],[-29.911,-9.379],[-29.471,-9.371],[-29.51,-12.023],[-26.108,-15.586],[-21.255,-15.766],[-21.263,-16.194],[-12.329,-16.528],[-12.419,-19.421],[-12.424,-19.558],[-12.415,-19.695],[-12.394,-19.83],[-12.36,-19.963],[-12.316,-20.093],[-12.26,-20.219],[-12.192,-20.338],[-12.114,-20.45],[-12.026,-20.556],[-11.93,-20.654],[-11.824,-20.741],[-11.711,-20.819],[-11.591,-20.887],[-11.467,-20.944],[-11.337,-20.988],[-11.204,-21.021],[-11.068,-21.042],[-10.931,-21.052],[10.115,-21.821],[10.287,-16.705],[14.295,-16.834],[26.305,-17.223]];
const footprint=new CrossSection([outline]);
// Hoofdgebouw, westfront en magazijn zijn volledige prisma's tot hun dakvlak.
const all=prism(outline,base,z(23.4));
parts.push(all.intersect(box(-40,-30,base,-20.4,30,z(23.4))),all.intersect(box(-20.4,-30,base,14,30,z(22.3))),all.intersect(box(14,-30,base,40,30,z(22.6))));
// Twee lichtkokers zichtbaar in orthofoto en AHN: de bodem blijft gesloten.
cuts.push(box(-20.1,-6.3,z(12),-16.6,5.8,z(24)),box(11,-11.4,z(9.8),13.55,3.8,z(24)));
// Vooruitstekende centrale entree/erker heeft een eigen lager dak.
cuts.push(box(-34,-2.55,z(18.5),-29.82,2.43,z(24)));
// Oorspronkelijk noordelijk zadeldak en twee kleinere daklichten/opbouwen.
parts.push(hipRoof(17,5.2,z(22.25),z(27.3),2.0).rotate([0,0,90]).translate([8.1,11.4,0]));
parts.push(hipRoof(7.2,4.4,z(22.2),z(25.32),.7).translate([-5.1,5.3,0]),hipRoof(4.8,4,z(22.2),z(24.7),.8).translate([-9.8,-14.8,0]));
// Achtergevel: gemeten twee schoorsteen/topgevelblokken.
parts.push(box(23.6,11.7,z(22.5),26.85,14.5,z(27.6)),hipRoof(3.3,3.6,z(27.55),z(28.85),1.2).translate([25.2,13.7,0]),box(22,-17.1,z(22.5),26.4,-13.7,z(25.35)));
// Vierzijdig gewelfde koperen kappen: één gesloten oppervlak met profielringen.
// Ringen beschrijven de gebogen kap, geen op elkaar gestapelde volumes.
const cap=(c)=>{
 const profile=[[3.1,30.8],[3.35,31.4],[3.5,32.3],[3.46,33.6],[3.25,35.0],[2.85,36.4],[2.13,37.5],[1.35,38.1],[.6,38.8]],n=32,vertices=[];
 for(const[r,h]of profile)for(let i=0;i<n;i++){const t=2*Math.PI*i/n,co=Math.cos(t),si=Math.sin(t);vertices.push(c[0]+r*Math.sign(co)*Math.abs(co)**.75,c[1]+r*Math.sign(si)*Math.abs(si)**.75,z(h));}
 const tris=[];for(let j=0;j<profile.length-1;j++)for(let i=0;i<n;i++){const k=(i+1)%n,A=j*n+i,B=j*n+k,C=(j+1)*n+k,D=(j+1)*n+i;tris.push(A,B,C,A,C,D);}
 const low=vertices.length/3;vertices.push(c[0],c[1],z(profile[0][1]));const high=vertices.length/3;vertices.push(c[0],c[1],z(38.8));
 for(let i=0;i<n;i++){const k=(i+1)%n;tris.push(low,k,i,high,(profile.length-1)*n+i,(profile.length-1)*n+k);}
 return new Manifold({numProp:3,vertProperties:new Float32Array(vertices),triVerts:new Uint32Array(tris)});
};
const inside=([x,y])=>{let yes=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++){const A=outline[i],B=outline[j];if((A[1]>y)!==(B[1]>y)&&x<(B[0]-A[0])*(y-A[1])/(B[1]-A[1])+A[0])yes=!yes;}return yes;};
const groove=(A,B,s,t,lo,hi,depth=.35)=>{const len=Math.hypot(B[0]-A[0],B[1]-A[1]),d=[(B[0]-A[0])/len,(B[1]-A[1])/len],n=[d[1],-d[0]],at=[A[0]+d[0]*(s+t)/2,A[1]+d[1]*(s+t)/2];if(lo<23&&inside([at[0]+n[0]*.8,at[1]+n[1]*.8])){n[0]*=-1;n[1]*=-1;}return box(-depth,-(t-s)/2,z(lo),.6,(t-s)/2,z(hi)).rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI]).translate([...at,0]);};
for(const c of [[-9.29,17.46],[-9.71,-17.98]]){
 const oct=circle(c,3.35,8,Math.PI/8);parts.push(prism(oct,base,z(30.9)),cap(c));
 for(let face=0;face<8;face++)for(const[lo,hi]of[[23.3,26.5],[27.6,29.9]])cuts.push(groove(oct[face],oct[(face+1)%8],.7,1.9,lo,hi,.28));
 // Wijzerplaten als blinde ronde nissen: gedragen materiaal, geen losse schijf.
 for(const d of[0,90,180,270]){
  const disk=prism(circle([0,0],1.5,32),0,1.05).rotate([-90,0,0]).rotate([0,0,d]);
  const r=d*Math.PI/180;cuts.push(disk.translate([c[0]+3.75*Math.sin(r),c[1]-3.75*Math.cos(r),z(33.5)]));
 }
}
// Drie topgevels op het westfront en de ingangen van de zijgevels.
const gable=(at,width,bottom,top,depth,deg=0)=>prism([[-width/2,z(22.25)],[width/2,z(22.25)],[width/2,z(bottom+.7)],[0,z(top)],[-width/2,z(bottom+.7)]],0,depth).rotate([90,0,90]).rotate([0,0,deg]).translate([at[0],at[1],0]);
for(const y of[-6.7,0,6.7])parts.push(gable([-29.8,y],5.0,23.35,y===0?27.3:26.4,1.3));
parts.push(gable([8.1,20.55],5,24,28.5,1.1,-90),gable([8.2,-21.65],5.2,22.8,26.5,1.1,90));
// Westfront: drie driezijdige erkers met schuine console (>45°).
for(const y of[-6.7,0,6.7]){
 const upper=[[-29.4,y-2],[-30.5,y-2],[-31.2,y-1.25],[-31.2,y+1.25],[-30.5,y+2],[-29.4,y+2]];
 const lower=[[-29.4,y-2],[-29.85,y-2],[-29.85,y+2],[-29.4,y+2]];
 parts.push(hull([...lower.map(([x,y])=>[x,y,z(9.3)]),...upper.map(([x,y])=>[x,y,z(11.3)])]),prism(upper,z(11.25),z(17.9)));
 cuts.push(box(y===0?-33.2:-31.55,y-.9,z(12),-30.85,y+.9,z(17.1)));
}
// Drie bouwlagen met per bouwfase eigen vensterreeks, blinde nissen van .35m.
for(const[A,B,count]of[[[-29.69,9.19],[-29.8,2.43],4],[[-29.83,-2.57],[-29.91,-9.37],4],[[-25.75,15.32],[-11.97,15.95],6],[[-6,20.48],[6,20.66],6],[[14.46,15.65],[26.75,15.73],6],[[26.82,14.9],[26.41,-16.4],14],[[26.3,-17.22],[14.3,-16.83],6],[[10,-21.8],[-6,-21.1],8],[[-12.33,-16.53],[-26.1,-15.59],6]]){
 const len=Math.hypot(B[0]-A[0],B[1]-A[1]);
 for(let floor=0;floor<3;floor++)for(let i=0;i<count;i++){const t=(i+.5)*len/count,lo=5.25+floor*5.3;if(floor===1&&A[0]<-29)continue;cuts.push(groove(A,B,t-.59,t+.59,lo,lo+(floor===0?4.2:3.6)));}
 for(const n of[10.1,15.7,21.2])cuts.push(groove(A,B,.1,len-.1,n,n+.23,.18));
}
// Hoeken van het westfront bevatten een eigen erker en vensters.
for(const[A,B]of[[[-29.22,11.84],[-25.75,15.32]],[[-26.11,-15.59],[-29.51,-12.02]]])for(let floor=0;floor<3;floor++)cuts.push(groove(A,B,1.2,3.6,5.3+floor*5.3,9.4+floor*5.3));
// Middelste entree: twee blinde zijdeurpartijen, geen los luifeldak of reclame.
cuts.push(box(-32.9,-2.95,z(4),-30.1,-2.18,z(8.2)),box(-32.9,2.12,z(4),-30.1,2.8,z(8.2)));
const model=union(parts).subtract(union(cuts));

if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Model niet gesloten/verbonden '+model.status()+' '+model.decompose().length);
await writeLandmark({slug,base,nodes:[['building:HAL-gebouw met erkers lichtkokers topgevels en tweelingtorens',model]],catalog:{
 name:'Hotel New York',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-36,0],[0,-26],[30,0]],replacesBuildings:['NL.IMBAG.Pand.0599100000642881'],
 description:'HAL-kantoor met BAG-grondplan, drie westelijke erkers en topgevels, twee lichtkokers, magazijn en twee achtkantige klokkentorens met gewelfde vierzijdige kappen. Geveldetail uit fotos; vlaggenmasten en windvaan weggelaten voor 1:1000.',
 realWorld:{groundNapM:ground,roofNapM:[22.3,22.6,23.4],capTopNapM:38.8,towerCentres:[[-9.29,17.46],[-9.71,-17.98]],axisDegrees:angle,estimates:['profiel vierzijdige kappen en klokkengrootte uit fotos binnen AHN-hoogte','vensterritme, erkerconsoles, topgeveldetail en ingangshoogtes uit fotos','lichte dakhellingen tot vlakke dakvlakken vereenvoudigd; dakinstallaties en smalle masten weggelaten']},
 sources:['PDOK BAG0599100000642881, BGT, AHN DSM/DTM0.5m en Actueel_orthoHR;2026-10-09','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000642881 (3D BAG CC BY4.0)','https://monumentenregister.cultureelerfgoed.nl/monumenten/513872','https://hotelnewyork.nl/over-hotel-new-york/geschiedenis-hotel-new-york/','https://commons.wikimedia.org/wiki/File:Rotterdam_Hotel_New_York_seen_from_the_northeast.jpg','https://commons.wikimedia.org/wiki/File:Rotterdam_Landverhuizersplein_and_Hotel_New_York_seen_from_the_southwest.jpg','https://commons.wikimedia.org/wiki/File:Hotel_New_York_(Rotterdam)_DSCF3888.jpg','https://commons.wikimedia.org/wiki/File:Achterkant_Hotel_New_York_(Rotterdam)_DSCF4012.jpg']
}});





