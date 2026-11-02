# Oude watertoren (Etten-Leur)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-etten-leur-oude-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, plint en kroonlijst zijn prisma's en omhulsels van een afgeschuind vierkant, de steunberen, portalen, lisenen en erkers omhulsels van trapezia, het tentdak een omhulsel van de achthoekige dakvoet en de top; deuren en panelen zijn nissen.

De oude watertoren aan de Hoevenseweg 31 is in 1924 gebouwd naar ontwerp van H. Sangster voor de N.V. Waterleiding Maatschappij Noord-West-Brabant, 48,70 m hoog met twee reservoirs (laag 300 m³, waterspiegel 28,5 m; hoog 400 m³, waterspiegel 41,5 m). Hij is rijksmonument 516667. Het register noemt de stijl expressionistisch (Wikipedia: art deco) en beschrijft een betonskelet met gepleisterde vulling op een vierkante, afgesnoten plattegrond, in drie geledingen met erkervormige uitkragingen en steunberen in de onderbouw, bekroond door een achthoekige kop met een koperen tentdak.

## Bestanden

- `watertoren-etten-leur-oude-watertoren.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een losse kop of erker zou een voet tot de grondplaat krijgen.
- `watertoren-etten-leur-oude-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-etten-leur-oude-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [101932.69, 398722.56], het hart van het vierkant uit de BAG-contour van pand 0777100000151802 (10,6 m over de gevels, zonder de steunberen), op maaiveld (NAP +6,56 m; het AHN-maaiveld in een ring van 8 tot 12 m ligt tussen +6,40 en +6,72). De top van het tentdak ligt in het AHN precies op dit punt. `xAxis` [0.9767, 0.2147]: +X wijst naar de oostgevel, RD-richting 12,4 graden, langs de zuid- en noordgevel van de BAG-contour; +Y wijst naar de noordgevel.

De vier `groundSamplePoints` liggen 7,5 m uit het hart voor de portalen, tussen de steunberen. `groundHeight` 50,64 (NAP 6,56 plus de NLGEO2018-geoïdehoogte 44,08 op de oorsprong) is de terugval zonder maaiveld.

## Onderdeel `building:schacht-lisenen-erkers-kop-en-tentdak`

- Schacht: vierkant van 10,6 m over de gevels met afgeschuinde hoeken (zijde 1,0 m, schuin vlak 1,4 m), zonder tapsheid.
- Donkere plint 0,2 m voor de gevel tot +2,3, op een kraag van 45 graden naar de schacht.
- Vier steunberen op de hoeken, langs de diagonaal: 1,0 m breed, 1,85 m voorbij de hoek (BAG), met een schuine rug van +4,0 tegen het hoekvlak naar +1,0 op de punt.
- Vier portalen, midden op elke gevel: 4,6 m breed op de grond en 3,8 m op +6,6, met schuine wangen en een vlakke bovenkant; 0,5 m uit de noordgevel (BAG) en 0,3 m uit de andere. In elk portaal een deurnis van 1,6 × 2,6 m en een verdiept paneel van 2,2 m breed van +3,4 tot +6,0.
- Per gevel een lisene boven het portaal: 2,8 m breed en 0,2 m uit de gevel tot +21,0, daarboven (zone van het lage reservoir) 3,2 m breed en 0,3 m uit de gevel.
- Erkers (zone van het hoge reservoir): vanaf +34,3 op een onderkant van 45 graden 0,55 m uit de gevel, naar boven breder van 3,5 tot 3,8 m (3D BAG: 3,8 m), met schuine wangen, tot de dakvoet op +45,7.
- Achthoekige kop: kroonlijst van 11,4 m over de gevels (0,4 m voor de gevel) van +43,0 tot +45,7 op een kraag van 45 graden, met afgeschuinde hoeken (zijde 1,9 m) die op de diagonalen binnen het hoekvlak van de schacht blijven, zoals het AHN (dakrand op de diagonalen 6,7 m uit het hart).
- Koperen tentdak van de achthoekige dakvoet op +45,7 naar de top op +48,68 (AHN: z = 48,68 − 0,52 r langs de assen).

