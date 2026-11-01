# Watertoren Berg en Dal

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-berg-en-dal.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een geëxtrudeerde achthoek (vierkant met afgeschuinde hoeken), sokkel en dakrand zijn omhulsels van twee achthoeken, het tentdak is een piramide van de achthoek en de top; louvrestroken, deur en panelen zijn nissen, lisenen, penanten, reliëfblokken en het deurportaal blokken op de gevel.

De watertoren aan de Watertorenweg in Berg en Dal is in 1929 gebouwd naar ontwerp van A. Busselaar en J.H.J. Kording, met een reservoir van 110 m³. Naast de deur hangt een plaquette voor J.Th. Arts, fitter-monteur van het waterbedrijf, gesneuveld op de Grebbeberg in mei 1940.

## Bestanden

- `watertoren-berg-en-dal.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een los dak zou een voet tot de grondplaat krijgen.
- `watertoren-berg-en-dal.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-berg-en-dal-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [191564.2, 425604.29], het hart van de BAG-contour van pand 0241100000002828, op maaiveld (NAP +93,2 m). De contour is een vierkant met afgeschuinde hoeken: hoofdvlakken van 4,5 m, schuine vlakken van 2,6 m, 8,2 m over de vlakken; de top van het tentdak ligt in het AHN binnen 0,1 m van dit hart. +X staat loodrecht op het oostelijke hoofdvlak, 13,3 graden linksom van RD-oost (`xAxis` [0.9732, 0.23]); +Y wijst naar de deur aan de Watertorenweg (noord, het adres Watertorenweg 31a ligt op het pand). Vervangt alleen het BAG-pand van de toren; de buurpanden liggen 25 m of verder weg.

## Onderdeel `building:schacht-dakrand-en-tentdak`

- Sokkel op de BAG-contour (8,2 m over de vlakken) tot +1,4 met een schuine waterlijst naar de wand.
- Bakstenen schacht met verticale wanden, 8,0 m over de vlakken (hoofdvlakken 4,4 m), tot +23,35.
- Elk hoofdvlak: een strook louvreramen als nis van 1,6 m breed en 0,4 m diep van +17,0 tot +22,4, daaronder twee reliëfblokken van 2,0 m breed (+15,54 tot +16,15 en +16,32 tot +16,9) op een schuine onderkant, en een lisene van 0,5 m tot de voet. Op de drie zijvlakken eindigt de lisene op een penant van 0,9 m breed tot +3,0; op het noordvlak op het deurportaal.
- Deurportaal: omlijsting van 2,6 m breed en 0,3 m diep tot +2,5, luifel tot +2,9 die 0,55 m voor de gevel uitsteekt op schuine kanten, deur van 1,2 × 2,4 m als nis.
- Elk schuin vlak: twee verdiepte panelen van 1,7 m breed (+1,55 tot +15,4 en +16,3 tot +22,1), met de band ertussen op de hoogte van de reliëfblokken.
- Betonnen dakrand die 0,12 m uitkraagt op een schuine onderkant (56 graden), van +23,35 tot +24,0.
- Achtzijdig tentdak van 36 graden achter de dakrand, met de graten naar de hoeken, tot +26,6.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Berg_en_Dal)): bouwjaar, architecten, reservoir, plaquette. De vermelde hoogte van 37,6 m klopt niet met het AHN.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +93,2 (vlak), bovenkant van de dakrand rond +24,0, top van het tentdak NAP +119,9 (26,7 m boven maaiveld), helling van het dak tussen 36 en 42 graden, de randen van het dak binnen 0,1 m van de BAG-contour.
- BAG-pand 0241100000002828 (bouwjaar 1924 in de BAG) en luchtfoto (PDOK): plattegrond, stand van de vlakken, tentdak met acht graten.
- RCE-foto [20313815](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Berg_en_Dal_-_20313815_-_RCE.jpg), frontaal op de deur met verticalen evenwijdig: geen verjonging, hoogtes van louvrestrook, reliëfblokken, deur, portaal en dakrand, breedtes van strook, blokken, lisene en portaal, geschaald op de bovenkant van de dakrand in het AHN (41 px/m).
- Foto's [Watertoren (01)](https://commons.wikimedia.org/wiki/File:Berg_en_Dal_(Groesbeek)_Watertoren_(01).JPG) en [Watertoren (02)](https://commons.wikimedia.org/wiki/File:Berg_en_Dal_(Groesbeek)_Watertoren_(02).JPG): louvrestroken en lisenen op de zijvlakken, het penant op de sokkel, de panelen in de schuine vlakken.

## Geschat en weggelaten

Geschat: de diepte van nissen en panelen (0,25 tot 0,4 m) en het uitsteken van lisenen, blokken, penanten en dakrand (0,12 tot 0,25 m), de hoogte van de sokkel (1,4 m) en van de penanten (3,0 m), de wanddikte achter de sokkel (0,1 m terug), het begin van het tentdak 0,45 m achter de gevel en zijn helling (uit het AHN, waar de randpixels mengen), en dat alle vier hoofdvlakken een louvrestrook hebben (op foto's gezien op drie).

Weggelaten (kleiner dan 0,9 m of te dun): de afzonderlijke louvrelamellen en de vier smalle vensters in elke strook (0,3 m hoog), de tandlijst onder de dakrand, de hoekblokjes van de dakrand, de antennemast en het ventilatiekapje op de top, de plaquettes naast de deur, het hekwerk en de toegangspoort.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet meetbaar (gemeten 1,000000): dakrand, luifel, reliëfblokken en nisplafonds hangen onder 50 tot 58 graden. De doorsneden op 1, 2,7, 8, 16, 20, 23,7 en 25 m blijven gelijk. Op de kaart hoort de toren op de plek van het verborgen PDOK-blok te staan, de voet 0,1 tot 0,2 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) zit alleen een randje ondersteuning onder de luifel van het portaal. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, met de voet 0,1 tot 0,15 m in het PDOK-maaiveld.

Controle-URL: http://localhost:3000/kaart/51.81782/5.91743/200/1x1/0
