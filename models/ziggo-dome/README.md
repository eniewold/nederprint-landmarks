# Ziggo Dome (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `ziggo-dome.glb` | Catalogusbron in meters: één node `building:ziggo-dome` met de doos en zijn gevelgeleding (ledlamellen, glazen plint, entree met terrasvloer, ramen in de laadgevel), het dak met nok en installatiekasten, de uitkragende hoeken aan de entreezijde en de luifel boven de twaalf laaddocks |
| `ziggo-dome-1-1000.stl` | De Ziggo Dome in één stuk op 1:1000, met de onderkant (1 m onder het straatniveau) op het printbed (91 × 121 × 35 mm) |
| `ziggo-dome.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van de doos op het
straatniveau aan de laadzijde (NAP -3,0 m) en de glTF-conventie Y omhoog. +X
loopt langs de korte zijde naar het zuidzuidoosten (RD-richting (0,482,
-0,876), 61,18 graden rechtsom vanaf het oosten, evenwijdig aan het veld van
de Johan Cruijff ArenA), +Y naar de entree aan De Passage. De doos staat aan
drie zijden in het verhoogde dek rond het gebouw (NAP +2,1 m); alleen aan de
zuidwestkant ligt de straat met de laaddocks. Het maaiveld wordt daar op drie
punten bemonsterd (`groundSamplePoints`, 12,5 m voor de gevel), niet op het
dek. Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0363100012238052`, dat
ook de parkeergarage onder het plein omvat; andere panden liggen niet onder
het model (de gebouwen aan De Passage met de loopbruggen naar de zaal staan
er los van). Het model staat ruim 150 m van de ArenA en overlapt die niet.

Onderdelen in het model (hoogtes in NAP):

- De doos van 90,96 × 114,9 m volgens de BGT-voetafdruk; de dakrand in het
  AHN valt er op 0,2 m na mee samen, dus de gevels staan verticaal. Wikipedia
  noemt 90 × 90 m; dat is de zaal.
- Het dak op +28,0 m aan de rand met een lage nok tot +28,7 m langs de lange
  as (|y| tot 19 m), gefit op het AHN.
- Vier installatiekasten van 7,6 × 18,4 m, op 29,2 tot 36,8 m van de lange
  as en 29,8 tot 48,2 m van de korte as (AHN-raster per 0,5 m): een vlakke
  bovenkant op +30,85 m tussen 33 en 45 m en aan beide kopse kanten een schuin
  vlak van 35 graden vanaf een opstand tot +28,8 m.
- De ledgevel: de verticale lamellen als groeven van 0,5 m breed en 0,3 m
  diep om de 3 m (38 op elke lange gevel, 30 op elke korte), van de onderkant
  van het ledveld tot 0,8 m onder de dakrand, die daardoor als gesloten band
  leest. De groeven lopen door de schuine onderkant van de uitkragende hoeken
  heen zonder nieuw ondervlak.
- Onder het ledveld (vanaf +5,8 m, één bouwlaag boven het dek) een glazen
  plint die 0,4 m terugligt, op de laadgevel boven de luifel en op de lange
  gevels tot de uitsparingen aan de entreezijde.
- De entree aan De Passage: tussen de uitkragende hoeken begint het ledveld
  pas op +10,8 m; daaronder twee bouwlagen glas 0,4 m terug (de entree en het
  restaurant met het terras), gescheiden door de terrasvloer van +6,3 tot
  +7,0 m.
- In de laadgevel drie rijen van twaalf ramen van 4,2 × 1,2 m (onderkant
  +9,0, +13,9 en +19,0 m) als nissen van 0,35 m; de lamellen lopen erdoor,
  zoals op de foto's.
- De twee hoeken aan de entreezijde, waar de BGT-voetafdruk in trappen
  terugspringt (tot 12 m) en de doos boven het plein uitkraagt: de onderkant
  loopt vanaf de gevel op het plein 1,1 m per meter (47,7 graden) schuin op
  tot +10,8 m in de buitenhoek (uit foto's: twee bouwlagen entree onder de
  doos).
- De luifel boven de laaddocks aan de zuidwestkant (de BAG-strook buiten de
  BGT-voetafdruk): 5,73 m diep, bovenkant op het dek (+2,1 m), met twaalf
  laaddocks van 5,1 m breed en penanten van 1 m van x = -30 tot 43 m eronder
  (aan de voorrand 1,2 m onder de bovenkant, dan onder 47,7 graden terug tot
  de straat); het stuk aan de noordnoordwestkant is een dichte wand.
- De onderbouw tot net onder het dek (+1,6 m) over de hele doos; aan drie
  zijden verdwijnt die in het terrein.

Het AHN bevestigt dat de massa werkelijk zo eenvoudig is: rechte gevels en
haakse hoeken op de dakrand, geen schuine gevelvlakken, geen attiek (de
dakrand ligt hooguit 0,15 m boven het dak) en geen verdiepte daken; de
afgeschuinde en getrapte hoeken zitten alleen in de voetafdruk onder de
uitkragingen. Het herkenbare zit in de gevel, en die is uit foto's geschat.

Er hangt niets vrij over: het steilste ondervlak staat 47,7 graden, en de
nissen en groeven hebben een bovenkant die onder 50 graden naar de gevel
terugloopt. Met de optie ‘Printbare overhang’ blijven de uitsparingen onder
de hoeken en de laaddocks daardoor ook in de print open (op 1:1000 vult de
export 0,9 % volume op; de hele uitsnede kost circa 4 seconden). Staat de
optie uit, dan kiest de export de verticale opvulling en worden ze in de print
dicht gezet; op de kaart blijven ze open.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Ziggo_Dome) (Benthem
Crouwel Architekten, 2012; 30 m hoog, zwarte gevel met 840.000 leds), PDOK BGT
en BAG (voetafdruk op het maaiveld, uitsparingen en luifelstrook), PDOK AHN
(dsm en dtm 0,5 m via WCS: dakrand, dakhoogte en nok, installatiekasten, dek,
luifel en straatniveau), de PDOK luchtfoto en foto's van Wikimedia Commons
(`2020 Ziggodome.jpg`, `Ziggo Dome.JPG`, `Ziggodome Amsterdam - panoramio.jpg`,
`ZiggoDome2012.jpg`) voor de gevelopbouw. Geschat uit foto's: de onderkant
van de uitkragende hoeken en van het ledveld, de terrasvloer, de rijen ramen,
het aantal laaddocks en de steek van de lamellen (in werkelijkheid veel
fijner dan 3 m). De trap naar het terras en de twee loopbruggen naar De
Passage (+15,5 en +20,7 m, ook niet in PDOK) zijn weggelaten: de bruggen
overspannen het plein vrij en zijn niet zonder steun te printen.

Licentie van het model: eigen werk op basis van open bronnen.
