# Mariakerk (Boer)

De middeleeuwse Mariakerk aan de Oude Weg is een romaanse zaalkerk met een rondgesloten koor, een westtoren met vierzijdige spits en een versierde zuidingang. De in de BAG vermelde 1900 is niet het oorspronkelijke bouwjaar: de kerk is middeleeuws. Het model vervangt BAG-pand 0070100000322272.

## Bestanden en uitgangspunten

- `mariakerk-boer.glb`: een gesloten gebouwdeel in meters; `mariakerk-boer.json` bevat plaatsing en pandvervanging.
- `mariakerk-boer-1-1000.stl`: model op Z omhoog, ongeveer 21,6 × 8,5 × 18,9 mm.
- Generator: `node scripts/generate-mariakerk-boer.mjs`.

De oorsprong is RD (166942,8; 580989,8) nabij de toren; X loopt langs de kerk richting oost-zuidoost met vector (0,98648; −0,1639). Het maaiveld is circa NAP +1,72 m. De BAG levert de contour en een scheepsnok van circa NAP +11,59 m; rechtstreeks gecontroleerde AHN-DSM-punten boven de spits liggen rond NAP +20,18 m, met een uitschieter van +22,93 m bij een kleine dakbekroning. Enkele rastercellen ontbreken bij de spits; tussen aanwezige meetpunten is geïnterpoleerd. De gemodelleerde top ligt op circa NAP +20,10 m, zonder de dunne windvaan.

De verdeling en diepte van de vensternissen, de vorm van het zuidportaal, de klok, torenlijst en steunberen zijn uit foto's geschat en op schaal vereenvoudigd. De torenspits eindigt op een 0,9 m breed vlak voor printbaarheid. Fijne sierelementen, wijzers, de windvaan en het naastgelegen pand zijn weggelaten.

De 45°-steuncontrole van één gesloten volume en de doorsneden op 1:1000 zijn geslaagd. Van een volledige uitsnede van 150 × 150 m zijn modellen met en zonder landmark geëxporteerd; vier aanzichten zijn vergeleken met de PDOK-reconstructie en schuine foto's. De kaart- en printpreview worden afzonderlijk beoordeeld.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000322272), [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0), [rijksmonument 15850](https://monumentenregister.cultureelerfgoed.nl/monumenten/15850), [foto's](https://commons.wikimedia.org/wiki/Category:Mariakerk_(Boer)) en [kerkgeschiedenis](https://www.tsjerkepaad.nl/overzicht-kerken/boer-maria-kerk).
