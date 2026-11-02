# Oude watertoren (Oss)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-oss-oude-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, panelen, mantel, dakrand en spits zijn cilinders en afgeknotte kegels, de pilasters, sluitstenen en consoles omhulsels van rechthoeken; vensters en de ingang zijn nissen.

De Oude watertoren aan de Watertorenstraat 1 in Oss is in 1935 gebouwd in opdracht van het Rijksbureau voor Drinkwatervoorziening, naar een ontwerp van (volgens het register waarschijnlijk) J.H.J. Kording: 48 tot 48,5 m hoog met een dubbel reservoir van 2 × 300 m³, rijksmonument 516605. Late Amsterdamse School in verstrakte vormen: een ronde bakstenen schacht om een betonskelet, met op de plaats van het skelet zes brede bakstenen pilasters, een smalle tussenverdieping met per travee een uitspringend paneel met vier lage vensters, een gladde reservoirmantel met hoge smalle vensters van glasstenen en een ronde koperen spits. De toren is sinds 1978/1985 van een Turkse moskeevereniging; de ISN Ulu Moskee staat in de eenlaagse aanbouwen aan de west- en noordkant (een eigen BAG-pand van latere datum, buiten de bescherming en niet in dit model), op de begane grond van de toren zit een winkel.

## Bestanden

