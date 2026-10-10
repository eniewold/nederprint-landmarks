// Spoorbrug Buggenum (Buggenum): twee parallelle vakwerkbruggen, vier gebogen velden per spoor.
// Broncontouren BGT, dekhoogten AHN; onderbouwschattingen in README.
import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const wasm=await Module();wasm.setup();const {Manifold,CrossSection,Mesh}=wasm;
const args=process.argv.slice(2),flag=(s,d)=>args.indexOf(s)>=0?args[args.indexOf(s)+1]:d;
const scale=Number(flag('--scale','1000')),mmPerMetre=1000/scale;
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),'spoorbrug-buggenum');
const WATER_NAP=14.65,SLAB=1.5,ROAD_LAYER=.5;
const ccw=r=>r.reduce((a,p,i)=>a+p[0]*r[(i+1)%r.length][1]-p[1]*r[(i+1)%r.length][0],0)>0?r:[...r].reverse();
const section=r=>new CrossSection([ccw(r)]).simplify(.02),prism=(r,z,h)=>section(r).extrude(h).translate([0,0,z]);
const union=ss=>Manifold.union(ss.filter(s=>!s.isEmpty()));
const rect=(a,b,c,d)=>[[a,b],[c,b],[c,d],[a,d]];
const ORIGIN=[196617.8, 359621.8];
const AXIS=[0.7199425000503346, -0.694033714326094];
const DECK_RINGS=[[[-133.4387335558963,-6.993586132803309],[-130.00859761433492,-6.988544079880393],[-127.05440716719917,-6.98256058978114],[-124.82445753849036,-6.9788655397056365],[-119.78035292544315,-6.96944998216317],[-116.14729844269792,-6.967418851913169],[-68.97794519155148,-6.87696518473011],[-64.37798456255108,-6.867898125747595],[-19.906136814100478,-6.9012873536668975],[-16.423119262813202,-6.904993749386877],[-4.48172580068241,-6.910925252616049],[-3.8145622065966607,-6.935879985393913],[-2.388807824319199,-6.936544469571648],[0.42804556850988845,-6.93794566073384],[0.6860005513800348,7.37157135512708],[-2.3886369618034706,7.353650349636284],[-4.8012486100654925,7.339157770824785],[-16.009393717268967,7.414399085960532],[-19.998847932364622,7.414655041032482],[-64.40405743725132,7.45672438954105],[-69.00476391755046,7.445549320632209],[-116.24742565457801,7.445549320632212],[-119.41224674007167,7.446254191983498],[-124.49506729188143,7.446741971445873],[-127.00922613968122,7.448254587300973],[-130.2094225393317,7.448193202116941],[-133.300944537226,7.473722330997462],[-144.34412628900077,7.481583446046131],[-144.38525225286702,-6.998104591174093],[-133.4387335558963,-6.993586132803309]],[[144.19477881916438,-6.793545414207412],[144.24744105088763,7.273618787925976],[132.96804754497367,7.2815647415513975],[130.57294219230013,7.257557457499571],[128.08284684894062,7.2600436002169895],[126.54253448454571,7.261392719797395],[121.69672335572534,7.266731623069901],[119.76604992102241,7.269575662651493],[69.99405872609647,7.253685618081583],[62.794691639373035,7.263959382946069],[15.352281631302596,7.324197479106052],[12.845757154380381,7.3177907274818015],[3.807325188438435,7.390051346908516],[2.245595910542496,7.380477288536875],[0.6860005513800348,7.37157135512708],[0.42804556850988845,-6.93794566073384],[2.2300471676834808,-6.9384320008141325],[4.008705204930101,-6.939197834029646],[12.739802667135153,-6.917423870356441],[15.084232551664902,-6.918655384385323],[62.81433295437621,-6.909906258371325],[70.01408867290532,-6.898970380062516],[119.68929827607347,-6.79997604254344],[121.505439637404,-6.800721470481218],[126.30111938258102,-6.801605671321332],[128.1144327914727,-6.80229928164631],[130.5083777522758,-6.803023626955447],[132.94191404706893,-6.804473418264632],[144.19477881916438,-6.793545414207412]]];
const ROAD_FOOTPRINTS=[{"id":"L0004.62feeaefc2a24abf8904dae59acb277b","rings":[[[-113.84601650809358,4.417055947473699],[-133.21545257190638,4.458668082090369],[-133.79518281978545,4.469290684216447],[-133.78634775452323,1.863710145920915],[-133.35449461056373,1.8494321189238296],[-124.74040545814569,1.8153575781993234],[-109.35522855924555,1.7873434919830555],[-96.5982244057622,1.791220157537648],[-90.31837680420442,1.8126468080220932],[-76.15120341915429,1.775832709581224],[-63.132126902634695,1.7628844975679954],[-51.67734852853107,1.7545538069311546],[-37.26753022087062,1.759970521178931],[-23.317979628939412,1.7342162568392616],[-3.8415885415112974,1.7401501307801324],[0.5849138677672694,1.7389582419976428],[5.066587258217876,1.7381698867295],[16.614045846282096,1.7316771111677853],[30.938818310777226,1.727336542862592],[57.14639490524808,1.7230886027361474],[69.82567668101377,1.6923209036207296],[83.04307259056661,1.6955411286419126],[97.36308495068772,1.6629987624008968],[108.24576744772848,1.657371306432489],[117.20633809378269,1.6586743659276648],[130.37827949417965,1.6514118623337293],[133.13402650786264,1.673054334685556],[133.55230988295105,1.6901428722582743],[133.59746500169328,4.308878638853209],[133.13931079941827,4.315859109229208],[120.9064309668524,4.315816012579455],[110.51524770265479,4.3202170347068805],[92.78882609115682,4.330309184092264],[74.62661480898194,4.332827501145235],[47.855581647461065,4.348107080523824],[21.85827847185504,4.364768292446687],[13.643391466535222,4.378090827146747],[0.6316384154229161,4.3661519570848295],[-5.212264062722805,4.360782996230691],[-47.87337277031099,4.3687728932076],[-86.47083787824857,4.334128359239142],[-113.84601650809358,4.417055947473699]]],"attributes":{"bgt_functie":"spoorbaan","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":null}},{"id":"L0004.6e33b84661044e2c947468527eaa98a2","rings":[[[-98.00678026509476,-2.2099122310602115],[-108.77603375957439,-2.1893897633528567],[-133.39301115331224,-2.182461787899411],[-133.81875304126535,-2.220630424778795],[-133.78233248539615,-4.826009196296961],[-133.23756301108278,-4.814774435585827],[-119.54263177287275,-4.841521023374554],[-91.86402764853108,-4.845848552601133],[-70.83226272530085,-4.868414342936124],[-45.1006316252766,-4.8717208459064265],[-32.68216368910251,-4.894173433475261],[-22.19914969730404,-4.904500455334626],[0.46506922330992484,-4.917373650384656],[3.209783920369668,-4.9188674696732155],[11.75181760694528,-4.9098954095826555],[25.454849574175448,-4.919109793017626],[36.442860344797616,-4.927374441642747],[50.25217370721396,-4.9258061981117445],[67.38243593720881,-4.934168639691004],[84.57835738047909,-4.948684756566529],[96.11026223022755,-4.954892535527216],[112.64433916999518,-4.962939245521296],[128.60667745225288,-4.987384354197919],[133.1206705288167,-4.961183120950593],[133.57193621147252,-4.958136213879026],[133.57770176298263,-2.3662604918289034],[133.1260270432629,-2.353033718051976],[119.53837663582618,-2.3381540314754505],[104.85898113815969,-2.3117566196177908],[91.48972528388572,-2.3044147809750046],[69.78078979440141,-2.3012661014829714],[47.95902120440784,-2.2804909807562184],[21.872197077966753,-2.2862351109876857],[10.493851145802573,-2.2750615661000473],[0.5123119466595858,-2.2619004110038023],[-17.756278862275707,-2.236923325534605],[-42.37592875571879,-2.2214596752527638],[-63.48024691520772,-2.2216101324802775],[-86.99442099338938,-2.2016496144668514],[-98.00678026509476,-2.2099122310602115]]],"attributes":{"bgt_functie":"spoorbaan","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":null}},{"id":"L0004.b4017ce563684f3cb32ef8e6954dbae0","rings":[[[-133.21545257190638,4.458668082090369],[-133.23448240566492,6.237688842357217],[-133.22950859617748,7.0494925509001325],[-133.2083161407959,7.4727322936322205],[-133.300944537226,7.473722330997462],[-144.34412628900077,7.481583446046131],[-144.38525225286702,-6.998104591174093],[-135.28107234035866,-6.994482356649282],[-135.25687057109846,-6.561396597949055],[-133.24182492165937,-6.591246736569237],[-133.23756301108278,-4.814774435585827],[-133.78233248539615,-4.826009196296961],[-133.81875304126535,-2.220630424778795],[-133.39301115331224,-2.182461787899411],[-133.35449461056373,1.8494321189238296],[-133.78634775452323,1.863710145920915],[-133.79518281978545,4.469290684216447],[-133.21545257190638,4.458668082090369]]],"attributes":{"bgt_functie":"spoorbaan","bgt_fysiekvoorkomen":"open verharding","plus_fysiekvoorkomen":null}},{"id":"L0004.f4208d48dade43278dba385783f808ca","rings":[[[144.24744105088763,7.273618787925976],[133.1455663318145,7.281848129503326],[133.13931079941827,4.315859109229208],[133.59746500169328,4.308878638853209],[133.55230988295105,1.6901428722582743],[133.13402650786264,1.673054334685556],[133.1260270432629,-2.353033718051976],[133.57770176298263,-2.3662604918289034],[133.57193621147252,-4.958136213879026],[133.1206705288167,-4.961183120950593],[133.11660488149036,-6.804138212762003],[144.19477881916438,-6.793545414207412],[144.24744105088763,7.273618787925976]]],"attributes":{"bgt_functie":"spoorbaan","bgt_fysiekvoorkomen":"open verharding","plus_fysiekvoorkomen":null}}];
const BGT_SUPPORTS=[{"id":"L0002.1f925b9b561248feaddcd1a86e2308f6","ring":[[-1.1821622649205614,-9.97921426663666],[-0.02924179013938712,-10.434576077489565],[0.8609925542868277,-9.941685813860758],[1.7868434355039204,-8.469940881529443],[1.9523465572763206,-6.539419004765153],[2.0912267083814204,7.099708434480704],[1.6949029765716959,8.203877126130282],[1.3309452449997432,9.298966058388945],[-0.09706066152156746,10.103079937738926],[-1.4003441289700007,9.338404056397772],[-2.2596344929391354,7.87109731601612],[-2.501661330127164,-6.881434704273216],[-2.07895974502606,-8.70745671124779],[-1.1821622649205614,-9.97921426663666]],"index":21},{"id":"L0002.7855767b7960475db6b786807161546a","ring":[[64.07817495231967,-10.53637787744834],[65.54742713771324,-11.636867775556363],[67.33702875816944,-11.69653384633586],[68.33731456475022,-11.257287554193455],[69.28832101418244,-9.879357318969053],[69.94719269614534,-8.002430813544168],[70.06989272591031,6.297541693494469],[69.914144431257,7.7169681511560455],[69.53427023830865,8.792546413083576],[68.94916611878027,9.706394414310418],[67.61855193048697,10.92386510466539],[66.67808510732691,11.35623896443379],[65.43274257508158,11.090509821762613],[63.632471784343664,9.332801916554654],[62.90205019650423,7.2563344104138725],[62.80019158348713,-7.102719695710095],[63.25208728993195,-9.188121160779106],[64.07817495231967,-10.53637787744834]],"index":23},{"id":"L0002.c806878fa08648c99611475eee2534d2","ring":[[-64.63488575215875,-8.460105957277941],[-64.67951888503012,8.055133940565256],[-65.80514022058946,9.575784330658632],[-66.82746221143482,10.018144757255525],[-68.29435398790403,9.086025389276047],[-69.2431740237012,7.171270956044221],[-69.47143686079073,5.752515840727992],[-69.17180624134575,-8.270890539029605],[-68.54073654918791,-9.377946112889152],[-67.8557974960018,-10.053873988790016],[-66.80733150826781,-10.690493241301885],[-65.37983869731396,-9.66995599323724],[-64.63488575215875,-8.460105957277941]],"index":25},{"id":"L0004.441cae757cf34efaa96a4dfbb524da69","ring":[[-133.24570209526567,-8.192334169362217],[-132.9566809542298,-8.166512084958526],[-132.09563294159616,-7.722592813061511],[-131.57791655773548,-7.219340643813211],[-131.4506295721751,-6.8341134078752175],[-131.2899768968305,6.603763050776965],[-131.41869733248586,6.989437848334402],[-131.89236513987132,7.4620569425734535],[-132.31027867974004,7.696733897496084],[-132.8017708003628,7.929930156878556],[-133.20708970693474,7.9642315264544346],[-133.20651971364885,7.995339003166766],[-144.34252612514433,8.070672946450584],[-144.38891893878377,-8.201735163794385],[-143.20575215801708,-8.20290520795897],[-133.24539669332407,-8.214263755069753],[-133.24570209526567,-8.192334169362217]],"index":26},{"id":"L0004.701093c6bf2643f4a030b54c99fcea6c","ring":[[132.96963119830696,7.753962341106438],[132.2919777634066,7.592401757518866],[132.30220893968354,5.950743960323928],[132.3161056164245,3.5056108591914956],[132.324861600648,1.9764289430135118],[132.35566265941856,-3.097063768584976],[132.36477035964685,-4.684244618355165],[132.37601426461018,-6.618005093313277],[132.3775561760464,-6.80403364625842],[132.38470513820394,-7.880561812346621],[132.38589922838997,-8.162766656632863],[132.93859196501884,-8.298072750020147],[133.11328279944027,-8.297737544517517],[133.1134013363536,-8.368462264005329],[143.4679099523733,-8.290153128499224],[144.18937463595324,-8.284984918444001],[144.19405726791894,-6.987311973130764],[144.2464328943075,6.871225965408313],[144.24922096751152,7.67953359661111],[143.6042923610742,7.6828641455818945],[133.1461968635834,7.740825909393783],[132.96963119830696,7.753962341106438]],"index":29}];
// Continu NAP-wegprofiel: AHN-medianen, uitschieters van voertuigen en
// schaduw-/gatmetingen op de rijbanen verwijderd, zie README.
const PROFILE=[[-145,25.78],[-134,25.8],[-67,25.8],[0,25.8],[66.4,25.8],[134,25.8],[145,25.82]];
function interpolate(points,x,index=1){let i=points.findIndex(p=>p[0]>x)-1;if(i<0)i=x<points[0][0]?0:points.length-2;i=Math.min(points.length-2,i);const [a,b]=[points[i],points[i+1]];return a[index]+(b[index]-a[index])*Math.max(0,Math.min(1,(x-a[0])/(b[0]-a[0])));}
const top=x=>interpolate(PROFILE,x)-WATER_NAP;
function limits(x){const ys=[];for(const ring of DECK_RINGS)for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];if(Math.min(a[0],b[0])<=x&&x<Math.max(a[0],b[0]))ys.push(a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]));}if(!ys.length)return x<0?limits(-140):limits(140);return [Math.min(...ys),Math.max(...ys)];}
// Noordelijke rivierpijler uit BGT; zuidelijke positie geschat op 120,7 m afstand.
const RIVER_PIERS=[-67,-.2,66.4];
function depth(x){return 2.1;}
function loftX(stations,sectionAt){const verts=[],tris=[],n=sectionAt(stations[0]).length;for(const x of stations)for(const [y,z]of sectionAt(x))verts.push(x,y,z);for(let i=0;i<stations.length-1;i++)for(let j=0;j<n;j++){const a=i*n+j,b=i*n+(j+1)%n,c=(i+1)*n+(j+1)%n,d=(i+1)*n+j;tris.push(a,b,c,a,c,d);}for(let j=1;j<n-1;j++){tris.push(0,j+1,j);const k=(stations.length-1)*n;tris.push(k,k+j,k+j+1);}return new Manifold(new Mesh({numProp:3,vertProperties:Float32Array.from(verts),triVerts:Uint32Array.from(tris)}));}
const stations=[...new Set([...Array.from({length:160},(_,i)=>-145+i*290/159),...PROFILE.map(p=>p[0]),...DECK_RINGS.flatMap(r=>r.flatMap(p=>[p[0]-.001,p[0],p[0]+.001])),-134,-67,-.2,66.4,134])].sort((a,b)=>a-b);
const footprint=CrossSection.union(DECK_RINGS.map(section));
const deck=footprint.extrude(SLAB).translate([0,0,-SLAB]).refineToLength(3).warp(v=>{v[2]+=top(v[0]);});
const mask=footprint.extrude(40);
// Twee plaatliggers; geen gesloten koker onder de volledige dekbreedte.
const kokers=[-3.3,3.3].map(c=>loftX(stations,x=>[[c-.475,top(x)-depth(x)],[c+.475,top(x)-depth(x)],[c+.475,top(x)-SLAB+.1],[c-.475,top(x)-SLAB+.1]]).intersect(mask));
const ESTIMATED_PIERS=[];
const estimated=ESTIMATED_PIERS.map(x=>{const [lo,hi]=limits(x);return prism(rect(x-2.3,lo-.5,x+2.3,hi+.5),0,top(x)-SLAB+.2).intersect(mask);});
const piers=BGT_SUPPORTS.map(({ring})=>{const x=ring.reduce((s,p)=>s+p[0]/ring.length,0);return prism(ring,0,Math.max(.1,top(x)-SLAB+.2));}).filter(s=>!s.isEmpty());

