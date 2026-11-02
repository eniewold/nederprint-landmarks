# Watertoren Roosendaal (Roosendaal)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-roosendaal.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de begane grond en de schacht zijn achtkantige prisma's en kegelstompen (`hull`), het reservoir, de band, de fries en de dakrand zijn omwentelingsvormen, het dak een rechte kegel, de dakkapellen prisma's met een rondboogprofiel en het verdiepte metselwerk, de deur en de vensters nissen.

De watertoren staat aan de Nispensestraat in Roosendaal. Hij is gebouwd in 1916 (gevelopschrift; het register noemt 1917) naar een ontwerp van H.P.N. Halbertsma, is rijksmonument 517281 en heeft een betonskelet. Volgens Wikipedia reikt hij tot 48,6 m boven NAP, volgens het register is hij circa 52 m hoog; het reservoir houdt 300 m³. Een gepleisterde achtkantige begane grond met plint draagt een achtkantige, licht tapse schacht van drie geledingen: verdiept metselwerk tussen het betonnen vakwerk, de bovenste geleding met segmentbogen. Daarop een rond, uitkragend reservoir met een schuine onderrand, een band, een fries met kantelen en een geprofileerde dakrand, bekroond door een koperen kegeldak met vier dakkapelletjes met een gebogen fronton en een piron. In het zuidvlak leidt een trap naar de deur in een gepleisterde omlijsting met een gebogen fronton.

## Bestanden

- `watertoren-roosendaal.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-roosendaal.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en `replacesBuildings` (BAG-pand 1674100000957195).
- `watertoren-roosendaal-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [90646.39, 393890.4] (WGS84 51.530313, 4.459769), het midden van de achtkantige BAG-contour van pand 1674100000957195 (bouwjaar 1916, 92 m², vlakken 5,27 m uit het hart). Op het maaiveld NAP +4,40 m (AHN-DTM 8 m ten zuiden en westen 4,34 tot 4,45; aan de noordoostkant ligt een lager hof op +3,6, daarom staan de `groundSamplePoints` aan de zuid- en westkant). `xAxis` [0.9646, -0.2639]: +X loopt langs RD -15,3 graden, de normaal van een BAG-vlak (oostzuidoost, de straatkant); de vlakken staan op veelvouden van 45 graden daarvan. De deur staat in het zuidvlak op -Y. `groundHeight` 48,6 (NAP 4,40 + 44,20, NLGEO2018-geoïde op de oorsprong) is de terugval als er geen maaiveld is.

## Onderdeel `building:schacht-reservoir-en-koperen-spits`

- Begane grond: achtkant van 10,54 m over de vlakken (BAG) tot 5,3 m, plint van 10,84 m tot 0,8 m, kroonlijst van 11,2 m met een kraag van 45 graden tot 5,9 m.
- Deuromlijsting 2,6 m breed en 0,25 m voor het zuidvlak met een gebogen fronton tot 4,8 m, deur 1,3 × 2,6 m als nis, trap van twee treden (0,4 en 0,8 m) tot 1,3 m voor de gevel.
- Hoge vensters van 1,3 × 2,4 m als nissen in de begane grond op 0, 45, -45 en 180 graden.
- Schacht: achtkant van 10,24 m over de vlakken op de kroonlijst tot 8,42 m op 24,6 m.
- Verdiept metselwerk: per vlak en per geleding een nis van 0,3 m tussen hoekpilasters van 0,6 m, geledingen van 6,4 tot 11,7, 12,6 tot 18,0 en 18,9 tot 23,4 m, de bovenste met een segmentboog tot 24,1 m. Op het vlak met het balkonhuisje ontbreekt de bovenste nis (daar staat de console).
- Schuine onderrand van de hoeken van de schacht naar een rond van 9,5 m op 25,4 m en schuin naar de reservoirwand van 10,1 m op 27,9 m; band van 10,4 m van 27,9 tot 28,4 m.
- Reservoirwand van 10,1 m tot 33,4 m, met een fries van 10,4 m van 31,9 tot 33,4 m en acht kantelen van 2 m breed die tot 31,2 m naar beneden steken.
- Dakrand: holle lijst als rechte kraag (67 graden) naar 11,9 m op 35,2 m, rechte rand tot 35,9 m en een schuine bovenkant naar de voet van het dak (11,3 m op 36,2 m).
- Koperen kegeldak van 58 graden (helling 1,59) tot 45,2 m, 48 zijden.
- Vier dakkapellen op 0, 90, 180 en 270 graden: 1,4 m breed, de voorkant op 5,3 m uit het hart, zijwanden tot 38,9 m en een halfrond fronton tot 39,6 m.
- Piron van 0,9 m met een bol van 1,0 m tot 46,0 m.
- Balkonhuisje op 45 graden (oostnoordoost): 1,8 m breed, tot 5,75 m uit het hart, van 24,6 m tot onder de band, op een console van 45 graden.

