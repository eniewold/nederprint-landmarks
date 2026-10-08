# Piraña (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-pirana.glb` | Catalogusbron in meters: nodes `building:station` (het tempelcomplex met de ronde hal, het poortgebouw, het liftblok en de tunnelvleugel), `building:huisjes` (de twee themahuisjes op het plein), `building:beelden` (de Tolteekse krijgers en de kwijlbeelden), `building:rotsen` (de kunstrots), `building:rivier` (de kademuren langs de stroombedding) en `building:brug` (de brug over de Karpervijver) |
| `efteling-pirana-1-1000.stl` | Het model op 1:1000 met de onderkant (NAP +6,4 m) op het printbed (230 × 123 × 14 mm) |
| `efteling-pirana.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-pirana.mjs`](../../scripts/generate-efteling-pirana.mjs)
(gedeelde hulpfuncties in `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131592,1, 406524,68), het
middelpunt van de ronde hal (cirkelfit op de BAG-boog, straal 13,14 m), met
z = 0 op het plein (NAP +9,97 m), en de glTF-conventie Y omhoog. +X loopt
langs de tunnelvleugel naar het oost-zuidoosten (RD-richting
(0,77162, -0,63608), 39,5 graden met de klok mee vanaf de RD-X-as), +Y naar
het plein en de Kanovijver. Het blok aan het plein staat 56,25 graden
gedraaid op dat stelsel. Het maaiveld wordt op vier punten bemonsterd
(`groundSamplePoints`: het bovenplein voor de poort en de noordwesthoek en het
terras ten zuiden van de hal, PDOK-maaiveld NAP +9,97 tot +10,13 m), niet op
het lagere voorplein (+9,05 m) of het water. `groundOffsetMetres` is 0.
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0809100000017607` (het
station, 1981), `NL.IMBAG.Pand.0809100000017604` (1971) en
`NL.IMBAG.Pand.0809100000017605` (1978); de twee kleine panden op het plein
zijn volgens Eftepedia het themahuisje met de transformatoren en het lage
decorhuisje bij de wachtrij.

Onderdelen (hoogtes in NAP; plein +9,97 m):

- Station, daken per zone uit het AHN-DSM (raster per 0,5 m in het lokale
  stelsel en in het stelsel van het pleinblok), afgesneden op de BAG-contour:
  de ronde hal met de draaischijf en het aansluitende blok +17,4 m (één dak
  met borstwering, getrapte Chan Chan-kantelen op de trommel, negen lisenen
  en trapeziumvensters), het poortgebouw aan het plein +19,3 m met de grote
  trapeziumvormige uitgang en het Quetzalcoatl-paneel erboven, het liftblok
  +15,2 m binnen borstweringen van +17,7 m met twee torens van +18,6 m, de
  strook langs de rotskloof +14,3 m, de noordwesthoek +12,2 m, het
  noordoostblok en de uitbouw naar de brug +14,0 m, de tunnelvleugel langs de
  Kanovijver +13,8 m met toren A (+18,4 m), het binnenplaatsblok met twee
  torens (+17,5 m) en getrapte muren, en de tunnelmond met twee torens
  (+17,3 m), het kijkbalkon en de trapeziumvormige tunnelopening vanaf het
  water (+9,6 m). Trapeziumnissen (0,35 m diep) langs de noordgevel en de
  westgevel aan de kloof.
- Themahuisjes: adobeblokken op de BAG-contour (+12,4 en +11,8 m) met
  borstwering, getrapte kantelen en een trapeziumdeur.
- Beelden: de twee Tolteekse krijgers op het plein (voetstuk, romp met
  borstplaat, hoofd en vederkroon, top +15,8 m) en de twee kwijlbeelden op het
  rotseiland in het brede deel van de lus (voet, gezichtsplaat met neus,
  halfronde zonnekroon, 0,9 m dik).
- Rotsen: 26 facetblokken op de roodbruine kunstrots van de luchtfoto, de top
  uit het 85e percentiel van het AHN-DSM (+10,5 tot +16,6 m): de hoge waterval
  op de zuidwesthoek van het opslagbassin, de rotsen in de bocht ten zuiden van
  het bassin, de rotskloof langs de westgevel van het station, de rotsen bij
  het bruggetje en op de oever, en het rotseiland onder de kwijlbeelden.
- Rivier: kademuren van 0,9 m dik op de oeverlijn van het PDOK-water van de
  baan (de lus om het Piraña-eiland, de kloof, de bocht langs de waterval, de
  goot om het opslagbassin met de scheidingsmuur), de bovenkant het hoogste
  PDOK-maaiveld 1 tot 2,5 m buiten de oever plus 0,3 m (minimaal +8,3,
  maximaal +12,2 m). Het water zelf zit in het PDOK-terrein (NAP +6,9 m, voor
  de hele baan één peil) en niet in het model.
- Brug: de houten brug van de uitbouw van het station over de goot en de
  Karpervijver naar de zuidoever (BGT-overbruggingsdeel, 51 m, 2,6 m breed),
  dek van +13,7 naar +9,6 m (AHN-DSM), schragen om de 6 m die naar onderen
  uitwaaieren, met schoren onder 45 graden, en een landhoofd.

Alle onderdelen beginnen op NAP +6,4 m, een halve meter onder het PDOK-water.

Printbaar op 1:1000 en 1:500: de export vult bij de gebouwen vrijwel niets op
(station 0,02 %, huisjes 0,02 %, beelden 0,00 en 0,02 %, rotsen en kademuren
0,00 %). Alleen de brug krijgt onder het dek tussen de schragen de standaard
wig en steunwand (+58 % op 1:1000, +32 % op 1:500). De STL is 20,5 cm³ op
1:1000.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Pira%C3%B1a_(Efteling)),
[Eftepedia](https://www.eftepedia.nl/lemma/Pira%C3%B1a) (ritverloop,
draaischijf van 18 m, tunnel van 65 m, krijgers, kwijlbeelden,
themahuisjes), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Pira%C3%B1a),
PDOK BAG (de drie panden), PDOK BGT (overbruggingsdeel), het PDOK
3D-terrein (water van de baan en het maaiveld langs de oevers), PDOK AHN
(dsm 0,5 m via WCS: dakhoogtes, torens, rotsen, brugdek) en de PDOK
luchtfoto (kunstrots, rotseiland, de krijgers via hun schaduw). Geschat uit
foto's: de kantelvorm, aantal en maat van lisenen en nissen, vorm en maat van
de krijgers en kwijlbeelden, de rotsvormen (vlakken op de luchtfotocontour),
de schragen van de brug en de hoogte van de kademuren. Weggelaten: de
houten loopbruggen tegen de gevel, het bruggetje over de rotskloof en de
rotsbogen erover, de waterval in de eerste bocht (onder de bomen), de tonnen,
de golfslagrotsen, de Quetzalcoatl in het water, het kwijlbeeldpaar aan het
einde van de baan (plaats onzeker) en de wachtrij met de schuildakjes.
