# Rat Verlegh Stadion (Breda)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `rat-verlegh-stadion.glb` | Catalogusbron in meters: node `building:stadion` (gesloten ring van vier tribunes onder één dak, de aanbouwen, de vier hoektorens en de vier lichtmasten) |
| `rat-verlegh-stadion-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (179 × 140 × 35 mm, één stuk) |
| `rat-verlegh-stadion.json` | Catalogusitem met RD-georeferentie, maaiveld, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (110872,29, 400846,31), in het hart
van de veldopening op het maaiveld (de straat rond het stadion, NAP +3,25 m), en
de glTF-conventie Y omhoog. +X loopt langs de lengteas van het veld naar het
noordoosten (49,0 graden vanaf de RD-X-as, uit de kleinste omhullende rechthoek
van de veldopening in het AHN) en +Y dwars daarop naar het noordwesten, naar de
hoofdingang. Het maaiveld wordt op vier punten op de straten en pleinen rond het
stadion bemonsterd (`groundSamplePoints`, 12 tot 16 m buiten de gevels);
`groundHeight` (47,12 m) is de laagste PDOK-terreinhoogte daar (ellipsoïdisch).
Vervangt de PDOK-reconstructie van de acht BAG-panden van het stadion: de
tribunes `NL.IMBAG.Pand.0758100000070836` (noordwest), `…070840` (zuidoost),
`…070842` (noordoost) en `…096090` (zuidwest) en de hoektorens `…070833`,
`…070841`, `…095930` en `…096089`.

Onderdelen (hoogtes boven de straat; maat n is de afstand vanaf de rand van de
veldopening naar buiten; alles uit convexe rompen van vlakken, prisma's en
cirkelbogen, geen hoogteveld):

- De ring van tribunes rond de veldopening van 128,6 bij 83,3 m (AHN), op alle
  vier zijden met dezelfde doorsnede die langs de zijde is uitgetrokken en in
  de hoeken in verstek aansluit (de hoeken zijn gesloten en overdekt):
  - het dak, 19,4 m diep, van +20,55 m aan de veldopening tot +19,9 m aan de
    achterrand (AHN +20,4 tot +20,6 en +19,7 tot +20,0 m), met de vakwerkligger
    langs de veldopening (1,2 m diep, onderkant +17,9 m) en een dakplaat van 1,7
    tot 1,55 m dik (onderkant +18,85 tot +18,35 m); onder de plaat per traveelijn
    een dakspant (0,9 m breed, tot 1,0 m diep) en in elke hoek een hoekligger van
    de hoek van de veldopening naar de mast;
  - de zitrang in tien treden van 1,93 m diep van n = −1,0 tot 18,3 m (+3,0 tot
    +13,3 m), aan de lange zijden een extra voorste rij van n = −2,6 tot −1,0 m
    op +2,3 m (de verbouwing van 2025);
  - de schuine onderkant van de rang (+7,5 m bij n = 11,4 m tot +11,9 m aan de
    achterkant), die buiten boven de lage aanbouwen en in de doorgangen naast de
    hoektorens zichtbaar is, met de rugbalk van +11,9 tot +13,3 m;
  - de achterwand (n 18,3 tot 19,4 m) van de bovenste trede tot het dak, met aan
    de binnenzijde de glazen band (0,4 m diep, +13,9 tot +17,95 m) tussen de
    spanten.
- Per traveelijn (luchtfoto: om de 10,9 m, twaalf op de lange en acht op de korte
  zijden) een betonnen spant van 1,0 m breed: de kolom buiten de achterwand, de
  ligger onder de schuine onderkant van de rang en de schoor met het groene
  vakwerk van +11 m tot de dakrand, 2,4 m buiten de wand (+15,4 m aan de punt).
- De bakstenen aanbouwen met hun gebogen gevels (cirkelbogen door de
  BAG-contouren): noordwest drie lagen tot +12,6 m (straal 203 m, tot 71,4 m van
  het hart) met de hoofdingang (8 m breed, 1,2 m diep) en een opbouw tot +15,0 m;
  zuidoost drie lagen tot +11,8 m (straal 205 m, tot −68,4 m); noordoost twee
  lagen tot +7,9 m (straal 113 m, tot 89,6 m); zuidwest twee lagen tot +7,9 m met
  een rechte gevel onder de dakrand. Raamnissen van 2,4 m breed en 0,4 m diep om
  de 4,4 m in elke laag. Daarnaast de buitentrap aan de zuidwestkant (+7,0 m,
  AHN) en de twee dug-outs aan de noordwestkant (+3,0 tot +3,6 m).
- De vier hoektorens op hun BAG-contouren (14 bij 12 m) tot +16,4 m, met drie
  raamnissen per laag in de twee buitengevels; het dak rust er op kolommen van
  0,9 m (de ruimte tussen toren en dak is open, zoals op de foto's).
- De vier lichtmasten op de binnenhoeken van de torens, door het dak: een voet
  van 2,8 m, een mast van 1,2 m en een lampkop van 5,0 bij 1,6 m die naar het
  veld wijst, tot +34,0 m (AHN-pieken +32,6 tot +34,2 m).

Geschat (uit foto's en de dakhoogten): de treden van de zitrang (begin, hoogte,
aantal), de onderkant van het dak en de diepte van de vakwerkligger, de schuine
onderkant van de rang, de maten van de spanten en het groene vakwerk, de hoogte
van de hoektorens (vier lagen, +16,4 m), de zuidwestaanbouw (onder de dakrand,
niet in het AHN; hoogte gelijk aan de noordoostaanbouw), de raamnissen en de
lampkoppen. De voorste rij van 2025 en het verlaagde veld staan niet in het AHN
(van vóór de verbouwing); de rij is uit de luchtfoto van 2026 afgeleid en op
+2,3 m gezet, net boven het PDOK-veld (+1,9 m).

Weggelaten: de zonnepanelen op het dak (0,2 m), de stoelen, trappen en hekken op
de rang, de reclameborden langs de dakrand, de kabels, de losse staven van het
groene vakwerk (als dichte schoor van 1,0 m, staven zijn dunner dan 0,9 m) en de
doorschijnende strook voorin het dak (in het AHN deels doorzichtig; hier dicht
dak).

Pasvorm op het AHN: de dakrand en de achterrand liggen op alle vier zijden op de
gemeten randen (veldopening ±64,3 en ±41,65 m, achterrand 19,4 m verder, AHN
18,8 tot 19,5 m), de dakhoogte binnen 0,2 m van het DSM, de aanbouwen op hun
gemeten hoogte en de masten op de DSM-pieken. In een verse PDOK-dump staat de
voet rondom op of tot 0,3 m in het PDOK-terrein (+47,12 tot +47,42 m).

Printbaar op 1:1000: onder +2,9 m wijst geen vlak onder 45 graden naar beneden;
daarboven hangen het dak, de vakwerkligger, de onderkant van de rang, de spanten,
de lampkoppen en de plafonds van de raamnissen bedoeld uit (`OVERHANG_OK`). De
export vult op 1:1000 41,6 % volume op (138,4 naar 196,0 cm³, status NoError,
3,1 s): vooral onder het dak van 19,4 m diep boven de open zitrang. De STL is
129,7 cm³ (12.802 driehoeken, status NoError), één stuk.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Rat_Verlegh_Stadion)
(20.500 plaatsen, verbouwing 2025), PDOK BAG (de acht panden), PDOK AHN (dsm en
dtm 0,5 m via WCS), de PDOK luchtfoto (2024 en 2026: traveelijnen, zonnepanelen,
de voorste rijen van 2025) en Wikimedia Commons-foto's (NAC Breda DSCF4040 tot
4071, Rat Verlegh Stadion P1030371 tot 386 en DSCF9251 tot 9258, NAC stadium
inside, Rat Verleghstadium 2 en 3: zitrang onder het dak, glazen band,
vakwerkligger, betonspanten met groen vakwerk, getrapte onderkant van de rang,
bakstenen aanbouwen, hoektorens met het dak op kolommen, lichtmasten op het dak).
