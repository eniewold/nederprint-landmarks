# Maasbrug bij Heumen (Heumen)

Betonnen A73-brug over de Maas, met twee onafhankelijke brughelften, twee
fietspaden en de noordelijke aanbruggen. Het model gebruikt bouwdelen en
lofts tussen dwarsdoorsneden; geen stapeling van AHN-hoogtelagen.

## Bestanden en regenereren

- `maasbrug-heumen.glb`: werkelijke constructie in meters, Y omhoog.
- `maasbrug-heumen.json`: RD-plaatsing, wegdeelattributen in de GLB,
  waterbemonstering en vervangen BGT-dek.
- `maasbrug-heumen-1-1000.stl`: millimeters, Z omhoog, interne printvoet.
- `node scripts/generate-maasbrug-heumen.mjs` regenereert deze bestanden.

Oorsprong RD **186126,075 / 419135,265**; +X naar Heumen, hoek 98,05° vanaf
oost; +Y naar west. Model-z = NAP minus 7,9 m; bodem z = −1,0 m.
Vier maaiveldpunten op de Maas bij x = −200/−180, y = ±30 m leveren
PDOK-hoogte **51,5589655 m**; offset −0,1 m.

## Constructie en bronnen van de maten

De actuele BGT-dekcontour levert een lengte van 696 m inclusief de
landhoofduiteinden, tegen 686 m in het oorspronkelijke ontwerp. Het
dwarsprofiel is 36,82 m breed, met een smalle open scheiding tussen de
brughelften. Lokale randen volgen de lichte bocht aan de noordzijde;
landhoofdrandjes zijn tot x = ±340 m geregulariseerd.

De rivierkokers verlopen van 2,75 tot 7 m constructiehoogte, met de
hoofdoverspanning van 157,5 m. Noordelijk staan twee TT-liggerwebben per
brughelft onder de dekplaat; beide systemen hebben het overstek van 4,7 m.
Het AHN-DSM levert het lengteprofiel om de 5 m, met NAP +20,6 m boven de
rivier en +16,7 m aan het noordelijke einde. De tien pijlerassen zijn
−255, −97,5, −7,07, 38,08, 83,23, 128,38, 173,53, 218,68, 263,83 en 308,98 m.
De twee noordelijke rivierpijlervoeten zijn ook in de BGT teruggevonden.

De vier actuele wegdelen (registratie 25 september 2026) staan letterlijk,
met hun lokaal_id en tot 5 cm vereenvoudigde contour, in de generator:
`L0002.6eea37cb80884bf1874bf3a6cae646d8`,
`L0002.7d60a86d37354b38912490730750df37`,
`L0002.950adf11fa674bb3ada073deedcb0798` en
`L0002.96c20f9a88af49439d7db29be12e84ae`.

De bovenste 0,5 m is verdeeld over `road:rijbaan` en `road:fietspad`,
met `bgt_functie` **rijbaan autosnelweg** / **fietspad** en
`bgt_fysiekvoorkomen` **gesloten verharding**. De BGT vult geen
plus_fysiek_voorkomen. Zes schampkanten blijven constructie, met 2 cm
vrijruimte in de snijstrook. Het vervangen BGT-dek is
`L0002.60a1804e97d247e2808a8f3e1d42168e`; dekvervanging is gecontroleerd
met `node scripts/replaces-terrain.mjs maasbrug-heumen --write`.

## Schattingen en printaanpassingen

Geschat zijn de zuidelijke rivierpijlerpositie vanuit de gedocumenteerde
overspanning, de noordelijke pijlerposities op de ontwerpsteek van 45,15 m,
de pijlerverjonging, de TT-webdikte (1 m), de scheiding (0,8 m), de dekplaat
(0,9 m) en de schampkanten (0,9 × 0,6 m). De kokerbodem verloopt tussen
de gedocumenteerde hoogtes als gekromde voute. Lantaarns, hekspijlen,
geleiderails, verkeersportalen en kleine opleggingsdetails zijn weggelaten.

De STL heeft onder beide dekken een doorlopende interne printvoet: een
50°-wig vanaf de laagste koker naar een scherm van minimaal 0,9 mm op
1:1000. Dit onderdeel is niet in de GLB opgenomen; de export maakt zijn
eigen gedeelde opvulling. Het model moet op meerdere tegels worden geprint.

## Controle

Alle onderdelen zijn gesloten Manifold-volumes met status NoError.
Het geheel is twee losse gesloten brughelften; de doorgangen tussen de
TT-webben verklaren de positieve genus van de GLB. De STL heeft genus −1
(uitsluitend de twee brughelften), **30.234 driehoeken**, afmetingen
**696 × 40,79 × 14,33 mm**, volume **228,05 cm³** en **0 m²** onondersteunde
ondervlakken boven de bodem. De onderdeelvolumes tellen op tot 59.213,03 m³;
paargewijze overlap is kleiner dan 0,02 m³.

AHN-vergelijking op 8.547 geldige dekpunten: 96,2% binnen 1 m, 98,4% binnen
2 m, mediane afwijking −0,04 m en P90 absolute afwijking 0,21 m. Voertuigen
blijven in deze onafhankelijke puntvergelijking aanwezig.

Verticale stralen op **12.392** punten vinden geen samenvallende
bovenvlakken tussen onderdelen binnen 1 cm en geen wegdeel zonder dikte.
De permanente test controleert de drie nodes/attributen, beide pijlersystemen,
uiteinden, open brughelftscheiding en het ontbreken van constructiehoekpunten
op het rijvlak binnen de schampkanten.

Een volledige preview-uitsnede van **430 × 860 m**, matrix op 1:1000,
grondplaat 1 mm, hoogtefactor 1 en 45° overhang, is met en zonder landmark
geëxporteerd. De rode fietspadregel werkt in kaart en preview.
De gedeelde opvulling gaat naar building; wegdelen krijgen geen eigen
steunvolume. Het geringe negatieve volumeverschil bij booleaans bijsnijden
is apart gemeten; wegdelen behouden meer dan 99% van hun volume.
Doorsneden van de opgevulde constructie tonen twee doorlopende wandstelsels.

De volledige GLB en de preview zijn bekeken van vier kanten (−35°, 55°,
145°, 235°), naast dezelfde PDOK-reconstructie, de actuele luchtfoto en de
schuine foto onder de rivierbrug. De BGT-dekplaat verdwijnt zonder een gat
in de Maas. Controle-URL:
[kaart](http://localhost:3000/kaart/51.76004/5.83805/600/1x1/0?rules=r.f.fietspad.10200).
Nakijken: de voute boven de rivier, de geschatte uiterwaardpijlers en de
aansluiting van beide fietspaden op de landhoofden.

## Bronnen

- [Ontwerp door Rijkswaterstaat, Cement (1981)](https://www.cementonline.nl/artikelen/brug-over-de-maas-bij-heumen).
- PDOK BGT OGC API, actuele overbruggingsdelen en wegdelen in EPSG:28992.
- PDOK AHN DSM/DTM 0,5 m en actuele orthofoto.
- [Schuine foto van kokers en rivierpijler](https://commons.wikimedia.org/wiki/File:Linden_(Cuijk,_N-Br)_-_Heumen_(Gld)_graffiti,_bridge_of_A73_over_Meuse_river.JPG).
- [Brugbeelden, Mook en Middelaar in Beeld](https://www.mookenmiddelaarinbeeld.nl/mooder-maas/bruggen-over-de-maas).
