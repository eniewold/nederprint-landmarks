// Koepel Breda: BAG-cirkelfit, doorlopend AHN-radiaal profiel en afzonderlijke bouwdelen.
// Aanpak/referentie: generate-evoluon.mjs en generate-koepel-arnhem.mjs.
import {box,prism,circle,dome,spire,hull,gableRoof,union,writeLandmark} from './efteling-kit.mjs';
const slug='koepel-breda',ground=3.072,base=-.3;
const origin=[113424.789,400331.152],xAxis=[Math.cos(-21.5*Math.PI/180),Math.sin(-21.5*Math.PI/180)];
const z=n=>n-ground,parts=[],cuts=[];
// AHN DSM .5 m: medianen per radiale meter; de knopen definiëren schuine vlakken.
// BAG-cirkelfit r=31.4614, residu .086 m. Buitenring en centrale koepel zijn doorlopend.
const profile=[[31.461,16.92],[30.5,17.551],[28.5,18.747],[27.5,19.656],
 [26.5,20.864],[25.5,22.804],[24.5,24.510],[23.5,25.855],[22.5,27.004],
 [20.5,28.928],[18.5,30.180],[16.5,31.263],[14.5,32.195],[12.5,32.986],
 [10.5,33.701],[8.5,34.210],[6.5,34.538],[4.5,34.797],[0,34.82]];
