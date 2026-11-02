# Watertoren Wilhelminasingel (Breda)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-breda-wilhelminasingel.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, schacht, banden en fries zijn omwentelingsprofielen, de bovenbouw, de goot en de spits omhulsels van twaalf- en achthoeken, portaal, dakkapellen en torentjes blokken en `hull`-vormen; vensters, rondboognissen en de bogen van het fries zijn nissen.

De watertoren aan de Wilhelminasingel, naast het Wilhelminapark, is in 1893-1894 gebouwd naar ontwerp van J. Schotel in neorenaissancestijl, volgens Wikipedia 42 m hoog met een reservoir van 500 m³. Hij is rijksmonument 10345 (het register: bakstenen toren met natuurstenen sierdelen, een ronde schacht die een veelhoekige, op een boogfries overgekraagde bovenbouw met spits draagt, met pilasters en rondbogen). Sinds 1974 buiten gebruik en sinds 1976 kantoren.

## Bestanden

- `watertoren-breda-wilhelminasingel.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een losse bovenbouw of spits zou een voet tot de grondplaat krijgen.
- `watertoren-breda-wilhelminasingel.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-breda-wilhelminasingel-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [113274.1, 399677.0], het middelpunt van de ronde BAG-contour van pand 0758100000065355 (straal 7,04 m, de goot), op maaiveld (NAP +2,70 m; het AHN-maaiveld in een ring van 8 tot 12 m ligt tussen +2,6 en +2,8). De top van de spits ligt in het AHN binnen 0,3 m van dit punt. `xAxis` [-0.866, 0.5]: +X wijst naar het portaal, RD-richting 150 graden (noordwest), waar op de luchtfoto het pad en het witte fronton liggen. De vlakken van de twaalfzijdige bovenbouw staan op k·30 graden, in RD en in het model (de zuidrand van de goot ligt op de luchtfoto oost-west); de spits heeft vlakken op k·45 graden.

De vier `groundSamplePoints` liggen 9 m uit het hart op de diagonalen, naast het portaal en de stoep. `groundHeight` 46,6 (NAP 2,70 plus circa 43,9 m geoïdehoogte, zoals bij `kasteel-van-breda`) is de terugval zonder maaiveld. Het dichtstbijzijnde andere pand staat 25 m verder (zuidoost).

## Onderdeel `building:schacht-boogfries-bovenbouw-en-spits`

