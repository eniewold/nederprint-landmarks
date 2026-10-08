# Danse Macabre (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-danse-macabre.glb` | Catalogusbron in meters: nodes `building:abdij` (de tienhoekige showhal met onderbouw, lichtbeuk, dak, de gevels van de oude Spookslot-entree en de platte bijgebouwen binnen het BAG-pand) en `building:ruine` (de geruïneerde ronde toren ten noorden van de hal) |
| `efteling-danse-macabre-1-1000.stl` | Het model op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (43 × 46 × 21,7 mm, twee losse delen) |
| `efteling-danse-macabre.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Generator: [`scripts/generate-efteling-danse-macabre.mjs`](../../scripts/generate-efteling-danse-macabre.mjs)
(met de gedeelde hulpfuncties uit `scripts/efteling-kit.mjs`).

Danse Macabre (geopend op 31 oktober 2024) staat op de plek van het Spookslot
in Anderrijk. De GLB is in meters met de oorsprong in het hart van de
tienhoekige hal op RD (131558,20, 406711,50), op het maaiveld (circa NAP +9,2
m), en de glTF-conventie Y omhoog. +X loopt 6,5 graden linksom gedraaid ten
opzichte van de RD-X-as (oost-noordoost); de voorzijde met de grote puntgevel
en het maaswerkvenster kijkt naar -Y (zuid-zuidoost, naar het Abdijplein). Het
maaiveld wordt op vier punten op het plein aan de zuid- en westkant
bemonsterd (`groundSamplePoints`); ten noorden ligt een heuvel. Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0809100000020767` (bouwjaar 2025, 1201
m²; in de PDOK-tegel een LoD1.1-blok van 16 m).

Plattegrond: een regelmatige tienhoek past op de BAG-hoekpunten van de zuid-,
zuidwest- en westgevel met een restfout van 7 cm: apothema 16,67 m (33,3 m
tussen de vlakke zijden, zijden van 10,8 m). De kleine uitstulpingen in de
BAG-contour op de hoeken zijn de steunberen. De lichtbeuk (27,4 m) en de
dakring (22,4 m) zijn op de luchtfoto gemeten en liggen concentrisch.

Onderdelen (hoogtes boven het maaiveld):

- Onderbouw: gesloten muur met steunberen op de tien hoeken (schuine
  afdekking tot 7,6 m), consoles en een rondboogfries die 0,35 m uitkraagt op
  een kraag van 45 graden (7,65–8,0 m), borstwering tot 10 m rond een
  loopgang op 9,4 m.
- Lichtbeuk: per zijde twee blinde spitsboogvensters, aan de voor- en
  achterzijde een groot maaswerkvenster (3 m breed, met twee montants) met
  rozetten en lage spitse nissen en een puntgeveltje tot 17,8 m; kroonlijst op
  een kraag van 45 graden, borstwering tot 15,6 m. Steunberen op de hoeken met
  slanke pinakels (achtkante spits tot 21,2 m) naast de grote vensters en
  schoorsteenachtige koppen met een dakje tot 17,8 m op de overige hoeken.
- Dak: dakring tot 15,9 m, laag tienhoekig piramidedak tot 18,3 m met een naaf
  en tien stalen spanten van het glasdak langs de graten.
- Gevels van de oude Spookslot-entree: aan de zuidzijde een puntgevel van 9 m
  breed (top 8,2 m) met een rond venster en de ingang; aan de zuidwestzijde
  drie spitse geveltjes (tot 7,6 m) met de poort van "Dr. Charlatans"; aan de
  west-zuidwestzijde drie lage geveltjes als reliëf.
- Bijgebouwen binnen de BAG-contour: oost 8,6 m, noord 6 m (plat dak met
  installaties), noordwest 7 en 5 m.
- Ruïnetoren ten noorden (Ø 5,4 m, geen BAG-pand): een open halve ronde toren
  met een gebroken bovenrand van 8 tot 12,5 m.

Het AHN (DSM/DTM 0,5 m) is van voor de bouw en toont nog het rechthoekige
Spookslot. Alle hoogtes zijn daarom geschat uit foto's (verhoudingen tot de
zijdebreedte van de lichtbeuk en het ronde venster); het AHN-DTM is alleen
gebruikt voor het maaiveld (NAP +9,1 tot +9,3 m).

Printbaar op 1:1000 en 1:500: de export vult 0,02 % volume op (alleen de
vlakke bovenkant van de nissen); muren staan recht op, daken en gevelpunten
lopen schuin omhoog, fries en kroonlijst rusten op een kraag van 45 graden,
spitsbogen hebben een top van 58 graden. De STL is 15,8 cm³.

Bronnen: PDOK BAG (pand 0809100000020767), PDOK luchtfoto 8 cm, PDOK
3D-gebouwtegel, PDOK AHN DTM 0,5 m, [Wikipedia](https://nl.wikipedia.org/wiki/Danse_Macabre_(Efteling))
en foto's op Wikimedia Commons (Category:Danse Macabre (Efteling)). Geschat
zijn alle hoogtes, de diepte van de gevels aan de voet, de indeling van de
lichtbeuk (welke zijden een groot venster hebben en welke hoeken een pinakel),
de hoogtes van de bijgebouwen en de vorm van de ruïnetoren. Weggelaten: het
vakwerk boven het glasdak, lantaarns, beelden, het doek van "Dr. Charlatans"
en de gebroken bovenrand van de borstwering. Niet in het model: In den Swarte
Kat (pand 0809100000020769, een los horecagebouw 60 m zuidelijker), het hokje
0809100000020768 en de pannendaken van de Kruysgang (geen BAG-pand).
