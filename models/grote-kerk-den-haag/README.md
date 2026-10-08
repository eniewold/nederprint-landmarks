# Grote of Sint-Jacobskerk (Den Haag)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `grote-kerk-den-haag.glb` | Catalogusbron in meters: node `building:kerk` (hal met kruisdaken, koor met sluiting en kooromgang, toren en aanbouwen, opgebouwd uit dakvlakken en bouwdelen) |
| `grote-kerk-den-haag-1-1000.stl` | De kerk op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (97 × 45 × 81 mm) |
| `grote-kerk-den-haag.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (80961,30, 454897,72), het
zwaartepunt van het BAG-pand, op het maaiveld (NAP +3,2 m), en de
glTF-conventie Y omhoog. +X loopt naar het oosten (11,75 graden tegen de klok
in vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. De kerk zelf
ligt 2,7 graden rechtsom van die as: de nokken en gevels in het AHN lopen
onder die hoek. Het script rekent daarom in een kerkstelsel (s langs het
schip, t dwars) en draait het gebouw aan het eind om de oorsprong; de toren
staat in het westen (s −46 tot −31 m), het koor in het oosten (s 16,5 tot
49 m). Het maaiveld wordt op vier punten op het kerkplein bemonsterd
(`groundSamplePoints`, NAP +3,1 tot +3,3 m). Vervangt de PDOK-reconstructie
van `NL.IMBAG.Pand.0518100000269743` (kerk, toren en kapellen in één pand);
het model wordt begrensd op de BAG-contour (0,5 m ruimer).

Onderdelen (maten in het kerkstelsel, hoogtes boven het maaiveld). Elk
dakvlak is een planvergelijking op een rechthoek of veelhoek (een profiel of
een afgesneden prisma); er is geen hoogteveld en er zijn geen lagen gebruikt.

- De hal (schip met twee zijbeuken, t −14,9 tot 19,65 m, 34,6 m breed) onder
  kruisdaken: een langsnok boven het schip (t 2,35 m, goten 13,35 m uit
  elkaar) en drie dwarse zadeldaken over de volle breedte met nokken op
  s −16,75, −3,4 en 9,95 m (13,35 m uit elkaar). Alle nokken liggen op
  +23,65 m, de vlakke goten op +13,9 m, de helling is 1,53 (57 graden). Waar
  langsdak en dwarsdaken elkaar kruisen ontstaan de ruitvormige kilgoten uit
  het AHN; de dwarsdaken eindigen in topgevels op t −14,9 en 19,65 m.
- De westtravee (s −32,6 tot −23,4 m, 9,2 m): in beide zijbeuken een
  langs lopend zadeldak (nokken t −9,45 en 14,25 m, +23,65 m, steiler:
  helling 2,0) met een topgevel naar het eerste dwarsdak toe.
- Vier steunberen langs de noordgevel (op s −32,2, −23,4, −10,05 en 3,8 m;
  1,1 × 1,4 m, tot +11,6 m met schuine kop), twee lage portalen (+4,4 en
  +3,0 m) en een trappentorentje bij de noordoosthoek van de hal (+20,6 m).
- Aan de zuidzijde een lage kapellenrij (t −22 tot −14,9 m, 5,7 m diep) in
  drie delen onder zadeldaken met de nok langs s: +11,2 m (s −22,7 tot
  −9,4 m), +7,6 m (s −9,5 tot 17 m) en een plat deel van +6,4 m in het
  westen. Hoogtes uit het 3D BAG-dakmodel; het DSM meet hier de boomkruinen.
- Het hoge koor (14,6 m breed, as t 2,0 m, van s 16,5 tot 35 m) met nok op
  +34,05 m, helling 1,45 en goot op +23,5 m, en een vijfzijdige sluiting (halve
  tienhoek met middelpunt s 35 m, straal 7,3 m): vijf hoekdaken waarvan de
  nok doorloopt tot s 34,7 m.
- De kooromgang eromheen (halve breedte 13,45 m, buitenmuur tot +12,8 m) met
  een lessenaarsdak van +18 m tegen de koorwand naar +12,8 m, een
  convexe romp van twee gelijkvormige veelhoeken. Steunberen (1,3 m breed)
  op de vier hoeken van de sluiting; aan beide zijden een straalkapel met
  dwars zadeldak (noord: nok s 21,35 m +19,8 m, zuid: nok s 21,1 m +19,3 m,
  goot +13,9 m) en kleine aanbouwen (de uitsprongen van de omgang op s 26 tot
  30,5 m met zadeldakjes van +6,1 en +7,0 m, de noordoostkapel +6,2 m en een
  blok van +13,5 m in de oksel van zuidkapel en hal).
- Het trappentorentje op de noordwesthoek van het koor (2,5 × 2,5 m, +27 m
  met piramidedakje tot +29,5 m) en het dakruitertje op de nok (zeshoek van
  4,2 m, s 18,9 m, tot +41,2 m).
- De zeskantige toren: regelmatige zeshoek met de punten naar noord en
  zuid (straal 8,6 m, 14,9 m van vlak tot vlak), schacht tot +54,7 m met zes
  hoekbeer die in vier versnijdingen tot +26 m oplopen, een schaftdak van
  +54,6 tot +61,4 m (helling 2,9), de lantaarn tot +66,5 m (straal 4,5 tot
  3,8 m) en de spits (straal 3,8 tot 0,55 m) tot +80,4 m. De ringprofielen
  van lantaarn en spits zijn de mediaan van het DSM per ring.
- Lage aanbouwen in het westen: zuidwest een zadeldak (nok +12,1 m op t −17,8 m,
  goot +8,2 m, aan de westkant afgeschuind) met een plat dak van +6,3 m
  ernaast, noordwest een zadeldak met de nok langs t (+6,9 m).

Vergelijking met het AHN-DSM (rastervergelijking op 0,25 m, cellen boven 3 m
met een meetwaarde): 81,3 % ligt binnen 1 m en 86,9 % binnen 2 m (binnen de
BAG-contour 81,6 % en 87,4 %). Tegen de dakvlakken van de 3D BAG (LoD2.2,
zonder gaten of boomkruinen) is het 91,3 % binnen 1 m en 94,1 % binnen 2 m, en
het volume is 68.050 m³ tegenover 68.625 m³ voor de 3D BAG (−0,8 %). Het model
bedekt 98,9 % van de BAG-contour boven +1 m. De afwijkingen zitten vooral aan
de wandranden (een raster van 0,5 m heeft een randcel van een halve meter), in
de boomkruinen aan de zuidzijde en in de ruis van het DSM op de spits.

Printbaar op 1:1000: alle delen staan als kolommen op het maaiveld, dus de
export vult op 1:1000 en 1:1500 niets op (0,00 % volume); op 1:2500 komt er
0,6 % bij. De STL is 68 cm³ (1538 driehoeken, geen ondervlakken onder 45
graden, het script slaagt zonder `--allow-overhang`) en het model is één
samenhangend deel zonder tunnels. De kleinste delen zijn de steunberen
(1,1 m breed) en de top van de spits (zeshoek van 0,95 tot 1,1 m).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Sint-Jacobskerk_%28Den_Haag%29)
(middenbeuk 12 m, vijfzijdig priesterkoor met kooromgang), PDOK BAG (het pand),
PDOK AHN (dsm en dtm 0,5 m via WCS) voor de vlakken van daken, koor en toren,
de 3D BAG (api.3dbag.nl, LoD2.2) voor de lage aanbouwen en de PDOK
luchtfoto voor het dakpatroon. Geschat zijn de dakhelling onder de leien waar
het DSM gaten heeft (gelijk aan het meetbare deel van het vlak), de hoogte van
de steunberen en de vorm van de lage aanbouwen. De torenhoogte is onzeker:
Wikipedia geeft 92,5 m, het AHN en de 3D BAG zien de spits tot +80,4 m (NAP
+83,6 m); de dunne naald erboven (dunner dan 0,9 m) is weggelaten. Weggelaten:
de pinakels, de vensters en alle gevelreliëf.