// BGT-pijlers geven de veldgrenzen; de actuele dekcontour loopt over de landhoofden door.
const FIELD_ENDS=[-134,-67,-.2,66.4,134],TRUSS_Y=[-6.25,-.95,.95,5.75],TRUSS_WIDTH=1.5;
const profileY=(poly,y0,y1)=>section(poly).extrude(y1-y0).rotate([90,0,0]).translate([0,y1,0]);
const profileX=(poly,x0,x1)=>section(poly).extrude(x1-x0).rotate([90,0,90]).translate([x0,0,0]);
function crest(x,a,b){const end=Math.min(x-a,b-x),u=(x-(a+b)/2)/((b-a)/2);return top(x)+Math.min(6+2.6*(1-u*u),Math.max(.4,end*1.35+.4));}
const trusses=[];const portals=[];
for(let field=0;field<4;field++){
 const a=FIELD_ENDS[field],b=FIELD_ENDS[field+1],xs=Array.from({length:41},(_,i)=>a+(b-a)*i/40);
 const outline=[[a,top(a)-.3],[b,top(b)-.3],...xs.toReversed().map(x=>[x,crest(x,a,b)])];
 for(const y of TRUSS_Y){
  let wall=profileY(outline,y-TRUSS_WIDTH/2,y+TRUSS_WIDTH/2);
  // Spitse, blinde vakwerkopeningen: dubbelzijdig 0,3 m reliëf, kern 0,9 m.
  for(let j=0;j<12;j++){
   const l=a+(b-a)*j/12+1,r=a+(b-a)*(j+1)/12-1,m=(l+r)/2,z=top(m)+.95,h=crest(m,a,b)-1.1;
   if(h-z<2)continue;
   const opening=[[l,z],[r,z],[m,h]];
   wall=wall.subtract(profileY(opening,y-TRUSS_WIDTH/2-.01,y-TRUSS_WIDTH/2+.3)).subtract(profileY(opening,y+TRUSS_WIDTH/2-.3,y+TRUSS_WIDTH/2+.01));
  }
  trusses.push(wall);
 }
 for(const x of [a+4.5,b-4.5])for(const [lo,hi]of [[-6.25,-.95],[.95,5.75]]){
  const c=(lo+hi)/2,z=top(x),outer=[[lo-.75,z],[hi+.75,z],[hi+.75,z+6.6],[lo-.75,z+6.6]],opening=[[lo+.75,z-1],[hi-.75,z-1],[hi-.75,z+2.4],[c,z+5.5],[lo+.75,z+2.4]];
  portals.push(profileX(outer,x-.475,x+.475).subtract(profileX(opening,x-.6,x+.6)));
 }
}
const guards=union(TRUSS_Y.map(y=>prism(rect(-134.02,y-.77,134.02,y+.77),0,40)));

