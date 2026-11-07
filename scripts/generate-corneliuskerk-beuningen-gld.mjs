import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
// Kerkas in +X naar het koor; oorsprong bij de westtoren.
const B=-.5,origin=[181568,430646],axis=[.976,-.219],ground=9.093;
const roofed=(poly,planes,z=60)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Driebeukige basiliek: hoog middenschip en lagere zijbeuken, vijfzijdig koor.
const cy=.52,nave=roofed(rect(2.3,-4.1,33.0,5.1),[[0,1.16,19.84-1.16*cy],[0,-1.16,19.84+1.16*cy]]);
const south=roofed(rect(4,-8.52,33,-4),[[0,1.12,14.7+1.12*4]]),north=roofed(rect(4,5,33,9.56),[[0,-1.12,14.7+1.12*5]]);
const choir=roofed([[32.5,-7.9],[35.3,-7.9],[40.8,-3.7],[43,-1.6],[43.25,2.1],[40.5,5.3],[33,5.3]],[[0,1.16,19.84-1.16*cy],[0,-1.16,19.84+1.16*cy],[-1.16,0,19.84+1.16*38.4]]);
const annex=roofed(rect(39.8,5.0,47.8,11.65),[[0,-1.05,9.8+1.05*5.0]]);
// Westtoren met oude kern, vier hoekaccenten en ingesnoerde spits.
const tower=prism(rect(-3.15,-3.05,2.4,4.1),B,27.0),centre=[-.35,.52];
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]),oct=(c,r)=>circle(c,r,8,Math.PI/8);
const spire=union([loft(rect(-3.15,-3.05,2.4,4.1),26.9,oct(centre,1.65),28.0),loft(oct(centre,1.65),28.0,oct(centre,.45),50.76)]);
const accents=[];for(const x of [-2.65,1.9])for(const y of [-2.55,3.6])accents.push(prism(rect(x-.5,y-.5,x+.5,y+.5),B,28.2));
// Vieringruiter boven het koor: AHN top NAP +38,46.
const small=[30,.52],ruiter=union([loft(oct(small,1.0),19.2,oct(small,.55),20.1),loft(oct(small,.55),20.0,oct(small,.45),29.37)]);
for(const x of [7,12.6,18.2,23.8,29.3])for(const sign of [-1,1]){const y=sign<0?-8.52:9.56;accents.push(roofed(rect(x-.5,Math.min(y,y+sign*.9),x+.5,Math.max(y,y+sign*.9)),[[0,-sign,8.8+sign*y]],10));}
let all=union([nave,south,north,choir,annex,tower,spire,ruiter,...accents]);
const niche=(x,y,w,z0,z1,angle=0,depth=.85)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [9.8,15.4,21,26.6])cuts.push(niche(x,-8.67,1.25,2.5,8),niche(x,8.86,1.25,2.5,8));
for(const x of [9.8,15.4,21,26.6])cuts.push(niche(x,-4.25,1.0,15.0,17.8),niche(x,4.4,1.0,15.0,17.8));
for(const x of [-1.85,-.35,1.15])cuts.push(niche(x,-3.2,.9,22.8,26.2),niche(x,3.4,.9,22.8,26.2));
for(const y of [-1.8,-.35,1.1])cuts.push(niche(-2.4,y,.9,22.8,26.2,90));
cuts.push(niche(-2.4,.5,1.4,0,3.4,90),niche(-2.4,.5,1.2,7,12,90),niche(43.4,.52,1.1,3,9.5,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'corneliuskerk-beuningen-gld',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Corneliuskerk Beuningen Gld',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-5,-5],[-5,6],[12,-11],[30,-11],[49,8],[20,12]],replacesBuildings:['NL.IMBAG.Pand.0209100000011088'],description:'Neogotische basiliek met twee zijbeuken, veelhoekig koor, kleine dakruiter en westtoren met ingesnoerde naaldspits.',realWorld:{groundNapM:ground,naveRidgeM:19.84,towerTopM:50.76,roofTurretTopM:29.37},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0209100000011088','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.monumenten.nl/monument/523147','https://commons.wikimedia.org/wiki/Category:Corneliuskerk,_Beuningen']}});