## Bronnen en maten

- [Wikipedia, Watertoren (Roosendaal)](https://nl.wikipedia.org/wiki/Watertoren_(Roosendaal)): Halbertsma, 1916, 48,6 m boven NAP.
- [Rijksmonumentenregister 517281](https://monumentenregister.cultureelerfgoed.nl/monumenten/517281): opbouw, materialen, 300 m³, circa 52 m, vier dakkapelletjes, piron, deuromlijsting.
- BAG-pand 1674100000957195: regelmatige achthoek, vlakken op -15,3 + 45k graden.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld, de helling van het dak binnen 3,7 m uit het hart (1,59) en de top van de kegel op NAP +49,6; het maximum NAP +50,36 is de piron. Verder naar buiten heeft het DSM op het koperen dak geen bruikbare punten.
- 3D BAG (LoD2.2 uit AHN5, 2024): dak tot 5,6 tot 5,8 m uit het hart op NAP +40,5 tot +41,0, kegeltop NAP +49,6, dakkapellen tot NAP +44,0 op -12, 78 en 168 graden.
- Luchtfoto (PDOK, 8 cm): dakrand 11,9 m doorsnede, de toren hangt ongeveer 7,7 m naar het noorden over; tuinpaden naar het zuidvlak.
- Foto [RM517281 IMG 9483](https://commons.wikimedia.org/wiki/File:Roosendaal,_de_Watertoren_RM517281_IMG_9483_2021-06-14_10.57.jpg) (2021, evenwijdige verticalen): breedtes dakrand : reservoir : schacht boven : schacht onder = 355 : 301 : 251 : 298 px, de hoogtes van de banden en het reservoir (29,8 px/m), het balkonhuisje.
- Foto's [WatertorenRoosendaal](https://commons.wikimedia.org/wiki/File:WatertorenRoosendaal.jpg), [WatertorenRoosendaalAchterzijde](https://commons.wikimedia.org/wiki/File:WatertorenRoosendaalAchterzijde.jpg) en [Watertoren Roosendaal](https://commons.wikimedia.org/wiki/File:Watertoren_Roosendaal.jpg): reservoir, fries, dakrand, dakkapellen, piron, deur met fronton en trap, schacht met segmentbogen.
- NLGEO2018-geoïdehoogte op de oorsprong (44,20 m) voor `groundHeight`.

## Geschat en weggelaten

Geschat:

- De doorsnedes van schacht, reservoir en band (±0,3 m): verhoudingen op de foto, geschaald op de dakrand van de luchtfoto.
- De hoogtes van de kroonlijst, de geledingen, de onderrand, de band, de wand en de dakrand (±0,5 m, uit één foto; de foto's zijn van onderen genomen).
- De richting van de deur (zuid, uit de tuinpaden) en van het balkonhuisje (oostnoordoost, uit de kijkrichting van de foto's); de vensters in de begane grond (richting en aantal).
- De dakkapellen op de vlakrichtingen 0/90/180/270 (de 3D BAG geeft 3, 93 en 183 graden); de vierde is aangenomen.
- De diepte van het verdiepte metselwerk (0,3 m, in het echt minder) en de kantelen van de fries (0,15 m reliëf, vorm en aantal geschat).

Weggelaten, omdat ze kleiner zijn dan 0,9 m:

- de kleine ronde openingen in de onderrand en de smalle staande ramen in het reservoir;
- de vensters in de panelen en de dakkapellen, de balkonhekjes en het balkonnetje onder het huisje;
- de felsnaden van het koperen dak, de pilasters van de deuromlijsting en de bollen op de trappalen.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export dat doet, vrijwel niets op (volume 1,000016): kragen onder 45 graden of steiler, nisplafonds onder 56 graden, dakkapellen en piron op de kegel. PDOK toont de toren als een achtkantige zuil tot de dakrand met een spits; het model voegt de begane grond met kroonlijst en deurpartij, de tapse schacht met het verdiepte metselwerk, het uitkragende ronde reservoir met band, fries en dakrand, de ronde kegel met dakkapellen, de piron en het balkonhuisje toe. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.53034/4.45977/200/1x1/0
