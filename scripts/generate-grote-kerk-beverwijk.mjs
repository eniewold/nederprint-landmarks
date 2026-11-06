import {union,hull,prism,rect,circle,box,spire,place,gableRoof,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[105478,500042], AX=[.99657,.08275], pieces=[];
const blockRoof=(x0,x1,y0,y1,eave,ridge)=>hull([[x0,y0,B],[x1,y0,B],[x1,y1,B],[x0,y1,B],[x0,y0,eave],[x1,y0,eave],[x1,y1,eave],[x0,y1,eave],[x0,(y0+y1)/2,ridge],[x1,(y0+y1)/2,ridge]]);
// Drie evenwijdige beuken, dakvlakken uit BAG en AHN in plaats van hoogteplakken.
pieces.push(blockRoof(8.8,48,-4.6,5.4,7.4,16.0));
pieces.push(blockRoof(8.7,48,5.3,16.2,7.4,15.6));
pieces.push(blockRoof(9,36.1,-11.3,-4.5,7.5,13.2));
// Sluitstuk tussen de kerk en de vrijstaande Wijkertoren.
pieces.push(blockRoof(3.5,9,-3,4,7.6,12.7));
// Toren, vierkante gemetselde romp en achtzijdige naald.
pieces.push(box(-4.9,-4.3,B,5.5,5.3,41.0));
pieces.push(spire([.3,.5],4.7,40.9,61.7,8,Math.PI/8));
for(const x of [-4.2,4.8])for(const y of [-3.6,4.6]){pieces.push(box(x-.48,y-.48,40.3,x+.48,y+.48,42.4),spire([x,y],.67,42.3,43.4,4,Math.PI/4));}
// Tegen de oostgevels een grafkapel en consistorie.
pieces.push(prism(circle([47.9,9.8],2.4,8,Math.PI/8),B,5.3),spire([47.9,9.8],2.4,5.2,7.4,8,Math.PI/8));
pieces.push(blockRoof(38.1,43.5,14.6,20.1,4.0,8.0));
pieces.push(blockRoof(38,43.5,-9.8,-4.3,4.2,11.0));
// Zuidelijke grafkapel en steunberen van de zijbeuken.
pieces.push(blockRoof(19.3,25.2,-16.1,-11.1,3.7,5.8));
for(const x of [10,15.2,20.2,25.3,30.4,35.6,40.8,46]){
 for(const [y,side] of [[-11.25,-1],[16.15,1]]) {if(side<0&&x>36) continue;const y0=side<0?y-1.0:y-.1,y1=side<0?y+.1:y+1.0;pieces.push(hull([[x-.5,y0,B],[x+.5,y0,B],[x-.5,y1,B],[x+.5,y1,B],[x-.5,y0,5.5],[x+.5,y0,5.5],[x-.5,y1,6.5],[x+.5,y1,6.5]]));}
}
let all=union(pieces);
// Steunloze blinde spitsboognissen; diepte circa 0,4 m.
const niche=(x,y,w,z0,z1,axis='y')=>{const za=z1-w/2;let h=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,za],[w/2,0,za],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,za],[w/2,1,za],[0,1,z1]]);if(axis==='x')h=h.rotate([0,0,90]);return h.translate([x,y,0]);};
const cuts=[];
for(const x of [12.5,17.6,22.7,27.8,32.9,38,43.1]){if(x<35) cuts.push(niche(x,-11.65,1.45,2.2,7.1));cuts.push(niche(x,15.8,1.45,2.2,7.1));}
// Galmgaten en blindnissen aan vier torenzijden.
for(const t of [-1.4,1.5]) {for(const [a,b] of [[26,34],[11,23]]){cuts.push(niche(-4.55,t,1.65,a,b,'x'),niche(5.9,t,1.65,a,b,'x'),niche(t,-4.65,1.65,a,b),niche(t,4.95,1.65,a,b));}}
cuts.push(niche(-4.55,.5,2.6,.1,5.0,'x'));
// Grote vensters in de oostelijke topgevels.
cuts.push(niche(48.4,.4,2.0,3,12,'x'),niche(48.4,10.7,2.0,3,12,'x'));
all=all.subtract(union(cuts));
await writeLandmark({slug:'grote-kerk-beverwijk',base:B,nodes:[['building:kerk',all]],catalog:{name:'Grote Kerk Beverwijk',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[0,-10],[0,10],[20,-20],[45,20]],replacesBuildings:['NL.IMBAG.Pand.0375100000017910'],description:'Driebeukige Grote Kerk met de vrijstaande Wijkertoren, tussenbouw, steile spits, grafkapellen en gevelnissen.',realWorld:{groundNapM:3.198,ahnTopNapM:64.907,modelTopM:61.7},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0375100000017910','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/9448','https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Beverwijk']}});
