# Raveleijn (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-raveleijn.glb` | Catalogusbron in meters: nodes `building:kantoor` (de kantoorvleugels met mansarde, het oostblok, het hoektorentje en de vijfhoekige hoektoren), `building:gevelrij` (de huisgevels aan de arena met galerij), `building:belfort` (de Belforttoren), `building:tribune` (het overdekte tribunegebouw met omloop en drie torens), `building:stadspoort` (de Magische Stadspoort) en `road:brug` (de brug naar het Ton van de Venplein) |
| `efteling-raveleijn-1-1000.stl` | Het hele model op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (125 × 120 × 33 mm, 55 cm³) |
| `efteling-raveleijn.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-raveleijn.mjs`](../../scripts/generate-efteling-raveleijn.mjs)
(gedeelde hulpfuncties in `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131367,5, 407214,5), het hart van
de Belforttoren, op het maaiveld (NAP +8,0 m), en de glTF-conventie Y omhoog.
+X loopt langs de symmetrie-as van het complex, van de toren door de arena
naar de middelste tribunetoren (48,1 graden rechtsom vanaf de RD-X-as, naar het
zuidoosten), +Y naar het noordoosten. De vleugels, de toren, de tribune en de
poort zijn elk in hun eigen stelsel opgebouwd en in RD geplaatst. Het maaiveld
wordt op vier punten bemonsterd (`groundSamplePoints` (29,5, 3,7) in de arena,
(-6,5, -36,5) in de tuin aan de westkant, (1,2, 42,6) langs de Europalaan en
(50,2, 41,7) op het plein tussen tribune en oostblok; NAP +7,9 tot +8,1 m), niet
op het water bij de poort. `groundOffsetMetres` is 0. Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0809100000017646` (de kantoorvleugels en
de toren); de tribune (BGT-overkapping) en de poort zijn geen BAG-pand. De
arena zelf blijft PDOK-terrein.

Onderdelen (hoogtes boven het maaiveld):

- Kantoorvleugels (BAG-contour): vlak dak op +15,3 m, aan de buitengevels een
  mansarde van +10,5 tot +15,3 m met dakkapellen om de 4,2 m, vensternissen op
  drie verdiepingen en lisenen; het lage deel rond de hoektoren op +8,5 m; op
  de zuidwesthoek een vierkant torentje met tentdak tot +21 m; aan de oostkant
  het blok aan de Ravenring met mansarde van +8 tot +12 m, een grote topgevel
  en dakkapellen, en de doorgang naar de tribune.
- Vijfhoekige hoektoren aan de Europalaan (luchtfoto: vijf hoekpunten op 6,6 m
  van het hart): goot +11 m, flauwe voet tot +13,6 m, spits tot +23,4 m,
  vensternissen op de drie buitenzijden.
- Gevelrijen aan de arena: zeven huizen per rij met topgevels, trapgevels, een
  halsgevel, een gotische zaalgevel met pinakels en daken met dakkapellen
  (goten +10,6 tot +14,4 m, toppen tot +17,6 m), gevels om en om iets voor of
  achter de rooilijn, vensternissen; ervoor de galerij van 4 m diep tot +3,6 m
  met spitsboognissen en een borstwering.
- Belforttoren (12,6 × 16,8 m, 41,9 graden gedraaid): middenrisaliet met
  spitsboogingang, roosvenster en klok, zijvensters, kroonlijsten, vier
  hoektorentjes met kraagsteen en spits tot +25,8 m, arcade onder de goot
  (+20,5 m), topgevel midden op de voorgevel, schilddak tot nok +30 m met
  dakkapellen, lantaarn met spits tot +32,8 m (het hoogste punt), bordes met
  trap naar de arena.
- Tribune (binnenrand een cirkel met straal 39,4 m rond RD 131370,8 /
  407211,75): open front met zitrijen (treden 0,8 × 0,53 m) tussen kolommen om
  de 8 graden onder een dak dat onder 45 graden naar voren oploopt, voorste
  dakstrook +12,8 m, dak +10,2 m, frontgevel op de as tot +14,6 m; aan de
  achterkant de omloop met stenen voet, deurnissen, open galerij (nissen) en
  pannendak van +11 naar +7,6 m; drie torens: midden vierkant met klok,
  klokkenstoel en getrapt tentdak met lantaarn tot +17,6 m, noord rond met
  uikoepel tot +15,9 m, zuid vierkant met tentdak tot +15,3 m.
- Magische Stadspoort: poortgebouw met doorgang (2,9 m breed, 4,8 m hoog,
  spitse top), omlijsting, torentje met nis voor het ruiterbeeld; links de
  ronde toren met kegeldak tot +9,8 m en erkertorentje; rechts de vierkante
  toren (8 graden gedraaid) met stenen voet, houten verdieping, erker, steil
  schilddak met dakkapel tot +10,4 m en slank torentje.
- Brug naar het Ton van de Venplein (luchtfoto): 3,4 tot 4,4 m breed, 22 m
  lang, dek op +0,35 m.

Printbaar op 1:1000 en 1:500 zonder steun: alles staat op de onderkant, daken
lopen omhoog, kraagstenen, consoles en erkervoeten zijn 45 graden, de
doorgang en alle nissen hebben een spitse top van minstens 50 graden en het
tribunedak boven de zitrijen loopt onder 45 graden op. Printcontrole
: op 1:1000 kantoor +0,01 %, gevelrij +0,06 %, belfort
+0,04 %, tribune +0,34 %, stadspoort +3,5 %, brug 0 %; op 1:500 ten hoogste
+2,3 % (stadspoort).

Bronnen: PDOK BAG (pand 0809100000017646), PDOK BGT (overkapping van de
tribune, de poort), PDOK AHN (dsm en dtm 0,5 m via WCS), PDOK luchtfoto 8 cm,
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Raveleijn)
(arena, Belforttoren, poort, tribune-achterzijde, bouwfoto's Ravenring 2026),
[Wikipedia](https://nl.wikipedia.org/wiki/Raveleijn_(attractie)) en Eftepedia
([Raveleijn (gebouw)](https://www.eftepedia.nl/lemma/Raveleijn_(gebouw)),
[Magische Stadspoort](https://www.eftepedia.nl/lemma/Magische_Stadspoort)).
Geschat zijn alle gevelornamenten, vensters en nissen, de volgorde en breedte
van de huisgevels, de dakkapellen, de vorm van de torendaken (het DSM is grof;
de Belforttoren stond op de luchtfoto in de steigers), de zitrijen en de diepte
van het open tribunefront, en de hoogtes van de poorttorens (uit vooraanzichten
met de doorgang als maat; DSM tot ~10 m). Weggelaten: de Ravenring (in aanbouw
in 2026 tussen tribune en oostblok), het nieuwe platte gebouw tussen
Droomvlucht en Raveleijn, de decorstukken in de arena, leuningen,
windwijzers, lantaarns en het waterrad.
