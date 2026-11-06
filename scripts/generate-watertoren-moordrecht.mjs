// Watertoren Moordrecht (1924): vierkante schacht met verticale vensters,
// geleed reservoir en kleinere bekroning met wijzerplaten. Maten uit BAG/AHN.
import { Manifold, union, hull, box, place, writeLandmark } from './efteling-kit.mjs';
const BASE=-.5, ORIGIN=[105697.02,443998.31];
// De schacht en de twee sprongen van het reservoir hebben benoemde bouwdelen.
const body=box(-5.3,-5.3,BASE,5.3,5.3,22.0);
const middle=box(-4.95,-4.95,21.9,4.95,4.95,26.7);
const crown=box(-3.9,-3.9,26.6,3.9,3.9,33.0);
// Een schuin ondersteunde lijst voorkomt losse horizontale overhang.
const ledge=hull([[-4.95,-4.95,25.8],[4.95,-4.95,25.8],[4.95,4.95,25.8],[-4.95,4.95,25.8],[-5.1,-5.1,26.05],[5.1,-5.1,26.05],[5.1,5.1,26.05],[-5.1,5.1,26.05],[-5.1,-5.1,26.7],[5.1,-5.1,26.7],[5.1,5.1,26.7],[-5.1,5.1,26.7]]);
// Lage bijbouw is als deel van het pand aan de westzijde opgenomen.
const annex=box(-9.1,-2.55,BASE,-5.0,-.8,3.0);
let all=union([body,middle,crown,ledge,annex]);
// De schuine bovenzijde van de blinde nis blijft binnen 45° printbaar.
const cut=(r,t,w,z0,z1,d=.35)=>hull([[r-d,t-w/2,z0],[r+.3,t-w/2,z0],[r-d,t+w/2,z0],[r+.3,t+w/2,z0],[r-d,t-w/2,z1+2*d],[r+.3,t-w/2,z1],[r-d,t+w/2,z1+2*d],[r+.3,t+w/2,z1]]);
const cuts=[];
// Zes hoge glasstroken per gevel, in twee hoogtezones.
for(const a of [0,90,180,270]){
 for(const t of [-3.5,-2.2,-.9,.9,2.2,3.5])for(const [z0,z1] of [[4.8,9.2],[14.0,20.1]]) cuts.push(place(cut(5.3,t,.9,z0,z1,.35),{deg:a}));
 // Klokvlak en slanke nissen onder de daklijst: wijzers zijn te klein.
 cuts.push(place(cut(3.9,0,2.4,28.4,30.8,.4),{deg:a}));
 for(const t of [-2.6,2.6])cuts.push(place(cut(3.9,t,.9,27.4,31.4,.35),{deg:a}));
 for(const t of [-3.3,-2.2,-1.1,0,1.1,2.2,3.3])cuts.push(place(cut(4.95,t,.9,22.5,25.0,.32),{deg:a}));
}
cuts.push(place(cut(5.3,0,1.5,0,2.5,.35),{deg:270}));
all=all.subtract(union(cuts));
await writeLandmark({slug:'watertoren-moordrecht',base:BASE,nodes:[['building:watertoren',all]],catalog:{name:'Watertoren Moordrecht',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:-.3,groundSamplePoints:[[8,0],[-10,0],[0,8],[0,-8]],replacesBuildings:['NL.IMBAG.Pand.1892100000640291'],description:'Vierkante toren met smalle vensterstroken, geleed reservoir, klokgeleding en lage westaanbouw; RD-oorsprong op toren as.',realWorld:{groundNapM:4.018,ahnTopNapM:37.82,modelTopM:33.0},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1892100000640291','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/511045','https://commons.wikimedia.org/wiki/Category:Watertoren_(Moordrecht)']}});
