# Teylers Museum (Haarlem)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `teylers-museum.glb` | Catalogusbron in meters: node `building:museum` (Spaarnevleugel met gevel, fronton, beeldengroep en lichtkoepel, Fossielenzalen onder het glazen mansardedak, Ovale Zaal met observatorium, twee schilderijenzalen, uitbreiding van Henket met tuinhuis, Fundatiehuis met binnenplaats) |
| `teylers-museum-1-1000.stl` | Het complex op 1:1000 met de onderkant (0,5 m onder het maaiveld aan het Spaarne) op het printbed (104 × 82 × 23 mm) |
| `teylers-museum.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (104120, 488350), op de as van de
Fossielenzalen bij de Ovale Zaal, op het maaiveld aan het Spaarne (NAP +0,5 m),
en de glTF-conventie Y omhoog. +X loopt naar het noordoosten (45,6 graden tegen
de klok in vanaf de RD-X-as, haaks op de zalen; gemeten aan de evenwijdige
BAG-randen van zalen, Damstraat en steeg) en +Y langs de zalen naar het
noordwesten, naar de Nauwe Appelaarsteeg. De Spaarnegevel staat aan de -Y-kant
maar volgt de kade onder -25,84 graden in dit stelsel (lijnfit op de
BAG-hoekpunten van de gevel); zij is in een eigen gevelstelsel gebouwd. Het
maaiveld wordt op drie punten op de kade voor de gevel bemonsterd
(`groundSamplePoints`, AHN NAP +0,45 tot +0,6 m); `groundHeight` 43,44 is de
laagste PDOK-terreinhoogte daar (ellipsoïdisch), zodat een uitsnede zonder de
kade het model niet laat wegvallen. De Damstraat en de steeg liggen 0,8 m hoger
(NAP +1,3 m); daar steekt de voet dieper in het terrein. Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0392100000065736` (museum, Spaarne 16),
`…037991` (uitbreiding 1996), `…063892` (Fundatiehuis, Damstraat 21),
`…037992` (vleugel en prieel aan de binnenplaats van het Fundatiehuis, zonder
eigen adres) en `…037264` (het tuinhuis).

