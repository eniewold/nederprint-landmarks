# Erasmus MC-hoogbouw (Rotterdam)

De oorspronkelijke faculteitstoren van OD205, met Prouvé-gevelpanelen,
in gebruik sinds 1968. Het model omvat het volledige afzonderlijke
BAG-pand van de toren. De nieuwere ziekenhuisbouw en omliggende laagbouw
blijven de bestaande PDOK-objecten.

## Bestanden en positie

- `erasmus-mc-toren.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `erasmus-mc-toren.json`: RD-plaatsing, maaiveld, vervanging en bronmaten.
- `erasmus-mc-toren-1-1000.stl`: millimeters, Z omhoog, één verbonden volume.
- `node scripts/generate-erasmus-mc-toren.mjs`: reproduceerbare generator,
  vaste bronmaten, geen netwerk; voorbeeld `generate-mondriaantoren.mjs`.

Oorsprong **RD (91851, 436180)**, lokale X op **24,2°** in RD.
Z=0 is **NAP −0,8 m**, onderkant −1 m. Vier expliciete maaiveldpunten
buiten de toren kiezen het laagste PDOK-niveau **42,35545937 m**
ellipsoïdisch, tevens vaste terugval; `groundOffsetMetres` is 0.
Vervangt uitsluitend **NL.IMBAG.Pand.0599100010031236**.
De oorspronkelijke backloglocatie lag circa 105 m naast de toren.

## Gemeten bouwdelen

| Onderdeel | m NAP |
|---|---:|
| Schachtrand | 107,880 |
| Middenzone onder dakopbouw | 111,840 |
| Technisch dakgebouw | 114,900 |
| Westelijke opbouw | 111,440 |
| Kopopbouw | 111,360 |
| Kleine opbouwen | 112,650 / 114,019 |
| Hoge installatie | 116,816 |

BAG bepaalt de circa 79,2 × 33,6 m schacht met kopinspringingen,
tegenoverliggende middennissen en driehoekige kolombekleding. Twee werkelijke
schuine dakvlakken stijgen doorlopend van +107,88 naar +111,84 m NAP.
3DBAG LoD2.2 en AHN DSM ondersteunen de hoogtes; de technische volumes
zijn vaste bouwdelen, geen gestapelde hoogtelagen. Geen terreinplaat.

## Details, schattingen en vereenvoudiging

Afgeronde televisievensters zijn echte blinde nissen van 0,35 m diep.
Kleine ventilatievelden en drie brede servicebanden krijgen eigen reliëf.
Vensterverdeling en 4 m laagritme zijn uit foto's geschat; hoofdtraveeën
volgen een ritme van circa 7,2 m. De driehoekige kolombekleding volgt de
BAG-contour en steekt circa 1 m uit. Kopse gevels en middennissen hebben
afzonderlijke vensters; de dakopbouw heeft blinde roosterreliëfs.

Dakinstallaties zijn tot hun gemeten bouwvolumes vereenvoudigd. Vrijstaande
antennes, dakletters, ladderhekwerk en dunne leidingen zijn weggelaten omdat
hun doorsnede kleiner is dan 0,9 m; ze worden niet vervangen door een hoge
massieve dakwand. De maaiveldreferentie is bij de toren gekozen, niet op het
verhoogde dak van de omliggende laagbouw. De BAG-toren omvat geen zelfstandige
entree-uitbouw: die ligt binnen de PDOK-laagbouw van het ziekenhuis.

## Controles

GLTFLoader, kaartplaatsing en volledige preview gecontroleerd. Vier
wereldgerichte renders naast echte PDOK LoD2.2-meshes en schuine foto's:
−35° voegt televisievensters, servicebanden en dakroosters toe;
55° de andere lange gevel en de diepe kopnis met ramen;
145° de tegenoverliggende televisievensters en dakinstallaties;
235° de andere kopgevel en blinde roosterreliëfs op de middenopbouw.

Manifold en STL: `NoError`, één verbonden volume, 213.520 driehoeken;
**79,2 × 35,8 × 118,6 mm** op 1:1000. De normale 45°-printcorrectie voegt
**0,1406%** volume toe, zonder losse steunconstructies. Volledige export op
exact 1:1000: **180 × 180 mm**, 227 objecten, 306.754 driehoeken,
118,9 mm totale hoogte. De permanente test in `tests/landmark-models.test.ts`
controleert het juiste pand, echte nissen en raycasts op de continue dakhelling.

Controlekaart:
http://127.0.0.1:3008/kaart/51.9105288/4.4694426/680/1x1/0?size=180&bruggen=0

## Bronnen en rechten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100010031236),
  TU Delft/3DGI, CC BY 4.0; [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0)
  en [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0;
  [luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Faculteitsgebouw](https://commons.wikimedia.org/wiki/File:Faculteitsgebouw_Erasmus_MC.jpg),
  Sten van Houwelingen, CC BY-SA 4.0;
  [Erasmus MC 2008](https://commons.wikimedia.org/wiki/File:Erasmus_MC_2008_hires.JPG),
  Ricknl, publiek domein;
  [Coolhaven](https://commons.wikimedia.org/wiki/File:Erasmus_Medical_Center_Rotterdam_view_from_Coolhaven.jpg),
  Cathrotterdam, CC BY-SA 4.0.
- [Platform Wederopbouw Rotterdam](https://wederopbouwrotterdam.nl/artikelen/medische-faculteit):
  architectuurgeschiedenis en schuine foto's Iris van den Broek en Guido Pijper.
  Alle foto's uitsluitend referentie, buiten de repository bewaard.
