import {union,hull,prism,rect,circle,dome,writeLandmark} from './efteling-kit.mjs';
// Groate Kerk: lokaal X oost en Y noord langs de BAG-gevels.
// Maaiveld NAP +0,829 m; hoofdvolume, voorportiek en noordelijke achterbouw.
const B=-0.5, origin=[169411.75,587400], axis=[0.990149,0.140016];
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const roofed=(poly,planes)=>{let s=prism(poly,B,40);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Hall 30 x 12,6 m, schilddak met nok NAP +15,81 m en goot NAP +12,25 m.
let pieces=[roofed(rect(-15.39,-9.35,14.49,3.23),[[0,.57,16.74],[0,-.57,13.22],[.57,0,20.27],[-.57,0,19.72]])];
// Voorhal met driehoekig fronton onder de toren; de muur achter vier kolommen sluit de open portiek voor print.
pieces.push(roofed(rect(-6.2,-16.4,5.31,-8.9),[[.46,0,14.42],[-.46,0,14.01]]));
// Noordelijke, lage aanbouwen op de BAG-voetafdruk, met hun afzonderlijke schild- en zadeldaken.
pieces.push(roofed(rect(-4.21,3.1,3.29,12.0),[[.48,0,7.4],[-.48,0,6.96]]));
pieces.push(roofed(rect(-6.95,11.75,6.04,20.25),[[0,.49,1.46],[0,-.49,13.37],[.49,0,7.79],[-.49,0,7.35]]));
// Vier Dorische zuilen als reliëf verbonden met de dichte achterwand; diameter 1m.
for(const x of [-4.8,-1.9,1,3.9]) pieces.push(prism(circle([x,-16.36],.56,24),B,9.85));
// Ronde bovenbouw: vierkante klokgeleding en ronde lantaarn met koepel.
const tc=[-.45,-11.95];
pieces.push(box(-3.02,-14.45,2.12,-9.40,B,18.50));
pieces.push(prism(circle(tc,2.23,32),18.45,25.03));
pieces.push(dome(tc,[[2.23,24.98],[2.16,25.44],[1.94,25.99],[1.53,26.54],[.96,27.02],[.45,27.45],[0,27.7]],48));
let all=union(pieces);
// Rondboognissen in de buitengevels: 0,35 m diep en in werkelijkheid groter dan 0,9 m.
const niche=(x,y,w,z0,z1,ang=0,depth=.75)=>{const r=w/2,z=z1-r,pts=[[-r,z0],[r,z0],[r,z],[r*.866,z+r*.5],[r*.5,z+r*.866],[0,z1],[-r*.5,z+r*.866],[-r*.866,z+r*.5],[-r,z]];return hull(pts.flatMap(([u,v])=>[[u,0,v],[u,depth,v]])).rotate([0,0,ang]).translate([x,y,0])};
const cuts=[];
// Grote ronde ramen aan de voorzijde van de twee vleugels en achterzijde.
for(const x of [-10.4,9.5]){cuts.push(niche(x,-9.72,2.1,3.0,8.9));cuts.push(niche(x,2.85,2.1,3.0,8.9));}
// Zijgevels van de brede zaal.
for(const y of [-6.1,.0]){cuts.push(niche(-15.75,y,2,3.0,8.9,-90));cuts.push(niche(14.12,y,2,3.0,8.9,-90));}
// Drie deuren en bovenlichten tussen de vier kolommen in de voorhal.
for(const x of [-3.35,-.45,2.45]){cuts.push(box(x-.72,-16.75,x+.72,-16.06,.0,6.5));cuts.push(box(x-.63,-16.75,x+.63,-16.06,7.3,8.35));}
// Achterbouw: vier vensters, deur op de achterkant.
for(const y of [5.15,8.1,10.6]){cuts.push(niche(-4.57,y,1.1,1.3,4.5,-90));cuts.push(niche(2.92,y,1.1,1.3,4.5,-90));}
cuts.push(niche(-.45,19.9,1.4,0,3.1));
// Galmgaten van de vierkante klokkenkamer; blinde nissen.
cuts.push(niche(-.45,-14.8,3.3,15.0,17.6),niche(-.45,-9.78,3.3,15.0,17.6),niche(-3.4,-11.9,3.3,15.0,17.6,-90),niche(1.76,-11.9,3.3,15.0,17.6,-90));
// Acht lantaarnopeningen als niet-doorlopende nissen; onderlinge zuilen >= 0,9 m.
for(let k=0;k<8;k++){const a=k*Math.PI/4,c=Math.cos(a),s=Math.sin(a);const p=[];for(const t of [-.48,.48])for(const r of [1.90,2.55])for(const z of [19.35,24.45])p.push([tc[0]+r*c-t*s,tc[1]+r*s+t*c,z]);cuts.push(hull(p));}
// Wijzerplaten in vier gevelvlakken van de klokgeleding, ondiepe ronde nissen.
const disc=(x,y,z,angle)=>hull(Array.from({length:24},(_,k)=>{const a=2*Math.PI*k/24;return [[.55*Math.cos(a),0,z+.55*Math.sin(a)],[.55*Math.cos(a),.65,z+.55*Math.sin(a)]]}).flat()).rotate([0,0,angle]).translate([x,y,0]);
cuts.push(disc(-.45,-14.8,17.85,0),disc(-.45,-9.78,17.85,0),disc(-3.4,-11.9,17.85,-90),disc(1.76,-11.9,17.85,-90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'groate-kerk-st-jacobiparochie',base:B,nodes:[['building:kerk',all]],catalog:{name:'Groate Kerk St.-Jacobiparochie',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-16,-11],[14,-11],[-16,5],[14,5],[-7,21],[6,21]],replacesBuildings:['NL.IMBAG.Pand.0063100000002015'],description:'Neoclassicistische brede zaalkerk met schilddak, Dorisch fronton en vier aangehechte zuilen, vierkante klokgeleding, ronde lantaarn met blinde openingen, koepel en lagere achterbouwen.',realWorld:{groundNapM:.829,roofRidgeNapM:15.81,towerDomeTopM:27.7},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0063100000002015','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/9511','https://commons.wikimedia.org/wiki/Category:Groate_Kerk','https://groatekerk.nl/in-de-kerk/']}});

