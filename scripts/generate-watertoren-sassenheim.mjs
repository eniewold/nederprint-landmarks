import {circle,prism,hull,ring3,union,place,box,writeLandmark} from './efteling-kit.mjs';
const O=[95261.64,470115.4], BASE=-.5, PH=(22.5-3)*Math.PI/180;
const oct=(r)=>circle([0,0],r,8,PH);
const fr=(r0,r1,z0,z1)=>hull([...ring3(oct(r0),z0),...ring3(oct(r1),z1)]);
// Octagonal base, eight vertical ribs and a wider reservoir on a 45-degree collar.
const shaft=fr(4.25,4.25,BASE,16.2);
const shoulder=fr(4.25,5.3,16.2,17.6);
const reservoir=fr(5.3,5.3,17.6,34.0);
const ribs=[]; for(let k=0;k<8;k++){const a=PH+k*Math.PI/4, n=[Math.cos(a),Math.sin(a)],t=[-n[1],n[0]],q=(r,w)=>[r*n[0]+w*t[0],r*n[1]+w*t[1]];ribs.push(prism([q(3.9,-.52),q(4.7,-.52),q(4.7,.52),q(3.9,.52)],BASE,17));}
// Shallow horizontal slits in the reservoir. Sloped upper faces remain printable.
const cut=(z0,z1,w,rad,depth)=>hull([[rad-depth,-w/2,z0],[rad+1,-w/2,z0],[rad-depth,w/2,z0],[rad+1,w/2,z0],[rad-depth,-w/2,z1+depth],[rad-depth,w/2,z1+depth],[rad+1,-w/2,z1-1],[rad+1,w/2,z1-1]]);
const cuts=[];for(let k=0;k<8;k++){const ang=42+45*k; for(const h of [[18.8,19.8],[21,22],[30,31],[32,33]])cuts.push(place(cut(h[0],h[1],1.8,4.9,.42),{deg:ang})); }
const body=union([shaft,shoulder,reservoir,...ribs]).subtract(union(cuts));
await writeLandmark({slug:'watertoren-sassenheim',base:BASE,nodes:[['building:watertoren',body]],catalog:{name:'Watertoren Sassenheim',origin:O,xAxis:[1,0],groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1525100000062491'],description:'Achthoekige betonnen watertoren met acht hoekribben en verbrede reservoirkop.',realWorld:{groundNapM:-.312,ahnRoofNapM:33.895,modelHeightM:34,publishedHeightM:35},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1525100000062491','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://indeweer.blogspot.com/2023/09/watertoren-147-sassenheim.html','https://commons.wikimedia.org/wiki/File:Sassemheim_Watertoren.jpg']}});



