// The Rock, Erick van Egeraat 2009. Voorbeelden Evoluon en NEMO gelezen.
// Vaste bouwdelen en doorgaande gevelvlakken, geen AHN-hoogtelagen.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='the-rock',ORIGIN=[119761,483431],ANGLE=3.2,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=.17,BASE=-.7,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const foot=[[-27.34,3.06],[-23.18,-18.1],[-21.84,-24.86],[-20.08,-33.74],[7.42,-27.03],[19.11,-28.17],[19.16,17.12],[-21.69,17.12],[-21.72,2.57]];
const middle=[[-21.7,17.12],[-21.0,-18.4],[-11.0,-19.68],[-7.29,-20.27],[.2,-23.92],[5.51,-23.02],[9,-27.2],[19.11,-28.17],[19.16,17.12]];
const crown=[[-20.63,-18.39],[-15.72,-20.56],[-10.98,-19.68],[-10.35,-15.86],[13.11,-13.14],[15.94,-13.67],[15.42,2.56],[13.64,4.39],[19.14,5.14],[19.15,17.1],[-18.42,17.11],[-18.69,10.83],[-20.09,10.84],[-20.99,-12.32]];
function niche(a,b,s0,s1,h0,h1,d=.38,sloped=false){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-d],[s1,-d],[s1,.5],[s0,.5]].map(([s,k])=>[a[0]+s*t[0]+k*n[0]+(sloped&&a[0]<0?Math.max(0,(z(62.57)-h)/(62.57-28.5)):0),a[1]+s*t[1]+k*n[1]+(sloped&&a[1]<0?3*Math.max(0,(z(62.57)-h)/(62.57-28.5)):0),h])));}
function windows(body,poly,first,top,stone=false){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);let row=0;for(let h=first;h+2<top-.6;h+=3.6,row++)for(let s=.7;s+1.8<L-.5;s+=stone?3.0:2.9){const width=stone?1.5+((row+Math.floor(s)+i)%3)*.4:1.8;cuts.push(niche(a,b,s,Math.min(s+width,L-.3),h+(stone?((row+i)%2)*.35:0),h+2.4,.38,false));}}return body.subtract(union(cuts));}
// Glazen voet en geroteerde/verschoven middensectie op gemeten dakniveaus.
let lower=windows(prism(foot,BASE,z(30.177)),foot,1.5,29.8);
const middleBottom=middle.map(([u,v])=>[u+(u<0?1:0),v+(v<0?3:0)]);
let glass=windows(prism(middle,z(28.5),z(62.57)),middle,32,62.2);
let stone=windows(prism(crown,z(60.8),z(87.702)),crown,63,87.5,true);
// Rotsachtige voorhangende stroken van natuursteen, als vier verbonden
// schuine facetten. Onderste knik uit foto geschat, bovenrand uit dakcontour.
const facets=[];for(const [u0,u1,h] of [[-18.4,-12.0,60.8],[-12.0,-5.0,65],[-5,3,61.5],[3,10.8,66.5]])facets.push(Manifold.hull([...ring3(rect(u0,16.65,u1,17.35),z(h)),...ring3(rect(u0,16.65,u1,18.25),z(h+1.1)),...ring3(rect(u0,16.65,u1,18.25),z(87.702))]));
// Wisselend steengevelritme ook op de facetten, geen gladde fotoloze kroon.
let crownFacets=union(facets);const cuts=[];for(let row=0;row<7;row++)for(let u=-17.5;u<10;u+=3.0)cuts.push(B(u,17.85,u+1.7+(row%2)*.4,18.6,64+row*3.3,66+row*3.3));crownFacets=crownFacets.subtract(union(cuts));
const machines=B(-12.1,-8.62,12.0,7.57,87.6,90.247);
const glazedRoof=Manifold.hull([...ring3(rect(-12.36,2.62,-3.0,11.1),z(87.6)),...ring3(rect(-12.36,2.62,-3.0,11.1),z(89.173))]);
// Twee dubbele hoge glasentrees, huidige gebouwindeling na renovatie.
const entranceCuts=[B(-5,-32.5,5,-26.6,1.0,7.4),B(-5,16.65,5,17.7,1.0,7.4)];
// Zuidingang is een blinde terugliggende nis, niet een vrij dak op dunne poten.
let model=union([lower,glass,stone,crownFacets,machines,glazedRoof]).subtract(union(entranceCuts)).trimByPlane([0,0,1],BASE);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:the-rock-glasvoet-verschoven-volume-en-natuursteenkroon',model]],catalog:{name:'The Rock',origin:ORIGIN,xAxis:AXIS,groundHeight:43.18035577,groundOffsetMetres:0,groundSamplePoints:[[119789,483421],[119757,483383],[119728,483417]].map(local),replacesBuildings:['NL.IMBAG.Pand.0363100012114135'],description:'Glazen voet en verschoven doorlopende middenvlakken, gearticuleerde natuursteenkroon met wisselend vensterritme en schuine voorhangende facetten, hoge noord/zuidingangen, glazen dakzone en gemeten dakinstallatie. Gevelas3.2graden.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,lowerRoofNapM:30.177,middleRoofNapM:62.57,crownRoofNapM:87.702,plantRoofNapM:90.247,glazedRoofNapM:89.173,estimates:['gevelovergangen en uitstekende steenfacetten vanaf60.8Ã¢â‚¬â€œ66.5NAP uit bronfotoÃ¢â‚¬â„¢s, circa1Ã¢â‚¬â€œ2m onzeker; geen glasrots op steenvoet maar natuursteen boven glas','raamritme3.6m (gebouwbron), gemengde venstervormen en.38m blinde nissen uit fotos geschat','noord/zuidingang en glazen dakzone vereenvoudigd; verticale atriumruimte niet inwendig uitgehold','dunne aluminiumprofielen en steenlamellen onder.9m samengevoegd; dakmachines gesloten hoofdvolume']},sources:['https://www.archdaily.com/183612/the-rock-erick-van-egeraat (tekst door architect)','https://therock-zuidas.nl/ (gebouwbeheerder, renovatie2024,laagsteek3.6m)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012114135 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:Amsterdam-TheRock.jpg (Choinowski CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:The_Rock_Amsterdam_2010.jpg (IKÃ¢â‚¬â„¢s World Trip CC BY2.0)','https://commons.wikimedia.org/wiki/File:Zuidas_Mahler_39.jpg (MrAronymous CC BY-SA4.0)']}});
