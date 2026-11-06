# Watertoren Nieuwegein (Nieuwegein)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-nieuwegein.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is één omwentelingsprofiel (schacht, band, hals, schuine bodem, reservoir, banden en kroonlijst), de onderbouw een regelmatige achthoek met een boeiboord en leien dak als hull, de ribben en consoles zijn losse bouwdelen, de vensters en velden nissen, en de aanbouw, gang en het bijgebouw prisma's op de BAG-hoekpunten.

De watertoren aan het Hooglandse Jaagpad in De Hoge Landen (ook "watertoren van IJsselstein") is in 1911 gebouwd naar ontwerp van Roelof Kuipers, in opdracht van het gemeentelijke waterleidingbedrijf van IJsselstein. Hij is volgens Wikipedia 28,5 m hoog en heeft een reservoir van 150 m³; sinds de grenswijziging van 1990 ligt hij in Nieuwegein. Rijksmonument 526781. Een witgepleisterde toren op een lage achthoekige onderbouw: een licht verjongende ronde schacht met halfronde ribben en een band, daarboven een korte hals met schuin uitlopende consoles en kleine rondboogvensters, en het cilindrische reservoir met ribben tussen een onderrand en een band, een fries van korte ribben onder de kroonlijst en een plat dak.

## Bestanden

