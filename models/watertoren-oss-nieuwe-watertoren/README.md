# Nieuwe watertoren (Oss)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-oss-nieuwe-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, banden en opbouw zijn cilinders, de glasgevel een zestienzijdig prisma, de vensters nissen.

De nieuwe watertoren van Organon (nu MSD/Organon) staat op het fabrieksterrein aan de Molenstraat (110) in Oss. Hij is in 1951 gebouwd naar een ontwerp van J.A.G. van der Steur jr. en jhr. A.P. Wesselman van Helmond: volgens Wikipedia 34,52 m hoog, met een betonnen vlakbodemreservoir van 85 m³ voor koeling, brandbestrijding en het eigen waterleidingnet van de fabriek. Geen monument; gerenoveerd in 2009 en nog in gebruik. Een strakke witte naoorlogs-modernistische toren: een ronde betonnen schacht met rijen smalle verticale vensters, daarboven een bredere glazen trommel van vier bouwlagen rond het reservoir (het "glazen trappenhuis aan de buitenkant bovenaan") met groene banden op elke verdieping, een plat dak en in het midden een lagere groene ronde opbouw. Ontwerpers en maten komen overeen met de opdracht.

## Bestanden

- `watertoren-oss-nieuwe-watertoren.glb`: één node `building:schacht-glazen-trommel-en-opbouw`, op het maaiveld.
- `watertoren-oss-nieuwe-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-oss-nieuwe-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [165214.19, 419373.86], het zwaartepunt van de BAG-contour van pand 0828100001591002 (35,1 m², een 47-hoek met straal 3,26 tot 3,42 m: de trommel), op maaiveld (AHN-DTM NAP +8,3 m; 3D BAG 8,26). De toren is rond: lokale +X is RD-oost (`xAxis` [1, 0]). `groundHeight` 51,96 is NAP +8,3 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,66 m). Het model vervangt het pand, zodat het PDOK-blok (een cilinder ter grootte van de trommel van maaiveld tot het dak) verdwijnt.

## Onderdeel `building:schacht-glazen-trommel-en-opbouw`

- Ronde schacht van 4,5 m (r 2,25) van het maaiveld tot de trommel.
- Drie rijen van twaalf smalle verticale vensters als nissen van 0,4 m breed en 0,3 m diep (plafond 56 graden): 7,9–9,8 m, 15,5–17,4 m en 22,5–24,1 m, de bovenste rij vlak onder de trommel.
- Glazen trommel van 24,65 m tot het platte dak op 34,7 m: een zestienzijdige glasgevel (apothema 3,15 m) met groene banden van 6,76 m (r 3,38, de BAG-cirkel): een voetband van 0,55 m, drie tussenbanden van 0,35 m op 27,1, 29,5 en 31,9 m (verdiepingen van 2,4 m) en een dakband van 0,4 m. De onderkant van de trommel is vlak, zoals in het echt; de export vult er een kegel van 45 graden onder.
- Groene opbouw in het midden van het dak: een voetrand van 4,6 m tot 34,95 m en een ronde opbouw van 4,0 m tot 36,3 m, met een verdiept dak van 2,2 m breed op 35,05 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Oss)): bouwjaar, ontwerpers, 34,52 m, 85 m³.
- [watertorens.eu](https://watertorens.eu/torens/Oss/Organon/fotoos.html): adres Molenstraat 110, betonnen vlakbodem, naoorlogs modernisme, het glazen trappenhuis bovenaan, renovatie 2009; de foto van O. Brinkkemper (RCE, 2017), frontaal van de trommel en de opbouw: breedtes van schacht (4,47 m) en opbouw (4,0 m), hoogte van de trommel (10,1 m), de banden en de opbouw (1,56 m), de vensterrij onder de trommel. Geschaald op de trommel (BAG).
- [Trefhetinoss](https://www.trefhetinoss.nl/locaties/3632373061/watertoren-organon): de ansichtkaart "Oss, N.V. Organon" (circa 1951), de hele toren van opzij: schacht 4,6 m, trommel vanaf 24,6 m, de vensterrijen in de schacht. Geschaald op de toren van maaiveld tot dak (34,7 m).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +8,2 tot +8,5, dak van de trommel NAP +42,9 tot +43,1, rand van de opbouw NAP +44,3 tot +44,8 op 1,5 tot 2 m uit het hart, verdiept dak daarbinnen NAP +43,3 tot +43,4.
- 3D BAG (LoD2.2, AHN5 2024) van pand 0828100001591002: maaiveld 8,26, dak 42,87 tot 43,55 (NAP); ter controle.
- BAG-pand 0828100001591002 en luchtfoto (PDOK): het hart en de maat van de trommel, de ronde opbouw met het donkere verdiepte dak.

## Geschat en weggelaten

Geschat: de hoogtes van de banden en de vensterrijen en de breedtes van schacht en opbouw (foto's, geschaald op BAG en AHN), het aantal vlakken van de glasgevel (zestien, uit de stijlen op de foto), het aantal vensters per rij (twaalf: vier op de zichtbare helft, op 30 graden), de breedte van de vensters (in het echt circa 0,25 m, op 0,4 m gezet), de voetrand, en de breedte van het verdiepte dak (DSM circa 2,8 m; op 2,2 m gezet zodat de rand van de opbouw 0,9 m dik blijft).

Weggelaten: de ingang en eventuele vensters op de begane grond (op geen bruikbare foto te zien, achter fabriekshallen), de glasstijlen en leuningen in de trommel en de luiken op het dak (kleiner dan 0,9 m), en de leidingbrug die aan de noordoostkant langs de toren loopt (geen deel van de toren). Het opbouwtje met de trap op het dak dat in 1951 aan één kant stond, is bij de renovatie vervangen door de ronde opbouw; het model volgt de huidige toestand.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume met 1,7 %: vrijwel alles is de kegel onder de vlakke onderkant van de trommel (1,1 m uitkraging), plus randjes onder de banden. Schacht, vensternissen en opbouw blijven zoals ze zijn. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (3D BAG LoD2.2: één cilinder ter grootte van de trommel van maaiveld tot het dak) de smallere schacht met de vensterrijen, de bredere glazen trommel met de groene verdiepingsbanden en de opbouw met voetrand en verdiept dak.

Controle-URL: http://localhost:3000/kaart/51.76284/5.53518/200/1x1/0
