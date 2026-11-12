# Zuiderkerk (Assen)

Vereenvoudigd model van de Zuiderkerk uit 1924–1925 aan de Zuidersingel, rijksmonument 469336.

## Bestanden en ligging

- `zuiderkerk-assen.glb`: meters, glTF Y omhoog; één gesloten `building:kerk-en-toren`-node.
- `zuiderkerk-assen.json`: RD-oorsprong `[233871, 556725]`, X-as `[0.9988, -0.0486]`; lokale +Y wijst naar de voorgevel. Vervangt BAG-pand `0106100000000646`.
- `zuiderkerk-assen-1-100.stl` en `zuiderkerk-assen-1-1000.stl`: printmodellen in millimeters op 1:100 en 1:1000.
- Generator: `scripts/generate-zuiderkerk-assen.mjs`.

## Onderdelen en aannames

Het hoofdvolume heeft kruisende zadeldaken met kilgoten, een vooruitgeschoven ingang, lage zij- en achtervleugels en een vierkante toren met tentdak. Contour en richting volgen BAG en nokken; dakvlakken volgen AHN4 en 3D BAG. De nok ligt rond NAP +26,42 m en het geschatte maaiveld rond NAP +9,83 m. Van 2952 AHN-cellen binnen de contour ontbreken zes, waarvan drie rond de steile torenkap; de top is uit 3D BAG en foto's geschat op NAP +32,6 m. De 3D BAG gebruikt hier AHN4 uit 2022 omdat AHN5 nog ontbreekt.

Vensters en deuren zijn blinde nissen, waarvan posities en afmetingen uit foto's zijn geschat. De ingang en de smallere geveldelen zijn vereenvoudigd, de dunne raamstijlen en metselwerkdetails onder 0,9 m zijn weggelaten.

## Controle

De generator geeft `NoError`, één verbonden deel en een afmeting van ongeveer 27,3 × 33,3 × 23,1 mm op 1:1000. Een modeltest controleert catalogus, BAG-vervanging, plaatsing, gesloten mesh en overhangopvulling. De kaart en preview moeten nog worden gecontroleerd.

## Bronnen

- [Rijksmonumentenregister 469336](https://monumentenregister.cultureelerfgoed.nl/monumenten/469336)
- [3D BAG: pand 0106100000000646](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0106100000000646)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m, en actuele luchtfoto.
- [Wikimedia Commons: Zuiderkerk Assen](https://commons.wikimedia.org/wiki/Category:Zuiderkerk_(Assen))
