# Watertoren Hellevoetsluis (Hellevoetsluis)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hellevoetsluis.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, plint, schacht, reservoir en borstwering zijn omwentelingsvormen (96 zijden), de lijsten en de onderkant van het reservoir zijn kegelvlakken, de consoles en kantelen zijn radiale blokken, de aanbouw is de BAG-contour als prisma, de lichtkoepel een piramide, en de deur en de vensters zijn nissen.

De watertoren aan de Opzoomerlaan in de vesting Hellevoetsluis is in 1896 gebouwd naar ontwerp van N. Biezeveld. Volgens Wikipedia is hij 22 m hoog en had hij twee reservoirs van 60 m³. In 1965 ging hij buiten gebruik. Daarna is hij voor één gulden verkocht en tot woning met werkruimte verbouwd, waarbij de reservoirs zijn verwijderd. Hij is een gemeentelijk monument. De ronde toren van rode baksteen met gele banden heeft een burchtachtige bovenbouw. Onderaan zit een plint met een rondboogdeur, daarboven een slanke schacht met kleine vensters en een medaillon. Een rand van consoles met rondbogen ertussen kraagt uit naar de bredere reservoircilinder, met kruisvormige schietgatvensters. Daarop volgen een lijst en een borstwering met ronde gaten en kantelen rond een plat dakterras met een rond trappenhuis. Aan de noordkant ligt een platte aanbouw van één laag die tot hetzelfde BAG-pand hoort.

## Bestanden

