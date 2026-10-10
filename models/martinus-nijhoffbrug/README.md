# Martinus Nijhoffbrug — Zaltbommel

Betonnen tuibrug met vier afzonderlijke pylonen, 120 tuien en de gebogen
noordelijke aanbrug. Voor kaart en meerkleurige export zijn constructie,
autosnelweg, betonnen fietspad en geasfalteerd fietspad aparte GLB-nodes.
De STL op 1:1000 bevat het hele model met een eigen printvoet.

## Bronnen en metingen

- [Bruggenstichting, G. Wierda, 2003](https://bruggenstichting.nl/70-bruggen/bruggen-2003/bruggen-september-2003/540-martinus-nijhoffbrug):
  vier pylonen, 120 tuien, 16 naar de hoofdoverspanning en 14 naar de
  zijoverspanning per pyloon, hoofdoverspanning 256 m.
- [Rijksdienst voor het Cultureel Erfgoed, *Bruggen*, p. 59](https://www.cultureelerfgoed.nl/site/binaries/site-content/collections/documents/2006/01/01/bruggen-categoriaal-onderzoek-wederopbouw-1940-1965/bruggen.pdf):
  pylontop NAP +84 m. Dit is een absolute hoogte, geen hoogte boven het dek.
- Bekeken schuine foto's:
  [20140722 Martinus Nijhoffbrug 02](https://commons.wikimedia.org/wiki/File:20140722_Martinus_Nijhoffbrug_02.jpg)
  en [Martinus Nijhoffbrug 2016](https://commons.wikimedia.org/wiki/File:Martinus_Nijhoffbrug_2016.jpg).
  De tweede toont de vier afzonderlijke, licht taps toelopende pylonen en de
  waaiers; de vakwerkbrug ernaast is de spoorbrug en hoort niet bij dit model.
- PDOK actuele BGT, AHN DSM/DTM 0,5 m en actuele luchtfoto; bronuitsnede
  RD [145481,425095,146881,426495], gedownload 10 oktober 2026.

De actuele BGT-dekcontour is `L0002.52b681f147c5438a89dd464d42da993c`.
De BGT-pijlercomplexen liggen 255,03 m uit elkaar. De pylonposities zijn
lokaal x ±127,516 m, y ±18,3 m; de dwarse posities zijn uit de AHN-clusters
en foto afgeleid. Het volledige BGT-kunstwerk inclusief landhoofden is
circa 996,94 m lang. De smallere noordelijke aanbrug buigt volgens de
letterlijke BGT-contour naar het westen af.

De oorsprong is RD [146235,732781,425523,446536], +X is
[-0,1090643001,0,9940346968], +Y naar het westen. Lokale Z is NAP minus
3,55 m; glTF gebruikt Y omhoog. De wegdekhoogte volgt gemeten dwarsstroken
langs de gebogen hartlijn, met een mediaanfilter van drie stations om één
verkeersobject en meetruis te verwijderen. Het hoogste dek ligt rond
NAP +21,3 m, noordelijk daalt het naar +13,5 m.

Vier actuele BGT-wegdelen zijn letterlijk in de generator opgenomen:
`L0002.6dce7926a0994cbaaba471366e66bb75` en
`L0002.5faef8c0badc4da08e8e48ddc6b2648a` (autosnelweg/asfalt),
`L0002.5ac5d366aa9d4ec280ae760ba00623f0` (fietspad/cementbeton),
`L0002.e8b483924d604f06a823a78d13e2e342` (fietspad/asfalt).
Alle hebben relatieve hoogteligging 1. De bovenste 0,5 m vormt wegdek;
schampkanten en guards voor de gehele tuivlakken en pylonen blijven in
`building`. `extras.attributes` bewaart functie, gesloten verharding en
asfalt/cementbeton. Reststroken krijgen de autosnelweg-attributen.

## Printvereenvoudigingen en geschatte delen

Het model bestaat uit een vlakke dekplaat, trapeziumvormige kokers, pijlers,
lofts langs de aanbrug, taps toelopende pylonen en tuivlakken. Geen
gestapelde hoogtelagen. Kokerdoorsneden en diepte 3,1 m, dekplaat 0,9 m,
schampkanten 0,9 × 0,6 m en de oplegkoppen zijn geschat uit foto's.
De noordelijke steunpunten x 211,281,5,352,422,5,493,563,5,634,704,5 m
zijn geschat; er waren geen afzonderlijke actuele BGT-pijlercontouren voor.
Hun dubbele kolommen zijn een eenvoudige representatie van de aanbrug.

De 120 echte kabels zijn op deze schaal te dun en te flauw om vrijhangend
te printen. Hun plaats is vereenvoudigd tot ribben van circa 0,96 m breed
in draagvlakken van 0,9 m dik. De vlakken zijn bewust zichtbaar en behouden
de waaiercontour, met uitsluitend spitsopeningen van 50 graden tussen
aangrenzende ribben. Ankerposities en -hoogten zijn geschat: 16 ribben tot
124 m naar de hoofdoverspanning, 14 tot 86 m naar de zijoverspanning,
pylonankers rond NAP +75–80 m. De uiterste staarten volgen de dekcontour.
Leuningen, lantaarns, bebording en kleurdecoratie op de pylonen ontbreken.

De STL krijgt onder de kokerbodems een wig van 50 graden naar een scherm
van minimaal 0,9 mm. Dit is onderdeel van het printmodel; externe steun is
niet nodig. Afmetingen op 1:1000: circa 996,94 × 79,84 × 81,45 mm,
volume 504,91 cm³. Een gewone printer vraagt dus om meerdere tegels.

## Controle

- Constructie, wegen, geheel en STL zijn positieve gesloten Manifold-volumes
  met `NoError`. De vele spitsopeningen zijn doorgangen, geen opgesloten holtes.
- Partitievolume wijkt minder dan 0,05 m³ af van het geheel; onderlinge
  volume-overlap blijft onder 0,02 m³.
- 17.622 raychecks: nul dubbele bovenvlakken tussen nodes en nul wegvlakken
  zonder dikte. De permanente test controleert vier pylontoppen, de gebogen
  aanbrug, de drie wegattributensets, het constructievrije wegdek en de BGT-ID.
- Onafhankelijke AHN-controle: 6.421/6.427 geldige punten (99,91%);
  97,49% binnen 1 m, 99,02% binnen 2 m; mediaan -0,014 m en P90 0,322 m.
  AHN toont slechts fragmenten van de pylonen; daarvoor is de bronhoogte gebruikt.
- De STL-controle vindt 0,000233 m² numerieke rest aan ongedragen neerwaartse
  facetten, ruim onder de grens 0,02 m²; geen echte ongedragen bouwdelen.
- Controlekaart op poort 3082 bekeken met en zonder landmark en de regel
  `r.f.fietspad.10200`: rood fietspad, rijbaan in wegkleur, kerbs in gebouwkleur.
  De kaart is van boven gecontroleerd; de schuine controle is met de GLB en
  volledige previews gedaan, niet met een gekantelde Cesium-camera.
- Volledige preview-export: 580 × 1160 m rond 51,82070 / 5,25930,
  matrixdoelschaal 1:1000 met tegels 200 mm; de gecentreerde 400 × 1000 m
  printtegels omvatten het hele BGT-kunstwerk. Met en zonder landmark van
  vier kanten naast elkaar vergeleken, plus vier GLB-gezichten en de foto's.
- Volledige 3MF-export geslaagd. Gezamenlijke opvulling blijft in de
  constructie (+265,70%); wegen krijgen geen voet. Conversie trimt 0,89%
  autosnelweg, 0,95% betonfietspad en 2,24% asfaltfietspad; minstens 97,75%
  van elk wegvolume blijft behouden.

Lokale bronbestanden, renders, raychecks en preview/3MF staan buiten beide
repo's in `landmarks-run/martinus-nijhoffbrug/` bij deze Codex-chat.

Reproduceren: `node scripts/generate-martinus-nijhoffbrug.mjs --scale 1000`.
Kaart: `/kaart/51.8186100/5.2600000/600/1x1/0?theme=thema-stad&landmarks=1&rules=r.f.fietspad.10200`.
Nakijken: de zichtbare tuivlakken, geschatte noordelijke pijlers en de aansluiting
van beide fietspaden op de gebogen aanbrug.