## Geschat en weggelaten

Geschat: de hoogtes van de geledingen (lisene breder op 21,0 m, erker vanaf 34,3 m, kroonlijst 43,0 tot 45,7 m) en van de portalen (6,6 m) uit verticaal gecorrigeerde RCE-foto's, geschaald op de dakrand uit het AHN en de 3D BAG (±0,8 m); de breedtes van portalen, lisenen en erkers uit dezelfde foto's (±0,3 m), de erkerbreedte bovenaan uit de 3D BAG; de afschuining van de schachthoeken (1,0 m, op foto's tussen 0,8 en 1,3 m; op de grond verdekt door de steunberen); de uitsprong van de kroonlijst (0,4 m) en de erkers (0,55 m); de hoogte en helling van de steunberen; de diepte van de nissen. De erkers hebben in het echt holle, iets ingesnoerde wangen; in het model zijn ze recht en lopen ze naar boven iets uit.

Weggelaten (kleiner dan 0,9 m of alleen kleur): de kleine vierkante vensters in de erkers en de schacht (circa 0,5 m), de dubbele profilering aan de onderkant van de kroonlijst, de getrapte koperen randen langs de dakvoet en de hoekkepers (treden van 0,3 m), de smalle verticale groeven naast de lisenen en op de hoeken, het hek en de gemetselde hekpijlers rond de toren, en het pompstation (geen onderdeel van het monument).

## Controle

Eén gesloten NoError-node met genus 0, de onderkant op -0,3 m. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 0,1 %: de kragen van de plint, de lisenen, de erkers en de kroonlijst lopen onder 27 tot 45 graden en de plafonds van de nissen onder 56 graden. De doorsneden op 1 tot 48 m blijven gelijk. Controlebeelden blijven buiten de repo. Vergeleken met de PDOK-reconstructie (3D BAG LoD2.2: een vierkante kolom met verticale stroken tot de dakvoet en een tentdak, plus lage steunberen) heeft het model van alle kanten de afgeschuinde hoeken, de plint, de hoge steunberen, de portalen met deur en paneel, de lisenen met hun verbreding, de uitkragende erkers, de achthoekige kroonlijst en een regelmatig tentdak.

Controle-URL: http://localhost:3000/kaart/51.57495/4.62161/200/1x1/0

## Bronnen

- [Wikipedia](https://nl.wikipedia.org/wiki/Oude_watertoren_(Etten-Leur)): bouwjaar, architect, 48,7 m, reservoirs van 400 en 300 m³.
- [Rijksmonument 516667](https://monumentenregister.cultureelerfgoed.nl/monumenten/516667): expressionistisch, vierkante afgesnoten plattegrond, drie geledingen met erkervormige uitkragingen, steunberen in de onderbouw, achthoekige kop met koperen tentdak, 48,70 m, waterspiegels op 28,5 en 41,5 m.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +6,56, top van het tentdak NAP +55,25 (48,68 m), dakhelling 0,52 m per m langs de assen, dakrand op de diagonalen op 6,7 m uit het hart (de afgeschuinde kop).
- 3D BAG (LoD2.2): dakvoet op 45,6 tot 45,9 m, erkers 3,8 m breed en 0,35 tot 0,4 m voor de gevel.
- BAG-pand 0777100000151802 en luchtfoto (PDOK, 8 cm): vierkant van 10,6 m op 12,4 graden, steunberen van 1,0 m op de hoeken, uitsprong van de portalen, plint en portaal aan de zuidkant, koperen tentdak.
- RCE-foto's op Wikimedia Commons: "Overzicht van de watertoren - Etten-Leur" (20388941, 20388942, 20388943), "Overzicht - Etten-Leur" (20340467, 20340337), "Voet van de watertoren met ingangspartij - Etten-Leur" (20340470, 20340471) en "Bovenste gedeelte met koperen tentdak - Etten-Leur" (20340468, 20340472): geledingen, portalen, lisenen, erkers, kroonlijst en dak; en "Etten Leur Watertoren 0796".
