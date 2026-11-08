# Nederlands Hervormde Kerk (Lobith)

Landmark voor het protestantse zaalkerkje aan de Markt in Lobith (gemeente Zevenaar), rijksmonument 21963, BAG-pand `0196100000342619`. Gebouwd in 1660 op de plaats van een kapel uit 1648: een zaal met driezijdige sluiting en hoog dak, aan de noordoostzijde tegen een puntgevel, met een zeszijdig koepeltorentje op de nok.

## Bestanden

- `nederlands-hervormde-kerk-lobith.glb`: één node `building:kerk`, meters, Y omhoog.
- `nederlands-hervormde-kerk-lobith.json`: catalogusitem.
- `nederlands-hervormde-kerk-lobith-1-1000.stl`: printbestand op 1:1000 (mm, Z omhoog).
- Generator: `scripts/generate-nederlands-hervormde-kerk-lobith.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (205513,53, 430515,18), het midden van de BAG-contour, op maaiveld NAP +15,2 m (AHN-DTM rond de kerk; `groundHeight` als terugval). De lokale X-as (`xAxis` [-0,5335, -0,8458]) loopt evenwijdig aan de lange gevels van de puntgevel (noordoost) naar de sluiting (zuidwest); +Y wijst naar de Markt (zuidoost). `groundOffsetMetres` is -0,5.

## Onderdelen

- Zaal 13,85 × 11,0 m met driezijdige sluiting tot 17,0 m lengte (BAG-contour, symmetrisch gemaakt).
- Muren tot de kroonlijst op 6,2 m, kroonlijst als schuine kraag van 0,35 m.
- Dak: twee lange dakvlakken van 54 graden met de nok op 14,3 m (NAP +29,5, AHN en 3D BAG), drie steilere schilden boven de sluiting die bij x = 5,1 op de nok samenkomen (eindschild ca. 66 graden, uit het AHN-profiel).
- Puntgevel aan de noordoostzijde met afdekking 0,35 m boven het dak en schouderstukken op beide hoeken.
- Dakruiter op x = -1 (AHN-piek): leien voet met uurwerk 1,9 m breed tot 15,6 m, zeszijdige lantaarn tot 17,3 m, koepel tot 18,35 m en makelaar tot 19,4 m.
- Spitsboogvensters als nissen van 0,35 m: drie aan de straat (het eerste vanaf de sluiting langer, het middelste boven het portaal), drie hoge aan de achterzijde, één in elke schuine zijde van de sluiting en een blinde nis in de kopse zijde.
- Barok stenen portaal aan de straat met kroonlijst en deurnis.

## Geschat en weggelaten

Dakhelling, goothoogte en de plaats van de dakruiter komen uit het AHN-DSM (0,5 m) en de 3D BAG; de afmetingen van de dakruiter, de vensters en het portaal zijn geschat uit foto's. De vensterposities aan de achterzijde zijn gelijk genomen aan die aan de straat (alleen oude foto's beschikbaar). Weggelaten: de open bogen van de lantaarn (posten < 0,9 m, nu dicht), wijzerplaten, windvaan en bal, het kleine dakraam en de schoorsteen op het achterste dakvlak die op foto's uit de jaren vijftig staat maar niet meer in het AHN zit. De aangebouwde buurpanden zijn geen onderdeel van het model.

## Controle

De generator maakt één gesloten volume (genus 0) met vlakke voet; het volume (1927 m³) ligt dicht bij het LoD2.2-volume van de 3D BAG. Een tijdelijke vitest plaatst het model op een uitsnede van 200 × 200 m, controleert `replacesBuildings`, manifold en genus, en dat `supportedSolid` op 1:1000 geen opvulling toevoegt (verhouding 1,000). Het model is van vier kanten (-35, 55, 145 en 235 graden) gerenderd naast de 3D BAG-reconstructie en vergeleken met schuine foto's van Wikimedia Commons.

## Bronnen

- [Rijksmonumentenregister 21963](https://monumentenregister.cultureelerfgoed.nl/monumenten/21963)
- [Reliwiki: Lobith, Markt 13 - Ned. Hervormde Kerk](https://reliwiki.nl/index.php/Lobith,_Markt_13_-_Ned._Hervormde_Kerk)
- [3D BAG, pand 0196100000342619](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0196100000342619)
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), BAG WFS en PDOK-luchtfoto
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Lobith)
