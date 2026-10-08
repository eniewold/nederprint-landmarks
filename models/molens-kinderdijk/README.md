# Molens van Kinderdijk (Kinderdijk)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `molens-kinderdijk.glb` | Catalogusbron in meters: negentien nodes `building:<molen>`, één per molen (`Nederwaard 1` tot `8`, `Overwaard 1` tot `8`, `Hoge Molen`, `Kleine Molen`, `Blokweer`) met romp, kap, staart en wiekenkruis |
| `molens-kinderdijk-1-1000.stl` | De negentien molens los naast elkaar op 1:1000 (vijf per rij, wiekenvlak langs X), elk met de onderkant van zijn fundering op het printbed en een printsteun onder de twee onderste wiekpunten (157 × 86 × 27,5 mm) |
| `molens-kinderdijk.json` | Catalogusitem met RD-georeferentie, maaiveldpunten, vervangen panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (104070, 432835) (WGS84 51,88172
N, 4,64750 O), centraal tussen de molengangen van de Nederwaard en de
Overwaard, en de glTF-conventie Y omhoog. +X wijst naar het oosten en +Y naar
het noorden (`xAxis` (1, 0), geen draaiing). z = 0 ligt op het water van de
boezem van de Nederwaard (NAP -1,10 m volgens het PDOK-terrein, dat daar
over honderden meters binnen 3 cm vlak is). Het maaiveld wordt op zeventien
punten op dat water bemonsterd (`groundSamplePoints`): bij elke molen van de
Nederwaard en bij de Blokweer 14 tot 20 m van de molen, bij de Overwaard 75
tot 112 m ervandaan, want de boezem loopt langs de hele groep. Zo kiest elke
uitsnede hetzelfde peil, ook als hij maar een deel van de groep bevat. Rond
de Hoge en de Kleine Molen ligt geen boezemwater; een uitsnede zonder een
van die punten valt terug op `groundHeight` 42,49 (de PDOK-hoogte van het
boezempeil). `groundOffsetMetres` is 0. Elke molen staat met zijn eigen voet
op het PDOK-maaiveld rond de molen (z = 1,9 tot 2,6 m, de Kleine Molen en de
Blokweer 0,8 en 0,7 m) en loopt met een fundering tot 1,5 m daaronder door,
de vlakke onderkant van zijn node.

De negentien molens en hun BAG-panden (`replacesBuildings`):

- Nederwaard 1 tot 8 (0571100000001018, …1581, …0241, …0460, …1489, …0418,
  …0105, …1406; adressen Nederwaard 4 tot 11): de ronde stenen grondzeilers
  van 1738 aan de westkant, nummer 1 in het noorden bij Kinderdijk, 1 tot 5
  langs de boezem naar het zuidoosten en 6 tot 8 in een tweede gang naar het
  zuidwesten (nummer 8 op x = -601, y = -400).
- Overwaard 1 tot 8 (0571100000000222, …1592, …1583, …0462, …1129, …0125,
  …0969, …0514; adressen Overwaard 4 tot 11): de achtkante grondzeilers van
  1740 aan de oostkant van de boezem, van nummer 1 in het noorden (x = -343,
  y = 281) tot nummer 8 in het zuidoosten (x = 600, y = -461).
- De Hoge Molen (1740, 0571100000001196, Boezemkade 2) en de Kleine of Lage
  Molen (1761, 0571100000000668, Boezemkade 3) van Nieuw-Lekkerland in het
  noordoosten.
- De wipmolen De Blokker van de Blokweer (0482100001254237, Blokweerschekade 7,
  Alblasserdam) in het zuiden, tussen de twee gangen.

Elke molen staat op het hart van zijn BAG-contour (bij Overwaard 1 en de
Kleine Molen, waarvan de contour een aanbouw bevat, op het hart van de romp
in het AHN) en is gedraaid naar de richting van de as zoals het AHN die
toont (het wiekenvlak ligt in het DSM als een lijn voor de kap): de meeste
kappen staan naar het zuidwesten (-77 tot -161 graden vanaf het oosten),
Nederwaard 8, Overwaard 3 en de Hoge Molen naar het noordwesten.

Onderdelen per molen (hoogtes boven de voet):

- Nederwaard: een ronde stenen romp als afgeknotte kegel op de straal van de
  BAG-contour (4,7 tot 5,3 m) naar 3,3 m op 12,5 m; de rietgedekte kap tot
  15,9 m (NAP +16,7 tot +17,1 m).
- Overwaard: een stenen voet van 1 m en een rietgedekt achtkant op de
  BAG-contour (apothema circa 4,9 m) naar 3,2 m op 13,2 m; de kap tot 16,1 m
  (NAP +17,1 tot +17,5 m). De Hoge Molen als de Overwaard met de kap op
  16,3 m (NAP +17,8 m), de Kleine Molen kleiner (achtkant 4,6 naar 3,0 m,
  kap op 15,4 m, NAP +15,1 m).
- De Blokker: een vierkante ondertoren op de BAG-contour (7,6 m) naar 2,6 m
  op 7 m, een bovenhuis van 5 × 3,4 m van 9 tot 13,2 m met een schuine
  onderkant naar de ondertoren en een zadeldak met de nok op 14,9 m
  (NAP +14,5 m).
- De kap rust met een schuine onderrand op de romp en loopt over de nok
  langs de as; een staart van 0,9 m loopt van de achterkant van de kap naar
  het maaiveld 3,5 m achter de romp.
