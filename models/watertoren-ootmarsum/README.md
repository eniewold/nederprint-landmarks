# Watertoren Ootmarsum (Kuiperberg)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:100. Generator: `scripts/generate-watertoren-ootmarsum.mjs`; uitvoeren met Node vanuit nederprint-landmarks (zonder `--scale` schrijft hij de STL op 1:100). Geen hoogteplakken: de cilinder met plint en dakrand is een prisma op een 96-hoek met convexe omhullenden voor de afzaat en de onderkant van de dakrand, de traptoren is een blok met een daklijst als omhullende, en de vensters en de deur zijn nissen.

De watertoren op de Kuiperberg bij de Almelosestraat in Ootmarsum is in 1934 gebouwd (rijksmonument 513204). Hij is volgens Wikipedia en het register 9,05 m hoog en daarmee de laagste watertoren van Nederland, met een reservoir van 216 m³. Het register beschrijft twee geometrische volumes in rode machinale baksteen: een cilinder met het betonnen vlakbodemreservoir op een bakstenen plint, met een betonnen dakrand en spuwers, en een vierkante traptoren die gedeeltelijk in de cilinder staat, met drie zeer hoge smalle spleetvensters in de westgevel en de ingang (deur onder een rondboog, vijf bakstenen treden op het talud) in de noordgevel.

## Bestanden

- `watertoren-ootmarsum.glb`: één node `building:reservoircilinder-met-plint-en-dakrand-en-vierkante-traptoren`, op maaiveld.
- `watertoren-ootmarsum.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-ootmarsum-1-100.stl`: alles samen op 1:100 (10,8 × 8,9 × 9,9 cm).

## Oorsprong en oriëntatie

RD-oorsprong [256855.32, 492037.03] (52,40669 N, 6,88409 O), het hart van de cilinder: een cirkelfit op de 21 boogpunten van BAG-pand 1774100000252343 (straal 4,32 m, restfout 0,06 m). Lokale +X loopt van de westgevel van de traptoren naar het hart van de cilinder (RD 15,8 graden; de zijgevels van de traptoren liggen in de BAG op 15,75 en 16,19 graden, de westgevel haaks op 15,79), +Y wijst naar het noordnoordwesten, naar de ingang.

De toren staat op een eigen kop van de Kuiperberg die al in het PDOK-terrein zit: het AHN-DTM is op 5 m van het hart NAP +66,2 tot 66,5 en zakt op 9 m naar 65,0 tot 66,3 (3D BAG-maaiveld 65,25 is dat laagste punt). `groundHeight` 109,26 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (oost en noord op 5 m 109,26 en 109,40, zuid 109,46, west 0,8 m voor de traptoren 109,52; gemeten 2026-11-06); z = 0 ligt daarmee op NAP circa +66,26 en `groundOffsetMetres` is 0. Aan de west- en zuidkant zit de voet tot 0,3 m in het terrein. De heuvel zelf staat niet in het model. Het model vervangt BAG-pand 1774100000252343, zodat de PDOK-reconstructie (een cilinder tot het dak van het reservoir met een blok voor de traptoren) verdwijnt.

## Onderdeel `building:reservoircilinder-met-plint-en-dakrand-en-vierkante-traptoren`

Hoogtes boven z = 0 (NAP +66,26).

