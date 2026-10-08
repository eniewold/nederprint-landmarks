# Nieuwe Kerk (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `nieuwe-kerk-amsterdam.glb` | Catalogusbron in meters: nodes `building:kerk` (de kerk uit dakvlakken en bouwdelen) en `building:kerkmeesterskamer` (het aangebouwde pand aan de Dam) |
| `nieuwe-kerk-amsterdam-1-1000.stl` | Kerk en kerkmeesterskamer op 1:1000 met de onderkant (0,8 m onder het maaiveld) op het printbed (96 × 64 × 57 mm) |
| `nieuwe-kerk-amsterdam.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (121259,4, 487454,3), het midden
van de viering onder de dakruiter, op het maaiveld aan de Dam (NAP +1,9 m), en
de glTF-conventie Y omhoog. +X loopt langs de nok van schip en koor naar het
oosten (17,5 graden linksom vanaf de RD-X-as, gemeten aan de nokken en aan de
normalen van de LoD2.2-dakvlakken) en +Y loodrecht daarop naar het noorden.
Het maaiveld wordt op vier punten aan de westkant en aan de Dam bemonsterd
(`groundSamplePoints`, NAP +1,9 tot +2,0 m); aan de noordkant ligt het 0,5 m
lager, daarom begint het model 0,8 m onder het maaiveld. Als geen van die punten
in de uitsnede valt, gebruikt de lader `groundHeight` 44,88 m (de ellipsoïdische
PDOK-terreinhoogte op die punten). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0363100012169079` (de kerk) en `NL.IMBAG.Pand.0363100012169014`
(de kerkmeesterskamer: de PDOK-reconstructie van dat pand neemt punten van de
kerk mee en staat tot NAP +27,8 m, tegenover +17,6 m in het AHN). De huizen
tegen de noordgevel zijn eigen BAG-panden en blijven als PDOK-model staan.

Onderdelen (hoogtes boven het maaiveld op NAP +1,9 m, 95,9 bij 63,6 m en 57 m
hoog met de onderkant): een gotische kruisbasiliek uit bouwdelen met rechte
dakvlakken z = a u + b v + c. Nokken, goten en hellingen komen uit het AHN en
uit de LoD2.2-vlakken van de 3D BAG; de bouwdelen worden met Manifold verenigd,
zodat kilgoten en schilden vanzelf ontstaan.

- Schip, dwarsschip en koor: één nok op +35,4 m (NAP +37,3 m) met vlakken van 57
  graden (helling 1,55), 16,3 m breed tussen de buitenmuren. Het schip loopt van
  de westgevel (u = -40,6 m) tot de viering, het dwarsschip van de zuidgevel aan
  de Dam (v = -29,6 m) tot de noordgevel (v = +29,6 m). Het koor sluit met vijf
  zijden van een twaalfhoek rond (27,6, 0) met een apothema van 8,15 m; de vijf
  dakvlakken van de sluiting beginnen op dezelfde goot, dus de nok eindigt
  precies op u = 27,6 m.
- Langs alle hoge daken een borstwering van 0,9 m breed tot +25,8 m met 32
  pinakels (0,9 m, tot +29 m) op de traveegrenzen; op de zes hoeken van de
  sluiting staan de pinakels op steunberen die tot het maaiveld doorlopen. Drie
  topgevels (west, zuid en noord) van 1,2 m dik en 1,1 m boven het dakvlak (top
  +36,5 m) met een pinakel tot +39,1 m.
- Westgevel: twee achtkantige hoektorens van 3,4 m op de hoeken van het schip
  met een kraag van 4,0 m op +26,6 m en een leien spits tot +37 m; het stenen
  westportaal (5,7 bij 17,2 m, +12 m) met een spitse doorgang van 4,4 m (top
  +9,5 m, 3,8 m diep) en twee blinde bogen.
- Zijbeuken van het schip (v ±8,15 tot ±14,9 m): lessenaarsdak van +15,3 m aan
  het schip naar +14,0 m aan de buitenmuur, een borstwering tot +15,7 m langs de
  zij- en westgevel, pinakels en steunberen (0,9 bij 1,4 m) op de traveegrenzen
  u = -32,6 en -26,5 m en hoeksteunberen.
