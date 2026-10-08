# Het Spoorwegmuseum (Utrecht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `spoorwegmuseum.glb` | Catalogusbron in meters: node `building:spoorwegmuseum` (de museumhal en station Maliebaan als twee losse delen) |
| `spoorwegmuseum-1-1000.stl` | De twee gebouwen op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (206 × 148 × 17 mm) |
| `spoorwegmuseum.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (137483,05, 455450,11), het
gezamenlijke zwaartepunt van de twee BAG-panden, op het maaiveld (NAP +2,9 m),
en de glTF-conventie Y omhoog. +X loopt langs de lange as van de hal naar het
noordnoordoosten (67 graden tegen de klok in vanaf de RD-X-as) en +Y loodrecht
daarop naar het westnoordwesten. Het station ligt ten noordoosten van de hal,
aan de overkant van de sporen. Het maaiveld wordt op vier punten rond de hal
bemonsterd (`groundSamplePoints`, NAP +2,7 tot +2,9 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0344100000128112` (de hal) en
`NL.IMBAG.Pand.0344100000028153` (station Maliebaan).

Het model bestaat uit dakvlakken (planvergelijkingen z = a u + b v + c, hoogtes
boven het maaiveld), gefit op het AHN-DSM op 0,25 en 0,5 m, en niet meer uit
hoogtegebieden. Alles is een zadel- of schilddak met rechte nokken, plat
afgedekte opbouwen met verticale wanden, of een uitkragende plaat. De vlakken
reiken tot de BAG-contouren en worden daarop afgesneden.

De museumhal (182 bij 50 tot 100 m, de oude werkplaats):

- Hoofddak: twee vlakken, noord z = 10,384 − 0,0886 v − 0,0005 u en zuid
  z = 10,118 + 0,0881 v − 0,0005 u. De nok ligt op v = 1,5 m op +10,25 m, de
  helling is 0,088 (5 graden); de goot ligt aan de noordkant op +7,9 m (v = 28)
  en aan de zuidwestkant op +7,6 m (v = −30) tot +5,0 m (v = −60). Het DSM
  wijkt op 23000 cellen 0,04 m rms van de twee vlakken af.
- Lichtstraat langs de nok: zadeldakje van 5 m breed (v = −1,0 tot 4,0) met
  de nok op +11,5 m (helling 0,6, 31 graden), van u = −79,0 tot +65,6 m met
  verticale koppen (145 m lang).
- Drie plat afgedekte opbouwen boven het hoofddak: noordwest (u −69,4 tot
  −20,7, v 3,5 tot 23,1, +10,07 m, aan de noordkant 1,7 m boven het dak),
  west (u −79,0 tot −32,0, v −26,4 tot −1,0, +10,07 m) en zuid (u −46,3 tot
  −4,4, v −56,1 tot −29,4, +10,1 m, tot 5 m boven het dak), met twee dakdozen
  van 7,5 bij 9 m op de westelijke opbouw (+11,6 m) en een lage verbinding
  (+9,0 m) tussen de westelijke en de zuidelijke opbouw.

Station Maliebaan (1874), symmetrisch om u = 78,95 m:

- Twee vleugels (u 36,3 tot 72,0 en 86,0 tot 121,7, v 56,8 tot 70,4) met een
  zadeldak: nok op v = 63,6 m op +8,82 m, goten op +6,78 m (helling 0,30,
  17 graden) en topgevels (verticale koppen) aan de buitenkanten.
- Entreegebouw (u 71,95 tot 85,95, v 56,8 tot 77,7): een schilddak van vier
  vlakken met helling 0,40 (22 graden) vanaf de goot op +13,25 m. De nok ligt
  dwars op de vleugels op u = 78,95 m, +16,05 m, van v = 63,8 tot 70,7, met
  een schilddakkop aan de spoor- en aan de pleinzijde.
- Twee lagere zijdelen tegen de voorgevel (u 66,85 tot 73,15 en 84,75 tot
  91,05, v 70,1 tot 77,7) met een zadeldak: nokken evenwijdig aan v op
  u = 70,0 en 87,9 m, +14,74 m, goten op +13,39 m (helling 0,43, 23 graden)
  en topgevels op de voorgevel. Het dakvlak snijdt het schilddak van het
  entreegebouw in een dakvouw.
- Luifel boven de ingang (u 73,2 tot 84,7, v 77,4 tot 82,8): een uitkragende
  plaat van 11,5 m breed, 1,5 m dik, bovenkant op +6,2 m en onderkant op
  +4,7 m, die 5,1 m voor de BAG-contour (4,8 m voor de gevel) uitsteekt.

Vergelijking met het AHN-DSM (rastervergelijking op 0,5 en 0,25 m, cellen
boven 3 m): voor het hele complex ligt 99,0 % binnen 1 m en 99,7 % binnen 2 m
(hal 99,2 % en 99,9 %, station 97,0 % en 98,2 %). De afwijkingen zitten in
randen van 0,4 tot 0,6 m: de dakoverstekken buiten de BAG-contour en de rand
van de luifel. Het DSM heeft geen terugkaatsing op het glas van de lichtstraat
(930 cellen onder het model).

Printbaar op 1:1000: alle delen staan op het maaiveld; alleen de onderkant van
de luifel (uitkraging van 5,1 m, 1,5 m dik) hangt vlak en staat in
`OVERHANG_OK`. De export vult op 1:1000 en 1:1500 0,08 tot 0,09 % bij
(0,1 cm³), op 1:2500 1,4 %. De kleinste delen zijn 1,5 m hoog (lichtstraat,
dakdozen) en de luifelplaat is 1,5 m dik. De STL is 120 cm³ (206 × 148 × 17 mm)
en bestaat uit twee losse delen (de hal en het station), die in de tegel door
het terrein aan elkaar zitten.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Spoorwegmuseum_%28Utrecht%29)
en [Wikipedia: Station Utrecht Maliebaan](https://nl.wikipedia.org/wiki/Station_Utrecht_Maliebaan),
PDOK BAG (de twee panden), PDOK AHN (dsm en dtm 0,25 en 0,5 m via WCS) en de
PDOK luchtfoto. De nok- en goothoogtes, de hellingen en de afmetingen van de
luifel komen uit het AHN; het type dak (topgevels aan de vleugels en de
zijdelen, schilddak op het entreegebouw) uit de AHN-dwarsprofielen en de
luchtfoto. Geschat zijn de dikte van de luifel (1,5 m, de printminimum; de
bovenkant is gemeten) en de onderkant op +4,7 m. Weggelaten: de dakramen en
dakkapellen (nog geen 0,7 m boven het dak), de sierrand van de luifel, de
dakoverstekken, het perrondak achter het station (geen BAG-pand, 6,5 tot
7,6 m hoog), de zonnepanelen, de spoorlijnen met de rijtuigen en
locomotieven buiten de gebouwen en alle gevelreliëf (rondboogvensters,
lijsten).
