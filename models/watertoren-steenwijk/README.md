# Watertoren Steenwijk (Steenwijk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-steenwijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: toren, lijsten en balustrade zijn blokken en convexe omhullenden, de spits en de hoektorentjes achtkante piramides (omhullende van achthoeken), de kerkdaken planvergelijkingen boven de BAG-plattegrond met één helling per dak, vensters en nissen spitsboognissen.

De "watertoren" van Steenwijk is geen losse toren: in 1907 is een reservoir van 145 m³ geplaatst in de toren van de Grote of Sint-Clemenskerk (rijksmonument 34576) aan de Kerkstraat. Kerk en toren vormen samen één BAG-pand (1708100000005816), dus het model vervangt het hele pand: de toren in detail en de kerk als hallenkerk. De Wikipedia-lijst noemt 85 m (de tekst van het artikel 87 m); volgens het AHN-DSM ligt de top van de spits op NAP +85,5 bij een maaiveld van NAP +4,7, dus 80,8 m boven maaiveld. De 85 m lijkt de NAP-hoogte of een afgeronde waarde met het kruis en de haan.

## Bestanden

- `watertoren-steenwijk.glb`: één node `building:kerktoren-met-watertoren-en-grote-kerk`, op maaiveld.
- `watertoren-steenwijk.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-steenwijk-1-1000.stl`: alles samen op 1:1000 (71,8 × 27,9 × 81,1 mm).

## Oorsprong en oriëntatie

RD-oorsprong [204085.1, 533633.3] (52,78776 N, 6,11481 O), de as van de spits (top van het AHN-DSM; het hart van de torentop in het DSM ligt er 0,05 m naast), op het maaiveld aan de voet van de toren: AHN-DTM NAP +4,7 (west 4,5 à 4,6, rond de toren 4,6 à 4,8). Lokale +X wijst naar RD-richting -1,4 graden (oost, `xAxis` [0.9997, -0.02443]): de as van het schip uit de drie nokken in het AHN-DSM en de noord- en zuidmuur in de BAG. +Y wijst naar het noorden; het westportaal zit in de -X-zijde. `groundHeight` 46,66 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vijf `groundSamplePoints` rond de toren (west 46,70, noordwest 46,66, zuidwest 46,67, noord 46,78, zuid 46,91). Het terrein loopt naar het oosten op tot 47,8 achter de koren: daar staan de muren 1,1 m in het maaiveld. Het model vervangt BAG-pand 1708100000005816 (kerk en toren); de dichtstbijzijnde buurpanden in de PDOK-tegel liggen 10 m en meer van het model.

## Onderdeel `building:kerktoren-met-watertoren-en-grote-kerk`

Maten in het lokale stelsel, hoogtes boven maaiveld (NAP +4,7).

### Toren

- Romp: 10,4 × 10,6 m (u -5,2 tot 5,2, v -5,3 tot 5,3; AHN-DSM bovenaan 10,4 × 10,4 m, BAG aan de voet 10,2 × 11,2 m), tot de omgang op 44,4 m. Plint tot 1,2 m, 0,15 m uitstekend en schuin afgezet.
- Waterlijsten op 12,2, 23,6 en 34,4 m: 0,4 m hoog, 0,15 m uitstekend, onderkant 50 graden.
- Eerste geleding: westportaal als spitsboognis van 2,6 m breed tot 11,0 m, 0,5 m diep, met daarin het spitsboogvenster (1,6 m, van 4,9 tot 10,5 m) en de deur (1,6 m, tot 3,8 m). In de noord- en zuidzijde een blinde spitsboognis van 1,6 m van 5,0 tot 11,0 m.
- Tweede tot vierde geleding: per zijde drie hoge spitsboognissen van 1,6 m (0,35 m diep) op -3, 0 en +3 m, van 12,85 tot 22,6 m, van 24,25 tot 33,2 m en van 35,05 tot 42,3 m. In de bovenste twee geledingen in de middelste nis een diepere galmopening van 1,1 m. De oostzijde van de tweede geleding ligt achter het dak van het middenschip en heeft geen nissen.
- Kraaglijst van 43,3 tot 44,2 m, 0,35 m uitstekend met een onderkant van 50 graden; daarop de balustrade tot 45,3 m (AHN-DSM NAP +50,0), 0,9 m dik, met per zijde zes blinde openingen van 0,9 × 0,5 m.
- Vier hoektorentjes: achtkant van 1,6 m op de hoeken van de kraaglijst (hart 0,5 m binnen de gevels), romp tot 47,3 m, achtkant spitsje tot 51,4 m (AHN-DSM tot circa NAP +55).
- Spits: ingesnoerde voeten van een vierkant van 7,7 m op de omgang naar de achthoek (apothema 3,25 m) op 48,0 m; achtkante naald met een licht bol profiel (apothema 2,23 op 61,0 m, 1,03 op 71,6 m). Vier wijzerplaten van 2,3 m (middelpunt 49,2 m, 0,15 m voor het vlak, rand 50 graden) en vier dakkapelletjes van 1,0 m halverwege (onderkant 48 graden, zadeldakje tot 62,4 m).
- Lantaarn: achtkant (apothema 1,03 m) van 71,6 tot 75,2 m met vier spitsboognissen van 0,7 m, kroonlijst van 1,2 m (onderkant 50 graden), achtkant spitsje tot 79,0 m, bol als dubbele kegel tot 79,75 m en een naald voor kruis en haan tot 80,8 m (AHN-DSM NAP +85,5).

### Kerk

