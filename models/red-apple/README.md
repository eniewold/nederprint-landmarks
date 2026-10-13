# The Red Apple (Rotterdam)

Het complete KCAP-ensemble uit 2009: de circa 124 m hoge woontoren,
het vijfhoekige uitkragende kopblok, parkeer-/kantooronderbouw, winkels,
lage vleugels en arcade. De latere ibis- en Dock21-gebouwen hebben eigen
BAG-panden en blijven in PDOK behouden.

## Bestanden en plaatsing

`red-apple.glb`: één gesloten building-node, meters, Y omhoog.
`red-apple.json`: plaatsing. `red-apple-1-1000.stl`: vlakke voet,
circa 118,9 × 43,6 × 124,6 mm. Generator: `scripts/generate-red-apple.mjs`.
Vervangen pand: `0599100000753288`, inclusief alle bovengrondse vleugels.

Oorsprong RD (93218, 436907), +X op 44,66°, z = 0 op NAP +2,60 m,
voet -1,2 m. Vier gecontroleerde straatpunten geven ellipsoïdisch
+46,01782 tot +46,20364 m; de laagste is terugvalhoogte. Lage vlakken
bij het water zijn niet als straatpeil gebruikt. Geen extra kade- of tuinplaat.

## Bouwvlakken en gemeten hoogte

Torenroofdak NAP +123,273 m, lift-/techniekkern +125,991 m en tweede
kast +125,672 m. De gevel heeft versmallende verticale stijlen, weergegeven
als reliëf tussen naar boven bredere glasvelden, met smalle horizontale
verdiepingslijnen en aangesloten dakrandstijlen.

Het kopblok heeft een vaste vijfhoekige wooncontour op NAP +56,002 m,
terugliggende glazen onderbouw en afzonderlijke kolommen. De holle atria
hebben twee gemeten lagere glaskappen op +46,926 en +52,803 m, elk 1 m dik.
Liftkern op +58,418 m en aangrenzende installatie op +58,325 m.
De verschillende kleinere kasten op het atriumdak zijn meegenomen op
+47,492, +47,810, +47,843 en +48,512 m.

De parkeer-/kantooronderbouw eindigt op +23,937 m, de hogere kantoorstrook
op +29,769 m. Lage vleugels hebben daken +6,357, +7,063, +8,674,
+13,419 en +13,431 m. De aansluitvleugel eindigt rond +25,92 m.
Kleinere installaties op de onderbouw en de hoekschacht van +27,279 m
zijn op hun gemeten bronpositie opgenomen. Alle onderdelen zijn vaste
bouwprisma's, gevelvelden, kolommen en dakschalen; geen DSM-hoogtelagen.

## Schattingen en printvereenvoudiging

Contouren zijn circa 0,5–1 m vereenvoudigd uit BAG/3D BAG en luchtfoto.
De uitkraging van circa 3 m, kopblokonderzijde NAP +29,4 m, kolomraster,
kolommen van 1,2 m, vensterverdeling en glaspuien zijn fotomaten.
Het torenritme is circa 3 m verticaal en 1,9 m langs de gevel. Glasvelden
zijn ongeveer 0,35 m diep, de horizontale lijnen 0,12 m; dakrandstijlen
zijn voor 1:1000 naar 0,9 m breedte vereenvoudigd.

De kopblokvensters zijn blinde nissen, circa 2,4 × 2,45 m, met ritme 3,15 m.
Twee grote atriumvensters zijn 1,6 m diep met brede aangesloten lamelregels.
Die maat en verdeling zijn geschat; fijnere echte lamellen zijn samengevoegd.
De holte onder de glaskappen begint op de geschatte atriumvloer NAP +32 m.
De 45°-correctie vormt verbonden schuine ondervlakken onder het uitkragende
kopblok, glasdaken en vensters en verkleint de hogere atriumruimte.

De arcade is circa 2,8 m breed; de spitse bovenzijde is een printaanpassing
van de geschatte rechthoekige doorgang. Fijne glasroedes, dakrelings,
glasbalustrades, reclame, vegetatie en antennes kleiner/dunner dan 0,9 m
zijn weggelaten. De omgeving wordt niet met een nieuwe garageplaat bedekt.

## Controle

Generator, STL en opnieuw ingelezen GLB: `NoError`, één verbonden ruw volume,
49.002 driehoeken. De 45°-printcontrole geeft `NoError` en voegt 4,723%
volume toe, als deel van het model en zonder afzonderlijk steunmateriaal.
De permanente test controleert één plaatsing, het complete vervangen pand,
elf gemeten dak-/installatiehoogtes, het holle atrium, de arcade,
uitkraging en gevelreliëf.

Vier renders zijn naast dezelfde hoeken van de echte PDOK-reconstructie en
schuine KCAP-foto's beoordeeld. De verticale torenstroken, horizontale
kopblokgevels, uitkraging, atriumvensters, complete lage vleugels en arcade
verbeteren de vlakke en plaatselijk misvormde automatische gevels.
GLTFLoader, controlekaart en volledige printpreview zijn gecontroleerd.
Exacte 1:1000-export: 180 × 180 mm, 170 objecten, 95.028 driehoeken en
127,6 mm hoogte inclusief terrein. Het hele model valt binnen de uitsnede.
Onderzoek, foto's, renders en export blijven buiten de repo.

## Bronnen

- [KCAP](https://www.kcap.eu/projects/6/red-apple-rotterdam), architect,
  2009, 124 m, bouwprogramma en gevelbeschrijving; foto Rob t'Hart.
- [KCAP-fotoreferenties](https://www.kcap.eu/pressroom?project=6),
  Ossip van Duivenbode, uitsluitend referentie; geen overgenomen tekeningen.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000753288),
  TU Delft/3DGI, CC BY 4.0.
- PDOK 3D Tiles: reconstructie en straathoogtes.