Onderdelen (hoogtes boven het maaiveld aan het Spaarne, NAP +0,5 m afgetrokken;
alles uit vlakken, prisma's en omwentelingsvormen, geen hoogteveld):

- **Spaarnevleugel** (Christian Ulrich, 1879-1885), gevel van 16,8 m breed in
  drie vensterassen: het middenrisaliet van 7,2 m springt 1,1 m voor, met
  gekoppelde half ingemetselde zuilen (diameter 0,64 m) op sokkels, de portiek
  (nis 2,2 m breed, 0,55 m diep) en de loggia (nis 2,6 m breed) met een spitse
  bovenkant; de zijtraveeën met hoekpilasters en pilasters naast het risaliet
  (0,3 m voor de gevel) en twee rijen vensternissen (1,6 en 1,5 m breed,
  0,35 m diep). Cordonlijst op +5,8 m en hoofdgestel met kroonlijst tot +14,0 m,
  beide op een kraag van 50 graden. Op de zijtraveeën een dichte balustrade tot
  +15,2 m, op de hoeken postamenten met obelisken tot +17,4 m en op de hoeken
  van het risaliet postamenten tot +15,5 m. Het fronton boven het risaliet tot
  +16,5 m; daarachter de sokkel met de beeldengroep (Faam met vleugels tussen
  Kunst en Wetenschap, schematisch als naar boven smaller wordende lichamen met
  een hoofd als dubbele piramide) tot +18,9 m. Achter de gevel het platte dak op
  +14,0 m met de rotonde: een glazen lichtkoepel met 24 ribben als halve
  ellips (straal 4,0 m, top +17,3 m) op een trommel, 7,9 m achter de gevel op
  de as, en een lage lichtkap tot +15,0 m. Naast de gevel lagere stroken
  (garderobe, hoek bij Spaarne 18) tot +8,3 m.
- **Fossielenzalen en Instrumentenzaal** (Van der Steur, 1880-1885): de zaal
  van 12,45 bij 32 m met zinkbeklede gevels tot de goot op +13,2 m, lisenen van
  1,0 m breed en 0,3 m diep om de 4,0 m, hoge vensternissen ertussen en een
  kroonlijst op een kraag. Het glazen dak als mansardevlakken van 58 graden
  naar de knik op +16,95 m (7,7 m breed), daarboven een flauw glazen zadeldak
  met de nok op +17,4 m op de as, en schilden naar de Spaarnevleugel en de
  Ovale Zaal.
- **Ovale Zaal** (Leendert Viervant, 1784) in een blok met plat dak op +10,8 m:
  de lichtbeuk als achtzijdige trommel (lange zijden 13 m, kopse zijden 3,2 m,
  9,4 bij 17,6 m) tot de goot op +12,5 m, het achtzijdige schilddak van 55
  graden tot +15,9 m, daarop het houten blok van 4,0 bij 9,1 m tot +18,8 m en de
  belvedère van het observatorium (3,0 bij 3,2 m met afgeschuinde hoeken,
  rondboogvensters als spitse nissen, kroonlijst op een kraag en borstwering
  tot +22,1 m, het hoogste punt). Op het platte dak aan de zuidwestkant de
  glazen lantaarn (2,0 bij 2,4 m, tot +14,3 m). De gevel naar de binnenplaats van
  het Fundatiehuis met zes vensternissen in twee lagen.
- **Eerste en Tweede Schilderijenzaal** (1838 en 1893) langs de Nauwe
  Appelaarsteeg: de eerste (14,4 bij 10,1 m) met steile dakvlakken van de goot
  op +7,1 m naar het opgehoogde daklicht (knik +11,9 m) en een flauw glazen
  zadeldak tot +12,9 m; de tweede (18,4 bij 10,4 m) met een zadeldak van 44
  graden van +8,6 tot +13,6 m; beide met steile schilden. Op de steeggevels van
  de zalen en de Ovale Zaal lisenen van 0,9 m. Ertussen en ervoor lagere
  platte daken (+7,4 en +8,6 m).
- **Uitbreiding van Hubert-Jan Henket** (1996): de tentoonstellingszaal met
  plat dak op +7,3 m en een overstek van 1,8 m op een kraag van 50 graden
  boven de smalle binnenplaats tussen de zalen (die open blijft), de lagere
  glasstrook langs de tuin (+7,05 m), twee verbindingen (+5,7 en +6,4 m), de
  tuinzaal met het café (+7,4 m), het hogere blok aan de tuin (+9,6 m) en de
  lage glazen galerij als lessenaarsdak van +2,9 naar +6,9 m.
- **Tuinhuis** in de tuin: lage vleugels met plat dak (+4,2 m), een voorbouw
  (+4,95 m) en het middendeel met een flauw schilddak tot +5,8 m.
- **Fundatiehuis** (Damstraat 21, Pieter Teylers woonhuis, sinds 2021 deel van
  het museum): het voorhuis van 8,6 m breed met de vlakke gevel tot +17,9 m
  (kroonlijst op een kraag, drie vensterassen in vier lagen en de deur als
  nissen) en een zadeldak met de nok in de diepte op +18,1 m en een schild aan
  de achterkant; de lagere zijvleugel met zadeldak (+11,5 m, het voorste deel
  +12,9 m), de achtervleugel (nok +14,15 m) en de dwarsvleugel (nok +13,8 m),
  die elkaar met kilgoten snijden; de vleugel naar de Ovale Zaal met een plat
  dak op +11,5 m en een lessenaarsdak naar de binnenplaats tot +9,1 m; rond de
  open binnenplaats de vleugel aan de binnenplaats (+9,6 m), het blok naast
  het voorhuis (+10,5 m) en de lage vleugel met het prieel (+4,3 m), en lage
  aanbouwen tussen de vleugels (+3,3 en +8,0 m).

Waar de maten vandaan komen: de plattegrond uit de BAG-contouren (die in het
lokale stelsel vrijwel haaks liggen); goten, knikken en nokken van de zalen,
de koepel, de Ovale Zaal, het observatorium, de platte daken en het maaiveld
uit het AHN-DSM/DTM (0,5 m, in het lokale stelsel geresampled, profielen als
90e percentiel over 4 m); de dakvlakken van de Ovale Zaal (acht vlakken), de
schilderijenzalen en het Fundatiehuis bevestigd met de LoD2.2-vlakken van de 3D
BAG; de indeling van de zalen uit de plattegrond van het museum en
Rijksmonument 513441; de gevels, het dak van de Ovale Zaal met de lantaarn en
het observatorium, het glazen dak van de zalen en de binnenplaats van het
Fundatiehuis uit foto's op Wikimedia Commons. Het AHN ziet de bronzen
beeldengroep, de obelisken en de dunne balustrade niet; die zijn uit foto's
geschat.

Pasvorm op het AHN-DSM (bovenvlak van het model op 0,5 m tegen het DSM, cellen
boven 2 m): 77 % binnen 1 m en 86 % binnen 2 m; zonder een rand van 1,5 m
langs de gevels 83 % en 91 % (mediaan 0,01 m). De afwijkingen zitten in de
bomen boven de glazen galerij en het tuinhuis, het glas (het DSM ziet door de
koepel en de daklichten), de beelden en de randen.

Printbaar op 1:1000 zonder steun: alle lijsten en het overstek staan op een
kraag van 50 graden, nissen en vensters hebben een spitse bovenkant, de
beelden, obelisken en daken worden naar boven smaller, en het script slaagt
zonder `--allow-overhang`. De printcontrole (`prepareMeshes` met printbare
overhang op 1:1000) vult 0 % bij (38,4 cm³, NoError). Het model bestaat uit
twee delen: het complex en het losse tuinhuis.

Wat niet in het model zit en waarom:

- Leuningen en hekken op het dak van de Ovale Zaal en het observatorium, de
  wenteltrap, de vlaggenmast en de schoorstenen: dunner dan 0,9 m.
- Het beeldhouwwerk in de Spaarnegevel (de zwikvrouwen, het wapen van Teyler,
  kapitelen, de opengewerkte balustrade): kleiner dan 0,9 m; de balustrade is
  dicht.
- De vensters zelf: alleen als nissen.
- De winkel in Spaarne 18 (een eigen woonhuis met een eigen BAG-pand en
  woonfunctie) en het depot- en kantoorgebouw Zegelwaarden aan de Nauwe
  Appelaarsteeg (BAG 0392100000065737, een eigen gebouw uit 1951): daar blijft de
  PDOK-reconstructie. De buurpanden aan de Damstraat (onder meer Damstraat 19
  en 23) en de schuurtjes achter de Damstraat horen niet bij het museum.

Geschat: de geleding van de Spaarnegevel (cordonlijst, vensters, zuilen,
balustrade, obelisken) en de beeldengroep, de hoogte van het houten blok onder
het observatorium en de vorm van de belvedère, de lisenen en vensters van de
Fossielenzalen en de steeggevels, de vensters van het Fundatiehuis, de
lantaarn op het dak van de Ovale Zaal, de daken van het tuinhuis en de lage
aanbouwen tussen het Fundatiehuis en de museumvleugel.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Teylers_Museum),
[Rijksmonument 513441](https://monumentenregister.cultureelerfgoed.nl/monumenten/513441),
PDOK BAG (de vijf panden), PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2,
de PDOK luchtfoto en foto's op Wikimedia Commons.
