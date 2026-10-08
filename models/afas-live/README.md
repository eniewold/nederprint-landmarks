# AFAS Live (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `afas-live.glb` | Catalogusbron in meters: node `building:complex` (westelijk pand met de hoge zaal, oostvleugel met installatieblok en platform, de verbinding boven de spleet, de buitentrap en de vakwerkgevel in de noordhoek, met alle daktechniek) |
| `afas-live-1-1000.stl` | Het complex op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (133 × 131 × 25 mm) |
| `afas-live.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (124803,00, 480487,50), de
zuidwesthoek van het complex, op het maaiveld (NAP −3,3 m), en de
glTF-conventie Y omhoog. +X loopt langs de zuidzijde naar het noordoosten (28,5
graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noordwesten, langs de
westgevel. Het maaiveld wordt op vier punten langs de kade en op het plein
bemonsterd (`groundSamplePoints`, NAP −3,3 tot −2,9 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0363100012123240` (zaal en achterdeel) en
`NL.IMBAG.Pand.0363100012100092` (oostvleugel).

Hoofdmassa's (hoogtes boven het maaiveld, uit het AHN-DSM op 0,25 m, herberekend
uit de 0,5 m van de WCS, en afgesneden op de BAG-contouren):

- Het westelijke pand (62 bij 131 m, trapezium met een schuine noordrand): het
  achterdek op +16,3 m, de lage voorstrook langs de zuidgevel (v < 19 m) op
  +11 m, de hoge zaal (u 8,4 tot 58,8 m, v 19 tot 43,5 m) op +23,6 m (het DSM
  laat een welving van 0,3 m zien, die is vlak gelaten) en het blok erachter
  (u 8 tot 59,2 m, v 43,5 tot 82,7 m) op +19,7 m. Het hoogteverschil van 3,9 m
  tussen zaal en blok is de scheiding tussen de twee grote daken; de donkere
  band op de luchtfoto is de schaduw van die wand, geen spleet.
- De oostvleugel: het installatieblok op +18 m (u 62,4 tot 84,4 m, v 0 tot
  70,2 m, met een westrand die op u 62,4, 65,2 en 66 m springt) en het platform
  op +19,55 m ten oosten van u = 84,4 m op de contour van het tweede pand.
- De spleet tussen beide panden (u 59,2 tot 62,4 m, 3,2 m breed) is bij v < 39 m
  open tot het maaiveld. Daarboven ligt de verbinding als plaat van 1,5 m dik
  met de bovenkant op +7,3 m (het DSM is er over 47 m vlak op +7,3 m), die aan
  de zaal, het blok en het achterdek hangt en tot de noordoostgevel loopt; de
  ruimte eronder blijft open (de export vult die op). Een trapsgewijze strook
  (v 43,5 tot 68,5 m, wig tot +9,4 m) sluit de verbinding aan op het
  installatieblok.

Daktechniek en details, alles als blokken, balken en cilinders van minstens
1 m (alleen de dakramen zijn 0,7 m hoog):

- Dakramen: 6 op de zaal en 14 op het blok (u 10 tot 57 m), 2,0 bij 2,6 m en
  0,7 m hoog. In het DSM zijn ze 1,5 bij 2,5 m en 0,3 tot 0,8 m hoog; de maat
  is opgerekt zodat ze printbaar blijven.
- Voorstrook (+11 m): het technieklokaal (u 8,1 tot 19,2 m, v 9 tot 16,6 m,
  3,6 m hoog), een kast van 2,2 m tegen de zaal en twee kasten van 2,4 m
  (u 47,7 tot 55,5 m), een kast van 2,2 m bij u 21,5 tot 27,5 m en een kanaal
  van 1,3 bij 1,0 m in een C eromheen. Een opstaande dakrand van 1,0 m breed en
  0,8 m hoog loopt langs de zuidgevel.
- Achterdek (+16,3 m): de opstaande dakrand langs de kade, 1,2 m breed en 1,6 m
  boven het dek (+17,9 m, AHN), over 74 m; uit het DSM drie kasten (1,1 tot
  1,3 m hoog), een ronde ventilatiekap en een gebogen kanaal; en de installatie
  uit 2023: acht kanalen van 1,3 tot 2,0 m breed en 1,0 tot 1,4 m hoog
  (waaronder één van 77 m langs de westrand en de lus om de luchtbehandeling),
  de luchtbehandelingskast van 5,3 bij 3,8 m en 2,2 m hoog en twee kleinere
  kasten.
