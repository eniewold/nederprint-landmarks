// OV-terminal: drie gemeten dakgolven, analytische gebogen vlakken en BAG-voet.
import {Manifold,box,prism,union,writeLandmark} from './efteling-kit.mjs';
const slug='utrecht-centraal',base=-.8,origin=[136000,455710],xAxis=[.869,.495],ground=2.47,p=[],cuts=[];
// Gemeten extrema van het langsprofiel (NAP), geen DSM-pixels of hoogtelagen.
const crests=[[-133,22.55],[-107,26.75],[-67,21.25],[-8,27.92],[47,21.40],[87,26.75],[118,21.60]];
const centreHeight=x=>{
 let k=crests.findIndex(([a])=>a>x)-1;if(k<0)k=x>=118?crests.length-2:0;
 const [a,za]=crests[k],[b,zb]=crests[k+1],t=Math.max(0,Math.min(1,(x-a)/(b-a)));
 return za+(zb-za)*(1-Math.cos(t*Math.PI))/2;
};
// Parabolische dwarskromming, coefficient uit vijf AHN-dwarsprofielen.
const roofNap=(x,y)=>12+(centreHeight(x)-12)*(1-.00020*(y-12)**2);
const roofZ=(x,y)=>roofNap(x,y)-ground;
// Gesloten oppervlak: alleen triangulatie van continue vergelijkingen.
const xs=[...new Set([...Array.from({length:52},(_,i)=>-133+i*251/51),...crests.map(a=>a[0])])].sort((a,b)=>a-b);
const ys=Array.from({length:20},(_,i)=>-38+i*95/19),nx=xs.length,ny=ys.length,verts=[],tri=[];
for(const y of ys)for(const x of xs)verts.push(x,y,roofZ(x,y));
const bi=nx*ny;for(const [x,y]of [[xs[0],ys[0]],[xs.at(-1),ys[0]],[xs.at(-1),ys.at(-1)],[xs[0],ys.at(-1)]])verts.push(x,y,base);
for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=j*nx+i,b=a+1,c=a+nx,d=c+1;tri.push(a,b,d,a,d,c);}
// Four planar walls, subdivided at their top edge to share all vertices.
const edges=[Array.from({length:nx},(_,i)=>i),Array.from({length:ny},(_,j)=>j*nx+nx-1),Array.from({length:nx},(_,i)=>(ny-1)*nx+nx-1-i),Array.from({length:ny},(_,j)=>(ny-1-j)*nx)];
for(let k=0;k<4;k++){const e=edges[k],a=bi+k,b=bi+(k+1)%4;for(let i=0;i<e.length-1;i++)tri.push(a,e[i+1],e[i]);tri.push(a,b,e.at(-1));}
tri.push(bi,bi+2,bi+1,bi,bi+3,bi+2);
p.push(new Manifold({numProp:3,vertProperties:new Float32Array(verts),triVerts:new Uint32Array(tri)}));
// Katreinetoren has its own BAG; the terminal outline wraps around it.
const tower=[[47.8,-34.74],[47.9,-23.73],[54.26,-15.4],[87.96,-15.67],[87.85,-31.49],[85.06,-33.27],[85,-60],[47.8,-60]];
cuts.push(prism(tower,base-1,100));
// Glazed curtain walls: niches follow the roof, with 0.9 m mullions.
for(const y of [-38,57])for(let x=-130;x<115;x+=5){const h=Math.min(roofZ(x-1.9,y),roofZ(x+1.9,y))-1.25;cuts.push(box(x-1.9,y-.4,8.25,x+1.9,y+.4,h));}
for(const x of [-133,118])for(let y=-34;y<54;y+=5){const h=Math.min(roofZ(x,y-1.9),roofZ(x,y+1.9))-1.25;cuts.push(box(x-.4,y-1.9,8.25,x+.4,y+1.9,h));}
// Long platform-side plinth band and individual lower supports as relief.
for(const y of [-38,57])for(let x=-130;x<115;x+=7)cuts.push(box(x-2.7,y-.35,1.4,x+2.7,y+.35,6.6));
// North public passage is recessed into a solid print core, not an open flat span.
for(let x=-126;x<110;x+=5)cuts.push(box(x-1.9,56.6,8.1,x+1.9,57.4,13.0));
// Skylights measured on ortho: regular narrow strips recessed into local planes.
for(const [a,b]of [[-124,-88],[-52,29],[74,108]])for(let x=a;x<b;x+=5.1)for(const y of [-19,-3,13]){
 const slope=(roofZ(x,y+1)-roofZ(x,y-1))/2;
 const notch=box(-.55,-4.6,-.4,.55,4.6,.6).rotate([Math.atan(slope)*180/Math.PI,0,0]).translate([x,y,roofZ(x,y)]);
 cuts.push(notch);
}
// Long lowered daylight strip at the north shoulder of the central roof wave.
cuts.push(box(-48,28.3,22.2-ground,30,31.0,50));
// Platform stairs and sloping glazed stair hoods are supported wedges.
for(const x of [-116,-99,-77,-54,-31,-8,15,38,100]){
 p.push(prism([[-55,base],[-55,2.8],[-38,7.83],[-36,7.83],[-36,base]],x-2.8,x+2.8).rotate([90,0,90]));
 p.push(prism([[-55,base],[-55,4.1],[-38,11.9],[-36,11.9],[-36,base]],x-.75,x+.75).rotate([90,0,90]));
 for(let i=0;i<6;i++){const y=-54+i*2.6,z=3.0+i*.78;cuts.push(box(x-2.4,y,z-.3,x+2.4,y+.65,z+.2));}
}
// West arrival stair to Jaarbeursplein, supported and with printable coarse steps.
for(let i=0;i<8;i++)p.push(box(-156+i*3,-16,base,-130,26,1.0+i*.98));
const shells=union(p).subtract(union(cuts)).decompose(),outer=shells.filter(s=>s.volume()>0);
if(outer.length!==1||shells.some(s=>s.volume()<-25))throw Error('Los bouwdeel of grote holte '+shells.map(s=>s.volume().toFixed(2)).join(','));
await writeLandmark({slug,base,nodes:[['building:OV-terminal met drie dakgolven',outer[0]]],catalog:{name:'Utrecht Centraal (Utrecht)',origin,xAxis,groundSamplePoints:[[-155,-60],[-150,-65],[-160,-70]],groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0344100000139915','NL.IMBAG.Pand.0344100000148778'],description:'Lange terminalas 29.67 graden RD, Jaarbeurszijde naar -X; drie analytische dubbele dakgolven, blinde glasgevels, lichtstraten en perrontrappen. Katreinetoren, Stadskantoor, bollendak en perronkappen blijven apart.',realWorld:{groundNapM:ground,roofEnvelopeM:[251,95],roofCrestNapM:[26.75,27.92,26.75],roofTroughNapM:[21.25,21.40],schattingen:['analytische cosinusinterpolatie tussen gemeten langsprofielextrema en parabolische dwarskromming; geen hoogteveld','glasritme, trapkappen en grove aankomsttrap naar fotos; spooropeningen als blind reliëf op volle printkern','lichte noordstrook vereenvoudigd tot verlaagde daknis; ondergrondse tunnels blijven buiten vervanging']},sources:['PDOK BAG 0344100000139915 en 0344100000148778; AHN DSM/DTM .5m en Actueel_orthoHR bbox 135760,455460,136220,455980; 2026-10-09','https://www.benthemcrouwel.com/projects/utrecht-central-station','https://commons.wikimedia.org/wiki/File:Exterior_of_Utrecht_Centraal_(2019)_02.jpg','https://commons.wikimedia.org/wiki/File:Central_station_and_Stadskantoor_Utrecht_seen_from_Moreelsebrug.jpg','https://cms.benthemcrouwel.com/dynamic/images/483_OVT_Utrecht_Centraal_N58_a4.jpg','https://cms.benthemcrouwel.com/dynamic/images/483_OVT_Utrecht_Centraal_N19_a4.jpg']}});