- `watertoren-nieuwegein.glb`: één node `building:watertoren-onderbouw-schacht-reservoir-en-bijgebouwen`, op maaiveld.
- `watertoren-nieuwegein.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-nieuwegein-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [133436.5, 447560.4] (52,01598 N, 5,07308 O), het hart van de achthoekige onderbouw van BAG-pand 0356100000074678; het hart van het dakvlak van het reservoir in het AHN-DSM ligt er 0,1 m naast. Maaiveld AHN NAP +1,35 (DTM rondom 1,3 tot 1,4). Lokale assen gelijk aan RD (+X oost, +Y noord); hoeken hieronder in graden linksom vanaf oost. `groundHeight` 44,73 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (west op 8 m 44,81, noord op 8 m 44,73, zuid 45,00, oost 44,99); het PDOK-pand staat op 44,71.

Het model vervangt BAG-pand 0356100000074678 in zijn geheel: de toren met de achthoekige onderbouw, de lage aanbouw in het noordoosten, de gang naar het zuidoosten en het vierkante bijgebouw (allemaal bouwjaar 1911 in de BAG). De PDOK-reconstructie van dat pand is een achthoekig prisma tot NAP +27,3 (ellipsoïdisch 70,8) met dezelfde lage blokken. De buurpanden 0356100000074679 (woning, 1970), 0356100000074677 en 0356100000074676 staan los van de toren en kloppen met het AHN.

## Onderdeel `building:watertoren-onderbouw-schacht-reservoir-en-bijgebouwen`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Onderbouw: regelmatige achthoek met hoekpunten op 6,33 m van het hart, het eerste op 27,5 graden (uit de BAG; de hoekpunten wijken 0,1 tot 0,15 m af), wand tot 2,8 m. Op de zes vrije wanden een verdiept veld van 3,2 m breed van 0,5 tot 2,0 m (0,3 m diep).
- Boeiboord: 0,4 m overstek, schuine onderkant van 2,3 m tegen de wand naar 2,8 m (51 graden), voorkant tot 3,25 m (AHN-dakrand NAP +4,5 à +4,7); leien dak van de boeiboord tot de schacht op 4,3 m (circa 25 graden; AHN NAP +5,6).
- Schacht: rond, straal 3,68 m boven het dak tot 3,38 m bij de band op 14,75 m; 24 halfronde ribben van 0,48 m breed (één op 225 graden, het zuidwesten), van onder het dak tot in de band.
- Band: 3,73 m, onderkant van 50 graden van 14,75 tot 15,2 m, bovenkant 15,7 m.
- Hals: straal 3,5 m van 15,7 tot 17,0 m, met twaalf consoles van 0,9 m breed (één op 225 graden) die van de band schuin naar buiten lopen tot in de onderrand (buitenkant 67 graden), en vier paren rondboogvensters van 0,6 m breed (15,8 m tot de kruin op 16,6 m) in de vakken naast de consoles op 45, 135, 225 en 315 graden.
- Reservoirbodem: kegel van 50 graden van 3,5 m op 17,0 m naar 5,2 m op 19,03 m; onderrand 5,2 m tot 19,55 m.
- Reservoir: straal 4,95 m (AHN) met 24 ribben van de onderrand tot in de band; twee vensters van 0,6 m breed op 217,5 en 232,5 graden van 23,3 tot 24,2 m; band 5,2 m van 24,6 tot 24,85 m (onderkant 50 graden vanaf 24,3 m); fries van 24 korte ribben; kroonlijst 5,25 m, onderkant van 50 graden vanaf 25,1 m, tot het platte dak op 25,9 m (AHN NAP +27,25).
- Aanbouw in het noordoosten: BAG-hoekpunten, plat tot 2,15 m (AHN NAP +3,45).
- Gang naar het zuidoosten: BAG-hoekpunten, plat tot 2,75 m (AHN NAP +4,1).
- Bijgebouw in het zuidoosten: 7,6 × 8,0 m op de BAG-hoekpunten, plat tot 4,55 m (AHN NAP +5,87).
- Vensters en velden zijn nissen van 0,3 m diep met een plafond van 63 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Nieuwegein)): 1911, Roelof Kuipers, 28,5 m, 150 m³, Hooglandse Jaagpad, rijksmonument 526781.
- BAG-pand 0356100000074678 (PDOK, 2026-11-06): achthoek, aanbouw, gang en bijgebouw.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld, dak en straal van het reservoir, dakrand en dak van de onderbouw, hoogtes van aanbouw, gang en bijgebouw. 3D BAG: dak 27,27 (70e percentiel), maaiveld 1,28.
- Luchtfoto (PDOK, 2026-11-06): rond plat dak van het reservoir, achthoekige onderbouw met donkere dakrand, gang en bijgebouw met plat dak.
- PDOK-gebouwtegel (2026-11-06): achthoekig prisma tot het dak, zonder schacht, band, consoles en kroonlijst.
- Foto op Wikimedia Commons: "Watertoren Nieuwegein in 2020" (vanuit het zuidwesten: onderbouw met velden, boeiboord en leien dak, ribben, band, consoles met vensters, reservoir met vensters, band, fries en kroonlijst).

## Geschat en weggelaten

Geschat: alle hoogtes van de geledingen tussen het dak van de onderbouw en het dak van het reservoir (band, hals, onderrand, vensters, reservoirband, fries, kroonlijst) en de stralen van de schacht uit één foto vanuit het zuidwesten, geschaald op de reservoirdoorsnede en de dakhoogte uit het AHN (circa 0,3 tot 0,5 m nauwkeurig; de foto is perspectivisch); het aantal ribben (24) en consoles (12) geteld op de voorkant van de foto; de vensters alleen aan de zuidwestkant gezien, de andere drie paren in de hals aangenomen; de vensters in de hals circa 0,5 m lager dan op de foto, zodat ze onder de schuine bodem printbaar blijven; de schuine onderkant van de reservoirbodem en de consoles (in het echt een holle, overhangende welving); de velden in de onderbouw (breedte en hoogte uit de foto, op de niet-zichtbare wanden aangenomen); de hoogte van de aanbouw (het AHN is daar door begroeiing rommelig).

Weggelaten: het smalle spleetvenster in de schacht, de antennes op het reservoir, de bliksemafleider, de dakluiken en balken op het dak (kleiner dan 0,9 m), de verdikte voeten van de ribben, het hekwerk op de aanbouw, deuren en vensters van de onderbouw en het bijgebouw (niet op de foto te zien) en de losse buurpanden.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een export met `createModelBundle` op 1:1000 (ondersteuning v2, 45 graden) van een uitsnede van 80 m bevat het model, niet meer het PDOK-pand, en geen ondersteuning onder het model. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een glad achthoekig prisma tot het dak) aan elke kant de onderbouw met velden en overstekende boeiboord, het leien dak, de smallere geribde schacht met band, de consoles en vensters van de hals, het bredere reservoir met onderrand, ribben, band, fries en kroonlijst; aan de zuidwestkant ook de vensters in het reservoir.

Controle-URL: http://localhost:3000/kaart/52.01598/5.07308/200/1x1/0
