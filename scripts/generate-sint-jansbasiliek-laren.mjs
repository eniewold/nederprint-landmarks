import {union,hull,box,prism,place,circle,spire,gableRoof,writeLandmark} from './efteling-kit.mjs';
const BASE=-.5, ORIGIN=[144067.5,474261.5], ANGLE=5.0, AXIS=[Math.cos(ANGLE*Math.PI/180),Math.sin(ANGLE*Math.PI/180)];
const solids=[];
// Schip en koor, zijbeuken en dwarsbeuken als bouwdelen met zadeldaken.
const gabled=(x0,x1,y0,y1,eave,ridge)=>union([box(x0,y0,BASE,x1,y1,eave),place(gableRoof(x1-x0,y1-y0,eave-.02,ridge),{at:[(x0+x1)/2,(y0+y1)/2,0]})]);
solids.push(gabled(-20,29,-5.7,5.7,12.8,20.6));
solids.push(gabled(-19,12,-13.3,-5.3,9.5,13.6),gabled(-19,12,5.3,13.3,9.5,13.6));
const tran=place(gabled(-18,18,-5.5,5.5,11.5,17.0),{deg:90,at:[15,0,0]});solids.push(tran);
// Driezijdige koorsluiting, opgebouwd uit vlakken.
const choir=[[28,-6],[33,-4],[36,-1.8],[36,1.8],[33,4],[28,6]];
solids.push(prism(choir,BASE,12),hull([...choir.map(([x,y])=>[x,y,11.9]),[28,0,20.3],[32,0,19],[35,0,15]]));
// Achthoekige vieringkoepel met tentdak.
const cup=circle([15,0],6.3,8,Math.PI/8);solids.push(prism(cup,BASE,23.0),spire([15,0],6.3,22.9,26.0,8,Math.PI/8),prism(circle([15,0],1.0,8),25.9,26.7),spire([15,0],1.0,26.6,27.2,8));
// Tweelingtorens met steunberen en piramidedaken.
for(const y of [-6.8,6.8]){
 solids.push(box(-26,y-3.6,BASE,-18.8,y+3.6,34.2));
 solids.push(spire([-22.4,y],5.1,34.1,45.4,4,Math.PI/4));
 for(const x of [-26.3,-19.3])for(const yy of [y-3.8,y+3.1]) solids.push(box(x,yy,BASE,x+1,yy+1,31));
}
solids.push(gabled(-28,-20,-4.2,4.2,9.5,14.5));
// Aangesloten zuidelijke aanbouw behoort tot hetzelfde BAG-pand.
solids.push(gabled(-35,-15,-34,-20,7.2,11.4));
solids.push(box(-23,-21,BASE,-17,-12,6.5));
for(const x of [-13,-7,-1,5])for(const y of [-14.0,13])solids.push(box(x,y,BASE,x+1.0,y+1,9.6));
let all=union(solids);
const cut=(x,y,w,z0,z1,dir)=>place(hull([[-.4,-w/2,z0],[.8,-w/2,z0],[-.4,w/2,z0],[.8,w/2,z0],[-.4,-w/2,z1],[.8,-w/2,z1-1.2],[-.4,w/2,z1],[.8,w/2,z1-1.2]]),{at:[x,y,0],deg:dir});
const cuts=[];
for(const y of [-6.8,6.8])for(const z of [22,27])for(const off of [-1.2,1.2])cuts.push(cut(-26,y+off,1.1,z,z+3.5,180));
for(const x of [-12,-6,0,6]){cuts.push(cut(x,-13.3,1.4,4,8.5,270));cuts.push(cut(x,13.3,1.4,4,8.5,90));}
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-jansbasiliek-laren',base:BASE,nodes:[['building:kerk',all]],catalog:{name:'Sint-Jansbasiliek Laren',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:-.3,groundSamplePoints:[[-28,-18],[0,-19],[25,-20],[0,20]],replacesBuildings:['NL.IMBAG.Pand.0417100000006019'],description:'Kruisbasiliek met twee torens, zijbeuken, koorsluiting en achtkantige vieringkoepel.',realWorld:{groundNapM:5.137,ahnTopNapM:50.61,modelTopM:45.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0417100000006019','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/511274','https://commons.wikimedia.org/wiki/Category:Sint-Jansbasiliek,_Laren']}});


