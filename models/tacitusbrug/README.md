# Tacitusbrug — Ewijk

Twee naast elkaar gelegen A50-tuibruggen over de Waal, met alle aanbruggen.
De oude stalen brug heeft twee centrale pylonen; de nieuwe betonnen brug
heeft vier pylonen langs de dekranden. Dit model gebruikt afzonderlijke,
doorlopende dekprofielen en geen gestapelde hoogtelagen.

## Bestanden en generatie

- `tacitusbrug.glb`: meters, Y omhoog; één constructienode en zeven BGT-wegnodes.
- `tacitusbrug.json`: RD-plaatsing, waterbemonstering en de twee vervangen BGT-dekken.
- `tacitusbrug-1-1000.stl`: millimeters, Z omhoog; de twee bruggen zijn afzonderlijke gesloten volumes.
- Generator: `node scripts/generate-tacitusbrug.mjs` vanuit de landmarkrepo.

De generator gebruikt alleen vastgelegde meetgegevens. Twee opeenvolgende
generaties leverden identieke SHA-256-hashes voor GLB, JSON en STL.
De volledige brug is op 1:1000 circa 1075 × 74 × 72 mm; print een kaartmatrix
of splits de standalone STL in passende stukken voor het printbed.

## Metingen en bronnen

De BGT-overbruggingsdelen bepalen beide volledige dekcontouren, de pijlerposities
(en hun verschillende vormen) en de actuele verhoogde wegdelen. De zeven
wegdelen hebben hun eigen `bgt_functie` en `bgt_fysiekvoorkomen`: twee fietspaden
en vijf snelwegvlakken, waaronder stroken met open verharding. Historische BGT-
versies zijn uitgesloten. Weglagen zijn 0,5 m dik en volgen dezelfde vlakken als
het constructiedek; opgaande constructies hebben een beschermstrook van 2 cm.

Het AHN-DSM van 0,5 m geeft het lengteprofiel per brug. Voertuigpieken zijn
weggelaten en tussen de vastgelegde profielstations liggen rechte vlakken.
De hoogste meetbare pyloonpunten liggen rond NAP +77,9 m. Het dwarsverhang
van het nieuwe dek is circa 2,2%. De RD-oorsprong is
`[179108.38446535481, 432981.49390949926]`; +X volgt de brug naar het noorden,
+Y wijst naar de nieuwe westelijke brug.

De constructiebeschrijving bevestigt 270 m hoofdoverspanning, 1055 m
constructielengte, pylonen van 50 m boven het dek, 25 m dwarsafstand tussen
de nieuwe pylonen, een nieuw dek van circa 3,5–4,5 m en 80 nieuwe tuien.
De BGT-contour inclusief landhoofden meet circa 1075 m.

- [Constructie nieuwe brug, Cement / Mobilis](https://www.cementonline.nl/artikelen/nieuwe-tuibrug-in-a50)
- [Renovatie stalen brug, Nationale Staalprijs](https://www.nationalestaalprijs.nl/project/tacitusbrug)
- [BGT-overbruggingsdelen, PDOK](https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items)
- [BGT-wegdelen, PDOK](https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items)
- [AHN, PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Actuele orthofoto, PDOK](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0)
- [Schuine foto's, Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Tacitusbrug)

## Geschat en vereenvoudigd

De waterreferentie is geschat op NAP +6,0 m. De vaste terugvalhoogte is de
werkelijk bemonsterde PDOK-hoogte 49,75946 m ellipsoïdisch; de vier waterpunten
liggen buiten de brugdekken. De precieze actuele waterstand varieert.

De vorm van de oude pyloondoorsnede, de acht meter hoge koppen, de tuiverankering-
hoogtes, de leuningen als dichte één meter hoge borstwering en de dekdiktes
buiten de brondoorsneden zijn vereenvoudigd of uit foto's geschat.
De werkelijke dunne tuien zijn verdikt en gegroepeerd tot drie oude of vijf
nieuwe ribben per waaier. Hun vrije doorzicht vervalt: een gesloten scherm van
0,95 m draagt iedere waaier; het ribreliëf heeft schuine onderranden.
Onder beide dekken liggen geïntegreerde schuine printvoeten, minimaal één meter
breed en plaatselijk breder bij de lage uiteinden. Hun draagvlakken hellen 47°
boven horizontaal. Deze voeten vervangen voor de print het open doorzicht
onder de lange overspanningen; de gemeten pijlers blijven daarnaast zichtbaar.

Weggelaten: afzonderlijke leuningspijlen, lichtmasten, verkeersborden,
portaalvakwerken en individuele kabelstrengen, wegens hun staafdiktes onder
0,9 m op ware grootte. De dekken, alle zes pylonen, de grote aanbrugpijlers,
landhoofden en beide fietspaden zijn meegenomen.

## Controle

De generator toetst `NoError`, precies twee gesloten STL-volumes en vrije
ondervlakken: de grootste resterende numerieke snijsliver is 0,018 mm op
1:1000, onder de grens van 0,05 mm. GLB-vertices worden op 1 mm ware grootte
gekwantiseerd zodat gedeelde naden stabiel blijven. De weg- en constructievolumes
vormen één partitie zonder overlap.

De webshoptests toetsen plaatsing, zes pyloontoppen, alle BGT-wegattributen,
ruim 9000 verticale dekmetingen zonder samenvallende bovenvlakken en gedeelde
printopvulling zonder afzonderlijke wegopvulling. Er is een volledige
`createModelBundle`-export op 1:1000 met 45° printbare overhang gemaakt: een
uitsnede van 610 × 1220 m, matrix 3 × 6 tegels van 200 mm, inclusief beide
landhoofden. Volume en horizontale doorsneden zijn voor en na de opvulling
gecontroleerd. De uiteindelijke aanvullende opvulling van de constructie is circa 0,035%; de wegdelen worden niet apart opgevuld. Bij de meetpunten 50 m vóór de landhoofden liggen de eigen AHN-dekken circa 4,5–5,0 m boven de oudere PDOK-wegvlakken; dit hoogteverschil blijft bewust zichtbaar voor review.

Vier schuine aanzichten (−35°, 55°, 145°, 235°, elevatie 30°) zijn naast de
werkelijke PDOK-reconstructie en schuine foto's beoordeeld. Vanuit elke kant
voegt het model de verhoogde dekken, pylonen, tuiwaaiers, pijlers en gescheiden
fietsdekstroken toe. De controlebeelden en exports zijn buiten de repo bewaard.

[Controlekaart met rode fietspaden](http://127.0.0.1:3000/kaart/51.88484/5.73737/2100/1x2/0?matrix=1&printScale=1000&rules=r.f.fietspad.10200)

Nakijken: de zes pylonen, de gesloten tuiwaaiers en de rode fietspaden op beide
buitenranden, vooral de aansluiting van de volledige dekken op de landhoofden.
