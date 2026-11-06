# Watertoren Baarn (Baarn)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-baarn.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, schacht, uitkraging, reservoir en borstwering zijn omwentelingsvormen van een radiaal profiel (96 segmenten), het portaal, de consoles en de kantelen convexe omhullenden, de vensters en de deur blinde nissen met een schuin plafond.

De watertoren aan de Sophialaan 31 in de Transvaalwijk staat op een hoog punt in Baarn. Hij werd in 1903 gebouwd naar ontwerp en in opdracht van de Utrechtsche Waterleiding Maatschappij, in neorenaissancestijl, verwant aan de UWM-torens van Utrecht (Lauwerhof, Heuveloord) en Zeist; rijksmonument 511733, 29 m hoog, voet circa 10 m doorsnede, met een ijzeren Intze I-reservoir van 500 m³. Sinds 2014 is hij een woning met een dakterras. Een ronde, zich verjongende toren in drie geledingen: de voet met een donkere plint, een natuurstenen band en een siermetselband tussen cordonlijsten, met de ingang in een licht vooruitstekend portaal met timpaan en pinakel; de schacht met smalle vensters en bovenaan een boogfries op consoles; de uitkraging van siermetselwerk tussen profielijzers naar het reservoir met smalle vensters, een boogfries, een cordonlijst en kantelen. De kanteel aan de straatzijde, boven de ingang, is iets hoger en draagt een windvaan met het jaartal 1903.

## Bestanden

