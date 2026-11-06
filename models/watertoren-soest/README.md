# Watertoren Soest (Soest)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-soest.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, schacht, reservoir, borstwering en trappenhuis zijn cilinders (72 zijden), de onderkant van het reservoir en de latei boven de ingang zijn kegelvlakken, de steunberen zijn radiale blokken, en de vensters en de deur zijn nissen.

De watertoren aan de Oranjelaan 36 in Soest (rijksmonument 512722) is in 1931 gebouwd voor de Arnhemsche Waterleiding-Maatschappij naar ontwerp van H.F. Mertens uit Bilthoven. Hij staat op het hoogste punt van de Soester Eng (circa NAP +19,8) en is daardoor maar 23,7 m hoog; het stalen reservoir van 200 m³ (6 m doorsnede) stond in de bovenste cilinder. In 1984 buiten gebruik, in 1985-1986 verbouwd tot woonhuis en in 1993 (ZECC architecten) tot een woning van negen lagen; het reservoir is daarbij verwijderd en het dak werd een dakterras met een glazen trappenhuis. De toren is rond en van baksteen: een blinde plint met alleen de ingang, een teruggezette schacht van vier lagen met acht steunberen die het uitkragende reservoir dragen, vierlichtvensters tussen de steunberen, boven de ingang een betonnen latei met een muur die tot voor het reservoir doorloopt, en een reservoircilinder met twee rijen platte driedelige vensters en een kleinere cilinder erop.

Er is ook een aparte Watertoren Soestdijk; dit model is de toren in Soest zelf.

## Bestanden

