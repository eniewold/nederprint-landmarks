# Watertoren Geleen (Staatsmijn Maurits)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-geleen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het reservoir is een achttienhoekig omhulsel met een afgeschuinde onderrand, de lisenen zijn blokken op de hoeken, de kroonlijst een omhulsel met een schuine onderkant, de trommel een omwentelingsprofiel, en kolommen, balken, schacht en ingang zijn prisma's.

De voormalige watertoren van Staatsmijn Maurits (1924–1926, ontwerp Ir. A.E. Dinger, hoofd-bedrijfsingenieur van de Staatsmijnen) staat aan het Mauritspark, op het vroegere DSM-terrein. Gemeentelijk monument GM066 (Mauritspark 1a). Een betonnen toren: een achttienhoekig reservoir met lisenen en een kroonlijst, een plat dak met een lage ronde trommel en zes steunblokken, gedragen door zes kolommen met ringbalken en een ronde middenschacht. Op de foto's van 2007 grijs, op de huidige luchtfoto wit.

## Bestanden

- `watertoren-geleen.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
- `watertoren-geleen.json`: catalogusitem met RD-oorsprong, `xAxis`, maaiveldpunten, `groundHeight` en `replacesBuildings`.
- `watertoren-geleen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [185190.24, 331660.27], het hart van de middenschacht: de cirkel van 2,08 m in BAG-pand 1883100000047359. Dat pand (bouwjaar 1940 in de BAG, 6,5 m²) is alleen de voet van de schacht met een rechthoek van 1,41 bij 2,35 m naar het zuidzuidoosten (de ingang); in de 3D BAG en de PDOK-gebouwtegels staat het als een dunne zuil tot 38 m. Het model vervangt dat pand; andere panden liggen niet binnen 35 m. Maaiveld NAP +70,6 m (AHN-DTM, ring van 9 tot 13 m rond het hart). Assen in RD-richting (`xAxis` [1, 0]).

De zes kolommen staan op 5,9 m van het hart op -9 + k·60 graden (linksom vanaf RD-oost): de voeten van vier kolommen staan op de luchtfoto, waar de toren naar het noorden helt, op 5,6 tot 6,3 m van het hart en 55 tot 60 graden uit elkaar. De zes steunblokken rond de trommel staan op de luchtfoto op dezelfde hoeken (gemiddeld -11 graden), en de ingang van de BAG wijst naar de kolom op -69 graden. De hoeken van de achttienhoek en de lisenen liggen op -9 + k·20 graden, dus boven elke kolom een hoek. `groundHeight` 115,96 is het ellipsoïdische maaiveld: NAP +70,6 plus de NLGEO2018-geoïdehoogte van 45,36 m op de oorsprong.

## Onderdeel `building:kolommen-schacht-en-reservoir`

- Zes kolommen van 0,9 m, van de voet tot in de onderrand van het reservoir.
- Twee ringbalken tussen de kolommen, 0,9 m breed en hoog: van 6,05 tot 6,95 m en van 14,35 tot 15,25 m. Een kraagbalk van 0,9 m breed van 22,2 tot 23,8 m onder de bodem.
- Middenschacht van 2,08 m van de voet tot in de bodem, met de ingang uit de BAG (1,41 m breed, tot 3,0 m van het hart, 2,7 m hoog) naar het zuidzuidoosten.
- Reservoir: achttienhoek met hoeken op 6,45 m (12,9 m), een onderrand onder 60 graden van 6,05 m op 23,8 tot 6,45 m op 24,5, de wand tot in de kroonlijst; achttien lisenen van 0,6 m breed en 0,25 m diep op de hoeken, van 24,5 tot in de kroonlijst.
- Kroonlijst met hoeken op 6,8 m (13,6 m), een onderkant onder 55 graden van 34,7 tot 35,2 m en een rand tot 36,0 m; het platte dak daarbinnen op 35,7 m.
- Ronde trommel van 8,0 m met een wand tot 37,6 m en een vlak kegeldak tot 37,9 m in het midden; zes steunblokken van 0,9 m breed van 3,7 tot 5,0 m van het hart, tot 36,8 m.

## Bronnen en maten