const roofNap=r=>{for(let k=1;k<profile.length;k++){const[a,za]=profile[k-1],[b,zb]=profile[k];if(r>=b)return zb+(za-zb)*(r-b)/(a-b);}return profile.at(-1)[1];};
parts.push(dome([0,0],[[31.461,base],...profile.map(([r,n])=>[r,z(n)])],224));
// Veertienzijdige lantaarn en piron; hoogste AHN-return NAP39.7689.
parts.push(prism(circle([0,0],3.92,14,Math.PI/14),z(34.58),z(36.78)));
parts.push(spire([0,0],3.92,z(36.78),z(38.24),14,Math.PI/14));
parts.push(dome([0,0],[[.9,z(37.95)],[.9,z(38.28)],[.55,z(38.72)],[.45,z(39.25)],[0,z(39.7689)]],28));
for(let j=0;j<14;j++)cuts.push(box(3.48,-.7,z(35.02),4.15,.7,z(36.35)).rotate([0,0,j*360/14]));
// 28 roeven: 0.9 m printbreedte, ingebed reliëf langs het dakprofiel.
for(let j=0;j<28;j++){
 const a=j*2*Math.PI/28,d=[Math.cos(a),Math.sin(a)],t=[-d[1],d[0]];
 const line=profile.filter(([r])=>r>=4.5&&r<=27.5);
 for(let k=1;k<line.length;k++){
  const ps=[];for(const[r,n]of[line[k-1],line[k]])for(const w of[-.45,.45])for(const dz of[-.22,.23])ps.push([r*d[0]+w*t[0],r*d[1]+w*t[1],z(n)+dz]);
  parts.push(hull(ps));
 }
}
// Twee koepelvensterringen en lessenaarsring: blinde daknissen, .35 m diep.
for(const[r,len,w]of[[12.5,2.8,2.8],[22.4,3.7,3.4],[29.15,1.5,1.3]]){
 const n=roofNap(r),s=(roofNap(r+.1)-roofNap(r-.1))/.2;
 for(let j=0;j<14;j++)cuts.push(box(-len/2,-w/2,-.35,len/2,w/2,.8).rotate([0,-Math.atan(s)*180/Math.PI,0]).translate([r,0,z(n)]).rotate([0,0,(j+.5)*360/14]));
}
// Vier lagen, 13 celvensters per quadrant (RCE); ondiep zodat geen steun nodig is.
for(let q=0;q<4;q++)for(let j=1;j<=13;j++)for(const n of[4.55,7.85,11.15,14.45]){
 const a=q*90+j*90/14;
 if(Math.cos(a*Math.PI/180)>.975&&n<11)continue; // Gang bedekt de onderste ramen.
 const arch=prism([[-.57,z(n)],[.57,z(n)],[.57,z(n+1.10)],[.25,z(n+1.35)],[-.25,z(n+1.35)],[-.57,z(n+1.10)]],31.11,32.0).rotate([90,0,90]);
 cuts.push(arch.rotate([0,0,a]));
}
// Vier traptorens: projectie uit de BAG, kantelen en langgerekte blinde vensters.
for(let q=0;q<4;q++){
 const a=q*90,t=[];
 t.push(box(29.8,-2.10,base,33.66,2.10,z(19.40)));
 // Schuine kraag i.p.v. een vrij dragende horizontale lijst.
 t.push(hull([[29.7,-2.1,z(18.7)],[33.66,-2.1,z(18.7)],[33.66,2.1,z(18.7)],[29.7,2.1,z(18.7)],
 [29.45,-2.35,z(19.1)],[33.91,-2.35,z(19.1)],[33.91,2.35,z(19.1)],[29.45,2.35,z(19.1)]]));
 for(const y of[-2.1,-.55,1.0])t.push(box(32.65,y,z(19.2),33.66,y+1.10,z(20.35)));
 for(const y of[-2.1,1.0])for(const x of[29.8,31.25])t.push(box(x,y,z(19.2),x+1.05,y+1.1,z(20.35)));
 parts.push(union(t).rotate([0,0,a]));
 for(const n of[5.0,8.25,11.5,14.75])if(q%2===1||n>=11.5)cuts.push(box(33.30,-.55,z(n),34.2,.55,z(n+2.05)).rotate([0,0,a]));
 for(const y of[-1.4,0,1.4])cuts.push(box(33.29,y-.3,z(17.6),34.2,y+.3,z(18.7)).rotate([0,0,a]));
}
// Westelijk dienstgebouw: werkelijk zadeldak met lange rechte nok, geen hoogteplakken.
const west=[[-74.088,12.371],[-74.048,-8.643],[-56.292,-8.576],[-56.314,-6.584],[-39.063,-6.583],[-39.329,6.035],[-56.339,5.983],[-56.445,12.433]];
const mask=prism(west,base,50);
parts.push(box(-66.58,-6.60,base,-39.08,6.03,z(11.81)).intersect(mask));
parts.push(gableRoof(27.50,12.63,z(11.81),z(17.11)).translate([-52.83,-.285,0]).intersect(mask));
// Moderne U-aanbouw rond de westkop, AHN vlakke dakhoogte NAP7.55.
parts.push(union([box(-74.2,-9,base,-66.45,13,z(7.55)),box(-66.6,-9,base,-56.25,-6.45,z(7.55)),box(-66.6,5.83,base,-56.25,13,z(7.55))]).intersect(mask));
parts.push(box(-39.25,-2.16,base,-30.0,1.69,z(9.47)));
parts.push(gableRoof(9.3,3.85,z(9.47),z(11.23)).translate([-34.65,-.235,0]));
// Oostelijke verbindingsgang (zelfde BAG); het administratiegebouw is een apart pand.
const east=[[30.4,-6.19],[38.788,-6.099],[38.484,6.491],[30.4,6.37]];
parts.push(prism(east,base,z(11.53)));
// Geveltravees, daklichten en schoorstenen van het dienstgebouw.
for(const x of[-64.6,-61.3,-58.0,-54.7,-51.4,-48.1,-44.8,-41.5])for(const n of[4.35,7.60])for(const y of[-6.57,6.02])if(x>-56||n>7)cuts.push(box(x-.60,y-.35,z(n),x+.60,y+.35,z(n+1.75)));
for(const x of[-72,-69,-66,-63,-60,-57.5])for(const y of[-8.61,12.40])cuts.push(box(x-.6,y-.35,z(4.50),x+.6,y+.35,z(6.40)));
for(const x of[-63.6,-42.0])parts.push(box(x-.65,-.95,z(15.7),x+.65,.35,z(18.08)));
for(const x of[-60,-54,-48])cuts.push(box(x-1.05,-3.8,z(14.15),x+1.05,-2.1,z(16.25)));
parts.push(box(36.2,-1.2,z(11.3),37.4,1.2,z(12.91)));
const raw=union(parts).subtract(union(cuts));
const shells=raw.decompose().filter(s=>Math.abs(s.volume())>1e-6);
if(raw.status()!=='NoError'||shells.length!==1)throw Error(`Geen enkel gesloten model: ${raw.status()}, ${shells.length} delen `+JSON.stringify(shells.map(s=>({volume:s.volume(),bbox:s.boundingBox()}))));
await writeLandmark({slug,base,nodes:[['building:koepel, vier traptorens en dienstvleugel',shells[0]]],catalog:{
 name:'Koepelgevangenis (Breda)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-12,-35],[12,-35],[0,-39]],
 replacesBuildings:['NL.IMBAG.Pand.0758100000038514'],
 description:'Hart uit cirkelfit BAG; +X langs oostelijke verbindingsgang op -21.5 graden in RD; volledige koepel met westelijk dienstgebouw en lage U-aanbouw. Afzonderlijke poort, kapel en administratie blijven PDOK.',
 realWorld:{groundNapM:ground,diameterM:62.922,topNapM:39.7689,radialRoofProfileNap:profile,
  schattingen:['venstervormen en kantelen vereenvoudigd uit RCE/Commons, dakroeven verdikt tot .9 m','gevelvensters .35 m diepe blinde nissen; daklichten schematisch','daknok dienstgebouw NAP17.11 en goot NAP11.81 uit AHN, raamposities uit traveeritme','lantaarn facetten en piron vereenvoudigd; totale AHN-hoogte 36.70 m wijkt af van historische registermaat 37.90 m']},
 sources:['PDOK BAG 0758100000038514; AHN DSM/DTM .5m en Actueel_orthoHR bbox 113302.374,400203.561,113542.374,400443.561; 2026-10-09',
 'BGT pand G0758.5df91bb155564028893d365ff4136c3c, actuele versie 9c21367c-f302-08bd-8857-69c7965bb84d',
 'https://monumentenregister.cultureelerfgoed.nl/monumenten/526096','https://monumentenregister.cultureelerfgoed.nl/monumenten/526095',
 'https://commons.wikimedia.org/wiki/File:P1010275copyKoepelgevangenis_Breda.jpg',
 'https://commons.wikimedia.org/wiki/File:Achter_aanzicht_-_Breda_-_20040751_-_RCE.jpg',
 'https://commons.wikimedia.org/wiki/File:Zijaanzicht_-_Breda_-_20040750_-_RCE.jpg']
}});
