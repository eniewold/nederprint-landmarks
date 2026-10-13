# Grotius (Den Haag)

Grotius I en II / The Roofs, MVRDV, gerealiseerd in 2022. Het zijn twee
vrijstaande woontorens naast de Utrechtsebaan; het park over de weg is geen
bovengrondse onderbouw van de torens. De backloghint “2024” is gecorrigeerd.

## Bestanden

- `grotius-den-haag.glb`: meters, Y omhoog, twee gesloten building-nodes.
- `grotius-den-haag.json`: catalogus, RD-plaatsing en bronnen.
- `grotius-den-haag-1-1000.stl`: twee losse torens, circa 79,9 × 69,3 × 122,8 mm.
- `grotius-den-haag-grondplaat-1-1000.stl`: dezelfde torens op één verbonden
  vlakke grondplaat om afzonderlijk te printen; de GLB bevat die plaat niet.
- `scripts/generate-grotius-den-haag.mjs`: vaste bronmaten en benoemde bouwdelen.

## Plaatsing

Oorsprong RD (82435, 455347); +X op −40,3° in RD, langs het gevelstelsel;
+Y staat daar linksom haaks op. z = 0 op NAP +0,8 m. De voet loopt 1,2 m
onder deze referentie door. Vier straatpunten geven PDOK-maaiveldhoogtes
van ellipsoïdisch +44,11194 tot +44,23163 m; de laagste waarde is ook de
terugvalhoogte voor gedeeltelijke uitsneden.

De compacte zuidtoren vervangt BAG `0518100001758098`; de lange noordtoren
`0518100001758100`. De kelder `0518100001758099` wordt eveneens verborgen,
maar niet als bovengrondse plaat over het plein en de doorgang gemodelleerd.

## Bouwdelen

Beide torens hebben een doorlopende prismatische natuurstenen romp op de
eigen onregelmatige BAG-contour, individuele venster- en loggianissen,
balkonplaten met schuine onderkraag en een hoge glasnis bij de entree.
De asymmetrische kronen bestaan uit benoemde verticale woonbeuken met eigen
vlakke terrasdaken; geen gestapelde DSM-hoogtelagen.

De gewone AHN-WCS en de standaardluchtfoto tonen de bouwfase. De bruikbare
dakhoogtes komen daarom uit 3D BAG / AHN5 2023: noordkroon vanaf NAP +88,356 m
tot +121,452 m, dakopbouw +122,446 m; zuidkroon vanaf +70,500 m tot +100,509 m,
dakopbouw +102,265 m. Tussenliggende terrasdaken volgen de gemeten hoogtes
per woonbeuk. De openbare straat tussen de torens blijft open.

## Geschat en vereenvoudigd

De traveegrenzen in de kroon zijn uit bronfoto’s en het gemeten dakplan
vereenvoudigd tot regelmatige beuken, circa 1–2 m onzeker. Raamverdeling
(ongeveer 3,4 m), laagritme van 3,02 m, deels inpandige balkonposities,
uitkraging van 1,35 m en glasentrees zijn uit foto’s geschat. Nissen zijn
0,35 m diep; loggiavelden 0,9 m. Balkonplaten hebben een verdikte onderzijde
van minstens 0,9 m met een 45° kraag voor 1:1000. De kleine dakopbouwen zijn
als gesloten prisma’s vereenvoudigd.

## Weggelaten

Dunne glazen balkon- en terrasbalustrades, roedes, metalen onderhoudsgiek,
PV-plaatdikte en beplanting zijn smaller/dunner dan 0,9 m. De openbare
parkoverkluizing en het maaiveld blijven de PDOK-terreindata; de
ondergrondse kelder wordt niet tot een nieuw pleinvolume opgehoogd.

## Controle

Elke torennode is `NoError` en één verbonden buitenvolume met een vlakke
voet. De extra grondplaat-STL is eveneens één gesloten verbonden volume.
De 1:1000-printcontrole op 45° voegt circa 0,63% (noord) en 0,64% (zuid)
volume toe onder nissen en kleine uitkragingen, zonder afzonderlijke supports.

De permanente webshoptest controleert beide plaatsingen, de vervangen
panden, totale hoogtes, geveldetail, verschillende kroonhoogtes en de
doorgaand open straat. De GLB is in de three.js GLTFLoader bekeken. Vier
schuine renders zijn naast dezelfde hoeken van de echte PDOK-reconstructie
en schuine architectfoto’s beoordeeld: vensters, balkons, loggia’s en
regelmatige kroonbeuken zijn op alle kanten toegevoegd. Kaartschakelaar en
printpreview zijn gecontroleerd. De exacte 1:1000-export van 210 × 210 mm
bevat beide volledige torens, 303 objecten, 109.370 driehoeken en is 128,4 mm
hoog inclusief terrein/grondplaat. Controlebeelden blijven buiten de repo.

## Bronnen

- [MVRDV: Grotius Towers](https://www.mvrdv.com/projects/392/grotius-towers),
  ontwerp, 2022 en 120/100 m; foto’s Daria Scagliola en Emmely van Mierlo,
  auteursrechtelijke beelden uitsluitend als referentie.
- [PDOK BAG-WFS](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [PDOK AHN-WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM/DTM 0,5 m, CC0.
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG zuidtoren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001758098)
  en [noordtoren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001758100),
  TU Delft/3DGI, AHN5 2023, CC BY 4.0.
