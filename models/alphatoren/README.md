# Alphatoren (Enschede)

Alphatoren en het bijbehorende wooncomplex De Boulevard van KOW,
voltooid in 2008. Het gehele complex valt binnen één BAG-pand; het model
omvat daarom de toren én de vier lagere woongebouwen.

## Bestanden

- `alphatoren.glb`: meters, Y omhoog, gesloten node `building:alphatoren-en-de-boulevard`.
- `alphatoren.json`: RD-plaatsing, vervangen pand en bronnen.
- `alphatoren-1-1000.stl`: millimeters, Z omhoog, circa 110,6 × 89,8 × 101,9 mm.
- `scripts/generate-alphatoren.mjs`: reproduceerbare generator met vaste invoer.

## Oorsprong en oriëntatie

RD (258432, 470895), in het hart van de hoge toren. +X oost, +Y noord;
z = 0 op NAP +43,15 m. De toren staat -10,3 graden ten opzichte van RD-X,
gemeten uit het AHN-daksilhouet. De lagere bouwdelen volgen hun eigen gevelassen.
De voet ligt 0,6 m onder dit referentieniveau. Maaiveld wordt op vier
straatpunten bemonsterd: PDOK geeft daar ellipsoïdisch +86,66 tot +87,45 m.
De laagste waarde +86,66397 m is ook de terugval voor gedeeltelijke uitsneden.
Het model vervangt `NL.IMBAG.Pand.0153100000472517`.

## Bouwdelen en metingen

- Torenromp op een vierkant van circa 22,2 m met vier transparante hoekserres,
  individuele vensternissen in het metselwerk en een centrale verticale gleuf.
- Torendak NAP +127,159 m, teruggelegen glazen panoramaverdieping +130,634 m,
  kleiner techniekhuis +134,238 m en schoorsteen tot +144,42 m. De gepubliceerde
  hoogte van 101 m is dus inclusief de schoorsteen, niet alleen de torenromp.
- Afdekplaten op dezelfde gemeten hoogtes, met een 45 graden ondersnede.
- Twee lage plintvleugels naast de toren; noordelijke vleugel +62,226 m,
  noordoostblok +56,364 m, oostelijke schijf met penthouse +78,353 m en
  schouders +73,961 m, westelijke L-vleugel +64,226 m, middendeel +59,825 m,
  zuidelijk deel +53,968 m en lage tuinwoningen/verbinding +50,440 m.
- Zeven serrebalkons aan de hofzijde van de oostelijke schijf, met schuine
  kragen in plaats van onondersteunde vloerplaten; vensters op de lage gebouwen,
  grotere dakopbouwen en de brede entree met bordestrap.

Alle daken zijn vlakke dakvlakken en de bouwdelen zijn benoemde prisma's.
De modelopbouw gebruikt geen gestapelde DSM-hoogtelagen. De binnenhof is
doorgaand uitgespaard: de bestaande PDOK-tuin en paden worden niet door een
meegemodelleerd garagedak afgedekt.

## Geschat en vereenvoudigd

Het gevelraster (circa 3,08 m per torenlaag), vensterbreedtes, hoekserreritme,
de nisdikte van 0,35 m, balkonuitkragingen van circa 1,8 m en de gegroepeerde
bordestrap zijn uit foto's geschat. Afdekplaten en balkonvloeren zijn 0,9 m
dik voor 1:1000 en hebben een schuine onderzijde. De schoorsteen is 1,6 × 1,4 m
gemodelleerd; de foto toont een slankere schacht. De grenzen van de open
binnenhof zijn vereenvoudigd tussen de gemeten gebouwcontouren.

## Weggelaten

Glasroedes, relingen, regenpijpen, kleine dakventilatoren en luifelspanten
zijn dunner dan 0,9 m. De glazen entreeluifel is niet vrijstaand opgenomen:
de dunne spanten en horizontale plaat zouden op 1:1000 dicht worden gevuld;
entreevolume en trap zijn wel aanwezig. Binnenhoftuin, plantenbakken en
bestrating blijven de PDOK-terreindata en worden niet gedubbeld.

## Controle

Generator en ingelezen GLB geven `NoError`; het model is één verbonden
buitenvolume met een vlakke voet. De 1:1000-controle met `supportedSolid`
op 45 graden voegt circa 0,27% volume toe onder nissen en kleine uitkragingen.
Er is geen afzonderlijk steunmateriaal nodig. De schoorsteen en dragende
vrije onderdelen blijven minstens 0,9 mm op 1:1000.

De webshoptest controleert de RD-plaatsing, het vervangen BAG-pand, de totale
hoogte, geleding van alle vleugels en kroon, gevelgeometrie, entree en
geslotenheid. Verticale stralen door drie punten in de hof moeten het model
missen, zodat de bestaande tuin en paden zichtbaar blijven.

Vier schuine renders zijn naast de daadwerkelijke PDOK-gebouwtegels bekeken
en gecontroleerd tegen schuine straatfoto's en een luchtbeeld. Per kant heeft
de nieuwe versie geometrische vensters, hoekserres en kroon; aan de hofzijde
ook serrebalkons en entree. De PDOK-reconstructie mist de schoorsteen en heeft
grotendeels vlakke gevels. Kaart en een volledige preview-export van
160 × 160 m op 160 × 160 mm (1:1000) zijn gecontroleerd. De preview is circa
102,8 mm hoog inclusief terrein en grondplaat. Controlebeelden blijven buiten
de repo en worden hier niet gekoppeld.

## Bronnen

- [KOW: Alphatoren De Boulevard](https://kow.nl/projecten/alphatoren-de-boulevard-enschede/), gebouwomschrijving en foto's KOW/Alkondor/Van Derden, uitsluitend als referentie.
- [PDOK BAG-WFS](https://service.pdok.nl/lv/bag/wfs/v2_0), pand `0153100000472517`, CC0.
- [PDOK AHN-WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM/DTM 0,5 m, CC0.
- [PDOK actuele luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG, TU Delft/3DGI](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0153100000472517), AHN5 2023, CC BY 4.0.
- Commons: [20130407 Enschede 60](https://commons.wikimedia.org/wiki/File:20130407_Enschede_60.JPG), [77](https://commons.wikimedia.org/wiki/File:20130407_Enschede_77.JPG) en [94](https://commons.wikimedia.org/wiki/File:20130407_Enschede_94.JPG), Mark Ahsmann, CC BY-SA 3.0.
- [Aerial Twente (6781751906), cropped](https://commons.wikimedia.org/wiki/File:Aerial_Twente_(6781751906)_(cropped).jpg), Archangel12, CC BY 2.0.