- Installatieblok (+18 m): twee ventilatorunits (u 72,5 tot 75,1 m en 78,4 tot
  80,8 m, v 13,8 tot 17,5 m, 2,2 m hoog) en 37 kanalen en kasten van 1,0 tot
  2,4 m hoog, in rijen langs de lengte van het blok, op 0,25 m uit het DSM
  afgelezen. Langs de zuidgevel loopt een dakrand van 1,4 m hoog.
- Platform (+19,55 m): drie ronde lichtkoepels, diameter 7,0, 5,0 en 3,4 m en
  1,05, 0,95 en 0,85 m hoog (cilinder met een versmalde kap; AHN: 0,8, 0,7 en
  0,6 m), een luik van 3,5 bij 2,5 m en 1,4 m hoog, en een dakrand van 1,0 bij
  0,5 m langs de zuidgevel.
- Buitentrap: een helling tegen de westwand van het installatieblok (u 62,4 tot
  66 m, v 0,8 tot 7,8 m) van +2,2 m naar +9,4 m.
- Noordhoek langs de kade: een dakplaat op +10,7 m (1,5 m dik, op twee palen,
  met de opening naar het maaiveld die het DSM laat zien) tegen de noordwand van
  het installatieblok; langs de noordoostgevel een loopbrug van 3,5 m breed op
  +10 tot +11,5 m; en de stalen vakwerkgevel: een ligger van 1,2 bij 1,2 m op
  +16,7 tot +17,9 m (de voortzetting van de dakrand van het achterdek), drie
  kolommen van 1,2 m tot het maaiveld (op u 69,8, 77,3 en 83,4 m) en drie
  schoren van 1,1 m dik (46, 63 en 67 graden met het horizontale vlak).

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m):
91,5 % ligt binnen 1 m en 97,0 % binnen 2 m (de vorige versie: 91,3 % en
94,9 % op hetzelfde raster). Wat nog meer dan 1 m afwijkt zit vrijwel
helemaal in de randcellen langs de gevels, waar het DSM op 0,5 m is
uitgesmeerd, en in de installatie uit 2023 op het achterdek, die nog niet in
het AHN staat (zichtbaar in de luchtfoto's vanaf 2023, niet in die van 2021 en
2022). De kanalen daarvan zijn met de luchtfoto van 2026 gemeten; de
reliefverplaatsing van die foto is voor het achterdek op circa 1 m naar
het zuiden geschat en eruit gehaald.

Printbaar op 1:1000: de export vult 0,38 % bij (193,3 cm³ voor en 194,1 cm³ na),
0,54 % op 1:1500 en 1,20 % op 1:2500; de opvulling zit alleen onder de
verbinding, de loopbrug, de dakplaat en de schoren in de noordhoek. Het script
laat daar 76 driehoeken onder 45 graden toe (functie `OVERHANG_OK`, alleen
voor u 58,5 tot 86 m en v 37 tot 90 m, boven +1 m) en slaagt zonder
`--allow-overhang`. Het model is één samenhangend deel (genus 10, 3628 driehoeken);
de kleinste delen zijn de kanalen van 1,0 m breed en de dakramen van 0,7 m hoog.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/AFAS_Live), PDOK BAG (de twee panden), PDOK AHN (dsm en dtm 0,25 m via WCS, uit 0,5 m herberekend) en de
PDOK luchtfoto (2026, met 2021 tot 2025 ter controle van de leeftijd van de
installaties). Geschat zijn de hoogtes van de dakramen en kanalen (het DSM
heeft ze lager en breder), de breedte van de kanalen op het achterdek (uit de
luchtfoto), de loopbrug en de dakplaat (het DSM geeft 9 tot 13 m op een open
frame), de hoogte van de kolommen en schoren van de vakwerkgevel, de dakranden
langs de zuidgevels (het DSM geeft daar 0,5 tot 1,7 m op een randcel) en de
wig van de trap. Weggelaten: de gevelreliëfs, de leuningen en palen langs de
dakrand, de dunne leidingen, de zonnepanelen op het platform en de dakrand rond
de zaal en het blok (die is in het DSM niet te zien).