- Kapellen tegen de vierde en vijfde travee (u -20,3 tot -8,15 m, tot v = ±24
  m): schilddak met de nok langs het schip op +21,6 m (60 graden) en een schild
  naar het westen, een dakkapel met een pinakel op het buitenste dakvlak en
  pinakels op de hoeken.
- Kooromgang (twaalfhoek met apothema 14,7 m, tussen de straalkapellen 18,8 m):
  lessenaarsdak van +15,2 m tegen het koor naar +13,7 m bij de steunberen tussen
  de kapellen, met vier pinakels op die steunberen. Vijf straalkapellen op de
  zijden van de twaalfhoek (0, ±30, ±60 graden): 3/8-sluiting van 7,6 m breed tot
  21 m van het midden, goot +12,9 m en een tentdak van 45 graden tot +16,7 m met
  een pinakel. Daartussen lage aanbouwen tot de rooilijn (+3,4 m).
- Kapellen ten noorden van het koor (v 14,7 tot 22,8 m): twee schilddaken met de
  nok langs het koor op +19,2 m (53 graden, schilden 56 graden) met een kilgoot
  op u = 19,4 m, en een lage aanbouw daarachter (+4,9 m) met een zadeldak langs de
  straat (nok +8 m). Kapellen ten zuiden van het koor (v -22,1 tot -14,7 m): drie
  dakjes met de nok langs het koor op +16,6 m en steile schilden ertussen, een
  borstwering tot +15,8 m en drie steunberen met pinakels. Twee achtkantige
  torentjes op de zuidoosthoek (spitsen tot +21,3 en +21,8 m).
- Zuidportaal aan de Dam: een stenen voorbouw over de breedte van het
  dwarsschip met een lessenaarsdak (+6 m) en in het midden een portaal met een
  steil schilddak tot +9,3 m en een pinakel; het noordportaal tussen twee lage
  aanbouwen (+7 m) aan de noordgevel.
- Dakruiter op de viering: een achtkantige lantaarn van 3,6 m tot +38,4 m en
  3,2 m tot +41 m, daarboven een achtkantige naaldspits van 2,8 m naar 0,9 m op
  +56,2 m (het hoogste AHN-punt).
- Vensternissen als spitsbogen, 0,5 m diep: per travee in de lichtbeuk en de
  zijbeuken, grote vensters in de westgevel en in beide dwarsschipgevels, in de
  lichtbeuk van het koor, in elke zijde van de sluiting, in de straalkapellen en
  in de kapellen ten noorden van het koor.
- Kerkmeesterskamer (eigen node): het pand aan de Dam (u 7,5 tot 25,2 m) met
  een schilddak (nok +13,5 m, 53 graden), drie dakkapellen naar de Dam en vier
  vensternissen, en de lage aanbouwen tot de Eggertstraat (+8,6, +10,7 en +3,4
  m).

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 78,8 % ligt binnen 1 m en 86,9 % binnen 2 m. De afwijkingen zitten
vooral op de randen (gevels, borstweringen, pinakels), op de spitsen die het
AHN te laag geeft en in de lage aanbouwen aan de Eggertstraat.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de
spitsbogen van de vensternissen en de kraag van de hoektorens na (steiler dan
45 graden), en alles staat op het maaiveld. De export vult op 1:1000 en 1:1500
0,01 % bij en op 1:2500 0,6 % (kerk) en 1,3 % (kerkmeesterskamer). De STL is
92,5 cm³, heeft 5.162 driehoeken en de kerk en de kerkmeesterskamer zijn elk één
samenhangend deel (status NoError, geslacht 0). Dunste delen op 1:1000:
pinakels 0,9 mm, de spits van de dakruiter 0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_Kerk_%28Amsterdam%29)
(bouwgeschiedenis, vijf traveeën in het schip, nooit voltooide toren), PDOK BAG
(de twee panden), PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2
(api.3dbag.nl: hellingen van 57 en 53 graden), de PDOK luchtfoto en foto's op
Wikimedia Commons (de Dam, de Nieuwezijds Voorburgwal en de Eggertstraat).
Geschat zijn de hoektorens en hun spitsen (het AHN ziet ze tot +34 m), de lantaarn
van de dakruiter, de pinakels, steunberen, dakkapellen en vensternissen, de
portalen en de lage aanbouwen. Weggelaten: het maaswerk, het roosvenster, de open
balustrades (als dichte borstwering), de kruisbloemen op de topgevels en de
kleine dakramen.
