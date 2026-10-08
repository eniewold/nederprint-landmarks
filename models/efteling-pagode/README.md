# Pagode (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-pagode.glb` | Catalogusbron in meters: node `building:pagode` (de Thaise tempel in de hoogste stand aan de geknikte arm, met de staart en het tegengewicht) en node `building:machinekuil` (de afdekking van de tegengewichtkuil met de scharnierkap, en het machinehuis) |
| `efteling-pagode-1-1000.stl` | De attractie op 1:1000 met de onderkant (1 m onder het maaiveld) op het printbed (37 × 25 × 51 mm); het machinehuis is een los deel naast de kuil |
| `efteling-pagode.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

Generator: `scripts/generate-efteling-pagode.mjs` (met de gedeelde hulpen
uit `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131685,0, 406905,36), recht onder
het hart van de geheven tempel, op het maaiveld (NAP +10,0 m), en de
glTF-conventie Y omhoog. +X loopt langs de arm van het scharnier naar de
landingskuil aan de Siervijver (oost-zuidoost, 16 graden met de klok mee vanaf
de RD-X-as; de BAG-contouren van de kuil en het machinehuis en de sleuf in
het AHN-DTM liggen precies langs deze as) en +Y loodrecht daarop naar het
noord-noordoosten. Het maaiveld wordt op vier punten aan de zuidzijde van de
kuil en onder de tempel bemonsterd (`groundSamplePoints`, NAP +9,9 tot +10,05
m); het machinehuis aan de noordkant staat 0,5 m lager, daarom ligt de
onderkant op 1 m onder het maaiveld. Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0809100000017641` (de tegengewichtkuil, 25,1 × 6,3 m; het AHN
ziet daar de arm en de geheven tempel) en `NL.IMBAG.Pand.0809100000017642`
(het machinehuis). Het pand `0809100000017644` (1989, 50 m noordoostelijk bij
de Toko Pagode) hoort niet bij de attractie.

Stand: de tempel helemaal omhoog. Zo heeft het AHN hem ingemeten (top van de
spits op NAP +59,6 m), zo staat hij op de luchtfoto (door de hoogte 14 m
naar het zuidwesten verschoven) en zo is hij vanuit het hele park te zien. In
rust staat de tempel in de ronde landingskuil (17 m doorsnede, 29 m
oostelijk) en ligt de arm in een sleuf; dat is van buiten een carrousel in
het groen.

Onderdelen (hoogtes boven het maaiveld):

- De tempel (16,1 m doorsnede): de licht hellende schotel (onderkant +34 m bij
  de arm, rand +35,4 tot +36,55 m), de dichte borstwering van het dek (+36,5
  tot +37,65 m, 0,15 m terug), een vensterband van 0,6 m diep met een dakvoet
  onder 45 graden tot +38,95 m, het ringdak en twintig radiale puntgevels
  (2,45 m breed, top +41,2 m) met elk een hoorn van 1,1 m. In het midden de
  tienhoekige trommel (r 2,3 m) met het eerste puntdak (dakvoet r 3 m op +42,8
  m, klokvormig tot +45,4 m, tien hoorns), de achthoekige tweede trommel met
  het groene dakje (tot +46,55 m, acht hoorns) en de gouden spits met drie
  knoppen en de piek tot +49,7 m.
- De arm: een kokerbalk van 2,4 × 1,6 m vanaf het scharnier in de kuil (x
  -15,5 m, +4 m) onder 55 graden naar de knik op +29,5 m, 2,5 m voorbij het
  hart, en dan onder 72 graden terug naar het midden van de schotel. Achter
  het scharnier de staart (23 graden, naar het westen) met het tegengewicht
  als blok aan het westeinde van de kuil (top circa +10 m, zoals in het AHN).
- De machinekuil: de afdekking op +1,6 m binnen de BAG-contour met de
  scharnierkap tot +4,8 m; het machinehuis met plat dak op +2,2 m (NAP +12,2
  m).

De landingskuil, de Siervijver en de wachtrij zitten in het terrein en zijn
niet gemodelleerd.

Printbaar op 1:1000: de arm loopt overal steiler dan 45 graden, gevels,
hoorns en spits leunen hooguit 35 graden over, dakvoeten en trommeloverstekken
rusten op een kraag van 45 graden. Alleen de schotel onder de tempel (circa 10
graden, zoals in het echt) en de onderkant van de staart hangen vlakker; de
export zet daar een kraag van 45 graden onder, die onder de schotel als
trechter op de arm uitkomt. Daardoor groeit de node `building:pagode` met
28,5 % op 1:1000 en 30,4 % op 1:500 (de machinekuil 0 %); dat is de bedoelde
trechter, geen fout. Op de kaart blijft de platte schotel zichtbaar. De STL is
2,1 cm³; de arm is op 1:1000 2,4 × 1,6 mm, de piek van de spits loopt uit in
een punt.

Bronnen: [Wikipedia (nl)](https://nl.wikipedia.org/wiki/Pagode_(Efteling))
(tempel van 16 m, 45 m hoog, tegengewicht in een kuil van 10 m),
[Wikipedia (en)](https://en.wikipedia.org/wiki/Pagoda_(Efteling)) (arm 225 t,
cabine 155 t, tegengewicht 340 t), efteling.com (blog "Wonder: opstarten
Pagode", 2019), PDOK BAG (de twee panden), PDOK AHN (dsm en dtm 0,5 m via
WCS: hart en hoogte van de geheven tempel, de arm en de staart in de kuil,
afdekking en machinehuis, de sleuf en de landingskuil voor de as), de PDOK
luchtfoto (twintig gevels) en foto's op Wikimedia Commons (Category:Pagode
(Efteling)). Geschat uit foto's: de hoogtes binnen de tempel (dek op +36,5 m,
zodat de spits op de AHN-top uitkomt), de daken en trommels, het aantal
hoorns, de doorsnede van de arm, de plaats van de knik en van het scharnier
(uit de AHN-punten op de arm en de staart). Weggelaten: de leuning (als dichte
borstwering), het siersnijwerk in de gevels, de rode ornamentband op de arm en
de hydraulische cilinders.
