# Rijntoren (Arnhem)

Kantoortoren van UNStudio, gebouwd in 2005, bij Arnhem Centraal. Het eigen
BAG-pand `0202100000247396` is volledig opgenomen. Parktoren is het aparte
pand `0202100000238526`; het stations-/busdek hoort bij `0202100000223614`,
dat al door het Arnhem Centraal-landmark wordt vervangen. Beide blijven
behouden, zonder dubbele stationsplint of een nieuwe pleinplaat.

## Bestanden en plaatsing

`rijntoren.glb`: één gesloten building-node, meters, Y omhoog.
`rijntoren.json`: plaatsing. `rijntoren-1-1000.stl`: vlakke onderzijde,
48,2 × 17,1 × 70,7 mm. Generator: `scripts/generate-rijntoren.mjs`.
Oorsprong RD (190215, 444129), +X op -13°, z = 0 rond NAP +28,9 m.
Vier gecontroleerde openbare punten geven ellipsoïdisch +72,51206 tot
+73,84856 m; de laagste is terugvalhoogte. Het hogere stadsbalkon en het
lagere expeditieniveau worden niet met elkaar verwisseld: de voet loopt
door tot NAP +23,5 m, lokale z = -5,4 m, onder het lagere niveau +24,5 m.

## Gemeten bouwvlakken

Hoofddak NAP +89,990 m, brede lift-/techniekkern +94,169 m en de opstaande
gebogen dakrand +91,124 m. De bovencontour volgt vaste BAG-punten met een
afgeronde oostelijke kop. Er zijn geen ontbrekende bovengrondse vleugels
binnen dit pand; de aansluitende stationsdelen zijn het bestaande landmark.

De architect noemt een circa 8 m brede constructievoet met 5 en 3 m
uitkraging. Het model heeft een 8 m brede voet, doorlopende schuine
glasvlakken over de onderste vier niveaus en circa 17,1 m brede bovenbouw.
Die overgang eindigt rond NAP +44,5 m. Het is één geometrische overgang
met schuine vlakken en een bovenprisma, geen stapeling van hoogtelagen.
Glasbanden en borstweringen volgen alle zijden en de afgeronde kop.

De backloghint 2008 is gecorrigeerd naar 2005. De aannemer noemt circa
70 m en 16 verdiepingen; van expeditieniveau +24,5 m tot kern +94,169 m
is circa 69,7 m. De hoogte boven het verhoogde stadsbalkon is kleiner.

## Geschat en vereenvoudigd

De BAG-contour is circa 0,1–0,3 m vereenvoudigd. De overgang van +24,5
naar +44,5 m, de rechte generatrices in plaats van zacht gebogen glazen
vlakken en de verdeling van entree-/expeditiepuien zijn geschat.
Glasvelden zijn circa 5,9 m lang, met 3,55 m verdiepingsritme; de hoogte
neemt bij de middensponning af van circa 2,3 naar 1,65 m. Dat bandpatroon
en 0,45 m blinde nisdiepte komen uit de schuine architect-/geveladviseurfoto's.
De kleine kozijnonderbrekingen zijn samengevoegd tot grotere glasvelden.

Fijne glasroedes, dakrelings, reclame en antennes smaller/dunner dan 0,9 m
zijn weggelaten. Het blauwe kleurverloop vormt geen aparte materiaalklasse.
Er zijn geen steunplaten over het plein, spoor of de bus-/stationsruimte.

## Controle

Generator, STL en opnieuw ingelezen GLB: `NoError`, één verbonden volume,
6.390 driehoeken. Ook de 45°-printversie is gesloten en verbonden; de
correctie voegt 0,401% volume toe, zonder afzonderlijk steunmateriaal.
De permanente test controleert één plaatsing, het eigen vervangen pand,
behoud van station en Parktoren, drie gemeten daken, versmallende voet,
glasnis en gesloten ruwe en gecorrigeerde volumes.

Vier aanzichten zijn naast dezelfde hoeken van de echte PDOK-reconstructie
en schuine foto's uit het UNStudio-profiel en van IBS beoordeeld. Glasbanden,
de slanke voet, ronde kop, entreevelden en opstaande dakrand verbeteren de
vlakke automatische gevels. GLTFLoader, controlekaart en volledige preview
zijn gecontroleerd. Exacte 1:1000-export: 150 × 150 mm, 137 objecten,
82.474 driehoeken en 71,9 mm hoogte inclusief terrein; de hele toren valt
binnen de uitsnede. Onderzoek, foto's en controlebeelden blijven buiten de repo.

## Bronnen

- [UNStudio-projectprofiel](https://architectenweb.nl/projecten/project.aspx?id=4449),
  voet, uitkragingen, niveaus en foto's; auteursrechtelijke referentie,
  fotograaf niet bij de beelden vermeld, geen overgenomen tekeningen.
- [Van Grunsven](https://www.grunsvengroep.nl/projecten/werken/park-en-rijn-toren-arnhem/),
  hoofdaannemer: 70 m en 16 verdiepingen.
- [IBS](https://ibsconsultants.nl/en/portfolio/construction-of-park-en-rijn-towers/),
  geveladviseur en primaire schuine foto’s, uitsluitend referentie.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0202100000247396),
  TU Delft/3DGI, CC BY 4.0.
- PDOK 3D Tiles: passende reconstructie en openbare peilen.