- `watertoren-hellevoetsluis.glb`: één node `building:watertoren-plint-schacht-consoles-reservoir-kantelen-en-aanbouw`, op maaiveld.
- `watertoren-hellevoetsluis.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-hellevoetsluis-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

De RD-oorsprong is [68457.78, 427243.1] (51,82707 N, 4,13177 O), het hart van de ronde schacht. Dat is een cirkelfit op de 64 boogpunten van BAG-pand 0530100002230574 (straal 2,81 m, spreiding 1 mm). Het maaiveld volgens AHN-DTM is NAP +2,0 à +2,1 rondom (3D BAG-maaiveld 2,0). Lokale +X wijst naar het westen (RD 180 graden; `xAxis` [-1, 0]), naar de rondboogdeur aan de kant van de Opzoomerlaan. Die richting volgt uit de RCE-foto 20300202: die kijkt recht op de deur, met het dienstwoonhuis van 1898 (BAG 0530100002227426, ten zuiden) rechts en de aanbouw (noord) links. `groundHeight` 45,86 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vijf `groundSamplePoints`, gemeten op 2026-11-06: west 45,889, zuid 45,925, oost 45,857, west van de aanbouw 45,871 en noord 45,956. Het terrein is vlak en het PDOK-pand begint op 45,79.

Het model vervangt BAG-pand 0530100002230574, en daarmee de toren en de aanbouw, die in BAG één pand zijn. Die aanbouw is in het model de BAG-contour als plat blok. De buurpanden blijven staan: de zeshoekige schuur op 5 tot 8 m ten zuidoosten (PDOK tot NAP +5,2, AHN +4,9), het dienstwoonhuis en de panden ten noorden van de aanbouw. Ze raken het model niet. De schuur, die er het dichtst bij staat, wijkt in PDOK 0,3 m af van het AHN.

## Onderdeel `building:watertoren-plint-schacht-consoles-reservoir-kantelen-en-aanbouw`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Voet en plint: verbrede voet met straal 2,95 m tot 0,5 m, plint met straal 2,85 m tot 4,2 m, lijst tot 2,95 m (4,2 tot 4,6 m, onderkant 50 graden) die bovenaan afloopt naar de schacht. Rondboogdeur aan de westkant als nis van 1,8 m breed en 0,4 m diep, met de aanzet op 2,55 m en de kruin op 3,45 m.
- Schacht: cilinder met straal 2,62 m. Rondboogvensters (nis van 0,9 m breed, 5,7 tot 7,4 m) en kleine vensters (nis van 0,9 × 1,0 m, 11,2 tot 12,2 m) op de vier schuine kanten (45, 135, 225 en 315 graden van de deur), en een medaillon boven de deur (nis van 0,9 × 0,9 m op 9,45 m).
- Uitkraging: lijst tot straal 2,8 m (12,95 tot 13,3 m) met daarop twaalf consoles van 0,9 m breed. Hun buitenkant loopt onder 76 graden schuin naar buiten, van 2,72 m op 13,3 m tot de reservoirwand op 15,3 m. Tussen de consoles staan de rondbogen als schuine onderkant van het reservoir, onder 50 graden van de schacht op 15,2 m tot de wand op 15,9 m.
- Reservoir: cilinder met straal 3,2 m van 15,9 tot 20,0 m, met een band op 16,45 tot 16,75 m. Acht schietgatvensters op de deur en om de 45 graden: een spleet (nis van 0,6 m breed, 17,3 tot 19,3 m) met een ruit van 1,1 m breed op 18,3 m voor de ronde verbreding op de kruising. Bovenaan een rondgaande lijst tot 3,35 m (19,96 tot 20,24 m, onderkant 50 graden).
- Bovenbouw: borstwering met straal 3,25 m en 0,9 m dik tot 21,6 m. Daarop staan tien kantelen van 18 graden (1,0 m breed aan de buitenkant, tussenruimte 1,0 m), waarvan één boven de deur, tot 23,15 m. Het dakterras ligt op 20,7 m. Het ronde trappenhuis (straal 1,0 m) staat tegen de oostkant, 1,5 m oost en 1,0 m noord van het hart, tot 22,95 m, met een platte kegel tot 23,15 m.
- Aanbouw: de BAG-contour (de boog om de toren vervangen door het hart) als plat blok tot 3,05 m, met een glazen piramide-lichtkoepel van 2,4 m in vierkant en 1,0 m hoog. Die koepel staat in de westvleugel, evenwijdig aan de zuidwestgevel.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Hellevoetsluis)): 1896, N. Biezeveld, 22 m, twee reservoirs van 60 m³, in 1965 buiten gebruik, verbouwd tot woning, gemeentelijk monument.
- BAG-pand 0530100002230574 (PDOK, 2026-11-06): de toren als boog met straal 2,81 m plus de aanbouw ten noorden, woonfunctie, 146 m², adres Opzoomerlaan 112.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06) en 3D BAG:
  - maaiveld NAP +2,0
  - dakterras NAP +22,7 (3D BAG 22,74), tot circa 3,0 à 3,2 m van het hart
  - kantelen en trappenhuis NAP +25,05 à +25,2 (3D BAG 25,05 à 25,17, een dakvlak van circa 2 m aan de oostkant)
  - aanbouw NAP +5,0 à +5,1 (3D BAG 5,0 à 5,11), met een gat in het DSM op de plek van de lichtkoepel
- Luchtfoto (PDOK, 8 cm, 2026-11-06): de top met de kantelen, het dakterras met vlonder en het ronde trappenhuis, de aanbouw met de piramide-lichtkoepel en het grijze dak.
- Foto's op Wikimedia Commons:
  - "Exterieur OVERZICHT - Hellevoetsluis - 20300202 - RCE": frontaal op de deur vanaf het westen, geschaald op 45 px per m. Hieruit komen de plint en de lijst (4,2 à 4,75 m), de deur, de vensters en het medaillon, de lijst onder de consoles (12,8 à 13,3 m), de consoles en bogen (13,5 tot 16,1 m), het reservoir (16,8 tot 20,0 m) met de schietgatvensters (17,3 tot 19,3 m), de lijst, de borstwering met ronde gaten (tot 21,6 m) en de kantelen (tot 23,1 m).
  - "Fortress Hellevoetsluis - Watertower and Church" en "Hellevoetsluis 003": het silhouet van de andere kanten.

## Geschat en weggelaten

Geschat:

- De stralen van plint (2,85 m), schacht (2,62 m) en reservoir (3,2 m) komen uit BAG, het DSM en de breedteverhoudingen op de RCE-foto.
- Alle tussenhoogtes komen uit die frontale foto. De top en het dakterras komen uit het AHN.
- De oriëntatie (deur op het westen) komt uit de opstelling op de RCE-foto.
- Het aantal consoles (twaalf in plaats van circa zestien) en kantelen (tien in plaats van circa achttien) is grover dan in het echt, zodat delen en tussenruimtes minstens 0,9 m zijn.
- De borstwering is 0,9 m dik, in het echt circa 0,5 m.
- De vensters zijn nissen van minstens 0,9 m breed, de schietgatspleet 0,6 m. In het echt zijn ze circa 0,3 à 0,45 m.
- Welke kanten vensters hebben: op de foto staan alleen die van de westkant. De schacht heeft ze hier op de vier schuine kanten en het reservoir rondom om de 45 graden.
- De ronde verbreding van de schietgaten is een ruit.
- De plaats en maat van het trappenhuis en de lichtkoepel komen uit het DSM en de luchtfoto.

Weggelaten:

- De ronde gaten in de borstwering (circa 0,3 m) en de smalle spleten tussen de consoles.
- De gele banden. Die zijn alleen kleur.
- De sierplaat boven de deur en het hekwerk tussen de kantelen.
- De muurtjes en schuurtjes op het erf. Die zijn eigen BAG-panden of geen pand.

## Controle

Het model is één gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Daarvoor zorgen:

- lijsten en de onderkant van het reservoir onder 50 graden
- consoles onder 76 graden
- nissen met een plafond van 56 tot 63 graden
- de ruit in de schietgaten onder 57 graden
- de lichtkoepel en de kap van het trappenhuis, die naar boven smaller worden

Een export op 1:1000 (80 × 80 m rond de toren, ondersteuning v2 en zonder, 45 graden) bevat het model met hetzelfde volume en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. PDOK toont een gladde cilinder tot NAP +25,2 met een rechthoekige uitstulping en de aanbouw als plat blok. In renders van vier kanten heeft het model daartegenover:

- de verbrede voet met de plint, de lijst en de rondboogdeur
- de vensters en het medaillon in de schacht
- de lijst met de schuin uitkragende consoles en bogen
- de bredere reservoircilinder met band, schietgatvensters en lijst
- de borstwering met kantelen rond het dakterras met het ronde trappenhuis
- de lichtkoepel op de aanbouw

Controle-URL: http://localhost:3000/kaart/51.82708/4.13178/200/1x1/0 (1,1 m van het hart van de toren).