- [Lijst van watertorens in Limburg](https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Limburg_(Nederland)): bouwjaar 1924, ontwerper, hoogte 30 m, reservoir 640 m³.
- [Lijst van gemeentelijke monumenten in Geleen](https://nl.wikipedia.org/wiki/Lijst_van_gemeentelijke_monumenten_in_Geleen): GM066, voormalige watertoren Mijn Maurits, 1926, Staatsmijnen, Mauritspark 1a, op 50,973908 / 5,817030 (9 m van het hart). Daarmee is de naamloze watertoren in OSM (way 1284590565) de toren uit de lijst.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +70,6, dak rond NAP +106,3 (35,7 m), rand NAP +106,6 (36,0 m) tot 6,8 à 7,2 m van het hart, trommel tot NAP +108,5 (37,9 m) met de rand rond 3,7 tot 4,0 m. Het zwarte dak geeft in het zuidoosten weinig terugslag en in het noordwesten een gat; daar meten alleen de rand en het noorden.
- Luchtfoto (PDOK, 8 cm): de voeten van vier kolommen, de ringbalken en de kraagbalk aan de zuidkant (hoogtes uit de verschuiving per hoogte, 0,22 m per m, gelijkgezet op de onderrand van het reservoir), de achttienhoekige dakrand, de trommel met zes steunblokken, het luik op de trommel.
- BAG (PDOK WFS): pand 1883100000047359 (cirkel plus rechthoek), geen buurpanden binnen 35 m.
- Foto's [7061 Geleen Watertoren DSM terrein](https://commons.wikimedia.org/wiki/File:7061_Geleen_Watertoren_DSM_terrein.JPG) (maten: 34,9 px/m, geschaald op de kroonlijst van 13,6 m, bovenkant van de rand op 36,0 m; kroonlijst 1,3 m, wand 10,9 m, kraagbalk 1,6 m, middenschacht circa 2,1 m, kolommen circa 0,7 m, lisenen circa 20 graden uit elkaar) en [Geleen Watertoren DSM terrein 2e](https://commons.wikimedia.org/wiki/File:Geleen_Watertoren_DSM_terrein_2e.JPG) (trommel en steunblokken, 0,7 m boven de rand).

## Geschat en weggelaten

Geschat: het aantal zijden (achttien, uit de lisenen op één foto; de luchtfoto laat een veelhoek zien maar is te onscherp om te tellen), de hoogtes van wand, onderrand en kraagbalk uit één foto van onderaf (±0,5 m), de hoogtes van de ringbalken uit de luchtfoto (±0,7 m), de diepte van de lisenen, de vorm van de onderrand (onder 60 graden afgeschuind; op de foto een lichtere band), de hoogte van de ingang (die staat op geen enkele foto) en de hoogte van de steunblokken. De AHN-top is 37,9 m; de 30 m van Wikipedia past daar niet bij en is niet gebruikt. Verdikt: kolommen en balken (circa 0,7 m) zijn 0,9 m, het printminimum op 1:1000. Of de ringbalken ook radiaal aan de schacht vastzitten, is op geen foto te zien; ze zijn weggelaten.

Weggelaten (kleiner dan 0,9 m of niet te zien): de voegen tussen de panelen van de wand, het luik op de trommel en een dakluik in het noordwesten (circa 0,8 m), de deur in de schacht, hekwerk en verlichting rond de voet.

## Controle

Eén gesloten NoError-node (genus 12 door de openingen in het kolommenframe). In de webshoptest vergroot de 45-gradenopvulling per node het volume met 33,8 %: onder de vlakke bodem binnen de kraagbalk en onder de kraagbalk (de echte overhang, circa 290 m³), en als wand van 0,9 m tot de onderplaat onder de twee ringbalken (circa 375 m³). Die wanden komen doordat de opvulling een rechte balk van 5 m tussen twee kolommen nog geen opening geeft; met vouten van 50 graden, achtkante of zeskante kolommen bleef dat zo. De doorsneden op 6,5, 14,8, 15,5, 17, 25, 30, 35,5, 36,5 en 37,5 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt steun onder de reservoirbodem en de kraagbalk, maar de export zet ook elke ringbalk als wand tot de grondplaat door, zodat de open onderbouw een dichte zeshoek wordt; het model blijft open (zie 'model open, export vult') en dat is een algoritmekwestie in overhang-support. Op de kaart staat de toren open op zijn zes kolommen met de voet 0,12–0,34 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/50.97383/5.81703/200/1x1/0
