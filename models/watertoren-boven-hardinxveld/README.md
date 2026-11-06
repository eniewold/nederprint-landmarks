# Watertoren Boven-Hardinxveld (Boven-Hardinxveld)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-boven-hardinxveld.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en band zijn prisma's, de schuine reservoirbodem, het reservoir, de omloop met kraag en de kap zijn hulls van vierkanten (planvlakken), de velden, de deur en het venster blinde nissen met een schuin plafond.

De watertoren van Boven-Hardinxveld (Hardinxveld-Giessendam) werd in 1923 gebouwd door de N.V. Algemeene Beton Compagnie uit Den Haag. Hij is 42,90 m hoog en heeft een betonnen vlakbodemreservoir van 215 m³; interbellumstijl met invloeden van het Nieuwe Bouwen en een "zware kap" (Wikipedia). Rijksmonument 512954. De toren staat er nog (BAG "Pand in gebruik", kantoorfunctie; luchtfoto en AHN). Een vierkante, gepleisterde betonnen schacht met per gevel drie verdiepte verticale velden boven een gladde voet en een band onder de kraag draagt een breder vierkant reservoir met een schuine onderkant. Bovenop het reservoir loopt een omloop op consoles met een stalen hekwerk, en daarop staat een zware geknikte piramidekap (het onderste deel steiler) met een pinakel.

## Bestanden

- `watertoren-boven-hardinxveld.glb`: één node, `building:watertoren-schacht-reservoir-omloop-en-kap`.
- `watertoren-boven-hardinxveld.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-boven-hardinxveld-1-1000.stl`: het model op 1:1000 (11,5 × 11,5 × 43,1 mm).

## Oorsprong en oriëntatie

RD-oorsprong [119622.02, 426112.23] (51,822498 N, 4,874057 O): het hart van de rechthoekige BAG-voetafdruk van pand 0523100000012264 (7,0 × 6,6 m), op het maaiveld: AHN-DTM NAP +0,05 (−0,08 tot +0,19 tussen 4 en 8 m). Het hart van de kap in het AHN-DSM ligt binnen 0,25 m van dit punt.

De lokale X-as loopt langs de zuidgevel van de BAG-voetafdruk, 0,9 graden linksom van RD-oost (`xAxis` [0.99988, 0.01571]).

`groundSamplePoints` liggen op 7 m in de vier asrichtingen; `groundHeight` 43,571 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 43,571 op de weg, noord 43,706, west 43,759, zuid 43,855, gemeten 2026-11-06). Het PDOK-pand staat op 43,55 met de top op 85,86 (een vierkant blok met een spits dak). `groundOffsetMetres` is −0,1. Geen buurpand raakt het model (het dichtstbijzijnde PDOK-pand ligt 15 m westelijk).

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +0,05).

- Schacht: 7,0 × 6,62 m (BAG) tot 22,5 m. Per gevel drie verdiepte velden van 0,3 m diep van 4,3 tot 21,0 m: een breed veld in het midden (37 % van de gevel, 2,6 en 2,45 m) en een smal veld van 0,9 m op 0,6 m van elke hoek. In de gladde voet een deur (nis 1,4 × 2,4 m) aan de oostzijde en een klein venster (nis 0,9 × 0,9 m) aan de noordzijde.
- Band: 0,15 m uitspringend van 21,7 tot 22,5 m, onderkant 45 graden.
- Reservoir: 9 × 9 m, schuine onderkant van de band op 22,5 m naar de wand op 23,6 m (45 graden langs X, flauwer langs Y), rechte wand tot de kap.
- Omloop: 11,5 × 11,5 m, plaat van 30,3 tot 30,75 m (AHN NAP +30,7) op een kraag van 45 graden vanaf de reservoirwand op 29,05 m (de consoles).
- Kap: goot 10 × 10 m op 32,2–32,35 m op een kraag van 45 graden vanaf 31,7 m; onderste kapdeel van 74 graden tot de knik (8,6 × 8,6 m) op 35,0 m; piramide van 58 graden tot de top op 42,0 m (AHN NAP +42,0).
- Pinakel: vierkant van 0,9 m van 41,2 tot 42,3 m met een spits tot 42,85 m (Wikipedia 42,9 m).

Nissen zijn 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Boven-Hardinxveld)): 1923, N.V. Algemeene Beton Compagnie, 42,90 m, 215 m³, rijksmonument 512954.
- BAG-pand 0523100000012264 (PDOK, 2026-11-06): rechthoek 6,99 × 6,62 m, bouwjaar 1923.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +0,05, omloop NAP +30,7 (1 m rondom de kap, 11,5 à 12 m in het vierkant), goot circa NAP +32,6 op 5 m uit het hart, knik rond 4,5 m (NAP +34,7), dakvlak van 58 graden, top NAP +42,0.
- PDOK-luchtfoto (Actueel_orthoHR): vierkante kap, zichtbaar ver naar het zuiden verschoven door de scheefstand.
- Foto's op Wikimedia Commons (categorie "Watertoren (Boven-Hardinxveld)"): "Hardinxveld Watertoren 6853.JPG" (2008, telelens, bijna orthografisch) en "Exterieur OVERZICHT, VOORGEVEL, ZIJGEVEL - Boven-Hardinxveld - 20276765 - RCE.jpg" (1992).

## Geschat en weggelaten

Geschat: de breedtes van het reservoir (9 m), de goot (10 m) en de omloop (11,5 m), de hoogtes van de band, de reservoirbodem, de kraag onder de omloop en de knik in de kap, en de indeling van de velden komen uit de foto van 2008 (0,0234 m per pixel op het reservoir), geschaald op het AHN. De goot staat op 32,2 m: het AHN mengt op de rand 32,3 tot 33,5, de foto geeft 1,1 tot 1,4 m boven de omloop. De smalle velden zijn in het echt circa 0,5 m breed en staan als 0,9 m in het model. Er zijn maar twee bruikbare foto's; de stand van deur (oost) en venster (noord) is daaruit afgeleid en onzeker. De consoles onder de omloop zijn samengevoegd tot één kraag van 45 graden, en de goot heeft een kraag van 45 graden waar hij in het echt recht uitkraagt.

Weggelaten: het stalen hekwerk van de omloop (dunner dan 0,9 m), de losse consoles (circa 0,3 m breed), de kleine ventilatieopeningen in het reservoir (circa 0,3 m) en de verdiepte voegen in de band.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model met hetzelfde volume als zonder steun (geen ondersteuningsobject) en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde vierkante kolom van 7 m met een spits dak) de velden in de schacht, de band, het bredere reservoir met de schuine bodem, de omloop en de geknikte kap met de pinakel.

Controle-URL: http://localhost:3000/kaart/51.82250/4.87406/200/1x1/0
