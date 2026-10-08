# Magere Brug (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `magere-brug.glb` | Catalogusbron in meters: nodes `road:fietspad`, `road:fietspad-klep` (met BGT-attributen), `building:brug`, `building:ophaalbrug` |
| `magere-brug-1-300.stl` | Brug met portalen en balansen in één stuk op 1:300, met de onderkant van de pijlers op het printbed (247 × 33 × 40 mm) |
| `magere-brug.json` | Catalogusitem met RD-georeferentie, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van de brug (tussen de
kleppen) op de waterspiegel van de Amstel (NAP -0,4 m) en de glTF-conventie Y
omhoog; de STL ligt 0,8 m hoger, zodat de onderkant van de onderbouw op z = 0
staat. +X loopt langs de brug naar de oostoever bij de Nieuwe Kerkstraat
(RD-richting (0,957, 0,289), azimut 73,25 graden), +Y stroomafwaarts naar het
noordnoordwesten. Net als bij de Koornbrug ligt z = 0 op het water en is
`groundOffsetMetres` 0; het maaiveld wordt op zes punten op het water naast de
brug bemonsterd (`groundSamplePoints`), niet op de kades (NAP +1,6 m). De brug
is geen BAG-pand, dus `replacesBuildings` blijft leeg.

Het model is vereenvoudigd zodat het op 1:1000 zonder losse steunconstructie
print. De export vult alles op wat vlakker hangt dan de ingestelde overhang
(standaard 45 graden) en laat delen smaller dan 0,8 mm niet dragen;
op 1:1000 is dat 0,8 m op ware grootte.
Daarom zijn de doorvaarten blind, ontbreken de leuningen, zijn staanders en
stangen minstens 0,9 m dik en is elk paar balansen één dichte plaat.
Printcheck op 1:1000 (uitsnede 104 mm): alle onderdelen NoError, de opvulling
gaat geheel naar de constructie (`building:brug` +10,1 %, 2416 → 2660 mm³;
fietspad, fietspad-klep en ophaalbrug 0 %), samen 3211 mm³, in 1,0 s.

Onderdelen in het model (hoogtes boven de waterspiegel):

- Dek van 74 × 10 m volgens de BGT, met een looplaag die volgens het AHN van
  2,2 m aan de kades oploopt tot 3,3 m op de middenpijlers en 3,8 m in het
  midden van de kleppen (0,1 m opgetild, zodat hij boven de PDOK-reconstructie
  blijft).
- Wegdek met PDOK-attributen: de bovenste 0,5 m van het dek, uitgesneden met
  een strook van 0,5 m onder tot 1 m boven het wegdek over dezelfde
  loftstations als de looplaag. De BGT heeft op de brug alleen fietspad
  (`relatieve_hoogteligging` 1, zonder `plus_fysiek_voorkomen`):
  - `road:fietspad` (`bgt_functie` fietspad, `bgt_fysiekvoorkomen` open
    verharding): de vaste delen, BGT-wegdelen
    `G0363.2e7d4263001c4b0f99f56542d0f264fb` (west) en
    `G0363.4f373ba742624507a7fc7c680027d98f` (oost). De dekranden van 0,5 m
    buiten die vlakken (waar de leuningen staan) horen er ook bij.
  - `road:fietspad-klep` (`bgt_functie` fietspad, `bgt_fysiekvoorkomen`
    gesloten verharding): de kleppen en de doorgang door de portalen tot
    x = ±5,6 m, BGT-wegdeel `G0363.dc5ccd30dd254a56b67b708b8f9bfbba`. De
    beweegbare kleppen krijgen zo hetzelfde wegdek als de vaste delen: de
    strook loopt over de kleppen door en wat er van de klep (0,6 m dik)
    onder overblijft, 0,1 m, hoort bij `building:ophaalbrug`. De lange randen
    van het BGT-vlak liggen op de rand van de klep, de dwarsranden op
    x = ±4,98 m.

  De staanders van de portalen, de hangstangen en de steunen steken door het
  wegdek en blijven met 2 cm vrij constructie. `building:brug` is de vaste
  brug onder het wegdek, `building:ophaalbrug` de kleppen onder het wegdek
  met het mechanisme hieronder. Samen vormen de vier onderdelen precies de
  brug als geheel (2664,0 m³, geen overlap); de STL is ongewijzigd.
- Dichte onderbouw tot 0,8 m onder water met acht blinde segmentbogen van
  0,4 m diep in beide gevels: per zijde vier vaste overspanningen van 6,5 m
  tussen de pijlers van 1,5 m (de buitenste 6 m tot een eindwand van 0,5 m),
  kruin 0,9 m onder het dek en pijl 0,6 m. Onder de 4,9 m brede kleppen
  springt de onderbouw 0,6 m terug als schaduwlijn van de doorvaart van 10 m.
- Twee portalen (galgen) op de middenpijlers: 6,9 m breed, 1 m diep, met
  staanders van 1 × 1 m en een opening over het looppad als rondboog met een
  spitse top van 50 graden (zelfdragend), kap tot 9,8 m.
- Per portaal één balansplaat van 6,1 × 12 m en 0,6 m dik, die met 1:6,7 naar
  het midden oploopt tot 11,2 m, met een ballastkist van 2,8 × 6,2 × 1,1 m
  achteraan, twee hangstangen van 0,9 m naar de voorkant van de klep en twee
  steunen van 0,9 m onder het achtereinde. Die steunen bestaan in werkelijkheid
  niet (de balansen hangen daar vrij), maar zonder steun zou de export de
  uitkraging van 6,7 m tot het dek opvullen.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Magere_Brug),
[Rijksmonumentenregister 518383](https://monumentenregister.cultureelerfgoed.nl/monumenten/518383)
(brug 242, huidige brug 1929-1934, stalen liggers op een betonnen paalfundering),
PDOK BGT (`overbruggingsdeel`: dek, kleppen en pijlers; `wegdeel`: de
fietspaden op het dek), PDOK AHN (dsm 0,5 m
via WCS: dekhoogtes, portalen, balansen en ballastkisten, in een stelsel langs
de brug) en Wikimedia Commons-foto's (`Magere Brug.jpg`,
`Amsterdam, brug 242, Magere Brug 2007.jpg`, `Magere brug 2010 08 28.jpg`)
voor de opstand. Plattegrond, pijlers, kleppen en dekhoogtes komen uit BGT en
AHN; de hoogte van de portalen en het verloop van de balansen uit het AHN; de
boogvorm en de afmetingen van staanders, balken en ballastkisten
zijn uit foto's geschat. De leuningen, de stalen schoren en trekstangen, de
verlichting en het remmingwerk rond de doorvaart zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