const whole=union([deck,...kokers,...piers,...estimated,...trusses.map(s=>s.intersect(mask)),...portals.map(s=>s.intersect(mask))]);
const layer=deck.subtract(deck.translate([0,0,-ROAD_LAYER]));let rest=footprint;const parts=[];
for(const {id,rings,attributes}of ROAD_FOOTPRINTS){const area=rest.intersect(CrossSection.union(rings.map(section))),road=layer.intersect(area.extrude(40)).subtract(guards);if(road.isEmpty()||road.volume()<.005)continue;parts.push([`road:${attributes.bgt_functie}-${id.split('.')[1]}`,road,attributes]);rest=rest.subtract(area);}
// Niet als wegdeel geregistreerde dekranden en middenberm blijven constructie.
const roadAreas=CrossSection.union(ROAD_FOOTPRINTS.flatMap(r=>r.rings.map(section))).intersect(footprint);
const roadStrip=deck.translate([0,0,1]).subtract(deck.translate([0,0,-ROAD_LAYER])).intersect(roadAreas.extrude(40)).subtract(guards);
parts.push(['building:vakwerk-portalen-pijlers-en-dekranden',whole.subtract(roadStrip)]);
const delta=parts.reduce((sum,[,s])=>sum+s.volume(),0)-whole.volume();if(Math.abs(delta)>Math.max(.05,whole.volume()*1e-6))throw Error('Volumepartitie '+delta);
for(const [name,s]of parts)if(s.status()!=='NoError')throw Error(name+': '+s.status());
// Twee doorlopende printwanden volgen de bocht; de schouders zijn 43 graden.
// De brede voet aan lage landhoofden voorkomt vrije horizontale ondervlakken.
const feet=[0,1].map(side=>loftX(stations,x=>{const [lo,hi]=limits(x),mid=(lo+hi)/2,a=side?mid-3:lo-3,b=side?hi+3:mid+3,c=(a+b)/2,ceiling=top(x)-SLAB+.2,root=Math.max(.05,ceiling-((b-a)/2-.5)/Math.tan(43*Math.PI/180)),wall=Math.max(.5,(b-a)/2-(ceiling-root)*Math.tan(43*Math.PI/180));return [[c-wall,0],[c+wall,0],[c+wall,root],[b,ceiling],[b,top(x)-.25],[a,top(x)-.25],[a,ceiling],[c-wall,root]];}));
const endFeet=footprint.offset(.5).extrude(1).refineToLength(3).warp(v=>{v[2]*=top(v[0])-.25;}).intersect(union([prism(rect(-147,-12,-130,12),0,40),prism(rect(130,-12,147,12),0,40)]));
const combined=union([whole,endFeet,...feet.map(f=>f.intersect(mask))]);
console.log("feet",endFeet.status(),endFeet.volume(),endFeet.boundingBox(),"whole",whole.status(),"combined",combined.status()); const printModel=union(combined.decompose().filter(s=>s.volume()>1e-6)).simplify(.001);
if(printModel.status()!=='NoError'||printModel.decompose().filter(s=>s.volume()>1e-6).length!==1)throw Error('STL niet verbonden');
const mesh=printModel.getMesh();let maxSliver=0;
for(let i=0;i<mesh.triVerts.length;i+=3){const ps=[0,1,2].map(k=>Array.from(mesh.vertProperties.slice(mesh.triVerts[i+k]*mesh.numProp,mesh.triVerts[i+k]*mesh.numProp+3))),u=ps[1].map((v,k)=>v-ps[0][k]),v=ps[2].map((v,k)=>v-ps[0][k]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n);if(n[2]<-.7072*len&&Math.min(...ps.map(p=>p[2]))>.001){const longest=Math.max(...[0,1,2].map(k=>Math.hypot(...ps[k].map((v,a)=>v-ps[(k+1)%3][a])))),altitude=len/longest;maxSliver=Math.max(maxSliver,altitude*mmPerMetre);if(altitude*mmPerMetre>.05)throw Error('STL vrije overhang '+altitude+' '+JSON.stringify(ps));}}
console.log('STL',printModel.status(),'max snijsliver',maxSliver);
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir,{recursive:true});await writeFile(path.join(outDir,'spoorbrug-buggenum.glb'),toGlb(parts,'NederPrint generate-spoorbrug-buggenum.mjs'));
await writeFile(path.join(outDir,`spoorbrug-buggenum-1-${scale}.stl`),toStl(printModel,`Spoorbrug Buggenum Buggenum 1:${scale} geïntegreerde printvoet`).buffer);
const entry={name:'Spoorbrug Buggenum',file:'spoorbrug-buggenum.glb',crs:'EPSG:28992',origin:ORIGIN,xAxis:AXIS,unitsPerMetre:1,className:'building',groundOffsetMetres:0,groundHeight:59.21031,groundSamplePoints:[[-105,-25],[-105,25],[-85,-25],[-85,25]],replacesTerrain:["L0004.6410596cb4094f2fb5bc04c90815f526", "L0004.a0cf901e826a464ab352da1ae3d2f2bb"],printFiles:[`spoorbrug-buggenum-1-${scale}.stl`],description:'Twee parallelle vakwerkbruggen met vier gebogen velden per spoor, actueel volledig BGT-dek en pijlers, AHN-spoorhoogte NAP +25,8 m en kruinhoogte +34,4 m. Vakwerk met printbare blinde driehoeken en spitse portaalopeningen; afzonderlijke BGT-spoorbanen. Waterbasis NAP +14,65 m, afgestemd op PDOK; staafmaten, onderbouw en veldverdeling vereenvoudigd.',realWorld:{deckNapM:PROFILE,waterNapM:WATER_NAP,fieldEndsX:FIELD_ENDS,trussWidthM:TRUSS_WIDTH,crownNapM:34.4,estimatedGirderDepthM:2.1,slabM:SLAB},sources:['https://nl.wikipedia.org/wiki/Spoorbrug_Buggenum','https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items','https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/Category:Spoorbrug_bij_Buggenum']};
await writeFile(path.join(outDir,'spoorbrug-buggenum.json'),JSON.stringify(entry,null,2)+'\n');console.log(JSON.stringify({parts:parts.map(([name,s])=>({name,status:s.status(),volumeM3:s.volume(),triangles:s.numTri()})),partitionDifferenceM3:delta,stlBounds:printModel.boundingBox()},null,2));
