# Arnhem Centraal (transferhal)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `arnhem-centraal.glb` | Catalogusbron in meters: node `building:transferhal` (garage en plint als rechte blokken, dak van de transferhal als gefacetteerd vlak en vier perronkappen, als gesloten solid) |
| `arnhem-centraal-1-1000.stl` | Het model op 1:1000 met de onderkant (NAP +21,5 m) op het printbed (168 × 92 × 28 mm) |
| `arnhem-centraal.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (190303, 444065), midden in de
transferhal, op het maaiveld van de straat aan de zuidkant (NAP +24,0 m), en
de glTF-conventie Y omhoog; +X wijst naar het oosten en +Y naar het noorden
(de RD-assen). Het maaiveld wordt alleen op de straat langs de zuidgevel
bemonsterd (`groundSamplePoints`, AHN NAP +24 m), niet op het plein en het
perronniveau (+31 m) of het busstation (+22 m). Vervangt de PDOK-reconstructie
van `NL.IMBAG.Pand.0202100000223614` (de OV-terminal); de kantoortorens, de
perronkappen en de passage over het spoor blijven uit PDOK.

Opbouw (herzien op luchtfoto's en straatfoto's): niet het hele gebouw is een
golvend dak. Ten noorden van de OV-terminal staan vier perronkappen; de
OV-terminal zelf bestaat uit twee delen, gescheiden bij x = 0 in
het stelsel van het raster (RD 190283, 444160):

- In het westen de plint met de parkeergarage als recht blok op de BAG-contour
  met een plat dak op NAP +44 m, een verhoogd deel van 60 bij 36 m op +47 m
  met de glazen lichtstraat (een wigvormig vlak) op +49 m, een dakrand van
  0,8 m hoog en breed en vijf banden van 0,5 m hoog en 0,35 m diep om de 3,5 m
  in de zuid- en de westgevel (de parkeerlagen, vanaf +27 m).
- De vier perronkappen (op verzoek toegevoegd, uit het AHN-DSM van 0,5 m en
  een screenshot): lange smalle daken boven de perrons, 13 graden gedraaid
  ten opzichte van de RD-assen (lange as naar het oost-zuidoosten), elk ongeveer
  176 m lang en 12 m breed (13,5 m de noordelijke), met afgeronde uiteinden en
  een vlak dak op NAP +33,2 m, 1,2 m dik. De middellijnen liggen op 79,3,
  102,9, 122,7 en 144,1 m in het gedraaide stelsel (de zuidelijke eerst) en
  de kappen eindigen aan de oostkant op u = 25, 21, 10 en 7 m en beginnen aan
  de westkant bij de passage op u = -153, -159, -163 en -169 m. Elke kap heeft
  zes ellipsvormige glaspanelen op de middellijn (28 tot 30 m lang aan de
  westkant, dan 19, 18, 18,5, een lang paneel van 33 tot 34 m en een kort
  paneel bij het oostelijke uiteinde; 5 tot 7 m breed) als nissen van 0,5 m
  diep, op vijf kolommen van 1,2 m in het zijaanzicht tussen de panelen. Het
  AHN ziet door het glas heen, dus de breedte en positie van de panelen komen
  uit de gaten in het DSM; het laatste paneel per kap is geschat. De kappen
  staan los van de rest van het model op hun kolommen.
- In het oosten de transferhal met het vrijgevormde dak dat van +44 m naar
  het busstation afloopt. Dat dak is een gefacetteerd vlak op knopen van 5 m
  (het gemiddelde van het AHN-DSM rond elke knoop) in plaats van het
  hoogteveld van 1 m; zo blijft het een vlak met driehoeken in plaats van een
  raster van 31.000 cellen, en de panelen van het echte dak zijn ook facetten.
  Het glazen oog is 2 m verlaagd. De noordgevel en de oostrand volgen een
  eigen dakcontour (de plint langs de kantoortoren en het plein, de lijn waar
  het dak het busstation raakt op DSM NAP +25,5 m, per 5 m gladgestreken),
  samen met de BAG-contour afgesneden met rechte wanden.

Vergelijking met het AHN-DSM: de garage is een plat dak dat de lichtschachten
en de binnenhoven van het DSM niet volgt; het facettenvlak van de hal volgt
het DSM op 5 m, dus de glazen gevels en de randen wijken af. De eerdere versie
op 1 m (92 % binnen 1 m) is hiermee bewust vergroot naar vlakken.

Printbaar op 1:1000: de blokken en het facettenvlak staan met rechte wanden
op de vlakke onderkant; alleen de bovenkanten van de banden en de onderkant van
de perronkappen (NAP +32 m) zijn vlak (het script controleert dat). Met
overhangopvulling op 1:1000 is het volume 223,3 cm³ tegen
195,0 cm³ voor het model: de export zet de kappen op een wand tot de
onderplaat (28 cm³ steun, voor de rest blijft het volume gelijk). In de kaart staat de hal tussen de PDOK-
kantoortorens en het busstation met het dak aflopend naar de bussen, en de
preview van een uitsnede van 200 m rond de hal toont het model zonder het
vervangen pand.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Station_Arnhem_Centraal)
(transferhal van UNStudio, 2015), PDOK BAG (de OV-terminal en de kantoortorens
die buiten het model blijven), PDOK AHN (dsm en dtm 0,5 m via WCS: het
hoogteveld, straat, plein en busstation) en de PDOK luchtfoto. Geschat zijn
de dakcontour in het oosten en noorden (uit het DSM) en de diepte van het oog.
Vereenvoudigd: het dak van de hal volgt het DSM op 5 m, dus de gedraaide kolom
binnen, de glazen gevels en de ruitvormige lichtopeningen in het dak zijn niet
te zien, en de garage heeft alleen banden en geen ramen; de passage over het spoor met haar lichtbogen en de
schuine steunen van de perronkappen ontbreken.
