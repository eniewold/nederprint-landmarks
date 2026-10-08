# Sint-Nicolaasbasiliek (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `sint-nicolaasbasiliek.glb` | Catalogusbron in meters: nodes `building:kerk` (de basiliek uit dakvlakken en bouwdelen) en `building:buurpand` (het pand aan de zuidkant) |
| `sint-nicolaasbasiliek-1-1000.stl` | Basiliek en buurpand op 1:1000 met de onderkant (0,6 m onder het maaiveld) op het printbed (55 × 30 × 59 mm, twee delen die tegen elkaar staan) |
| `sint-nicolaasbasiliek.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (121907,25, 487722,25), het midden
van de vieringtoren, op het maaiveld (NAP +2,25 m), en de glTF-conventie Y
omhoog. +X loopt van het front aan de Prins Hendrikkade naar het koor (60,6
graden rechtsom vanaf de RD-X-as, gemeten aan de normalen van de
LoD2.2-dakvlakken) en +Y loodrecht daarop. Het maaiveld wordt op de Prins
Hendrikkade voor de torens bemonsterd (`groundSamplePoints`, NAP +2,2 m); als
geen van die punten in de uitsnede valt, gebruikt de lader `groundHeight` 45,23 m
(de ellipsoïdische PDOK-terreinhoogte). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0363100012165691` (de basiliek) en
`NL.IMBAG.Pand.0363100012182894` (het buurpand aan de zuidkant: de
PDOK-reconstructie daarvan neemt punten van de zuidtoren mee en staat tot NAP
+25,8 m, tegenover +21,5 m in het AHN).

Onderdelen (hoogtes boven het maaiveld op NAP +2,25 m, 54,6 bij 30,3 m en 59,1 m
hoog met de onderkant):

- Schip, dwarsschip en koor onder één nok op +31,1 m (51 graden), 13,8 m breed;
  het dwarsschip met de nok langs v door de viering tot v = ±11,3 m en topgevels
  (+31,9 m); het koor met een smallere 3/8-sluiting rond (12, 0) met een
  apothema van 4,6 m; drie dakkapellen per kant op het schip.
- Zijbeuken (van de torens tot het dwarsschip) en kapellen naast het koor met
  eigen zadeldaken (nok +13,4 m op v = ±8,8 m) en steunmuren met een punt (+15,6 m)
  op de traveegrenzen.
- Vieringtoren: een achtkantige trommel van 13,6 m tot +38,2 m met galmgaten, een
  kroonlijst op een kraag met acht vazen, een volle achtkantige koepel (+40 m op
  13,6 m via +46,3 m op 9,8 m naar +48,5 m), een lantaarn van 3,6 m tot +53,4 m met
  een kroonlijst en een spits met kruis tot +58,5 m (het hoogste AHN-punt).
- Twee westtorens van 6,2 m (de zuidtoren 2,3 m verder naar voren): een
  vierkante romp tot +35,5 m met een borstwering, een achtkantige
  klokkenverdieping van 5 m met galmgaten tot +39 m, een koepel en een lantaarn
  met kruis tot +48,2 m.
- Het front tussen de torens met een topgevel (+31,7 m), het roosvenster als
  nis en een portaal met zadeldak (+9,5 m) voor de middeningang.
- Buurpand (eigen node): twee zadeldaken langs de kerk (nok +20,6 m met een
  schild naar de Prins Hendrikkade, en +15,6 m).
- Vensternissen en ingangen als spitse nissen in de zijbeuken, de lichtbeuk, de
  gevels van het dwarsschip, de sluiting en de torens.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 69,6 % ligt binnen 1 m en 84,0 % binnen 2 m. De afwijkingen zitten
vooral op de randen, de dakkapellen, de torens en het buurpand.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen
en de kraag onder de kroonlijst na (steiler dan 45 graden). De export vult op
1:1000 en 1:1500 niets bij en op 1:2500 0,5 % (kerk) en 0,8 % (buurpand). De STL
is 32,2 cm³ en heeft 2.482 driehoeken; kerk en buurpand zijn elk één samenhangend
deel (status NoError). Dunste delen op 1:1000: de vazen 0,9 mm en de spitsen
0,9 mm bovenin.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Co-kathedrale_basiliek_van_de_Heilige_Nicolaas)
(driebeukige kruiskerk, achtkantige vieringtoren met barokke koepel en
lantaarn, twee torens met roosvenster ertussen, de zuidtoren verder naar voren),
PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2 (api.3dbag.nl) en de
PDOK luchtfoto. Geschat zijn de geledingen en koepeltjes van de westtorens
tussen de AHN-punten, de vazen, de dakkapellen, de steunmuren, het portaal en de
vensternissen. Weggelaten: beelden, balustrades, maaswerk en de wijzerplaten.