- `watertoren-baarn.glb`: één node, `building:watertoren-voet-portaal-schacht-reservoir-en-kantelen`.
- `watertoren-baarn.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-baarn-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [147674.27, 469299.61] (52,21175 N, 5,28002 O): het hart van de top in het AHN-DSM 0,5 m (cirkel door 42 randcellen van het dakterras, straal 5,40 m, mediaan afwijking 0,2 m), op het maaiveld: AHN-DTM NAP +14,3 (14,22 tot 14,32 tussen 6,5 en 11 m).

Het ronde BAG-pand 0308100000021663 (straal 4,82 m, met het portaal) ligt 1,2 m zuidwestelijker. Aan die kant eindigt de top in het DSM al op 4,4 m van het BAG-hart en meet het AHN-DTM maaiveld binnen 4,9 m, wat bij een concentrische Intze-toren met een bredere top niet kan; de buurpanden liggen binnen 0,25 à 0,5 m van het AHN. De vorm van de BAG-voetafdruk (straal, portaal van 2,95 m breed en 0,65 m diep) is daarom overgenomen en naar het AHN-hart verschoven.

Lokale +Y wijst naar RD-richting 114 graden (noordwest): het portaal (as uit de BAG-voetafdruk), de straatzijde en de hogere kanteel (DSM-piek NAP +44,18 op 123 graden). +X wijst naar 24 graden.

`groundSamplePoints` liggen op 7 m in de vier lokale asrichtingen; `groundHeight` 57,49 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (57,49 tot 57,57, gemeten 2026-11-06; rondom op 6 tot 8 m 57,41 tot 57,62, vlak). `groundOffsetMetres` is -0,1.

## Onderdelen

Stralen en hoogtes boven het maaiveld (NAP +14,3).

- Plint: 4,95 m tot 0,8 m, afgeschuind naar de voet.
- Voet: taps van 4,85 m op 0,9 m (BAG 4,82; register circa 10 m) tot 4,75 m op 5,3 m. Natuurstenen band 0,12 m uit van 2,8 tot 3,0 m, cordonlijst van 4,25 tot 4,4 m, daarboven de siermetselband en de cordonlijst van 5,0 m van 5,3 tot 5,65 m met een afzaat naar de schacht.
- Portaal (+Y): 2,95 m breed, voorgevel op 5,5 m (0,65 m voor de voet), kroonlijst 0,12 m uit tot 3,92 m, timpaan tot 4,67 m en een pinakel van 0,9 m tot 5,4 m; deur met halfrond bovenlicht van 1,5 m breed tot 3,2 m als nis van 0,4 m.
- Schacht: taps van 4,7 m op 5,65 m tot 4,25 m op 15,7 m. Smalle vensters als nis van 0,9 m: vier van 6,2 tot 7,9 m en vier kleine van 13,3 tot 14,5 m op 45 graden naast de ingang en rondom, vier van 10,4 tot 12,2 m boven de ingang en rondom.
- Boogfries: band van 4,45 m van 16,4 tot 17,0 m op zestien consoles van 0,9 m breed vanaf 15,5 m; witte lijst van 4,55 m tot 17,25 m.
- Uitkraging: kegel van 4,55 m op 17,25 m tot 5,4 m op 18,9 m (63 graden); waterlijst 5,5 m van 18,9 tot 19,15 m.
- Reservoir: trommel van 5,4 m (AHN: top 10,8 m doorsnede) met veertien smalle vensters van 0,9 m van 20,0 tot 24,1 m, boogfries van 5,55 m van 24,7 tot 25,8 m met veertien rondbogen van 1,6 m boven de vensters, cordonlijst van 5,6 m van 26,2 tot 26,6 m.
- Kantelen: borstwering van 5,45 m tot het dakterras op 28,45 m (AHN NAP +42,86 met vlonder en meubels), daarop achttien kantelen van 0,9 m dik en 0,96 m breed (tussenruimte 0,94 m) tot 29,35 m (AHN NAP +43,4 à +43,7); die boven de ingang tot 29,9 m (AHN-piek NAP +44,18).

Alle banden, lijsten en de kroonlijst van het portaal hebben een onderkant van 50 à 51 graden, de consoles 48 graden en de nissen een plafond dat naar binnen onder 56 tot 63 graden oploopt.

## Bronnen en maten

- [Rijksmonumentenregister 511733](https://monumentenregister.cultureelerfgoed.nl/monumenten/511733): 1903, Utrechtse Waterleiding Maatschappij, 29 m, voet 10 m, drie geledingen, portaal met timpaan en pinakel, smalle vensters en boogfries in de schacht, uitkraging van siermetselwerk tussen profielijzers, reservoir met smalle vensters en boogfries, cordonlijst met kantelen, hogere kanteel met windvaan, Intze I-reservoir van 500 m³.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Baarn)): Sophialaan 31, 29 m, 500 m³, woning sinds 2014.
- BAG-pand 0308100000021663 (PDOK, 2026-11-06): ronde voetafdruk van 4,82 m met het portaal.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld, het hart en de straal van de top, dakterras, kantelen en de hoge kanteel.
- PDOK-luchtfoto: kantelen rond het dakterras, het pad naar de ingang aan de noordwestkant.
- Foto op Wikimedia Commons: "Baarn Watertoren 9170.JPG" (2006, vanaf de straat recht op de ingang, sterk schuin omhoog): geledingen, portaal, deur, vensters, boogfriezen, uitkraging, reservoir en kantelen; hoogtes met een perspectieffit op het maaiveld, de top en de breedtes van voet en reservoir.

## Geschat en weggelaten

Geschat: alle hoogtes tussen het maaiveld en de cordonlijst van het reservoir (banden, cordonlijsten, portaal, vensters, boogfriezen, uitkraging) uit één sterk schuin omhoog genomen foto met een perspectieffit (onzekerheid circa een halve meter); de stralen van de schacht (4,7 tot 4,25 m) uit breedteverhoudingen op die foto; het aantal vensters in de schacht (drie rijen van vier) en in het reservoir (veertien; op de foto vier tot vijf per helft zichtbaar), zestien consoles; achttien kantelen in plaats van de circa 24 op de luchtfoto, zodat kantelen en tussenruimtes 0,9 m blijven; de ligging van de toren op het AHN in plaats van de BAG.

Weggelaten: de windvaan met 1903 en de vlaggenmast (dunner dan 0,9 m), de profielijzers van de uitkraging, de sierankers tussen de reservoirvensters, de lijsten op de kantelen, de natuurstenen dorpels, sluitstenen en de naamplaat boven de deur, het siermetselwerk (vlak, alleen kleur), en op het dakterras de lounge, de bubbelbaden en de ligbedden (lager dan 0,9 m).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (120 m uitsnede) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand; een eerste versie met rondboognissen in de boogfries van de schacht liet de export daar opvullen en heeft nu consoles. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte cilinder op de BAG-voetafdruk tot 28,7 m) de plint, de verjongende voet met banden en cordonlijsten, het portaal met timpaan, pinakel en deur, de taps toelopende schacht met vensters en boogfries, de uitkraging naar het bredere reservoir met waterlijst, vensters, boogfries en cordonlijst, en de kantelen met de hogere kanteel boven de ingang.

Controle-URL: http://localhost:3000/kaart/52.21174/5.27995/200/1x1/0
