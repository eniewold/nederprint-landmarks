# De Kandelaar (Assen)

Vereenvoudigd model van De Kandelaar aan de Oude Molenstraat. Het historische kerkgebouw dateert uit 1876 en werd rond 1900 verbouwd; de kerk wordt sinds 1970 De Kandelaar genoemd.

## Bestanden en ligging

- `de-kandelaar-assen.glb`: meters, glTF Y omhoog; één gesloten `building:kerk-en-zalen`-node.
- `de-kandelaar-assen.json`: RD-oorsprong `[233865, 557260]`, X-as `[0.941, -0.339]`, dwars op de lange kap. Vervangt BAG-pand `0106100000000328`.
- `de-kandelaar-assen-1-100.stl` en `de-kandelaar-assen-1-1000.stl`: printmodellen in millimeters op 1:100 en 1:1000.
- Generator: `scripts/generate-de-kandelaar-assen.mjs`.

## Onderdelen en aannames

De kerk heeft kruisende zadeldaken met kilgoten, een lagere straatvleugel met drie opgaande geveltoppen en een aangebouwd zalencomplex met vier lichtkappen op het platte dak. Contour en oriëntatie volgen de BAG en daknokken; hoogten en dakvlakken volgen AHN4 en 3D BAG. De kerknok ligt rond NAP +24,26 m en het geschatte maaiveld rond NAP +10,61 m. De 3D BAG gebruikt hier AHN4 uit 2022 omdat AHN5 nog ontbreekt. Binnen de BAG-contour ontbreken 74 van 5277 DSM-cellen; de goten en nokken blijven meetbaar en de vlakke dakvlakken zijn uit omliggende metingen en 3D BAG geïnterpoleerd.

Afmetingen en posities van vensternissen, de drie geveltoppen en de vorm van de lichtkappen zijn vereenvoudigd geschat uit foto, 3D BAG en luchtfoto. Dunne raamstijlen en het kleinere metselwerk zijn weggelaten omdat ze op 1:1000 niet printbaar zijn.

## Controle

De generator geeft `NoError`, één verbonden deel en een afmeting van ongeveer 35,4 × 46,7 × 13,9 mm op 1:1000. Een gerichte modeltest controleert catalogus, BAG-vervanging, plaatsing, gesloten mesh en overhangopvulling. De vierzijdige vergelijking met de PDOK-gebouwtegel is uitgevoerd; kaart en preview moeten nog worden gecontroleerd.

## Bronnen

- [3D BAG: pand 0106100000000328](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0106100000000328)
- [Erfgoed Drenthe: Assen](https://drenthe.erfgoedcms.nl/lemma/assen)
- [Kerk & Orgel: De Kandelaar](https://www.kerk-en-orgel.nl/record.php?action=display&id=719&item=206&province=dr)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m en actuele luchtfoto.
- [Wikimedia Commons: Kandelaarkerk](https://commons.wikimedia.org/wiki/File:Kandelaarkerk_Assen.jpg)

