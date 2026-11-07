# Watertoren Roelofarendsveen (Roelofarendsveen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-roelofarendsveen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is een achthoekig prisma (vierkant met afgeschuinde hoeken), de kroonlijst een kraag onder 45 graden, het dak een achtkante piramide, het balkon en de tulpen zijn hulls met een onderkant onder 45 graden, het paviljoen is de BAG-contour als prisma met een verdiept dakterras, en vensters en etalages zijn nissen.

De watertoren van Roelofarendsveen (gemeente Kaag en Braassem, gemeentelijk monument) is in 1932 gebouwd naar ontwerp van Hendrik Sangster: 31,5 m hoog met een reservoir van 150 m³. Het is een betonnen toren op een vierkant met afgeschuinde hoeken, vier brede en vier smalle zijden, met een kroonlijst en een lage achtkante piramide als dak. De toren is verbouwd tot woon- en bedrijfsruimte, met vensters op alle lagen en een balkon aan de zuidzijde. Aan de voet staat een paviljoen van donkere baksteen met een bloemenwinkel, etalages onder een witte luifel en een dakterras. Sinds 1986 staat op elk van de vier brede zijden een meters hoge tulp.

## Bestanden

- `watertoren-roelofarendsveen.glb`: één node `building:watertoren-schacht-balkon-dak-tulpen-en-winkelpaviljoen`, op maaiveld.
- `watertoren-roelofarendsveen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-roelofarendsveen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [103390.1, 468607.3] (52,203157 N, 4,632228 O), het hart van de toren. Maaiveld AHN-DTM NAP -0,65 (ring van 8 tot 14 m: mediaan -0,59 tot -0,73; 3D BAG -0,72). De toren staat 9 graden rechtsom gedraaid ten opzichte van RD: een achthoekfit op het AHN-DSM boven 20 m geeft -9 graden met het hart op [103390.3, 468607.5], de BAG-contour volgt de zuidgevel en de zuidoostelijke afschuining en geeft het hart op [103390.06, 468607.24], en de top van het dak ligt in het DSM op [103389.9..103390.1, 468607.2]. Lokale +X is de zuidgevel met het balkon en de winkelpui (RD -99 graden; `xAxis` [-0.15643, -0.98769]); +Y wijst naar het oosten. `groundHeight` 42,51 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` rond het paviljoen (zuid 42,712, oost 42,727, noordoost 42,620, west 42,514; gemeten 2026-11-07); het PDOK-pand begint op 42,56. Toren en paviljoen zijn samen BAG-pand 1884100000002910 (bouwjaar 1931); het model vervangt dat hele pand. De buurpanden (een berging op 22 m ten oosten, een groot pand op 33 m ten oosten, de flats aan de overkant van de sloot) raken het model niet.

## Onderdeel `building:watertoren-schacht-balkon-dak-tulpen-en-winkelpaviljoen`

Maten in het lokale stelsel, hoogtes boven maaiveld (NAP -0,65).

