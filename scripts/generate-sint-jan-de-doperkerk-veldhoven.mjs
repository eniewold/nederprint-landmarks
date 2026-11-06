import {Manifold,union,hull,prism,rect,circle,ring3,spire,box,place,gableRoof,hipRoof,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[153768,381416], AX=[-.12,-.9927739];
const solids=[];
const roofed=(poly,planes)=>{let s=prism(poly,B,90);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const ridgeY=(y,z,k)=>[[0,k,z-k*y],[0,-k,z+k*y]];
const ridgeX=(x,z,k)=>[[k,0,z-k*x],[-k,0,z+k*x]];
// Middenbeuk en driezijdig gesloten koor, dakvlakken uit LoD2.2 en AHN.
const nave=[[-.5,-3.7],[28.7,-3.7],[33,-1.7],[33,2.7],[28.7,4.7],[-.5,4.7]];
solids.push(roofed(nave,[...ridgeY(.5,16.8,1.18),[-1.18,0,16.8+1.18*29.5]]));
// Zijbeuken met lessenaarsdaken.
for(const side of [-1,1]){const y0=side<0?-7.15:3.5,y1=side<0?-2.5:8.15;const k=.62;solids.push(roofed(rect(1.3,y0,27,y1),[[0,side<0?k:-k,side<0?12.2:12.82]]));}
// Transept met driehoekige sluitingen en steil schilddak.
const cross=[[15.6,-7.1],[17.9,-9.25],[21.2,-9.25],[23.4,-7.1],[23.4,8],[21.2,10.1],[17.7,10.1],[15.6,8]];
solids.push(roofed(cross,[...ridgeX(19.5,16.8,1.18),[0,1.18,16.8+1.18*5.2],[0,-1.18,16.8+1.18*6.2]]));
// Vierkante toren, geledingen in de wand en achtzijdige naald.
solids.push(box(-3.1,-3.2,B,3.1,4.2,23.6));
solids.push(spire([0,.5],3.5,23.5,43.6,8,Math.PI/8));
// Vier pinakels op de torenhoeken, minstens 0,9 m dik.
for(const x of [-2.45,2.45]) for(const y of [-2.55,3.55]) { solids.push(box(x-.45,y-.45,22.8,x+.45,y+.45,24.4),spire([x,y],.64,24.3,25.4,4,Math.PI/4)); }
// Vieringtorentje: dikker gemaakt dan de open constructie voor de schaal.
solids.push(prism(circle([19.5,.5],1.0,8),15.5,19.4));
solids.push(spire([19.5,.5],1.05,19.3,25.2,8));
// Voorste zijkapellen met schild en laag bijgebouw aan het koor.
for(const y of [-5.35,6.35]){const poly=circle([.9,y],2.0,5,Math.PI/2);solids.push(prism(poly,B,5.0),spire([.9,y],2.0,4.9,7.2,5,Math.PI/2));}
solids.push(box(27,-8.3,B,32.5,-3.4,4.4),place(gableRoof(5.5,4.9,4.35,7.5),{at:[29.75,-5.85,0]}));
solids.push(box(27,4.2,B,32.5,11.0,4.2),place(gableRoof(5.5,6.8,4.15,7.2),{at:[29.75,7.6,0]}));
// Steunberen, aan elke travee en rond het transept.
for(const x of [2.5,7,11.5,16])for(const s of [-1,1]) {const y=s<0?-7.65:8.65;solids.push(roofed(rect(x-.5,y-.55,x+.5,y+.55),[[0,s<0?1.2:-1.2, s<0?16:18]]));}
// Trapspil met spitsdak aan de toren.
solids.push(prism(circle([1.3,4.3],1.35,8),B,12),spire([1.3,4.3],1.4,11.9,14,8));
let all=union(solids);
// Blinde spitsboognissen met 45° bovenvlak: kerkgevels en galmgaten.
const niche=(x,y,w,z0,z1,axis='y')=>{const z2=z1-w/2;const pts=[[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z2],[w/2,0,z2],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z2],[w/2,1,z2],[0,1,z1]];let h=hull(pts);if(axis==='x')h=h.rotate([0,0,90]);return h.translate([x,y,0]);};
const cuts=[];
for(const x of [4.5,9,13.5,25.5]){cuts.push(niche(x,-7.5,1.3,2.2,5.8),niche(x,7.75,1.3,2.2,5.8),niche(x,-4.0,1.3,8.3,12.6),niche(x,4.4,1.3,8.3,12.6));}
for(const x of [18.3,20.6]) cuts.push(niche(x,-9.6,1.35,3,11),niche(x,9.75,1.35,3,11));
for(const y of [-1.6,1.3]) {cuts.push(niche(-2.9,y,1.25,15.3,19.7,'x'),niche(3.5,y,1.25,15.3,19.7,'x'));}
for(const x of [-1.5,1.5])cuts.push(niche(x,-3.5,1.2,15.3,19.7),niche(x,3.9,1.2,15.3,19.7));
cuts.push(niche(-2.9,.5,2.1,1,5.8,'x'),niche(-2.9,.5,2.1,7,13,'x'));
all=all.subtract(union(cuts));
for(const c of all.decompose())console.log('piece',c.volume(),c.boundingBox());
await writeLandmark({slug:'sint-jan-de-doperkerk-veldhoven',base:B,nodes:[['building:kerk',all]],catalog:{name:'Sint-Jan de Doperkerk Veldhoven',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[0,-12],[10,-12],[20,13],[35,0]],replacesBuildings:['NL.IMBAG.Pand.0861100000366307'],description:'Neogotische kruisbasiliek met toren, naaldspits, zijbeuken, driezijdig gesloten dwarsschip en koor, vieringtoren en zijkapellen.',realWorld:{groundNapM:22.57,ahnTopNapM:65.914,modelTopM:43.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0861100000366307','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/507725','https://commons.wikimedia.org/wiki/Category:St._Jan_de_Doperkerk_(Veldhoven)']}});
