# Watertoren Woerden (Woerden)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-woerden.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, schacht, uitkraging, reservoir en borstwering zijn afgeknotte kegels en cilinders (80 zijden), de consoles zijn radiale wiggen, het portaal is een prisma met zadeldakje en tuitgevel, en vensters, deur en kantelopeningen zijn nissen en sneden.

De watertoren aan de Oostsingel 1A in Woerden (rijksmonument 512630, complex 512629) is in 1905-1906 gebouwd naar ontwerp van J. Schotel, na de aanleg van de waterleiding in 1903, in neorenaissance- en art-nouveautrant. Eén reservoir van 75 m³; tot 1979 in gebruik, in 1984 gerestaureerd, sinds 2014 een woning ("De Kroon van Woerden"). De ronde toren staat op een lage aangeaarde verhoging met de oude waterkelder en bestaat uit drie geledingen: een licht taps toelopende voet met het ondiep uitgebouwde portaal onder een zadeldakje met tuitgevel en tegenover de ingang een rechthoekig venster; een taps toelopende schacht met tien in hoogte verspringende vensters; en de overkragende gele reservoirgeleding met tien keperboogvensters, een rondboogfries en kantelen rond het vlakke dak. Uitkragende banden scheiden de geledingen.

Het machinegebouw naast de toren (rijksmonument 512631, BAG-pand 0632100000017389) hoort bij hetzelfde complex maar is geen deel van dit model; het blijft de PDOK-reconstructie. De Kanzo-taak noemde 512631 als monumentnummer, maar dat is het machinegebouw; de toren is 512630.

## Bestanden

