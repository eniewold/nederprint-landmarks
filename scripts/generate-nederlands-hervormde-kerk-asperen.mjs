import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
// +X langs de kerk naar het koor; oorsprong in de westtoren.
const B=-.5,origin=[136008,432530],axis=[.988,.154],ground=4.032;
const roofed=(poly,planes,z=60)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Pseudobasilicaal schip met lagere zijbeuken, dwarsschip en vijfzijdig koor.
const cy=-1.65,nave=roofed(rect(4.4,-5.6,29,2.3),[[0,1.55,19.3-1.55*cy],[0,-1.55,19.3+1.55*cy]]);
const south=roofed(rect(4.4,-11.5,29,-5.4),[[0,1.05,13.2+1.05*5.4]]),north=roofed(rect(4.4,2.1,29,8.1),[[0,-1.05,13.2+1.05*2.1]]);
const transept=roofed(rect(28,-16.15,38.6,11.5),[[1.45,0,19.3-1.45*33.3],[-1.45,0,19.3+1.45*33.3]]);
const choir=roofed([[38.2,-7.6],[50.4,-7.8],[53,-6.4],[54.7,-4.2],[54.7,-1],[52.5,1.9],[50.4,2.3],[38.2,2.4]],[[0,1.48,19.1-1.48*(-2.7)],[0,-1.48,19.1+1.48*(-2.7)],[-1.48,0,19.1+1.48*50.0]]);
// Vierkante Kempische toren; de 3D BAG heeft een apart BAG-pand voor de toren.
const tower=prism(rect(-2.85,-6.08,4.65,3.15),B,40.2),centre=[.9,-1.45];
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]),sq=r=>rect(centre[0]-r,centre[1]-r,centre[0]+r,centre[1]+r),oct=r=>circle(centre,r,8,Math.PI/8);
const crown=union([loft(sq(2.7),40.1,sq(1.8),41.3),prism(sq(1.8),41.25,45.5),loft(sq(1.8),45.4,oct(.45),50.81)]);
const pillars=[];for(const x of [-2.45,4.2])for(const y of [-5.7,2.75])pillars.push(prism(rect(x-.55,y-.55,x+.55,y+.55),B,41.6));
// Steunberen met schuine afdekking.
for(const x of [10,15.5,21,26])for(const sign of [-1,1]){const y=sign<0?-11.5:8.1;pillars.push(roofed(rect(x-.5,Math.min(y,y+sign),x+.5,Math.max(y,y+sign)),[[0,-sign,8.5+sign*y]],10));}
let all=union([nave,south,north,transept,choir,tower,crown,...pillars]);
const niche=(x,y,w,z0,z1,angle=0,depth=.85)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [12.8,18.3,23.8])cuts.push(niche(x,-11.65,1.4,2.5,8),niche(x,7.4,1.4,2.5,8));
cuts.push(niche(33.3,-16.3,2.0,3,12),niche(33.3,10.8,2.0,3,12));
for(const y of [-4.8,-1.5,1.7])for(const z of [6,17,29])cuts.push(niche(-2.15,y,1.05,z,z+7,90));
for(const x of [-1.3,.9,3.1])for(const z of [6,17,29])cuts.push(niche(x,-6.23,1.05,z,z+7));
// Blinde openingen in het lantaarnlichaam behouden herkenning zonder los maaswerk.
for(const y of [-2.1,-.8])cuts.push(niche(-.2,y,.8,41.8,44.8,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'nederlands-hervormde-kerk-asperen',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Nederlands Hervormde Kerk Asperen',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-6,-8],[-6,5],[15,-14],[30,-18],[57,-2],[35,14]],replacesBuildings:['NL.IMBAG.Pand.0733100000008035','NL.IMBAG.Pand.0733100000006544'],description:'Laatgotische kruiskerk met pseudobasilicaal schip, dwarsschip en vijfzijdig koor; Kempische westtoren met hoekaccenten en lantaarn.',realWorld:{groundNapM:ground,naveRidgeM:19.3,towerTopM:50.81},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0733100000008035','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0733100000006544','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.monumenten.nl/monument/8397','https://commons.wikimedia.org/wiki/Category:Sint-Catharinakerk,_Asperen']}});
