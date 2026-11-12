# Hervormde kerk (Coevorden)

Vereenvoudigd model van de hervormde kerk, ook Stadskerk of Kruiskerk genoemd. De kerk werd in 1641–1645 gebouwd en is rijksmonument 11490.

## Bestanden en ligging

- `hervormde-kerk-coevorden.glb`: meters, glTF Y omhoog; één gesloten `building:kruiskerk-en-dakruiter`-node.
- `hervormde-kerk-coevorden.json`: RD-oorsprong `[246499.9, 520085.8]`, X-as `[0.515, 0.857]`, langs een nok; vervangt BAG-pand `0109100000005874`.
- `hervormde-kerk-coevorden-1-100.stl` en `hervormde-kerk-coevorden-1-1000.stl`: printmodellen in millimeters op 1:100 en 1:1000.
- Generator: `scripts/generate-hervormde-kerk-coevorden.mjs`.

## Onderdelen en aannames

Het gebouw heeft vier gelijke armen onder zadeldaken, met lage hoekaanbouwen, hoekberen en een centrale achtkante dakruiter met spits. Contour en richting volgen BAG en de nokken, dakvlakken de AHN en 3D BAG. De nokken van de kruisarmen liggen rond NAP +32,3 m, het maaiveld rond NAP +11,15 m. Van 2435 DSM-cellen binnen de BAG-contour ontbreken drie naast elkaar ter hoogte van de dakruiter. De AHN meet buiten het gat tot NAP +51,62 m; het model schat de top op circa 44,5 m boven maaiveld op basis van de gepubliceerde torenhoogte van circa 45 m en foto's. De 3D BAG gebruikt hier AHN4 uit 2022 omdat AHN5 nog ontbreekt.

De afmetingen van de dakruiter, galmgaten, ramen en portalen zijn vereenvoudigd uit foto's geschat. Raam- en deuropeningen zijn blinde nissen; de omloop is gesloten weergegeven en de spits is verdikt voor printbaarheid. Dun maaswerk, leuningen en windvaan zijn weggelaten omdat zij op 1:1000 te dun zijn.

## Controle

De generator geeft `NoError`, één verbonden deel en een afmeting van ongeveer 28,4 × 28,4 × 44,8 mm op 1:1000. Een modeltest controleert catalogus, BAG-vervanging, plaatsing, gesloten mesh en overhangopvulling. De kaart en preview moeten nog gecontroleerd worden.

## Bronnen

- [Rijksmonumentenregister 11490](https://monumentenregister.cultureelerfgoed.nl/monumenten/11490)
- [3D BAG: pand 0109100000005874](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0109100000005874)
- [Monumenten in Nederland: Coevorden](https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0019.php)
- [Dagblad van het Noorden: torenhoogte](https://www.dvhn.nl/weekbladen-drenthe/coevorder-courant/grepen-uit-het-verleden-kerk-geeft-coevordenaren-het-gevoel-dat-je-weer-thuis-bent/155097733.html)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m en actuele luchtfoto.
- [Wikimedia Commons: Kruiskerk Coevorden](https://commons.wikimedia.org/wiki/Category:Kruiskerk_(Coevorden))