- Schacht: vierkant van 7,6 m (halve zijde 3,8 m) met de hoeken afgeschuind op 4,4 m van het hart (afschuiningen van 1,95 m, brede zijden van 4,84 m), tot 27,6 m.
- Kroonlijst: 0,2 m uitkragend, onderkant onder 45 graden van 27,4 tot 27,6 m, bovenkant op 28,2 m.
- Dak: achtkante piramide van de kroonlijst (28,2 m) tot de top op 31,1 m, helling 36 graden.
- Zuidgevel (+X): pui van twee lagen boven het paviljoen (3,4 m breed, 3,9 tot 8,0 m), twee smalle hoge vensters aan de oostkant (8,9 tot 11,0 en 12,0 tot 14,0 m), een venster op 11,6 m en een paar op 14,3 m naast de steel van de tulp, het balkon (4,6 m breed, 1,2 m diep, vloer 16,9 m, dichte borstwering tot 17,9 m, onderkant onder 49 graden), de balkondeur (3,0 m breed, 18,0 tot 19,4 m) en twee vierkante vensters op 21,0 m.
- Oost-, west- en noordgevel: twee smalle hoge vensters (8,0 tot 10,0 en 13,5 tot 15,5 m) en een liggend venster (11,8 tot 12,7 m) aan de kant van de zuidgevel.
- Vensters als nissen van 0,3 tot 0,35 m diep met een plafond van 56 graden.
- Tulpen: op elk van de vier brede zijden een kelk van 2,3 × 3,1 m als reliëf van 0,25 m, van 22,7 tot 25,8 m, onderkant onder 45 graden.
- Paviljoen: de BAG-contour als prisma tot 3,7 m; dakterras 0,6 m verdiept binnen een borstwering van 0,9 m (vloer 3,1 m), behalve het oostelijke deel naast de toren (trappenhuis met hellend glazen dak) dat op 3,7 m blijft. Etalages als nis van 0,3 m (0 tot 2,45 m, plafond onder 49 graden) langs de ronde zuidzijde en 2,6 m aan de westzijde; een luifel van 0,4 m uitsteek (onderkant van 2,5 tot 3,0 m, bovenkant 3,2 m) langs de hele zuid- en westkant.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Roelofarendsveen)): 1932, Hendrik Sangster, 31,5 m, reservoir 150 m³, bloemenwinkel, sinds 1986 een tulp op elk van de vier zijden, gemeentelijk monument.
- BAG-pand 1884100000002910 (PDOK, 2026-11-07): 18 hoekpunten, 152 m², bouwjaar 1931; de contour is het paviljoen met de zuidgevel en de zuidoostelijke afschuining van de toren.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-07): maaiveld NAP -0,65, top van het dak NAP +30,46, kroonlijst circa +27,6 à +27,9, breedte 7,5 tot 7,7 m over de brede zijden en 8,5 tot 8,7 m over de afschuiningen, paviljoendak NAP +2,45 met een rand tot +3,0 à +3,3, oostelijk deel +2,8 à +3,4, balkon +15 à +17,5 tot circa 1,2 m voor de zuidgevel.
- 3D BAG (2026-11-07): nok NAP +30,54, maaiveld -0,72.
- Luchtfoto (PDOK, 4 en 8 cm, 2026-11-07): achtkant dak, dakterras met borstwering, trappenhuis aan de oostkant.
- Foto's op Wikimedia Commons: "Roelofarendsveen watertoren.jpg" (2010, vanuit het zuiden: winkelpui, luifel, balkon, vensters), "Watertoren Roelofarendsveen.jpg" (2007, vanuit het zuidwesten: twee gevels met tulpen, de afschuiningen en het dak), "Roelofarendsveen, watertoren in straatzicht foto2 2009-10-25" en "Roelofsarendsveen, de watertoren in straatzicht IMG 0045 2021-08-03" (hoogtes van vensters, balkon en tulpen).

## Geschat en weggelaten

Geschat: de afschuiningen (4,4 m van het hart) uit de breedtes in het AHN en de BAG-contour; de draaiing (-9 graden) uit de achthoekfit en de BAG-contour; de kroonlijst (0,2 m, 27,4 tot 28,2 m) uit het AHN en de foto's; de hoogtes en breedtes van vensters, balkon, balkondeur en tulpen uit de foto's vanuit het zuiden en zuidwesten (schaal uit de torenhoogte); de vensters op de oost-, west- en noordgevel (alleen de westgevel staat deels op een foto; de noordgevel staat op geen foto); het balkon met een dichte borstwering (in het echt een open hekwerk) en een onderkant onder 49 graden; de tulpkelk als bol reliëf zonder punten; de etalages en de luifel van het paviljoen (hoogte 2,45 tot 3,2 m, uitsteek 0,4 m) uit de foto's; het dakterras en de borstwering van 0,9 m (in het echt dunner) zodat het deel printbaar blijft; het oostelijke deel van het paviljoen als vlak dak op 3,7 m.

Weggelaten: de stelen en bladeren van de tulpen (circa 0,4 m breed, te dun voor 1:1000), de stalen antennebeugels op de hoeken en de antennepanelen op de afschuiningen, de kleine balkons op de oostgevel, het hekwerk en het meubilair op het dakterras, de beplanting op de noordpunt van het paviljoen, de vlaggenmasten, de belettering en het logo op het paviljoen, en de kozijnen.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 × 80 m rond de toren, ondersteuning v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand; met en zonder ondersteuning heeft het model hetzelfde volume. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een blokvormige achthoek met een plat paviljoen) de afschuiningen, de kroonlijst, het achtkante piramidedak, de vensters, het balkon, de vier tulpen, de etalages met de luifel en het dakterras met borstwering.

Controle-URL: http://localhost:3000/kaart/52.20317/4.63222/200/1x1/0
