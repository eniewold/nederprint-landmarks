# AFAS Stadion (Alkmaar)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `afas-stadion.glb` | Catalogusbron in meters: node `building:stadion` (afgeronde tribunering met het doorlopende dak, de hoofdtribune met de megatruss en twintig kraanspanten) |
| `afas-stadion-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (191 × 154 × 41 mm) |
| `afas-stadion.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (111304,05, 514113,22), in het hart
van de veldopening op het maaiveld (NAP -0,26 m), en de glTF-conventie Y
omhoog. +X loopt langs de lengteas van het veld naar het zuidoosten
(−45,12 graden vanaf de RD-X-as) en +Y dwars daarop naar het noordoosten; de
hoofdtribune ligt aan de −Y-kant, in het zuidwesten. Het maaiveld wordt op
vier punten op de parkeerplaats rond het stadion bemonsterd
(`groundSamplePoints`, NAP −0,3 tot −0,5 m). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0361100000106554` (het stadion) en
`NL.IMBAG.Pand.0361100000206467`.

Waarom een tweede versie: het AHN-DSM is van 2020, toen de dakken van de drie
andere tribunes al waren gesloopt (de PDOK-luchtfoto van 2020 laat de rode
zitplaatsen zien) en alleen de hoofdtribune nog het oude, lagere dak had. Het
eerste model volgde dat DSM en gaf daardoor drie lage zijden (+14 tot +16 m)
tegenover een hoofdtribune van +27 m, en nog de vier lichtmasten. Sinds het
nieuwe dak van ZJA (2020 tot 2021, na de instorting van 2019) loopt er één dak
rondom het hele stadion, ongeveer even hoog aan alle zijden, en zijn de
lichtmasten vervangen door ledverlichting in de dakrand. De PDOK-3D-
reconstructie en het AHN zijn van voor dat dak, dus de plattegrond komt nu uit
de luchtfoto's (2021 tot 2026, 8 cm) en de hoogtes uit de schaduwen daarop,
geijkt op de bouwcijfers.

Opbouw (hoogtes boven het maaiveld, NAP -0,26 m). Rang en dak zijn gebouwd uit
vlakke stroken en blokken (rang 96 stralen, dak 192 stralen van 1,9 graden),
dus zonder hoogteveld:

- De rang (blijft zichtbaar onder het dak): aan de noordoostkant en de twee
  koppen de gemeten ring uit het AHN, van +1,5 m aan de veldkant naar +13,6 tot
  +16 m aan de achterrand (helling 0,55 tot 0,75 m per meter); veldopening 138
  bij 94 m. Aan de hoofdtribune zag het AHN alleen de binnenrand (onder het
  oude dak); daar loopt de rang door met helling 0,55 tot de achtergevel
  (+19 tot +21,6 m, geschat).
- Het dak: een plaat van 2,5 m dik tussen een binnenrand (afgeronde rechthoek
  van 130 bij 78 m: noordoostrand op v = 43,6 m, koppen op u = -66 en 63,5 m,
  voorrand van de hoofdtribune op v = -34 m) en een buitenrand (181 bij
  150 m, afgeronde hoeken en de inspringende hoeken bij de uiteinden van de
  megatruss), beide afgelezen op de luchtfoto van 2026 op 0,5 m. Het dak is
  25 tot 30 m diep boven de noordoostkant en de koppen en 45 m boven de
  hoofdtribune. Over de noordoostkant en de koppen loopt de bovenkant van
  +27,5 m aan de veldkant naar +23,0 m aan de dakgoot op de buitenrand; boven de
  hoofdtribune ligt hij op +27,0 m aan de voorrand en stijgt hij naar +29,0 m
  aan de achterkant, met een overgang over de hoeken. Tussen rang en dakplaat
  is open ruimte van 4,5 tot 7 m aan de achterrand (noordoost en koppen) en
  van circa 23 m aan de veldkant.
- Twintig kraanspanten (acht aan de noordoostkant, vier aan elke kop en twee
  aan elke hoek): een mast van 2,4 m vanaf het maaiveld net buiten de dakrand
  tot +30,0 m (voet 1 m en top 3 m buiten de rand), een lip van het dak van
  3,5 m breed en 5,5 m diep eraan, een voet van 3 m breed naar de rang zodat
  alles één stuk blijft, en een schoor van 1,2 m dik van de mastkop schuin naar
  beneden (circa 38 m) tot op de binnenrand van het dak.
- De hoofdtribune in het zuidwesten (hoek 207,5 tot 332,5 graden): een gesloten
  achtergevel van 2,5 m dik van het maaiveld tot in de dakplaat langs de
  buitenrand, de megatruss als boog van 3 m breed en 3 m dik langs de voorrand
  (170 m lang, 34 rechte stukken van 5 m, top op +40,5 m, voeten in het dak) en
  twee voetstukken van 5 bij 10 m op de grond onder de uiteinden van de truss.
- Verwijderd: de vier lichtmasten op de binnenhoeken.

Hoe de hoogtes zijn afgeleid: op de luchtfoto van 2026 staat de zon precies in
het zuiden (de schaduw van een lantaarnpaal loopt recht naar het noorden).
De schaduwlengte op vlak terrein is hoogte gedeeld door de tangens van de
zonshoogte, en dat geeft de verhoudingen van de hoogtes boven de grond:
dakrand aan de noordkant en de koppen 1,0, voorrand van de hoofdtribune 1,19,
top van de megatruss 1,79 en de binnenrand van de zuidoostkop 1,2 (de
verhoudingen voorrand/dakrand en boog/voorrand zijn gemeten op vijf
jaargangen met zeer verschillende zonshoogtes en komen steeds uit op 1,15 tot
1,26 en 1,5 tot 1,6). De schaal komt uit de bouwcijfers: de truss heeft zijn
hoogste punt 40 m boven het veld (ZJA, stadiumdb, Wikipedia); dat past op een
zonshoogte van circa 40 graden (tangens 0,86) op de luchtfoto van 2026. De
masten staan op +30 m volgens de bouwcijfers; de schaduw van de masttoppen is
te rommelig om daar op af te lezen. De schaduw van het model (zon uit het
zuiden, tangens 0,86) valt op de luchtfoto van 2026 binnen circa 3 m samen met
de schaduwranden op het veld (voorrand van de hoofdtribune, de top van de boog
en de oostelijke rand) en ten noorden en ten westen van het stadion.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 m, cellen boven 3 m):
de rang alleen (zonder dak) ligt aan de drie zijden op 82,7 % binnen 1 m en
94,7 % binnen 2 m (het eerste model: 82,4 % en 94,4 %), op de hoofdtribune
na. Het dak zelf is niet met het AHN te vergelijken, want dat is ouder; op de
strook van het oude dak van de hoofdtribune (v = -57 tot -76 m) ligt 40,8 %
binnen 1 m en 69,0 % binnen 2 m, met het nieuwe dak gemiddeld 1,9 m hoger dan
het oude, zoals de bouwberichten vermelden (hoger en 4 m verder het stadion in).

Printbaar op 1:1000: de rang, de masten, de gevel en de voeten staan zonder
ondervlakken onder 45 graden; het script slaagt zonder `--allow-overhang`
omdat de bedoelde ondervlakken van het dak, de lippen, de schoren en de boog
(boven +19,5 m, `OVERHANG_OK`) zijn toegestaan. De export vult daaronder laag
voor laag op met een kraag onder 45 graden: op 1:1000 gaat het model van 175,3
naar 302,1 cm³ (+72 %), op 1:1500 van 51,9 naar 89,9 (+73 %) en op 1:2500 van
11,2 naar 19,4 cm³ (+73 %), zonder fout; de opvulling van de hele kom kost op
1:1000 circa 38 seconden. Het model is één samenhangend stuk (`--components`:
één regel `stuk`) met de veldopening als gat. De dunste dragende delen zijn de
schoren (1,2 m) en de masten (2,4 m); de dakplaat is 2,5 m dik.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/AFAS_Stadion) (19.500
plaatsen, dak van 2020 tot 2021), [ZJA](https://www.zja.nl/en/stadion-AZ-Alkmaar)
en [stadiumdb](http://stadiumdb.com/news/2021/03/alkmaar_symbolic_day_mega_truss_in_position)
(truss van 170 m en 600 ton met zijn hoogste punt 40 m boven het veld, kraanspanten
met 30 m uitkraging, dak recht en 30 m het stadion in),
[Cobouw](https://www.cobouw.nl/288647/nieuw-dak-op-afas-stadion-vereist-integrale-aanpak)
(22 kraanspanten van 30 m hoog en 9 m breed, truss 19 m hoog en 9 m breed) en
[Beton & Staalbouw](https://betonenstaalbouw.nl/projecten/2-500-ton-staal-voor-nieuw-dak-afas-stadion-in-alkmaar/),
PDOK BAG (de twee panden), PDOK AHN (dsm en dtm 0,5 m via WCS) voor de rang, en
de PDOK luchtfoto's 2020 tot 2026 voor de plattegrond en de schaduwen. Geschat
en onzeker: de absolute hoogtes van het dak (circa 2 à 3 m; de schaal hangt aan
de 40 m van de truss en de zonshoogte die daarbij past; werd de zon hoger
gesteld, dan staan de masten van 30 m beter in verhouding maar komt de boog op
circa 49 m), de helling van het dak aan de noordoostkant en de koppen (de schaduwen op het veld
laten de binnenrand hoger dan de buitenrand zien, zoals bij een dak dat naar de
dakgoot op de buitenrand afwatert; op een foto lijkt het dak
juist naar het veld te dalen, dat verschil is niet opgelost), de rang onder de
hoofdtribune (helling en achterwand), de doorsnede van boog, masten en schoren
(in het echt open vakwerk en kabels, circa 2 m schuin in plaats van de
8 m uit het lood van de luchtfoto) en de vorm van de achtergevel (in het echt
met paneel- en entreegevels). Weggelaten: de dakribben en de zonnepanelen, de
hangers van de boog, de trekstangen langs de dakrand, de translucente stroken
in het dak en de entreegebouwen aan de zuidwestkant.