- `watertoren-oss-oude-watertoren.glb`: één node `building:schacht-pilasters-reservoir-en-spits`, op het maaiveld.
- `watertoren-oss-oude-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-oss-oude-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [163834.11, 419681.4], het zwaartepunt van de BAG-contour van pand 0828100001593611 (138,7 m², de cirkel van de schacht met de zes pilasters), op maaiveld (3D BAG NAP +6,76 m). De pilasters staan in de BAG-contour op -1 + 60k graden van RD-oost: lokale +X is de oostelijke pilaster (`xAxis` [0.9998, -0.0175]), de travees staan op 30 + 60k graden. `groundHeight` 50,41 is NAP +6,76 plus de NLGEO2018-geoïdehoogte op de oorsprong (43,65 m). De `groundSamplePoints` liggen alleen aan de vrije zuid- en oostkant (parkeerplaats); west en noord staan de aanbouwen van de moskee. Het model vervangt het pand, zodat het PDOK-blok (een veelhoekige kolom ter breedte van de pilasters tot het maaiveld met een zeszijdige spits) verdwijnt.

## Onderdeel `building:schacht-pilasters-reservoir-en-spits`

- Schacht: cirkel van 12,8 m (r 6,4 m) van het maaiveld tot 27 m.
- Zes pilasters van 2,0 m breed tot 7,0 m uit het hart (14 m over de pilasters), van het maaiveld tot 33,2 m, met een kop die onder 45 graden 0,3 m terugwijkt.
- Tussenverdieping: per travee een uitspringend paneel (r 6,8 m) van 27,4 tot 31,3 m op een kraag van 45 graden, een betonrand van 0,1 m uit tot 31,6 m en een schuine bovenkant naar de mantel op 32,2 m; per paneel vier lage vensters van 0,4 × 1,6 m (29,2–30,8 m). Onder elk paneel een sluitsteen van 1,0 m breed (26,0–27,4 m, kraag van 45 graden).
- Reservoirmantel: cirkel van 13,2 m (r 6,6 m, 0,94 maal de pilasters), per travee een hoog smal venster van 0,5 × 4,4 m (34,8–39,2 m) en een console van 1,2 m breed, 0,3 m uit, met een puntige onderkant (39,6–41,7 m).
- Dakrand r 6,75 m van 41,7 tot 42,7 m op een kraag van 45 graden.
- Ronde koperen spits van r 6,1 m op 42,7 m tot 48,4 m (helling 0,93, 43 graden).
- Nissen van 0,3 m met plafonds van 56 graden: per travee in de schacht een smal hoog venster van 0,6 m breed (6,0–25,6 m; boven de ingang vanaf 5,6 m).
- Ingang aan de zuidkant (RD 269 graden, naar de parkeerplaats): rondboogdeur als nis van 1,6 m breed met een spitse top op 3,4 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Oude_watertoren_(Oss)): bouwjaar, ontwerper Kording, 48,5 m, 2 × 300 m³, de Ulu Moskee en de uitbreiding van 2007–2009.
- [Rijksmonumentenregister 516605](https://monumentenregister.cultureelerfgoed.nl/monumenten/516605): 1935, waarschijnlijk Kording, Late Amsterdamse School, 48,0 m, ronde grondslag, grote bakstenen pilasters op de plaats van het betonskelet, smalle hoge ramen, de tussenverdieping met vier lage vensters per travee, hoge smalle vensters met glasstenen naast het reservoir, ronde spits met flauwe helling van koper, rondboogingang met een kleine trap; de eenlaagse aanbouwen zijn van later en niet beschermd. Ontwerper en vorm komen daarmee overeen met de opdracht.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +6,8, dakrand circa NAP +49,4, spits NAP +55,15, helling van de spits 0,95 (mediaan per straal van 1,5 tot 4,5 m); de bovenkant reikt tot circa 6,7 m uit het hart en ligt tot 0,4 m zuidelijker dan de BAG-contour.
- 3D BAG (LoD2.2) van pand 0828100001593611: maaiveld 6,76, spits 55,2 (NAP); ter controle.
- BAG-pand 0828100001593611 en luchtfoto (PDOK): het hart, de stand en breedte van de zes pilasters, de straal van de schacht, de aanbouwen van de moskee aan de west- en noordkant.
- Foto "Oss, watertoren foto3 2016-04-20" (Wikimedia Commons), telelens vanuit de Watertorenstraat in het westen: verhouding van mantel en pilasters, hoogtes van paneel, pilasterkoppen, vensters, consoles en dakrand, geschaald op de mantel (28,3 px/m).
- Foto's "Oss Watertoren 1", "Watertoren Oss" en "Watertorenstraat Oss ri oost va Bermakker" (Wikimedia Commons): de zuidkant met de ingang, de vensters per travee en de spits.

## Geschat en weggelaten

Geschat: de straal van de mantel (foto, 0,94 maal de pilasters, en het AHN), de uitsprong van paneel, betonrand en dakrand, de hoogtes van paneel, pilasterkoppen, vensters, sluitstenen en consoles (foto, geschaald op de dakrand uit het AHN), de maat van de vensters, de voet van de spits binnen de dakrand, de lengte van de hoge vensters (op de foto's per travee verschillend; hier overal gelijk) en de plek en maat van de ingang (zuid, uit de foto's en de luchtfoto).

Weggelaten (kleiner dan 0,9 m, van later of alleen vlakversiering): de eenlaagse aanbouwen van de moskee (eigen BAG-pand, buiten de bescherming), de smalle uitbouw aan de noordkant van de BAG-contour (laag, tussen toren en moskee), de kleine trap en de kunststeen decoratie ANNO 1935 bij de ingang, de kleine blokjes boven de panelen, de makelaar op de spits, de antennes en schotels op de dakrand, de regenpijpen en de klimop aan de zuidoostkant.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,002 %: de kragen onder paneel, betonrand en dakrand, de sluitstenen en consoles lopen onder 45 graden en de nisplafonds onder 56 graden. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (3D BAG LoD2.2: een veelhoekige kolom tot het maaiveld met een zeszijdige spits) de ronde schacht met zes pilasters, de uitspringende panelen van de tussenverdieping met hun vensters, betonrand en sluitstenen, de smallere reservoirmantel met consoles en hoge vensters, de dakrand en de ronde spits, en de smalle hoge vensters en de ingang.

Controle-URL: http://localhost:3000/kaart/51.76566/5.51522/200/1x1/0