- `watertoren-soest.glb`: één node `building:watertoren-plint-steunberen-reservoir-en-dakterras`, op maaiveld.
- `watertoren-soest.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-soest-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [148410.4, 466137.14] (52,18333 N, 5,29082 O), het hart van BAG-pand 0342100000009497 (cirkelfit op de 22 hoekpunten, straal 4,41 m). Maaiveld AHN-DTM NAP +19,8 (ring van 6 tot 10 m: mediaan 19,82 tot 19,64; 3D BAG-maaiveld 19,65). Lokale +X is de as van de ingang naar het zuidwesten (RD -151,5 graden; `xAxis` [-0.87882, -0.47716]): daar komt het tuinpad van de Oranjelaan aan (-154 graden op de luchtfoto), en de steunberen staan op 22,5 + 45k graden van die as (AHN-DSM in de ring van 4 tot 4,7 m: fase 5 à 13 graden; voeten van drie steunberen op de luchtfoto op -124, -84 en -42 graden). `groundHeight` 62,98 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 6 m van het hart (ingang 62,98, links 63,03, achter 63,15, rechts 63,02; gemeten 2026-11-06); het PDOK-pand begint op 62,88. Het model vervangt BAG-pand 0342100000009497, zodat de PDOK-cilinder verdwijnt; de buurpanden (bergingen op 8 tot 10 m ten oosten, de woningen aan de Oranjelaan) raken het model niet.

## Onderdeel `building:watertoren-plint-steunberen-reservoir-en-dakterras`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Plint: cilinder met straal 3,85 m tot 3,0 m, blind behalve de voordeur (nis van 1,1 m breed en 0,4 m diep, van 0 tot 2,4 m, 0,45 m rechts van de as gezien van buiten).
- Schacht: cilinder met straal 3,4 m tot 13,85 m.
- Steunberen: acht radiale blokken van 1,0 m breed op 22,5 + 45k graden, buitenvlak op 4,42 m, tot 15,0 m (net in het reservoir); de twee naast de ingang tot 16,2 m.
- Vierlichtvensters als nissen van 1,3 × 0,9 m (0,35 m diep, plafond 56 graden) in de vier schuine traveeën (45, 135, 225 en 315 graden) op 3,2, 6,3, 9,4 en 12,5 m; de traveeën op 90, 180 en 270 graden blind.
- Ingang: tussen de steunberen naast de ingang een latei met een onderkant onder 46 graden van de schacht (12,85 m) tot de gevel (13,92 m), daarop een gebogen muur op 4,42 m tot de deklijst op 16,2 m, deels voor het reservoir; groot venster (1993) als nis van 2,2 × 0,8 m op 14,7 m.
- Reservoir: cilinder met straal 4,1 m van 14,6 tot 23,1 m, onderkant onder 47 graden van de schacht (13,85 m) tot de wand (14,6 m); twee rijen van acht driedelige vensters als nissen van 1,6 × 0,8 m op 16,9 en 21,3 m.
- Dak: borstwering (de kleinere cilinder) van straal 2,45 tot 3,35 m tot 24,0 m, verdiept dakterras op 22,85 m, glazen trappenhuis met straal 0,95 m tot 24,95 m, zinken kap met straal 1,05 m tot 25,15 m en ventilatiekap met straal 0,6 m tot 25,4 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Soest)): 1931, H.F. Mertens, 23,7 m, reservoir 200 m³ met 6 m doorsnede, woonhuis sinds 1993, rijksmonument 512722.
- [Rijksmonumentenregister 512722](https://monumentenregister.cultureelerfgoed.nl/monumenten/512722): ronde toren van baksteen; blinde plint met de ingang aan de westzijde; teruggezette schacht van vier lagen met geprofileerde steunberen die het reservoir in de uitkragende cilinder dragen; vierlichtvensters aan vier zijden tussen de steunberen; twee steunberen naast de ingang, vlak onder het reservoir verbonden door een betonnen latei waarop een muur tot voor de reservoircilinder doorloopt en eindigt in een deklijst; reservoircilinder met twee rijen platte driedelige vensters; daarop een kleinere cilinder met plat dak; 23,7 m hoog.
- ZECC architecten, herbestemming tot woonhuis over negen lagen (foto's Jeroen Musch, [divisare.com](https://divisare.com/projects/18063-zecc-architecten-jeroen-musch-herbestemming-watertoren-soest-woonhuis-over-9-lagen)): vooraanzicht frontaal op de ingang (hoogtes van plint, vensters, latei, muur, steunbeerkoppen en reservoirvensters), dakterras met het glazen trappenhuis, plattegronden (acht radiale steunberen, schacht circa 3,4 m en reservoir circa 4,1 m bij een buitenmaat van 4,4 m) en doorsnede (reservoirbodem circa 14,1 m, vensters op circa 3,4, 6,9, 10,3 en 13,6 m, reservoirvensters op circa 17,0 en 21,5 m, borstwering 23,9 m).
- BAG-pand 0342100000009497 (PDOK, 2026-11-06): cirkel met straal 4,41 m, bouwjaar 1931.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +19,8, reservoirrand NAP +42,9 à +43,0 tot circa 4,1 m van het hart, borstwering NAP +43,7 à +43,8 (3D BAG: dakmaximum 43,77), dakterras NAP +42,65, trappenhuis NAP +45,19; steunberen in de ring van 4 tot 4,7 m.
- Luchtfoto (PDOK, 8 cm, 2026-11-06): reservoirrand tot 4,0 m, borstwering van 2,8 tot 3,35 m, trappenhuis circa 0,9 m, tuinpad naar de ingang aan de zuidwestkant.
- Foto op Wikimedia Commons: "Soest Watertoren 9167" (2006, vanuit het westen): steunberen, latei met muur en venster, vensters onder het reservoir, reservoirvensters en de borstwering.

## Geschat en weggelaten

Geschat: de stralen van plint (3,85 m), schacht (3,4 m) en reservoir (4,1 m) uit de plattegronden, het AHN en de luchtfoto; de breedte van de steunberen (1,0 m) en hun hoogte (15,0 m, en 16,2 m naast de ingang) uit het vooraanzicht; de hoogte van de plint (3,0 m), de latei en de onderkant van het reservoir uit vooraanzicht en doorsnede; de onderkant van het reservoir en de latei als rechte kegel onder 46 à 47 graden in plaats van de gebogen betonnen rand; in welke traveeën vensters zitten (de vier schuine, zoals op de foto's van de voorzijde; de achterkant staat niet op een foto) en de vensters als nissen van minstens 0,8 m hoog (in het echt de reservoirvensters circa 0,4 m); de dikte van de borstwering (0,9 m, in het echt circa 0,55 m) zodat het deel printbaar blijft op 1:1000; de maten van het trappenhuis uit de foto van het dakterras en het AHN.

Weggelaten: het profiel van de steunberen (verspringingen kleiner dan 0,9 m), de deklijst als lijst, kozijnen, de vlaggenmast, het hekwerk met gemetselde penanten langs de Oranjelaan (geen deel van het pand) en de schuurtjes op het erf (eigen BAG-panden, in PDOK op hun eigen hoogte).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: onderkant van het reservoir 47 graden, latei 46 graden, nissen met een plafond van 56 graden, kap van het trappenhuis 52 graden. Een export op 1:1000 (100 × 100 m rond de toren, ondersteuning v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder met plat dak) de plint met deur, de acht steunberen, de vensters, de latei met de muur boven de ingang, het uitkragende reservoir met twee rijen vensters, de borstwering om het dakterras en het trappenhuis.

Controle-URL: http://localhost:3000/kaart/52.18333/5.29080/200/1x1/0
