# De Hoge Heren (Rotterdam)

Wooncomplex van Wiel Arets, voltooid in 2001: twee torens op een gezamenlijke
zeslaagse voet, aan de Gedempte Zalmhaven. De westtoren heeft verschoven
rechthoekige woonvleugels; de oosttoren volgt het schuine stratenpatroon.

## Bestanden

- `hoge-heren.glb`: meters, Y omhoog, één gesloten building-node.
- `hoge-heren.json`: plaatsing, vervangen pand en bronmaten.
- `hoge-heren-1-1000.stl`: vlakke voet, circa 86,5 × 35,6 × 103,1 mm.
- `scripts/generate-hoge-heren.mjs`: generator met vaste benoemde bouwdelen.

## Plaatsing

Oorsprong RD (92642, 436268), +X op 25,8° in RD langs de lange gevels,
+Y naar het noorden/westen. z = 0 op NAP +3,2 m; de voet loopt 1,2 m lager
door. Vier straatpunten geven PDOK-hoogtes van ellipsoïdisch +46,84165 tot
+47,20291 m. De laagste is ook de terugvalhoogte voor gedeeltelijke uitsneden.
Alleen BAG-pand `0599100000627495`, het hele complex, wordt vervangen;
Zalmhaven, de noordelijke lange woonflat en de aangrenzende panden blijven PDOK.

## Bouwdelen

De doorlopende torenprisma’s volgen de inspringingen bij de lifthallen;
de rechthoekige westtoren en schuine oosttoren eindigen op vlakke daken,
NAP +100,618 en +100,631 m. De ruimte boven de gezamenlijke voet tussen de
torens is open. Dakliftkernen staan op +105,010 en +105,107 m, met afzonderlijke
lagere technische kasten rond +101,5 tot +101,9 m. Zo is de totale hoogte
inclusief liftkern circa 102 m boven straatniveau.

Het volledige podium heeft een glazen begane grond, parkeer-/recreatiegevels
en een dak op +18,535 m. De terugliggende buitenste glasstroken zijn lager,
circa +6,735 m. De kleine verhoogde lifthalstrook op het podium eindigt op
+20,825 m, de zuidzijde heeft een glasentree met een kleine printluifel.
Alle daken zijn vlakke dakvlakken; er zijn geen gestapelde DSM-lagen.

## Geschat en vereenvoudigd

Brede rechthoekige vensters (circa 2,65 × 1,35 m), laagritme van 2,83 m,
loggia’s (1,1 m diepe blinde nissen), parkeergevelraster, glaspuien,
entree en luifel zijn uit schuine architectfoto’s geschat. De dakhoogtes
komen uit AHN en 3D BAG. Kleine contourruis in torens, lifthalnissen en
dakopbouwen is tot circa 0,5–1 m vereenvoudigd. Gewone vensters zijn 0,35 m
verdiept. De backloghint “vierkante ramen” volgt de foto’s niet.

## Weggelaten

De fijne kolenstructuur van gevelpanelen, roedes, loggia- en dakrelings,
onderhoudsgieken en groen zijn smaller/dunner dan 0,9 m en niet vrijstaand
opgenomen. De daktuin krijgt geen nieuwe terrein-node; het bestaande
maaiveld en de openbare omgeving worden niet gedubbeld.

## Controle

Generator, ingelezen GLB en STL: `NoError`, één verbonden buitenvolume.
De 1:1000-printcontrole met 45° voegt 0,253% volume toe onder nissen en
kleine uitkragingen; er is geen afzonderlijk steunmateriaal nodig.

De permanente webshoptest controleert plaatsing, pand-id, beide torendaken,
dakliftkern, gevelnis en de open ruimte boven het podium. Vier schuine
renders zijn naast identieke hoeken van de echte PDOK-reconstructie en
architectfoto’s bekeken: alle zijden hebben geometrische vensters/loggia’s,
het podium heeft glas- en parkeerreliëf en de dakinstallaties zijn regelmatige
bouwdelen. GLTFLoader, kaart en volledige printpreview zijn gecontroleerd.
De exacte 1:1000-export van 170 × 170 mm omvat het hele complex: 194 objecten,
84.926 driehoeken, 103,4 mm hoogte inclusief ondergrond. Controlebeelden
en bronfoto’s blijven buiten de repo.

## Bronnen

- [Wiel Arets Architects](https://www.wielaretsarchitects.com/en/projects/hoge_heren/),
  projectbeschrijving, oplevering 2001 en schuine foto’s; auteursrechtelijke
  beelden uitsluitend als referentie, geen overgenomen tekeningen/geometrie.
- [Bureau Bouwkunde](https://www.bureaubouwkunde.nl/projecten/de-hoge-heren-rotterdam/),
  beschrijving van twee verschillende torens op zeslaagse onderbouw.
- [PDOK BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN DSM/DTM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Actuele luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000627495),
  TU Delft/3DGI, CC BY 4.0.