- Natuurstenen plint van 13,9 m tot +1,2, op een kraag naar de schacht.
- Ronde schacht, taps van 13,5 m boven de plint tot 12,5 m onder het fries op +21,6.
- Witte banden: een brede band van +7,4 tot +8,0 (0,18 m uit de schacht) boven het portaal en twee smalle van 0,35 m op +12,8 en +17,5 (0,12 m), alle op een kraag van 45 graden.
- Portaal naar +X: een blok van 3,5 m breed dat 1,3 m uitsteekt tot +4,45, een kroonlijst op een kraag tot +4,95, een opzetstuk met schuine wangen (de voluten), een fronton tot +6,5 en een pinakel tot +7,4; deur (1,6 × 2,7 m) en oculus als nis; stoep van twee treden.
- Groot boogvenster (2,4 m breed, tot +5,3) op -72 graden (RD 78, noordnoordoost), onder het dubbele venster van de eerste rij.
- Drie rijen van vijf vensters, om 72 graden: dubbele vensters (1,6 m) van +9,3 tot +11,0 boven het portaal en het boogvenster, enkele (0,9 m) van +14,2 tot +15,9 ertussen en van +19,0 tot +20,7 weer boven het portaal.
- Boogfries: kraag van 45 graden van de schacht naar 13,5 m, fries tot +24,7 met twintig spitsbogen tussen consoles van 0,9 m.
- Twaalfzijdige bovenbouw van 13,0 m over de vlakken vanaf +24,4, op elke hoek een pilaster van 0,9 m die 0,22 m uitsteekt (voet op een kraag van 56 graden), in elk vlak een rondboognis van 2,6 m (+26,2 tot +30,8) met een venster van 0,9 m.
- Goot van 14,2 m over de vlakken: schuine onderkant (53 graden) van +31,6 op de gevel naar +32,45, rechte rand tot +32,85, dak tot +33,25 bij de voet van de spits.
- Achtzijdige spits van 9,2 m over de vlakken onder 64 graden tot +42,6.
- Vier dakkapellen (1,7 m breed, zadeldak tot +35,85, venster als nis) op de vlakken 0, 90, 180 en 270 graden, en vier achtkantige torentjes van 1,0 m met een spitsje tot +36,2 op de hoeken daartussen.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Breda_Wilhelminasingel)): architect, bouwjaren, 42 m, 500 m³, latere geschiedenis.
- [Rijksmonument 10345](https://monumentenregister.cultureelerfgoed.nl/monumenten/10345): ronde schacht, veelhoekige bovenbouw op een boogfries, spits, pilasters en rondbogen.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +2,70, goot en dak tussen r 5 en 7 op 32,6 tot 33,5 m boven maaiveld, spits met een helling van 2,0 m per m (op r 1 m NAP +43,75, 41,05 m boven maaiveld), top van de spits op circa 42,6 m; de makelaar erboven tot NAP +50,3. De wanden en de rand van de goot geven in het DSM gaten en interpolatie.
- 3D BAG (LoD2.2, `b3_h_dak_max` NAP +43,8): een cilinder tot de goot met een grove spits.
- BAG-pand 0758100000065355 en luchtfoto (PDOK, 8 cm): ronde contour van 14,1 m, twaalfzijdige goot van 14,4 m (stand op k·30 graden), achtzijdige spits met dakkapellen, portaal met pad naar het noordwesten.
- Foto [Watertoren, Wilhelminasingel, Breda P1460774](https://commons.wikimedia.org/wiki/File:Watertoren,_Wilhelminasingel,_Breda_P1460774.jpg), van ver (16 px/m): verhouding van goot, bovenbouw, fries en schacht (taps), hoogtes van de banden, het fries, de vensterrijen en het portaal, geschaald op de goot uit het AHN.
- Foto's [Watertoren Wilhelminasingel Breda 20230823](https://commons.wikimedia.org/wiki/File:Watertoren_Wilhelminasingel_Breda_20230823_-_1.png) (-1, -2, -3): het portaal met fronton, oculus en pinakel, het boogvenster ernaast, de vensterrijen om 72 graden, de consoles en bogen van het fries, de pilasters en rondboognissen van de bovenbouw, de dakkapellen en torentjes.

## Geschat en weggelaten

Geschat: de diameters van de schacht (13,5 en 12,5 m) en de bovenbouw (13,0 m) uit verhoudingen op de foto van ver, geschaald op de goot uit de BAG en de luchtfoto (±0,3 m); alle hoogtes onder de goot uit die foto (±0,4 m); de plaats van het boogvenster en de vensterrijen (om 72 graden, vijf per rij; op foto's zijn telkens twee of drie te zien); het aantal consoles (twintig in plaats van circa 26, zodat elke console 0,9 m breed blijft); de stand en vorm van de dakkapellen en torentjes (vier van elk, op foto's en de luchtfoto niet eenduidig te tellen); de maten van het portaal. De consoles van het fries hangen in het echt met een vlakke onderkant over; in het model staat het fries op een kraag van 45 graden met spitsbogen ertussen, zodat het zonder steun print. De goot heeft een schuine onderkant in plaats van een dunne overstekende plaat.

Weggelaten (kleiner dan 0,9 m of alleen kleur): de makelaar met de siersmeedijzeren bol op de spits (een staaf van circa 0,15 m), de kleine siernissen onder het fries, de geglazuurde tegelbanden en de witte vensteromlijstingen (kleur), de lantaarns naast de deur, de hekjes, het informatiebord en de verdiepte strook rond de voet (de vroegere omgrachting), die in het PDOK-terrein zit.

## Controle

Eén gesloten NoError-node met genus 0, de onderkant op -0,3 m. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,001 %: de kragen onder de banden, het fries, de pilasters, de goot en het portaal en de plafonds van alle nissen lopen onder 45 tot 64 graden. De doorsneden op 1, 5, 7,7, 10, 15, 20, 22,5, 24, 26, 28, 30,5, 32,6, 34 en 38 m blijven gelijk. Controlebeelden blijven buiten de repo. Vergeleken met de PDOK-reconstructie (3D BAG LoD2.2, een cilinder tot de goot met een grove spits) heeft het model van alle kanten de plint, de tapse schacht met banden en vensters, het boogfries, de overgekraagde twaalfzijdige bovenbouw met pilasters en nissen, de overstekende goot, de regelmatige achtzijdige spits met dakkapellen en torentjes, en aan de noordwestkant het portaal en aan de noordoostkant het boogvenster.

Controle-URL: http://localhost:3000/kaart/51.58444/4.78517/200/1x1/0