- Plint: 96-hoek met straal 4,42 m tot 1,2 m, afzaat van 45 graden naar de cilinder.
- Cilinder: straal 4,32 m (BAG) tot 7,15 m.
- Betonnen dakrand: onderkant van 45 graden naar 4,45 m op 7,28 m, bovenkant op 7,79 m (AHN-DSM NAP +74,05). Daarbinnen het verdiepte dak van het reservoir op 6,89 m (AHN-DSM NAP +73,15; 3D BAG 50e percentiel 73,17); de ring van dakrand en borstwering is 0,9 m breed.
- Traptoren: vierkant van 4,11 × 4,11 m (BAG-breedte; het register noemt hem vierkant), van x = -6,24 tot -2,13 en y ±2,055, dus 2,43 m buiten de cilinder; boven het dak van de cilinder staat ook de oostgevel vrij. Betonnen daklijst 0,08 m over, met een onderkant van 45 graden van 9,37 tot 9,45 m, dak op 9,62 m (AHN-DSM NAP +75,85 tot 75,93; 3D BAG h_dak_max 75,93).
- Westgevel: drie spleetvensters van 0,3 m breed om de 0,48 m, van 3,7 tot 8,8 m, als nis van 0,3 m met een plafond van 56 graden.
- Noordgevel: deur van 1,1 m breed midden in het deel buiten de cilinder, tot 2,25 m met een spitse top van 52 graden tot 2,95 m, als nis van 0,35 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Ootmarsum)): 1934, 9,05 m, 216 m³, de laagste watertoren van Nederland, op de Kuiperberg.
- [Rijksmonumentenregister 513204](https://monumentenregister.cultureelerfgoed.nl/monumenten/513204): cilinder met vlakbodemreservoir op een bakstenen plint, betonnen dakranden, spuwers circa 1 m onder de dakrand, vierkante traptoren deels in de cilinder, drie spleetvensters met betonnen lateien in de westgevel, deur onder een rondboog met naambord in de noordgevel, vlaggenmast, vijf treden op het talud.
- BAG-pand 1774100000252343 (PDOK, bouwjaar 1935, 2026-11-06): plattegrond van cilinder en traptoren.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, dak van het reservoir, dakrand en dak van de traptoren.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.1774100000252343: dakhoogtes en maaiveld.
- PDOK-luchtfoto (Actueel_orthoHR): vierkante traptoren aan de westkant, ring van de dakrand.
- PDOK-terrein (2026-11-06): maaiveld rond de voet.
- Foto op Wikimedia Commons: "Ootmarsum Watertoren 8948.JPG" (10 december 2006, vanuit het zuidwesten: westgevel met de spleetvensters, zuidgevel van de traptoren, plint en dakrand van de cilinder, daklijst).

## Geschat en weggelaten

Geschat: de hoogte van de plint, de dikte en de onderkant van de dakrand, het overstek van de daklijst en de hoogte en de breedte van de spleetvensters uit die ene foto (onzekerheid circa 0,3 m); de diepte van de traptoren (4,11 m, vierkant volgens het register; het AHN-dak van de traptoren loopt tot circa x = -2,2); de maat, de plaats en de boog van de deur (alleen uit het register; geen foto van de noordkant); de diepte van de nissen. De spleetvensters zijn verbreed tot 0,3 m (in het echt circa 0,15 m) en de ring van dakrand en borstwering tot 0,9 m (in het echt circa 0,5 m), voor 1:1000. De oost- en noordkant van de cilinder staan op geen foto; daar is niets bijzonders aangenomen.

Weggelaten: de spuwers en de uitsparingen onder de dakrand, de kleine luiken in de zuidgevel van de traptoren, de ventilatieroosters, de lateien, de vlaggenmast, de antennemast en de leidingen (kleiner dan 0,9 m), de vijf treden op het talud (zitten in het PDOK-terrein; 0,3 m aantrede wordt op 1:1000 een helling) en de heuvel (PDOK-terrein).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: afzaat, dakrand en daklijst met een onderkant van 45 graden, spleten met een plafond van 56 graden, deur met een spitse top van 52 graden. In een tegelexport op 1:1000 (80 m) vervangt het model het PDOK-pand en eindigt het op dezelfde hoogte (15,22 mm tegen 15,23 mm). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder met een blok, beide met een vlak dak) aan elke kant de plint, de uitstekende dakrand met het verdiepte dak en de daklijst van de traptoren, aan de westkant de drie spleetvensters en aan de noordkant de deur.

Controle-URL: http://localhost:3000/kaart/52.40669/6.88409/200/1x1/0
