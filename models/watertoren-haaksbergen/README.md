# Watertoren Haaksbergen (Haaksbergen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-haaksbergen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de onderbouw is een prisma van de BAG-rechthoek met een geknikte plint, de doorgangen zijn spitsbogen (convexe omhullende), de uitkraging en de gootlijst zijn omhullenden van twee rechthoeken, het dak is een schilddak met gelijke hellingen en de vensters zijn nissen.

De watertoren staat bij het station van de Museum Buurtspoorweg aan de Stationsstraat, naast het sporenterrein. Volgens de lijst van watertorens in Overijssel op Wikipedia is hij in 1998 gebouwd; ontwerper, hoogte en inhoud zijn onbekend, en er is geen eigen artikel, register of Wikidata-item met coördinaten. De plek volgt uit de Commons-foto "Haaksbergen Stationsstraat Watertoren" (2015), het enige BAG-pand op die plek (0158100000004297, een rechthoek van 4,49 × 3,17 m; het BAG-bouwjaar 1884 is dat van het stationsgebouw ernaast) en de piek in het AHN. Het is een spoorwegwatertoren in oude stijl: een bakstenen onderbouw met in elke zijde een doorgang onder een boog, kleine vensters, en daarop een uitkragende, groen beschoten houten kuip met een rij kleine vensters, een gootlijst op consoles en een schilddak met makelaars.

## Bestanden

- `watertoren-haaksbergen.glb`: één node `building:bakstenen-onderbouw-met-bogen-houten-kuip-en-schilddak`, op maaiveld.
- `watertoren-haaksbergen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-haaksbergen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [247353.76, 464154.64] (52,15783 N, 6,73687 O), het hart van BAG-pand 0158100000004297 (gemiddelde van de vier hoekpunten; de nok in het AHN-DSM ligt erop). Maaiveld AHN-DTM NAP +26,1 (25,9 tot 26,3 rond de toren). Lokale +X is de lange zijde van het BAG-pand (RD 33,75 graden, naar het noordoosten; `xAxis` [0.83147, 0.55557]); de korte zijden (normaal ±X) zijn de voorzijde op de foto. `groundHeight` 69,73 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (oost 69,90, west 69,80, noord 69,73, zuid 69,85); het PDOK-pand begint op 69,58. Het model vervangt BAG-pand 0158100000004297, zodat het PDOK-blok verdwijnt; het stationsgebouw ernaast (0158100000018448) staat in PDOK op de goede hoogte en blijft.

## Onderdeel `building:bakstenen-onderbouw-met-bogen-houten-kuip-en-schilddak`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Onderbouw: plint van 4,49 × 3,17 m tot 2,35 m, daarboven onder 45 graden 0,1 m terug tot de muur van 4,29 × 2,97 m.
- Doorgangen: in elke zijde een doorgang van 1,3 m breed, kruisend in het midden, als spitsboog met flanken van 55 graden vanaf 2,45 m tot 3,38 m; de vier hoekpijlers zijn 0,94 × 1,6 m.
- Vensters in de muur: twee naast de boog in de korte zijden, drie in de lange zijden, 0,45 × 0,35 m van 3,65 tot 4,0 m, nissen van 0,3 m diep.
- Kuip: 6,2 × 4,5 m van 5,25 tot 7,3 m; de onderkant kraagt vanaf 4,1 m uit (40 graden uit het lood aan de korte, 34 graden aan de lange zijden). Vensterrij van 6,45 tot 7,1 m, 0,45 m breed: drie in de korte, vijf in de lange zijden.
- Gootlijst: 0,35 m uitkraging onder 41 graden van 7,2 tot 7,6 m, rand tot 7,9 m (6,9 × 5,2 m).
- Dak: schilddak met gelijke hellingen (36 graden) van de gootlijst tot de nok op 9,8 m, nok 1,7 m lang langs X.

## Bronnen en maten

- [Wikipedia, Lijst van watertorens in Overijssel](https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Overijssel): Haaksbergen, 1998, hoogte, inhoud en ontwerper onbekend.
- BAG-pand 0158100000004297 (PDOK, 2026-11-06): rechthoek 4,49 × 3,17 m, richting 33,75 graden.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +26,1, gootlijst NAP +34,0 (7,9 m), nok NAP +35,9 (9,8 m); de dakrand ligt in het DSM op ±3,45 m in X en −2,2 tot +2,85 m in Y (het model neemt ±2,6 m, symmetrisch om het BAG-hart).
- Luchtfoto (PDOK, 2026-11-06): schilddak met korte nok langs de lange as.
- Foto op Wikimedia Commons: "Haaksbergen Stationsstraat Watertoren" (1 augustus 2015, recht op een korte zijde): bogen in de korte en de lange zijde, geknikte plint, vensters, kuip met beschot en vensterrij, gootlijst op consoles, schilddak met makelaars.

## Geschat en weggelaten

Geschat uit één foto (schaal circa 100 px/m uit de gootlijsthoogte en de BAG-breedte van 3,17 m): de hoogte van de onderkant van de kuip (foto 5,0 tot 5,15 m, hier 5,25 m met een schuine onderkant vanaf 4,1 m; in het echt vlak), de breedte van de kuip (6,2 × 4,5 m, tussen de foto en de AHN-dakrand in), de plinthoogte en de terugsprong van 0,1 m, de breedte en hoogte van de doorgangen en dat ze in alle vier de zijden zitten (gezien in twee), de plaats, maat en het aantal van de vensters (de achterkant en de tweede lange zijde zijn niet gefotografeerd en hier gelijk aan de zichtbare zijden), de uitkraging van de gootlijst en de hellingen van het dak (gelijke hellingen tussen de AHN-randen en de nok).

Weggelaten: het verticale beschot met latten op de kuip, de goudkleurige band onder de kuip, de consoles onder de gootlijst en de makelaars op het dak (allemaal kleiner dan 0,9 m), en het hekwerk rond de toren. De ronde bogen zijn spitsbogen met flanken van 55 graden en de onderkant van de kuip is schuin, zodat het model zonder steun print.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: spitsbogen van 55 graden, uitkraging van de kuip van 40 en 34 graden, gootlijst van 41 graden en nissen met een plafond van 56 graden. Een export op 1:1000 rond de toren bevat het model zonder extra steun en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (de BAG-rechthoek als blok tot circa 10 m met een schilddak) de doorgangen met de vier hoekpijlers, de terugspringende plint, de uitkragende kuip die breder is dan de onderbouw, de vensters in muur en kuip en de overstekende gootlijst.

Controle-URL: http://localhost:3000/kaart/52.15783/6.73687/200/1x1/0
