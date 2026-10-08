# Basiliek van de HH. Agatha en Barbara (Oudenbosch)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `basiliek-oudenbosch.glb` | Catalogusbron in meters: node `building:basiliek-oudenbosch` met voorgevel (halfzuilen, boognissen, attiek, beelden), schip met balustrade, viering, trommel met steunberen, koepel met ribben en dakkapellen, armen met apsissen, hoekvolumes en sacristieën |
| `basiliek-oudenbosch-1-1000.stl` | De basiliek in één stuk op 1:1000, met de onderkant (1 m onder het lage maaiveld) op het printbed (55 × 83 × 66 mm) |
| `basiliek-oudenbosch.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong onder het hart van de koepel op RD
(95519,15, 400427,87), op het maaiveld aan de koorzijde (NAP +2,0 m) en de
glTF-conventie Y omhoog. +Y loopt langs de as van de kerk naar het koor in het
noorden (RD-richting 85 graden), +X naar het oosten; de voorgevel aan het
voorplein ligt aan de -Y-kant. De as van de kerk staat 11 graden gedraaid ten
opzichte van de kleinste omhullende rechthoek van de BAG-contour; die is
daarom niet als stelsel gebruikt. Het terrein loopt van NAP +2,0 m aan de
koorzijde op tot +6,0 m op het voorplein. Het maaiveld wordt op vier punten aan
de lage noord-, west- en oostkant bemonsterd (`groundSamplePoints`, NAP +2,0
tot +3,4 m); het model heeft één vlakke onderkant en zakt aan de voorkant tot
4 m in het PDOK-terrein, zodat de hoogtes in NAP overal kloppen. Het
catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.1655100000541882`.

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM in een stelsel langs
de as, met de PDOK 3D-reconstructie (LoD2.2) en foto's op Wikimedia Commons als
vergelijking):

- De BAG-contour tot +27,0 m (de hoekvolumes tussen de armen), met de twee
  sacristieën aan de koorzijde op +13,5 m.
- Het schip van 26,6 m breed met een zadeldak langs de as (goten +26,5 m, nok
  +30,6 m), langs beide goten een balustrade (+27,5 m) met piedestals om de
  3,3 m (+28,0 m, de pieken in het DSM) en drie rondboogvensters als nis in
  elke zijgevel.
- De voorgevel naar de Sint-Jan van Lateranen in drie delen (het middendeel
  springt naar voren): halfzuilen in reuzenorde tot de kroonlijst
  (+29,2 tot +29,8 m), vijf boognissen in de traveeën, de attiek tot +34,0 m
  met het driehoekige middenfronton tot +38,0 m, het middenblok erachter tot
  +39,0 m, tien beelden op de attiek (+35,9 tot +37,8 m) en het hoofdbeeld op
  het middenblok (+42 m), op de plaatsen van de pieken in het DSM.
- De vierkante viering op +31,0 m met een balustrade tot +32,3 m.
- De drie armen met halfronde apsissen (straal 7,2 en 7,3 m): west en oost met
  goten op +28,2 m, het koor in het noorden met goten op +26,5 m, alle met een
  nok op +30,5 m die over de apsis als halve kegel afloopt, en drie
  rondboogvensters als nis in elke apsis.
- De trommel met een kern van 11,0 m straal tot +45,0 m, zestien steunberen
  (de gekoppelde zuilen, tot 12,7 m uit het hart, met een schuine kap) en
  zestien vensters als nis ertussen; de koepel naar het radiale DSM-profiel
  tot +58,7 m met zestien ribben (0,5 m boven het koepelvlak, in lijn met de
  steunberen) en zestien dakkapellen tussen de ribben; de lantaarn (4,6 m
  doorsnede) met spits tot +67,0 m. Het kruis op de top (in het DSM +69,8 m)
  is te dun om te printen.

Binnen de contour ligt 83 % van het DSM boven NAP +8 m binnen 2 m van het
model (mediaan 0,5 m); de PDOK-reconstructie, die uit hetzelfde AHN is
afgeleid, volgt het DSM per cel nauwer (mediaan 0,1 m) maar heeft geen
zuilen, beelden, balustrades, steunberen, ribben, dakkapellen of vensters.
Mapbox Standard heeft voor deze basiliek geen landmarkmodel.

Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
staan recht op of worden naar boven toe smaller; de nissen hebben een boog
tot 40 graden met een spitse sluiting van 50 graden en de ribben lopen aan de
voet uit in het koepelvlak. Alleen de kroonlijst van de voorgevel kraagt
0,3 m uit; daardoor vult de export op 1:1000 met de overhangopvulling in
plaats van verticaal, zodat de nissen blijven staan. Het script controleert
dat er verder geen vlak vlakker dan 45 graden naar beneden wijst. De export
van een uitsnede van 160 m op 1:1000 duurt circa 3,5 seconden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Basiliek_van_de_H.H._Agatha_en_Barbara)
(P.J.H. Cuypers en G.J. van Swaay, 1867-1880; verkleinde kopie van de
Sint-Pieter met de voorgevel van de Sint-Jan van Lateranen), PDOK BAG
(contour), PDOK AHN (dsm en dtm 0,5 m via WCS: schip, voorgevel, beelden en
piedestals, viering, armen, apsissen, ringen rond trommel en koepel, het
profiel van koepel en lantaarn, en het maaiveld), de PDOK 3D Basisvoorziening
(LoD2.2, ter vergelijking), foto's op Wikimedia Commons (RCE en anderen) en de
PDOK luchtfoto. Geschat zijn de indeling van de voorgevel, de vorm van de
beelden, het fronton, de vensters, de dakkapellen en de lantaarn; de kleine
koepels op de hoekvolumes, de wijzerplaten en reliëfs en de gevelindeling
binnen de nissen zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