- Plattegrond uit de BAG in het lokale stelsel: noordbeuk tussen v 4,9 (kilgoot) en 10,0 (noordmuur), u 4,65 tot 55,8; middenschip tussen v -4,7 en 4,9 met een 3/8-koor (oostvlak op u 64,8); zuidbeuk tussen v -15,05 en -4,7 met een 3/8-koor (oostvlak op u 65,25). De westmuur van schip en beuken staat op u 4,65, tegen de toren.
- Goot op 13,4 m (AHN-DSM NAP +18,1); kilgoten op goothoogte. Daken als planvergelijkingen z = 13,4 + k · afstand tot de gootrand: noordbeuk k 1,53 (57 graden, nok 17,3 m), middenschip k 1,33 (53 graden, nok 19,78 m), zuidbeuk k 1,31 (53 graden, nok 20,18 m); AHN-DSM: nokken NAP +22,0, +24,5 en +24,9. De beuken hebben een schild aan de westkant, de noordbeuk ook aan de oostkant; de koren een veelhoekig schild met dezelfde helling. Het middenschip loopt aan de westkant tegen de toren.
- Steunberen van 1,0 m breed op de BAG-posities (noordmuur 1,1 m diep, zuidmuur 1,45 m, koren 1,2 m radiaal op de hoeken, schuin op de westhoeken van de beuken en de oosthoek van de noordbeuk): volle diepte tot 6,0 m, afzaat onder 54 graden, daarboven 0,5 m minder diep tot 10,2 m en een schuine kap tegen de muur tot 12,6 m.
- Vensters als spitsboognissen van 0,35 m tussen de steunberen, van 3,6 tot 12,2 m, 2,4 m breed (smaller waar de travee smal is; in de lange travee van de noordmuur twee), in elk van de drie koorvlakken een venster van 2,0 m, en vensters in de oostmuur van de noordbeuk en de westmuren van beide beuken.
- Dakkapellen van 1,0 m met een zadeldakje: drie op het zuidelijke dakvlak van de zuidbeuk (u 12, 30 en 48), twee op het noordelijke dakvlak van de noordbeuk (u 14 en 36).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Steenwijk)): reservoir van 145 m³ in 1907 in de kerktoren, hoogte 85 m (infobox) of 87 m (tekst).
- Rijksmonumentenregister, monument 34576 (Grote of Sint-Clemenskerk).
- BAG-pand 1708100000005816 (PDOK, 2026-11-06): plattegrond van kerk en toren met steunberen en koorsluitingen.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +4,7; balustrade NAP +50,0, hoektorentjes tot circa +55, lantaarn circa +80, top NAP +85,5; goot +18,1, nokken +22,0, +24,5 en +24,9, kilgoten op goothoogte; dakhellingen.
- Foto's op Wikimedia Commons: "Steenwijkerland-Steenwijk, de Grote of Sint-Clementskerk RM34576 IMG 8488 2023-09-11 15.09" (vanuit het westen, telelens: 29,4 px/m tot de balustrade, daarboven 26,2 px/m verankerd op de lantaarn in het AHN): geledingen, waterlijsten, nissen, portaal, kraaglijst, balustrade, hoektorentjes, broach, wijzerplaten, dakkapelletjes, lantaarn en het spitsprofiel; "34576 Grote of Sint-Clemenskerk 2" (zuidzijde: steunberen, vensters, dakkapel); RCE-foto's 20205452, 20205455 en 20205441 (koren, schilddaken, noordzijde) en 20205440 (toren).

## Geschat en weggelaten

Geschat: alle hoogtes van de geledingen, nissen, het portaal, de kraaglijst, de hoektorentjes, de broach, de wijzerplaten, de dakkapelletjes en de lantaarn uit één foto (schaal verankerd op de balustrade en de lantaarn in het AHN); het spitsprofiel uit de breedtes op dezelfde foto (het AHN ziet de steile leien spits maar op enkele punten, die er binnen 1 à 2 m mee kloppen); de torenmaten als compromis tussen de BAG aan de voet en het DSM bovenaan; de steunberen (hoogtes, afzaten), de vensterhoogtes en de plaats van de dakkapellen uit de foto's; dat elke zijde van de toren dezelfde nissen heeft.

Weggelaten: het kruis met de haan (dunner dan 0,9 m, als naald tot de top in het AHN), het maaswerk en de galmborden, het opengewerkte vierpasmotief van de balustrade (blinde openingen), de kruisjes op de koorschilden, de goten en de dakoverstek (minder dan 0,3 m), de verdiepte toegang met lage muurtjes aan de zuidkant (in de BAG binnen het pand, maar in het AHN-DSM niet hoger dan circa 1 m boven maaiveld) en het kleine driehoekige uitsteeksel in de noordmuur (circa 0,8 m).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume vrijwel niet (minder dan 0,01 %): waterlijsten, kraaglijst, rand van de lantaarn en wijzerplaten 50 graden, nissen met een plafond van 56 tot 64 graden, dakkapelletjes in de spits 48 graden, steunberen met afzaten naar de muur. Een export op 1:1000 van een uitsnede van 100 m rond de kerk bevat het model met het volume van de GLB plus de voet tot de onderplaat en een ondersteuning van 0,2 mm³; het PDOK-pand van de kerk valt weg. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een toren als glad blok tot circa NAP +52 zonder spits en een kerk met drie gladde zadeldaken) de naaldspits met broach, wijzerplaten, dakkapelletjes, lantaarn en bol tot 80,8 m, de hoektorentjes, de balustrade en kraaglijst, de waterlijsten en de spitsboognissen per geleding, het westportaal, de steunberen met afzaten, de vensters, de koorschilden en de dakkapellen.

Controle-URL: http://localhost:3000/kaart/52.78776/6.11481/200/1x1/0