- `watertoren-woerden.glb`: één node `building:watertoren-voet-portaal-schacht-reservoir-en-kantelen`.
- `watertoren-woerden.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-woerden-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [120552.67, 455716.78] (52,08864 N, 4,88459 O), het hart van BAG-pand 0632100000017372 (cirkelfit op de 33 hoekpunten, straal 3,96 m). Die BAG-contour is de bovenaanzichtlijn van het reservoir; de voet zelf is smaller (straal 3,45 m). Lokale +X is de as van het portaal naar het westen (RD -175 graden; `xAxis` [-0.99619, -0.08716]): het portaal staat op de luchtfoto's van 2021 en 2024 aan de westkant, en op de foto's vanaf de Oostsingel en vanaf de brug in het zuiden staat het links op de rand van de toren. Een render vanuit de standplaats van foto 6805 laat het portaal op dezelfde plek zien.

Hoogtes: `groundHeight` 45,79 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 4,5 m van het hart, schuin tussen portaal en gevels (portaal-links 46,09, achter-links 45,79, achter-rechts 46,00, portaal-rechts 46,04; gemeten 2026-11-06). Het nulpunt van het model ligt daarmee op 45,69 = NAP +2,29 (het PDOK-terrein is hier NAP + 43,4). De voet staat op de verhoging op NAP +2,65 (AHN-DTM tussen 4,5 en 5 m van het hart), 0,36 m boven het nulpunt; de straat naast de verhoging ligt op NAP +0,9, waar ook het PDOK-pand begint (44,30). De verhoging zelf zit in het PDOK-terrein en staat niet in de GLB. Het model vervangt BAG-pand 0632100000017372, zodat de PDOK-cilinder verdwijnt. De buurpanden raken het model niet (machinegebouw op 9 m, woningen op 10 tot 20 m).

## Onderdeel `building:watertoren-voet-portaal-schacht-reservoir-en-kantelen`

Maten in het lokale stelsel, hoogtes boven het nulpunt van het model (voet op 0,36 m).

- Voet: afgeknotte kegel van straal 3,45 m (onder) tot 3,1 m op 5,16 m; uitkragende band tot straal 3,3 m van 5,16 tot 5,66 m, onderkant onder 45 graden. Recht tegenover de ingang een rechthoekig venster als nis van 0,9 × 1,4 m op 2,16 m.
- Portaal (+X): 2,6 m breed en tot 4,25 m van het hart, gootlijst op 3,86 m, zadeldakje tot 5,11 m, tuitgevel van 0,35 m dik en 2,8 m breed tot 5,36 m. Spitsboogdeur (dubbele deur) van 1,4 m breed van 0,96 tot de punt op 3,76 m (boogzijden 52 graden), 0,4 m diep. Stoep van 2,0 × 0,8 m tot 0,96 m.
- Schacht: afgeknotte kegel van straal 2,85 m op 5,66 m tot 2,55 m op 14,41 m; tien rechthoekige vensters van 0,8 × 2,0 m (nissen van 0,3 m, plafond 56 graden) op 18 + 36k graden, in hoogte verspringend van 6,36 tot 11,76 m langs de trap.
- Band boven aan de schacht tot straal 2,72 m van 14,41 tot 15,31 m.
- Uitkraging: binnenkegel van straal 2,5 m op 14,96 m tot 3,95 m op 16,56 m (41 graden) met zestien consoles van 0,5 m breed die 0,17 m voor de kegel liggen (43 graden), tot de onderrand.
- Onderrand van het reservoir: straal 4,12 m van 16,73 tot 17,26 m, onderkant onder 45 graden, bovenkant afgeschuind naar de reservoirwand.
- Reservoirgeleding: cilinder met straal 3,97 m tot 21,66 m, tien keperboogvensters van 0,8 m breed van 18,79 m tot de punt op 21,1 m (boogzijden 53 graden), 0,3 m diep, één boven het portaal.
- Rondboogfries: kraag onder 45 graden naar straal 4,12 m op 21,81 m; daarop de borstwering (binnenstraal 3,67 m) tot de kantelopeningen op 23,61 m en twaalf kantelen van circa 1,0 m tot 24,51 m (NAP +26,80).
- Dak: vlak op 23,46 m (NAP +25,75) met een glazen dakluik van 2,0 × 1,0 × 0,5 m op 2,6 m van het hart naar het noordwesten.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Woerden)): J. Schotel, 1905-1906, 27 à 28 m, reservoir 75 m³, doorsnede binnen 5,70 m onder en 7,10 m boven; woning sinds 2014.
- [Rijksmonumentenregister 512630](https://monumentenregister.cultureelerfgoed.nl/monumenten/512630): op een lichte aangeaarde verhoging met waterkelder; drie geledingen gescheiden door uitkragende banden; 28 m; portaal onder een zadeldakje met tuitgevel en een trap; rechthoekig venster tegenover de ingang; tien in hoogte verspringende vensters; overkragende geleding met tien keperboogvensters, rondboogfries en kantelen; vlak dak met windvaan.
- BAG-pand 0632100000017372 (PDOK, 2026-11-06): cirkel met straal 3,96 m, bouwjaar 1906.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): vlak dak NAP +25,7 à +25,8, kantelen NAP +26,7 à +26,9 tot circa 4,0 à 4,2 m van het hart; verhoging NAP +2,6 à +2,7 tot circa 5 m van het hart, straat NAP +0,9. Aan de zuid- en oostkant mist het DSM de dakrand (lagere waarden van de gevel), daarom de straal uit noord en west, luchtfoto, BAG en foto.
- Luchtfoto's (PDOK actueel, 2021 en 2024, 2026-11-06): bovenkant 7,9 à 8,0 m breed, circa 25 kantelen, dakluik, portaal aan de westkant.
- Foto's op Wikimedia Commons: "Watertoren, Woerden 6805" (vanaf de Oostsingel, bijna recht: hoogtes van banden, uitkraging, onderrand, vensters, fries en kantelen, en de breedtes van voet, schacht en reservoir op 0,0203 m per pixel), "Watertoren, onderste gedeelte - Woerden - 20216462 - RCE" (frontaal op het portaal: tapse voet, portaal, deur, stoep en trap), "Watertoren, bovenste gedeelte - Woerden - 20216463 - RCE", "Watertoren (Woerden)" en "Watertoren - Woerden - 20216460 - RCE" (vanaf de brug in het zuiden).

## Geschat en weggelaten

Geschat: alle hoogtes onder het dak en alle stralen behalve die van het reservoir uit foto 6805 (schaal uit de AHN-hoogte van de kantelen boven de voet); de tapsheid van de voet uit de RCE-foto van het portaal; de portaalmaten (breedte 2,6 m, uitbouw tot 4,25 m, goot 3,5 m en top 5,0 m boven de voet) uit die foto; de richting van het portaal (RD -175 graden, onzekerheid circa 15 graden) uit luchtfoto's en foto's; de hoogtes en richtingen van de tien schachtvensters (een regelmatige spiraal, in het echt volgen ze de trap); het aantal kantelen (twaalf van 1,0 m in plaats van circa 25 smallere, zodat kantelen en openingen printbaar zijn op 1:1000) en hun hoogte (0,9 m, in het echt circa 0,4 m); de breedte van de keperboogvensters (0,8 m, in het echt circa 0,5 m); de consoles (zestien van 0,5 m); het dakluik uit de luchtfoto van 2024.

Weggelaten: de trap van de verhoging naar het portaal (volgt het terrein, treden kleiner dan 0,9 m), de verhoging zelf (zit in het PDOK-terrein), de rondbogen van het fries en de kleurbanden van rode rijnsteen (reliëf kleiner dan 0,15 m), de natuurstenen lateien en lekdorpels, de bekroning en aanzetstenen van de tuitgevel, de windvaan, de vlaggenmast en de sirene (dunner dan 0,9 m), en het machinegebouw (eigen BAG-pand en rijksmonument, in PDOK op zijn eigen hoogte).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: banden, onderrand en fries onder 45 graden, uitkraging 41 en consoles 43 graden, nissen met een plafond van 56 graden, spitsbogen boven 50 graden. Een export op 1:1000 (100 × 100 m rond de toren, ondersteuning v2, 45 graden) bevat het model zonder het PDOK-pand; het ondersteuningsobject heeft geen volume. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder van straat tot dak) de tapse voet met portaal, de banden, de taps toelopende schacht met vensters, de uitkraging met consoles, de bredere reservoirgeleding met vensters en het fries, de kantelen en het dakluik.

Controle-URL: http://localhost:3000/kaart/52.08869/4.88458/200/1x1/0
