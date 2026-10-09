// Margadant: BAG-contour, afzonderlijke AHN-kapvakken en entreegebouwen.
// Continue extrusieprofielen; glas en spooropeningen als blinde nissen.
import {box,prism,union,hipRoof,gableRoof,place,writeLandmark} from './efteling-kit.mjs';
const slug='station-haarlem',base=-.8,origin=[104057,489144],xAxis=[.985,-.173],ground=1.2,p=[],cuts=[];
// Profilen zijn P90 per meter over 20 m, NAP minus 1.20; glasgaten interpoleren.
const front=[[-7,18.4],[-5,20.05],[-3,21.3],[-1,22.2],[1,22.85],[3,23.3],[5,23.6],[7,23.63],[9,23.55],[11,23.35],[13,22.95],[15,22.35],[17,21.55],[19,20.45],[21,19.1],[23,17.81]];
const rear=[[30,17.75],[32,19.4],[34,20.45],[36,21.15],[38,21.55],[40,21.65],[42,21.48],[44,21.0],[46,20.25],[48,19.2],[50,18.65]];
const small=[[13,8.7],[15,12.0],[17,14.0],[19,15.2],[21,15.75],[23,16.02],[25,15.95],[27,15.6],[29,14.85],[31,13.7],[33,11.7],[35,8.8],[40,8.4]];
const cap=(a,b,profile,dz=0)=>prism([[profile[0][0],base],...profile.map(([y,z])=>[y,z+dz]),[profile.at(-1)[0],base]],a,b).rotate([90,0,90]);
p.push(cap(-109,-60,front),cap(-60,73,front,-2.70),cap(-125,-60,rear),cap(-60,89.5,rear,-2.70));
p.push(box(-109,23,base,73,30,15.78),box(-125,50,base,89.5,59.5,4.62));
// Middle barrel continues beyond both pairs of high halls, clipped to BAG edges.
const westPlan=[[-270.2,13.25],[-125,13],[-125,40.15],[-206,40],[-243.3,38.3],[-270.2,34.85]];
const eastPlan=[[73,13.05],[129.5,13.05],[129.5,32.4],[108.15,36.1],[89.27,38.5],[73,40]];
p.push(cap(-270.2,-109,small).intersect(prism(westPlan,base,30)),cap(73,129.5,small).intersect(prism(eastPlan,base,30)));
// Lower eastern canopy turns with the tracks; plan measured from BAG.
const tail=[[129.4,16.45],[192.5,8.98],[192.54,14.25],[129.8,28.59]];
p.push(prism(tail,base,9.58));
// A separate low barrel is visible at the west end of the high southern hall.
p.push(cap(-121.5,-109,front,-2.68));
// South-side brick entrances and glazed connecting gallery.
for(const [a,b,eave,ridge] of [[-85.4,-63.1,11.90,15.03],[7.9,60.2,11.55,14.91]]){
 p.push(box(a,-20.55,base,b,-6.7,eave),place(hipRoof(b-a,13.85,eave-.05,ridge,3.2),{at:[(a+b)/2,-13.625,0]}));
}
// East entrance has the higher transverse middle hall, with a stepped fronton.
p.push(box(25.3,-22.65,base,45.55,-7,13.7),place(gableRoof(20.25,15.65,13.65,17.94),{at:[35.425,-14.825,0]}));
const stepped=(a,b,y,shoulder,peak)=>{
 const mid=(a+b)/2,n=4,w=(b-a)/2/n,q=[[a,base],[b,base],[b,shoulder]];
 for(let i=0;i<n;i++){q.push([b-i*w,shoulder+(i+1)*(peak-shoulder)/n],[b-(i+1)*w,shoulder+(i+1)*(peak-shoulder)/n]);}
 for(let i=n-1;i>=0;i--)q.push([a+i*w,shoulder+(i+1)*(peak-shoulder)/n],[a+i*w,shoulder+i*(peak-shoulder)/n]);
 return prism(q,-y-.6,-y+.6).rotate([90,0,0]);
};
p.push(stepped(-85.4,-74,-20.55,12.0,17.5),stepped(25.3,45.55,-22.65,14.0,18.35));
for(const [x,y,w,h]of [[-82.8,-20.7,3.0,19.3],[10,-20.6,2.4,16.4],[58,-20.6,2.4,16.4],[26,-22.7,2.4,19.2],[44.8,-22.7,2.4,19.2]]){
 p.push(box(x-w/2,y-.3,base,x+w/2,y+.7,h));
 for(const dx of [-w/2,w/2])p.push(box(x+dx-.45,y-.4,h-.3,x+dx+.45,y+.8,h+1.1));
 cuts.push(box(x-w*.3,y-.65,h-2.7,x+w*.3,y+.05,h-1.1));
}
p.push(box(-60.3,-7.8,base,7.9,-6.6,7.42),place(gableRoof(68.2,7.1,7.37,8.53),{at:[-26.2,-10.25,0]}));
// Recessed entrance arches: support-free solid masonry behind the glass.
const arch=(x,y,w,bottom,spring,top)=>{
 const q=[[x-w/2,bottom],[x+w/2,bottom],[x+w/2,spring]];
 for(let i=0;i<=12;i++){const a=i*Math.PI/12;q.push([x+w/2*Math.cos(a),spring+(top-spring)*Math.sin(a)]);}
 return prism(q,-y-.4,-y+.4).rotate([90,0,0]);
};
for(const [a,b,y]of [[-85,-63,-20.55],[8,25,-20.55],[25.5,45.3,-22.65],[45.8,60,-20.55]])for(let x=a+3;x<b-1;x+=6){cuts.push(arch(x,y,4.6,.6,3.9,5.6),box(x-1.4,y-.4,7.1,x+1.4,y+.4,10.9));p.push(box(x-3.1,y-.2,base,x-2.2,y+.45,12.5));}
for(let x=-57;x<7;x+=5.2)cuts.push(box(x-1.65,-7.1,1,x+1.65,-6.25,6.8));
// Long glass walls and arch-shaped end fascias: every side improves LoD2.
for(const [a,b,y,top]of [[-109,-60,-7,18.1],[-60,73,-7,15.4],[-125,-60,50,17.4],[-60,89.5,50,14.7]])for(let x=a+3;x<b-1;x+=5.2){cuts.push(box(x-2,y-.37,5.1,x+2,y+.37,top));p.push(box(x+2.05,y-.45,4.5,x+2.95,y+.45,top+.5));}
for(const [a,b,y]of [[-270,-125,13],[-270,-125,36],[89.5,129.4,13],[89.5,129.4,34]])for(let x=a+3;x<b-1;x+=6)cuts.push(box(x-2,y-.4,3.5,x+2,y+.4,7.7));
for(const [x,prof,dz]of [[-121.5,front,-2.68],[73,front,-2.70],[-125,rear,0],[89.5,rear,-2.70],[-270.2,small,0],[129.5,small,0]]){
 const q=[[prof[0][0]+.9,4.5],...prof.slice(1,-1).map(([y,z])=>[y,z+dz-1]),[prof.at(-1)[0]-.9,4.5]];
 cuts.push(prism(q,x-.36,x+.36).rotate([90,0,90]));
}
// Continuous skylights, brick dormers and chimneys, not loose glass sheets.
for(const [a,b]of [[-50,6],[44,69]])p.push(box(a,23.8,15.75,b,27.2,17.85),place(gableRoof(b-a,3.4,17.8,18.95),{at:[(a+b)/2,25.5,0]}));
for(const [a,b,y,z]of [[-80,-65,-18,13.3],[12,23,-18,13],[49,59,-18,13]])for(let x=a;x<b;x+=7){p.push(box(x-1.2,y-.9,z-1,x+1.2,y+.9,z+1),place(gableRoof(2.8,2.1,z+.95,z+1.8),{at:[x,y,0],deg:90}));}
for(const x of [-79,-67,13,53])p.push(box(x-.55,-11,12.0,x+.55,-9.7,17.4));
const shells=union(p).subtract(union(cuts)).decompose(),outer=shells.filter(s=>s.volume()>0);
if(outer.length!==1||shells.some(s=>s.volume()<-25))throw Error('Los bouwdeel/grote holte '+shells.map(s=>s.volume().toFixed(2)).join(','));
await writeLandmark({slug,base,nodes:[['building:stationsgebouw en samengestelde perronkappen',outer[0]]],catalog:{name:'Station Haarlem (Haarlem)',origin,xAxis,groundSamplePoints:[[-90,-25],[30,-27],[65,-25],[-45,-20]],groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0392100000039313'],description:'Stationsplein naar -Y, spooras -9.96 graden RD; twee bakstenen entrees, vier hoge gebogen kapvakken en beide lange uitlopers. Moderne Kennemerpleinbouw blijft PDOK.',realWorld:{groundNapM:ground,westMainRoofM:23.63,eastMainRoofM:20.93,westNorthRoofM:21.65,eastNorthRoofM:18.95,schattingen:['glas en spooropeningen als blinde nissen op volle kern; vensterritme, entreefrontons, dakdetails naar fotos','westelijke dakranden volgen BAG; oostelijke smalle kap als lage vlakke uitloper','moderne BAG 0392100000037572 aan Kennemerplein blijft apart, spoorstaal en rails onder .9m ontbreken']},sources:['PDOK BAG 0392100000039313, Actueel_orthoHR en AHN DSM/DTM .5m bbox 103760,489050,104360,489310; 2026-10-09','https://monumentenregister.cultureelerfgoed.nl/monumenten/19786','https://commons.wikimedia.org/wiki/File:Haarlem_station_buiten.jpg','https://commons.wikimedia.org/wiki/File:Haarlem_Central_Station_(1).jpg','https://commons.wikimedia.org/wiki/File:StationHaarlem-APR2018.jpg','https://commons.wikimedia.org/wiki/File:Achterzijde_-_Haarlem_-_20095942_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Station_Haarlem_2024_3.jpg']}});
