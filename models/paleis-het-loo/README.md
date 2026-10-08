# Paleis Het Loo (Apeldoorn)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `paleis-het-loo.glb` | Catalogusbron in meters: node `building:paleis` (hoofdgebouw, paviljoens, vleugels, het oostelijke complex en de lage vleugel langs de straat uit dakvlakken en bouwdelen) |
| `paleis-het-loo-1-1000.stl` | Het paleis op 1:1000 met de onderkant (0,5 m onder het voorplein) op het printbed (215 × 122 × 25 mm) |
| `paleis-het-loo.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (193174,6, 471890,07), op de
symmetrieas midden op het voorplein, op het maaiveld van het voorplein (NAP
+17,7 m), en de glTF-conventie Y omhoog. +X loopt langs de gevels naar het oosten
(0,9 graden linksom vanaf de RD-X-as, gemeten aan de nokken en goten van de
vleugels en paviljoens) en +Y naar het noorden, naar de tuin. Het complex is
symmetrisch in u = 0, op het oostelijke complex na. Het maaiveld wordt op het
voorplein tussen de vleugels bemonsterd (`groundSamplePoints`, NAP +17,7 m); het
tuinterras achter het hoofdgebouw ligt 2 m hoger en dekt daar de onderkant van de
gevel. Als geen van die punten in de uitsnede valt, gebruikt de lader
`groundHeight` 61,44 m (de laagste ellipsoïdische PDOK-terreinhoogte op die
punten). Vervangt de PDOK-reconstructie van drie panden: `NL.IMBAG.Pand.0200100000085665`
(het hoofdgebouw, de paviljoens, beide vleugels, het oostelijke complex en de
ondergrondse uitbreiding onder het voorplein en het tuinterras) en
`NL.IMBAG.Pand.0200100000800424` en `NL.IMBAG.Pand.0200100000800425` (de lage
vleugel langs de straat ten westen van de westvleugel, met het westpaviljoen en
het entreegebouw). PDOK had van die vleugel vlakke blokken met één spits dakje.

Onderdelen (hoogtes boven het voorplein op NAP +17,7 m; 214,5 bij 122,3 m en
24,5 m hoog met de onderkant):

- Hoofdgebouw (corps de logis, u -14,1 tot 14,1 m, v 37 tot 62,5 m): goot +15,6 m
  met een kroonlijst, dakvlakken van 46,6 graden tot het platte dak op +21,3 m met
  een balustrade (dichte borstwering tot +22,4 m), een dakopbouw van 5 bij 7,8 m
  tot +24 m en zes schoorstenen tot +23,8 m; middenrisalieten met een driehoekig
  fronton aan het voorplein (top +20,9 m) en aan de tuin (+18,3 m); vier
  dakkapellen op elke zijhelling en twee op de tuinhelling (+17,9 m); een bordes
  met vier treden tot +1,8 m voor de ingang; vensternissen in drie rijen.
- Binnenpaviljoens (u 12,8 tot 27 m aan beide kanten): goot +12,2 m, schilddak van
  45 graden met een plat bovenvlak op +17,4 m, langs de lange zijden een
  doorlopende dakkapel tot +14,6 m, een dakkapel midden in de korte zijden en vier
  schoorstenen tot +19,4 m.
- Buitenpaviljoens (u 26,4 tot 42,4 m): goot +12,3 m, schilddak van 49,6 graden met
  de nok op +17,7 m en twee schoorstenen tot +19 m, gebogen frontons (pijl 2 m, top
  +14,3 m) aan het voorplein en aan de tuin en een dakkapel aan de buitenkant.
- Zijvleugels om het voorplein (u 33,4 tot 42,4 m, v -47 tot 15,8 m): goot +8 m,
  nok +13,1 m met schilden aan beide einden, negen dakkapellen met een puntdakje
  naar het voorplein (om de 6,5 m), vier schoorstenen op de nok en een kopse
  paviljoen aan de straat (goot +10 m, tentdak tot +15,2 m met een schoorsteen tot
  +17,3 m); aan het voorplein vensternissen in twee rijen, aan de buitenkant
  velden tussen lisenen met hoog in elk tweede veld een klein venster.
- Het oostelijke complex rond een binnenhof (u 42,6 tot 102 m, v -57,7 tot -11,8 m):
  vleugels met schilddaken (goot +7,8 tot +8,3 m, nokken +12,9 tot +13,2 m),
  dakkapellen aan de straat en in de binnenhof, twee hoekpaviljoens met tentdaken
  (+15,3 en +16,8 m), een middenvleugel met topgevels (nok +13,4 m), veertien
  schoorstenen en een lage verbinding met de oostvleugel (+4,7 m) met installaties
  en een gang op +7,3 m.
- De lage vleugel langs de straat ten westen van de westvleugel (u -112,1 tot
  -42,2 m, v -57,7 tot -47,4 m): goot +7,8 m met een kroonlijst, zadeldak van 45
  graden met de nok op +12,8 m en schilden aan beide einden, zes dakkapellen met
  een puntdakje naar de straat (om de 6,5 m), twee schoorstenen op de nok (+14,6
  m) en vensternissen in twee rijen aan straat en terras; aan het westeinde een
  paviljoen van 10,2 bij 10,2 m (goot +9,9 m, tentdak tot +15,2 m, schoorsteen tot
  +17 m, een dakkapel aan elke lange zijde) en het lage entreegebouw met plat dak
  (+4,2 m).

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m met een
meetwaarde): 85,5 % ligt binnen 1 m en 93,1 % binnen 2 m; voor de lage vleugel
langs de straat alleen 87,0 % en 93,7 %. Wat het AHN boven 3 m heeft en het model
niet, zijn vooral de berceaus en bomen in de tuin ten oosten van de oostvleugel en
de schaduwstroken langs de westgevels.

Het AHN (de nieuwste opname) toont de toestand na de verbouwing van 2018 tot 2023,
gelijk met de nieuwste luchtfoto: de glazen daken van de ondergrondse uitbreiding
liggen vlak in het voorplein. De 3D BAG heeft nog een tijdelijke overkapping
achter het hoofdgebouw (tot NAP +39 m) en een blok voor de ingang; die zijn
genegeerd. De gebogen kwartcirkelgalerijen uit de opdracht bestaan niet meer aan
het voorplein: de colonnades zijn bij de uitbreiding van 1691 tot 1694 naar de tuin
verplaatst, en de paviljoens verbinden het hoofdgebouw met de vleugels. Wat op de
luchtfoto als gebogen vorm op de hoeken staat, zijn de gebogen frontons van de
buitenpaviljoens.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de nissen en
de kroonlijsten na (48 graden). De export vult op 1:1000 en 1:1500 niets bij en op
1:2500 0,99 %. De STL is 72,4 cm³, heeft 16.456 driehoeken en is één samenhangend
deel (status NoError, geslacht 2 door de binnenhoven). Dunste delen op 1:1000: de
dakkapellen 1,5 mm breed, de schoorstenen 1,2 mm en de balustrade 0,9 mm.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Paleis_Het_Loo), PDOK BAG, PDOK
AHN (dsm en dtm 0,5 m via WCS, ook op 0,25 m voor dakkapellen en schoorstenen), 3D
BAG LoD2.2 (api.3dbag.nl), de PDOK luchtfoto en foto's op Wikimedia Commons van het
voorplein, de tuinzijde, de vleugels, de buitengevel van de westvleugel en de
straatvleugel tijdens de verbouwing (2019). Geschat zijn de kroonlijsten, de
vensternissen (ritme van de foto's), de vorm van de gebogen frontons, de hoogte van
de dakkapellen van de vleugels, de straatvleugel en het oostelijke complex, de
dakkapellen van het westpaviljoen, de vensters van de straatvleugel aan de
terraskant en de schoorsteenhoogtes (het AHN vlakt ze af). Weggelaten: de glazen daken van de ondergrondse uitbreiding
(gelijk met het voorplein, met water erop), het hek met de pijlers en de lantaarns
aan het voorplein (dunner dan 0,9 m), de colonnades in de tuin, de vlaggenmast, de
balusters (als dichte borstwering), een laag aanbouwtje ten noorden van de
verbinding (geen deel van de BAG-panden), de windvaan op de schoorsteen van het
westpaviljoen (dunner dan 0,9 m), de lichtkoepels op het entreegebouw (lager dan
0,5 m) en het terras met parasols ten noorden van de straatvleugel.
