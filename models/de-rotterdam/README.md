# De Rotterdam (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `de-rotterdam.glb` | Catalogusbron in meters: node `building:de-rotterdam` (plint, onderdelen, bovendelen en dakopbouwen als gesloten solid) |
| `de-rotterdam-1-1000.stl` | Het gebouw op 1:1000 met de onderkant (NAP +3,0 m) op het printbed (107 × 50 × 152 mm) |
| `de-rotterdam.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93136,02, 435733,86), het midden
van het BAG-pand, op het maaiveld van de pier (NAP +3,5 m), en de
glTF-conventie Y omhoog. +X loopt langs de lange as naar het noordoosten
(RD-richting 39,1 graden); +Y wijst naar het noordwesten, de Nieuwe Maas. Het
maaiveld wordt op de kade aan de straatzijde bemonsterd, 3 m voor de plint
(`groundSamplePoints`, AHN NAP +3,0 tot +3,5 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0599100100002429`.

Opbouw: het AHN-DSM is per 1 m in het stelsel van het gebouw bemonsterd
(mediaan), gekwantiseerd naar de niveaus die het histogram toont (NAP +31,
+74, +88, +149 en +155 m) en met een meerderheidsfilter opgeschoond; daaruit
zijn rechthoekige blokken afgelezen (alle hoogtes in NAP):

- De plint over de hele kavel van 107,1 bij 49,6 m tot +31 m.
- De onderdelen van de drie torens tot de verspringing op +88 m; tussen de
  bovendelen blijft die als richel van 4 tot 5 m zichtbaar. Aan de
  rivierzijde tussen west- en middentoren een nis tot op de plint, aan de
  straatzijde richels op +74 m (westtoren, oosttoren) en +88 m.
- De drie bovendelen tot +149 m: de westtoren (24 bij 32 m), de middentoren
  met een uitsprong naar de straat en de oosttoren.
- Dakopbouwen tot +155 m op alle drie de torens.
- Uitkragingen (tweede herziening, op foto's van de rivierzijde en vanaf de
  straat): de bovenbouw (NAP +88 tot +149 m) begint pas op +88 m en rust op
  een onderbouw die er per toren anders onder staat; in de eerste versie liep
  de bovenbouw nog recht door tot de plint, zodat er alleen een sleuf was en
  geen uitkraging. Maten in x (langs de lange as) uit de verhoudingen op een
  frontale foto van de rivierzijde (het gebouw 107,1 m breed):
  - westtoren: onderbouw x = -47,3 tot -21,5 m, bovenste plaat -53,5 tot
    -26,8 m: de plaat kraagt 6,2 m uit aan de buitenkant en laat aan de
    binnenkant een richel van 5,3 m;
  - middentoren: onderbouw -21,5 tot 21,1 m, bovenbouw -21 tot 15 m, dus een
    richel van 6 tot 8 m aan de oostkant;
  - oosttoren: onderbouw 24,4 tot 53 m, bovenste plaat 17,6 tot 53,5 m, met
    tussen de onderbouw van midden- en oosttoren een sleuf van 3,3 m
    (x = 21,1 tot 24,4 m) door de hele diepte van het gebouw, van de plint
    tot de onderkant van de plaat, die er overheen ligt.
  Diepte (y) volgt het AHN (bovendelen y = -13 tot 24,8 m); uitkragingen in de
  diepte, kleine inkepingen onder de middentoren en de gevelstructuur zijn
  niet gemodelleerd. De dakopbouwen beginnen nu op het dak van de bovendelen.

Vergelijking met het AHN-DSM: binnen de voetafdruk ligt 60 % van de circa
20.000 DSM-cellen binnen 1 m (mediaan +0,55 m). De afwijkingen zitten in de
schaduw van de torens (geen lidarpunten aan de rivierzijde) en in een band
van 4 tot 6 m langs de straatgevels waar de lidarpunten van de glazen gevels
met lamellen alle hoogtes tussen +50 en +140 m geven; de niveaus daar zijn
geschat.

Printbaar op 1:1000: de blokken zijn recht met vlakke daken; de onderkanten
van de uitkragingen op +88 m zijn de enige vlakken die naar beneden wijzen
(het script controleert dat) en de export zet daar onder 45 graden steun onder.
Met overhangopvulling op 1:1000 is het volume 587,3 cm³ tegen 585,5 cm³ voor
het model. Let op: de opvulling vult de sleuf van 3,3 m in de print volledig
op (een bekende beperking van de opvulling bij lange smalle doorgangen, losse
taak gemeld, ook gezien bij de Waterpoort); de uitkraging aan de westkant
blijft zichtbaar als een afgeschuinde onderkant. In de kaart staat het gebouw op de pier met de drie torens
naar de Maas, en de preview van een uitsnede van 150 m toont het model
zonder het vervangen pand.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/De_Rotterdam) (OMA, 2013,
drie torens van 149 m op een gemeenschappelijke plint), PDOK BAG (het pand),
PDOK AHN (dsm 0,5 m via WCS) en foto's op Wikimedia Commons (vanaf de Maas en
de straatzijde). Geschat zijn de niveaus in de gevelband aan de straatzijde
en de vorm van de nis aan de rivierzijde (lidarschaduw). Vereenvoudigd: het
AHN ziet alleen de bovenkant, dus de uitkragingen zijn alleen op de twee
plekken gemodelleerd die op de foto's duidelijk zijn (westtoren, sleuf bij de
oosttoren); andere verspringingen in de diepte en de gevelstructuur
ontbreken.
