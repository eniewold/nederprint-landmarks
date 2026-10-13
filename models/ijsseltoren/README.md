# IJsseltoren (Zwolle)

Het volledige kantoorcomplex van PPKS/René Steevensz aan de Grote Voort,
opgeleverd in 2006, bestaat uit een hoge toren, twee lagere kantoorstroken
en een gebogen concourse met daktuinen. De backloglocatie bij het station
en het jaar 2004 zijn gecorrigeerd aan de hand van de bouwer en BAG.

## Bestanden en plaatsing

`ijsseltoren.glb` bevat één gesloten building-node in meters, Y omhoog;
`ijsseltoren.json` beschrijft de plaatsing; `ijsseltoren-1-1000.stl` staat
met vlakke voet op het printbed, circa 166,6 × 101,3 × 95,7 mm.
Generator: `scripts/generate-ijsseltoren.mjs`.

Oorsprong RD (201150, 502550), +X oost, +Y noord, z = 0 op NAP +1,2 m,
voet z = -1,2 m. Alleen BAG-pand `0193100000049836` wordt vervangen;
het aparte naastgelegen Engie/Spoolderwerk-gebouw blijft PDOK. Vier punten
langs het complex geven ellipsoïdisch +42,56070 tot +42,56552 m, de laagste
ook als terugvalhoogte. Het bestaande water en de openbare omgeving blijven
behouden; de voet volgt het pand, niet een nieuwe brede terreinplaat.

## Opbouw en maten

Doorlopende benoemde prisma’s vormen de drie kantoorvolumes. Hun dakvlakken
liggen op NAP +87,982, +36,806 en +44,292 m. De glaskop krijgt een open
dakruimte rond een terugliggend ovaal bouwvolume op +92,434 m; een meetbare
dakmast eindigt op +95,686 m. De lage stroken staan op kolommen boven het
concourse, met open ruimte onder de eerste kantoorvloer.

De gebogen onderbouw, noordelijke daktuinterrassen, lichtstraten en lagere
daktechniek zijn meegenomen. De drie halvleugels hebben doorlopende hellende
dakvlakken rond NAP +13,3 m, circa 9–16 m binnen de gemeten spreiding. Er zijn
geen gestapelde DSM-hoogtelagen. Gevels krijgen blinde glas- en vensternissen.

## Geschat en weggelaten

Torenplannen, kroonwand en ovaal dakvolume zijn circa 1–2 m vereenvoudigd
uit BAG, AHN/3D BAG en de schuine luchtfoto van de bouwer. De regelmatige
vensters, glasbanden, kolomposities en onderzijde op +16,9 m zijn uit foto’s
geschat. De concourse-dakhelling 0,043 en lichtstraatposities zijn circa 1 m
onzeker; het bestaande groene dak krijgt geen losse groen- of terrein-node.
De glasbanden zijn 0,35 m diep als blinde nissen. Fijne roedes, relingen,
reclameletters en antennepunten smaller dan 0,9 m zijn weggelaten.

De CSG krijgt 1 cm geometrische tolerantie om snijslivers bij overlappende
haldaken te verwijderen; de uiteindelijke GLB blijft één verbonden volume.

## Controle

Generator, STL en opnieuw ingelezen GLB: `NoError`, één positief verbonden
buitenvolume. Permanente test controleert plaatsing, vervangen pand,
volledige breedte, de vier dakhoogtes, dakmast, gevelreliëf en open ruimte
onder de middelste kantoorstrook. De printcorrectie bij 45° voegt 1,882%
volume toe, vooral onder kantoorstroken en vensternissen, zonder apart
steunmateriaal. De exacte 1:1000-preview-export omvat het hele complex op
240 × 240 mm: 116 objecten, 132.686 driehoeken, 95,7 mm hoogte met ondergrond.

Vier renders zijn naast gelijke hoeken van de echte PDOK-reconstructie
en schuine bronfoto’s beoordeeld: geometrische ramen en puien op alle kanten,
kolommen/open stroken, lichtstraten, regelmatige kroon en afzonderlijke
daktechniek verbeteren de vlakke PDOK-gevels. GLTFLoader, plaatsing op de kaart
en volledige printpreview zijn gecontroleerd. Controlebeelden blijven buiten
de repo.

## Bronnen

- [Trebbe](https://www.trebbe.nl/project/spoolderwerk/), bouwer: volledige
  onderbouw, drie volumes, 95,5 m hoogte en schuine buitenfoto’s; uitsluitend
  auteursrechtelijke referentie, auteur niet vermeld op de projectpagina.
- [IJsseltoren](https://ijsseltoren.nl/), beheerder, adres en concoursefoto’s.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000049836),
  TU Delft/3DGI, CC BY 4.0.