- Het wiekenkruis als plaat van 1,0 m dik en 2,4 m breed in X-stand onder
  50 graden met de horizontaal, met het midden 4,4 m voor de rompas (bij de
  wipmolen 3,1 m) en de as op 13,9 m (Nederwaard), 14,1 m (Overwaard), 14,3
  en 13,4 m (Hoge en Kleine Molen) en 12,9 m (Blokker). Vlucht 27,8 m
  (Nederwaard), 29,0 m (Overwaard), 28 en 27 m (Hoge en Kleine Molen) en
  25 m (Blokker). De onderste wiekpunten blijven 2,2 tot 2,8 m boven de
  voet; het hoogste punt is de bovenste wiek van Overwaard 3, 26,0 m boven
  de voet (NAP +27,4 m).

Wat er niet in zit: de schoren van de kap naar het maaiveld, het kruirad, de
scheprad- en vijzelkasten, het hekwerk en de zeilen van de wieken (de plaat
is dicht), de helling van de as (circa 10 graden; het wiekenvlak staat
verticaal), de gemalen, de molenaarswoningen en de bezoekersgebouwen.

Rond de rompas (binnen 4 m: romp en kap zonder de wieken) ligt 71 % van de
DSM-cellen binnen 2 m van het model (56 % binnen 1 m, mediaan +0,24 m,
mediaan absoluut 0,81 m); per molen 65 tot 77 %, alleen de Kleine Molen
53 % (een aanbouw tegen de romp) en de Blokker 62 % (de ondertoren is in het
DSM breder en lager). Bij de molens waarvan het DSM de kap zonder wiek
erboven toont, wijkt de nok 0,6 m of minder af van het 95e percentiel van
het DSM boven de romp. De wieken zelf zijn niet te
vergelijken: in het AHN staan ze in willekeurige standen, het model zet ze
in X-stand.

Printbaarheid op 1:1000: de wiekplaten zijn 1,0 m dik en hangen nergens
vlakker dan 50 graden; de kap, het bovenhuis en de as hebben een onderkant
van 50 tot 59 graden en de staart loopt onder 67 graden naar het maaiveld.
Het script controleert per molen dat alles op de onderkant van de fundering
begint, dat alleen de schuine eindvlakken van de twee onderste wiekpunten
(4,8 m² per molen) vlakker dan 45 graden hangen en dat de printversie geen
overhang heeft: daar loopt onder elke onderste wiekpunt een steun van de
plaatdikte tot het printbed. Een wiekpunt is een laagste punt in de lucht
en de export doet daar hetzelfde. In drie uitsneden op 1:1000 (400 × 400 m
rond Nederwaard 2 tot 4 en Overwaard 1 en 2, 320 × 320 m rond Overwaard 3 en
4 en de Blokweer, 300 × 300 m rond de Hoge en de Kleine Molen; 5 tot 13
seconden) gaat elke hele molen als gesloten solid met overhangopvulling door
(steile overhang aanwezig, de opvulling slaagt): boven de onderkant van
het model groeit het volume met 8 tot 12 mm³ op 530 tot 1160 mm³ (1 tot 2 %),
tussen het maaiveld en de wiekpunten komt er 1,8 tot 2,5 mm² doorsnede bij
(de twee paaltjes onder de wiekpunten) en hogerop minder dan 0,15 mm². De
rest van de groei is de voet die onder het maaiveld doorloopt tot de
onderplaat. De vervangen PDOK-panden zitten niet in de export en het
PDOK-terrein rond de voet ligt overal tussen 0,2 m onder en 0,3 m boven de
voet van het model (mediaan +0,02 tot +0,07 m). Een uitsnede over de hele
groep (1350 m) of over de Nederwaard (800 m) overschrijdt de grens van
4 miljoen vertices door het dichte PDOK-terrein van de polders; een molen
die door de rand van een uitsnede wordt afgesneden, krijgt de verticale
opvulling.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kinderdijkse_molens)
(negentien molens, Nederwaard 1738 met een vlucht van 27,5 tot 28 m,
Overwaard 1740 met 28,6 tot 29,5 m, de Hoge Molen 1740, de Kleine Molen
1761, de Blokker als wipmolen), de [Engelse
Wikipedia](https://en.wikipedia.org/wiki/Kinderdijk_windmills), PDOK BAG
(pand-id, bouwjaar, adres en contour per molen), PDOK AHN (dsm en dtm 0,5 m
via WCS: romp per hoogte, kap, asrichting, wiekenvlak), het PDOK-terrein van
de 3D Basisvoorziening (voet per molen, boezempeil) en Wikimedia
Commons-foto's (Kinderdijk - Molen Nederwaard 3.jpg; Kinderdijk, Overwaard
molens no8tm3 RM30558tm3 en Nederwaard molens no5en4 RM30547+6 IMG 9372
2021-06-13 11.20.jpg; Wipmolen van de Blokweer, van de polder Alblasserdam -
Kinderdijk - 20125314 - RCE.jpg) voor romp, kap en staart. Geschat zijn de
romp- en kaphoogtes per type (gemiddelde van de molens waarvan het DSM de
kap zonder wiek erboven toont), de hoogte van de as (2 m onder de nok), de
vorm van de kap, de stand en breedte van de wieken, de vlucht van de Hoge en
de Kleine Molen (28 en 27 m) en van de Blokker (25 m), de afmetingen van de
Hoge Molen (de BAG-contour van 62 m² is kleiner dan de romp in het AHN; als
de Overwaard aangenomen), de vorm van de wipmolen en de staart (3,5 m achter
de romp). De nummering volgt de adressen (Nederwaard en Overwaard 4 tot 11
voor de molens 1 tot 8, met de museummolen Nederwaard 2 op Nederwaard 5).

Licentie van het model: eigen werk op basis van open bronnen.
