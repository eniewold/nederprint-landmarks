# Fries Museum (Leeuwarden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `fries-museum.glb` | Catalogusbron in meters: nodes `building:museum` (de nieuwbouw met het grote dak, de doos, de plint, de kolommen en de tussenhal), `building:woonblok-noord` (het woonblok in hetzelfde BAG-pand) en `building:woonblok-plein` (het woonblok aan de noordkant van het plein) |
| `fries-museum-1-1000.stl` | Het hele model op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (77 × 65 × 26 mm) |
| `fries-museum.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, maaiveld, hoofdmaten en bronnen |

Alleen de nieuwbouw aan het Wilhelminaplein (Zaailand), geopend in 2013,
ontwerp Hubert-Jan Henket (Henket & partners, met Gianni Cananiello). De
Kanselarij en het oude museum aan de Turfmarkt liggen zo'n 300 m noordelijker
en horen niet bij dit model.

De GLB is in meters met de oorsprong op RD (182223,8, 579283,8), het hart van
de museumdoos (BAG-contour), op het maaiveld van het plein (NAP +1,95 m), en de
glTF-conventie Y omhoog. +X loopt langs de noord- en zuidgevel naar het oosten
(-6,85 graden vanaf de RD-X-as, uit de randen van de BAG-contour) en +Y
loodrecht daarop naar het noorden. De westgevel aan het plein ligt op u -28,2 m.
Het maaiveld wordt op zes punten bemonsterd (`groundSamplePoints`): op het
plein, in de straten ten noorden en zuiden en in de doorgang aan de oostkant
(AHN NAP +1,75 tot +2,1 m). `groundHeight` is 43,04 m, de laagste
PDOK-terreinhoogte (ellipsoïdisch) op die punten, zodat een uitsnede die alleen
het plein of het dak raakt het model niet laat wegvallen.

Vervangt de PDOK-reconstructie van drie panden:

- `NL.IMBAG.Pand.0080100010076276`: het museum met de tussenhal en het
  woonblok aan de noordkant (één BAG-pand).
- `NL.IMBAG.Pand.0080100000376229`: de ondergrondse parkeergarage onder plein
  en museum. PDOK reconstrueert haar met alles wat erboven staat, ook het
  museumdak tot op het maaiveld; boven de grond is er verder niets van te zien
  dan het museum en de woonblokken, die in dit model zitten (en een lage
  vlek van 3,4 m op het plein, de parasols van de terrassen).
- `NL.IMBAG.Pand.0080100010076275`: het woonblok aan de noordkant van het
  plein. PDOK trekt de oosthoek op tot het museumdak (+22 m) terwijl het AHN
  daar +13,55 m meet; daarom als eenvoudig blok meegemodelleerd.

Onderdelen (hoogtes boven het maaiveld; uit het AHN-DSM tenzij anders vermeld):

- Het dak: één vlakke plaat van 76,5 bij 53,3 m, bovenkant +22,55 m (NAP
  +24,5 m), 1,5 m dik (onderkant +21,05 m). Het kraagt 14 m over het plein
  uit, 10 m naar het noorden over de tussenhal en het woonblok, 3,3 m naar het
  zuiden en 6 m over de doorgang aan de oostkant.
- Lichtsleuven in het dak: twee rijen van 1,5 m aan de noordkant met
  dwarsbalken om de 8,4 m (in het model 1 m diepe sleuven, zie
  printbaarheid), een open sleuf van 1,6 m langs de noordgevel boven de
  tussenhal en een open sleuf van 6 m breed boven de doorgang aan de oostkant
  met twee dwarsbalken, waar de oostrand van het dak als een smalle lijst
  (1,6 m) langs het buurpand loopt.
- Op het dak: de grote lichtkap (23,5 bij 14,3 m) met een flauw zadeldak
  (goot +24,75 m, nok +25,75 m langs de lengteas), een installatieblok
  (+23,75 m), een schacht (+25,55 m) en een verlaagd installatievlak (+21,5 m).
- De dichte doos (donkere platen) op de BAG-contour, 56,5 bij 39,6 m, van
  +5,3 tot +16,5 m (uit foto's), met de getrapte glaspui van de trappenhal in
  de westgevel als nis van 0,35 m: de onderrand op +6,9 m in het noorden, schuin
  omhoog naar +11,8 m en zo tot de zuidhoek. Langs de oostgevel een verhoogde
  rand tot +18,15 m (NAP +20,1 m).
- De glazen bovenverdieping tussen de doos en het dak, 1,5 m teruggezet, met
  een ronde noordwesthoek (straal 5 m).
- De glazen plint, aan de plein- en de zuidzijde 2 m teruggezet onder de doos,
  met zes witte kolommen (0,9 m) onder de rand van de doos.
- Vier houten kolommen (0,9 m dik) van het maaiveld tot het dak aan de
  pleinzijde, om de 12 tot 14,5 m.
- De glazen tussenhal tussen het museum en het woonblok (BAG), dak +9,0 m.
- Woonblok noord (zelfde BAG-pand): +14,85 m, met lagere delen (+11,85 m) in de
  noordwesthoek en langs de noordgevel; het zuidelijke deel ligt onder het
  museumdak.
- Woonblok aan het plein (BAG 0080100010076275): +13,55 m, met een lagere rand
  (+10,65 m) langs de noord-, west- en oostgevel en twee trappenhuizen
  (+14,75 m).

Weggelaten: de letters FRIES MUSEUM en de gevelplaten (vlak), de lamellen en
het glas in de sleuven, de lage daklichten en glasstroken op het dak (0,5 tot
0,8 m hoog in het AHN), de gebogen glaswand van de plint, de draaideuren, en
het gevelreliëf, de balkons en de dakkapellen van de twee woonblokken
(buurpanden, als eenvoudig blok).

Pasvorm op het AHN-DSM (0,5 m, bovenkant van het model per cel van 1 m binnen
de voetafdruk): 69 % binnen 1 m en 74 % binnen 2 m; zonder de buitenste 4 m
van de dakrand 81 % en 86 %. De rand van de dakplaat is in het AHN ruizig
(waarden van NAP +15 tot +24 m over een strook van 3,5 tot 4,5 m): de foto's
tonen daar een dichte plaat met een dunne witte rand en een houten
onderzijde, dus de plaat loopt vlak door tot de rand.

Printbaar op 1:1000: alleen de dakplaat en de onderkant van de doos hangen
over; de export vult daaronder onder 45 graden op (printcontrole: museum
+17,1 % volume, de woonblokken 0 %, status NoError). Onder de uitkraging aan
het plein ontstaat een wig tot circa 10 m boven het maaiveld, waaronder de
houten kolommen als staafjes van 0,9 mm overblijven. De lijst langs de
oostrand van het dak krijgt een smalle steunwand tot de grondplaat, vlak
tegen het buurpand; de doorgang zelf blijft open. De twee rijen sleuven aan de
noordkant zijn 1 m diep in plaats van open, omdat de smalle balken ertussen
boven de open ruimte naast de tussenhal anders elk een steunwand tot de
grondplaat zouden krijgen. Alle nodes zijn gesloten manifolds.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Fries_Museum), PDOK BAG
(de drie panden), PDOK AHN (dsm en dtm 0,5 m via WCS), de PDOK luchtfoto en
foto's van de westgevel op Wikimedia Commons. Geschat: de onder- en bovenkant
van de doos (+5,3 en +16,5 m), de dikte van de dakplaat (1,5 m, de minimale
plaatdikte), de terugsprongen van de plint (2 m) en de bovenverdieping
(1,5 m), de glaspui, de straal van de ronde hoek, de plaats van de houten
kolommen (dikte 0,9 m in plaats van circa 0,6 m) en de witte kolommen, en de
hoogte van de tussenhal (uit een doorkijk door de sleuf). Van de noord-, oost-
en zuidgevel waren alleen de luchtfoto en het AHN beschikbaar.
