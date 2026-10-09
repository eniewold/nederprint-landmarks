# Koning Willem II Stadion (Tilburg)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `koning-willem-ii-stadion.glb` | Catalogusbron in meters: node `building:stadion` (de ring van tribunes onder het golvende dak met pylonen, de hoofdtribune met het hoofdgebouw, vier vakwerk-lichtmasten en de aanbouwen) |
| `koning-willem-ii-stadion-1-1000.stl` | Het stadion op 1:1000 met de onderkant (2,5 m onder het maaiveld) op het printbed (178 × 160 × 47 mm, één stuk) |
| `koning-willem-ii-stadion.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen BAG-panden, hoofdmaten en bronnen |

Gegenereerd door `scripts/generate-koning-willem-ii-stadion.mjs` (manifold-3d);
alle maten staan als constanten in het script.

## Oorsprong en oriëntatie

De GLB is in meters met de oorsprong op RD (132774,37, 394904,76), in het hart
van het veld op het maaiveld rond het stadion (NAP circa +15,7 m), en de
glTF-conventie Y omhoog. +X loopt langs de lengteas van het veld naar het
noordnoordwesten, naar de KingSide (95,75 graden vanaf de RD-X-as, uit de
randen van de veldopening in het AHN), +Y dwars daarop naar het
westzuidwesten, naar de hoofdtribune.

Het maaiveld wordt op zes punten op de straten en pleinen rond het stadion
bemonsterd (`groundSamplePoints`, 10 tot 15 m buiten de luifels; PDOK 59,44 tot
60,10 m ellipsoïdisch). `groundHeight` is de laagste daarvan, 59,44 m aan de
Goirlese kant. Het veld ligt 0,6 m en de droge gracht rond het veld 2,1 m onder
het maaiveld (AHN, en zo zakt ook het PDOK-terrein weg). Daarom staan alle
onderdelen op één vlakke onderkant van 2,5 m onder het maaiveld: de voorkant
van de tribunes loopt in de gracht door en zweeft nergens boven het
PDOK-terrein; rondom zit de voet in het terrein (gecontroleerd in een
PDOK-dump: terrein in de gracht 57,37 m, onderkant 56,94 m).

Vervangt de PDOK-reconstructie van de vier BAG-panden van het stadion:
`NL.IMBAG.Pand.0855100000283413` (hoofdtribune met hoofdgebouw),
`…196810` (noordwesthoek en de westhelft van de KingSide),
`…705438` (zuidwesthoek) en `…818422` (aanbouw van 2019 in de Goirlese kant).
De rest van de ring (lange zijde, oosthelft van de KingSide, Goirlese kant) is
geen BAG-pand en staat niet in PDOK.

## Onderdelen

Hoogtes boven het maaiveld; alles uit doorsneden, blokken en convexe rompen van
vlakken, geen hoogteveld.

- **De ring** (KingSide, lange zijde, Goirlese kant en vier hoeken): één
  doorsnede in ρ, de afstand tot de kernrechthoek u ±57,0 bij v ±39,5 m (in de
  hoeken radiaal), uitgetrokken langs de afgeronde rechthoek. Voorrand van de
  tribune ρ = 5,2 (u = ±62,2, v = −44,7 m), voorrand van het dak 6,45, achtergevel
  24,0, buitenrand van de luifel 27,15 (u = ±84,15, v = −66,65 m, AHN ±84,2 en
  −66,6 m). Daarin:
  - de zitrang in acht treden van 2,2 m diep, van +1,0 tot +7,6 m, die onder het
    dak open blijft;
  - de achterwand (1 m) met aan de buitenkant een glazen pui (0,45 m diep, +0,5
    tot +3,5 m) tussen de pylonen onder de luifel;
  - de dakplaat: fascia van 2,0 m aan de veldkant (bovenkant +13,65 m), plaat
    van 1,6 m die 1:16 naar achteren afloopt tot +12,6 m bij de gevel, en een
    luifel die achter de gevel omlaag buigt tot +10,4 m aan de rand;
  - het golvende dak: hoge, vlakke vakken van één travee (8,7 m) en daartussen
    holle bogen over twee of drie traveeën die in het midden 1,4 m doorhangen
    (AHN, ook in de hoeken: hoog tussen 36 en 54 graden); de doorhang geldt voor
    de hele doorsnede, dus ook voor de golvende achterrand;
  - 54 betonnen pylonen (1,2 m breed, 2,2 m diep onderaan) langs de achtergevel,
    op de traveelijnen (KingSide en Goirlese kant v = ±4,35 tot ±39,15 m, lange
    zijde u = ±4,35 tot ±56,55 m, in elke hoek op 18, 36, 54 en 72 graden), met
    een schuine top van +15,2 naar +16,2 m, en op elke pylon een tuivin van
    0,9 m (de blauwe stalen trekstangen) schuin omlaag naar het dak, 14,5 m naar
    voren;
  - twee schermen aan de voorrand (KingSide midden, v −5 tot 4 m, en Goirlese
    kant bij de zuidwesthoek, v 21 tot 30 m), +9,0 tot +14,3 m.
- **De hoofdtribune** (u −57,6 tot 57,6 m): de onderste rang in zes treden
  (+1,0 tot +5,6 m) vanaf v = 44,6 m, de glazen gevel van de businessboxen op
  v = 57,5 m met twee rijen raamnissen (2,0 m op 2,9 m), het dak met een schuine
  neus (onderkant +10,2 m op v = 46,2 m) en een dakrand die licht gebogen loopt
  van +13,6 m aan de einden naar +14,4 m in het midden, een kilgoot op de
  pylonlijn (+12,6 m, v = 63,5 m) en de achterrand op +14,0 m (v = 73,3 m),
  14 pylonen tot +17,4 m met tuivinnen naar voren en naar achteren, en het
  bakstenen hoofdgebouw (v 73,3 tot 81,4 m, plat dak +12,8 m) met drie rijen
  raamnissen in de westgevel, een verdiepte pui van 0,8 m op de begane grond
  (u ±45 m) en twee installaties (+1,8 m) op het dak.
- **Vier vakwerk-lichtmasten** op de hoeken (lampenbank in het AHN op
  u/v (79,75, −55,75), (−80,35, −55,75), (82,1, 49,25) en (−80,2, 48,4) m),
  +44,4 m: vier poten van 0,9 m (3,2 m breed onderaan, 2,0 m bovenaan),
  ringbalken om de 6 m, kruisdiagonalen en een lampenbank van 5,2 × 1,6 m naar
  het veld.
- **Aanbouwen**: de overdekte loopbrug aan de noordoosthoek (3,5 m breed, dak van
  +8,0 naar +6,0 m) met het trappenhuis (+10,0 m), drie poorten achter de
  KingSide (+4,2 m) en de Goirlese kant (+2,6 m), twee lage aanbouwen achter de
  westhelft van de KingSide (+5,0 m) en vier kiosken achter de lange zijde
  (+3,0 m), allemaal tegen de achtergevel onder de luifel.

## Geschat en weggelaten

Geschat: de treden van de zitrang (het AHN ziet alleen het dak), de onderkant en
dikte van de dakplaat (fascia 2,0 m, plaat 1,6 m), de doorsnede van de pylonen
en tuivinnen, de afmetingen en hoogte van de schermen, de doorsnede en
lampenbank van de masten (de top komt uit het AHN), de raamnissen en de pui.
De achtergevel ligt in het model voor alle zijden op ρ = 24,0 (AHN: 23,5 aan de
KingSide, 24,5 aan de lange zijde).

Weggelaten: de reclameborden, stoelen, hekken en trappen op de rang (te fijn
voor 1:1000), de luidsprekers en camera's onder het dak, de afzonderlijke staven
van de tuien (als dichte vin van 0,9 m, want losse staven zijn dunner dan
0,9 m), de dakgoten, het logo op het hoofdgebouw en het standbeeld voor de
ingang. De doorzichtige strook van circa 4 m aan de voorrand van het noord- en
zuiddak (in het AHN deels gaten) is als dak gemodelleerd.

## Pasvorm op het AHN

Rastervergelijking op 0,5 m (47.871 cellen met DSM boven 3 m en model boven
1 m): 77 % binnen 1 m en 85 % binnen 2 m, mediaan +0,04 m; de hoofdtribune
90 % binnen 1 m. De rest zit in de tuivinnen en pylonen (het AHN ziet de dunne
staven niet), de doorzichtige voorrand van het noord- en zuiddak (het AHN meet
daar de tribune eronder) en de bomen langs de lange zijde.

## Printbaarheid op 1:1000

Onder +3 m wijst geen vlak onder 45 graden naar beneden; daarboven hangen de
dakplaten, de luifels, de neus van de hoofdtribune, de schermen en de
lampenbanken bedoeld uit (`OVERHANG_OK`). De printcheck (export met de
printbare overhangopvulling op 1:1000) geeft status NoError en vult 30,5 % op
(110,5 naar 144,2 cm³, 14 s): vooral onder de uitkragende daken boven de open
zitrang, net als bij Galgenwaard. De STL is 123,8 cm³ (status NoError), één
stuk: de masten en aanbouwen staan tegen de ring.

## Bronnen

[Wikipedia](https://nl.wikipedia.org/wiki/Koning_Willem_II_Stadion) (15.220
plaatsen, geopend 1995, ontwerp Buro Bollen, uitbreiding hoofdgebouw 2000), PDOK
BAG (de vier panden), PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK luchtfoto
(8 cm: pylonen, tuien, hoekwaaiers, dakopbouwen, loopbrug) en foto's van
Wikimedia Commons (Willem II stadion.jpg, Willem II Stadion - tribunes.jpg),
stadiumguide.com, stadiumdb.com en eredivisie.nl (fotoserie van Marco Magielse,
2018): de pylonen met de stalen tuien, de golvende fascia aan beide kanten, de
zitrang onder het dak, de businessboxen, het hoofdgebouw, de schermen en de
vakwerkmasten.
