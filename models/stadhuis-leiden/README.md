# Stadhuis (Leiden)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `stadhuis-leiden.glb` | Catalogusbron in meters: node `building:stadhuis` (het hele complex als gesloten solid) |
| `stadhuis-leiden-1-1000.stl` | Het stadhuis in één stuk op 1:1000, met de onderkant (NAP +0,8 m) op het printbed (96,0 × 50,6 × 50,7 mm) |
| `stadhuis-leiden.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93664,10, 463711,40), het
zwaartepunt van de BAG-contour, op het maaiveld van de Breestraat (NAP +3,5 m),
en de glTF-conventie Y omhoog. +X loopt langs de Breestraat naar het
zuidoosten (RD-richting -52,25 graden); +Y wijst naar het noordoosten, naar de
Vismarkt. Het maaiveld loopt van de Breestraat af naar de Vismarkt en het
Stadhuisplein (NAP +1,3 tot +1,5 m). Het wordt daarom alleen aan de
Breestraat bemonsterd (`groundSamplePoints`, AHN NAP +3,4 tot +3,5 m), en de
vlakke onderkant ligt op NAP +0,8 m, 2,7 m onder de Breestraat, zodat de
achterkant ook op het lagere maaiveld staat. `groundOffsetMetres` is 0.
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0546100000042247`.

Onderdelen (hoogtes in NAP), allemaal binnen de BAG-contour:

- De vleugel aan de Breestraat achter de renaissancegevel (van de
  noordwestkop tot 42,6 m ten zuidoosten van de oorsprong) onder een zadeldak:
  goot +13,2 m aan de straat, nok +20,4 m op 7 m achter de gevel, goot
  +13,5 m aan de achterkant; daarachter de lagere kop aan de zuidoostkant
  (nok +17,0 m).
- Drie dwarse topgevels in het dak aan de Breestraat (AHN): dwarsdaken van de
  gevel tot de nok (+18,9 m, de middelste boven de ingang 7 m breed tot
  +20,9 m) met een topgevel op de rooilijn, de middelste met een bekroning tot
  +22,9 m.
- De trapgevel op de noordwestkop met zes treden tot +22 m en de schoorsteen
  tot +25 m (AHN).
- Dakkapellen op de plaatsen uit de luchtfoto: 12 aan de Breestraat tussen de
  topgevels, aan de hofkant van de vleugel aan de Vismarkt 8 grote en een
  bovenrij van 7 kleinere en aan de Vismarkt 5, elk met een zadeldakje.
- Het koperen koepeltje op het platte dak achter de vleugel aan de Breestraat
  (tot +19,4 m).
- De toren: een vierkante romp van 6,5 m tot +28,5 m, de achtkante
  klokkenverdieping tot +37 m, de koperen koepel tot +44 m, de lantaarn en de
  spits tot +51,5 m, het hoogste punt.
- De lagere delen rond de open binnenhof (de tuin op de PDOK-luchtfoto; de
  BAG-contour heeft hier een gat): plat op +17 tot +20 m.
- De vleugel van C.J. Blaauw aan de Vismarkt onder een zadeldak met de nok op
  +30,3 m (goten +21 en +20 m), oostelijker lager (nok +25 m), met het
  hoektorentje op de noordwesthoek tot +35 m.
- De lage strook achter de vleugel aan de Breestraat aan de oostkant (+8 m).

Vergelijking met het AHN-DSM: binnen de voetafdruk van het model ligt 82 % van
de circa 11.000 DSM-cellen binnen 2 m (62 % binnen 1 m, mediaan -0,04 m); de
afwijkingen zitten in de dakkapellen, schoorstenen en trapgevels, de toren
(het DSM mist de dunne spits) en de lagere delen aan de oostkant. Het AHN
toont in de binnenhof een dak op circa +20 m; het model volgt de BAG en de
recentere luchtfoto en laat de hof open.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken lopen
onder 45 graden of steiler omhoog, de toren en het hoektorentje worden naar
boven smaller (de koepel onder meer dan 60 graden) en er kraagt niets uit;
met overhangopvulling op een uitsnede van 200 m op 1:1000 komt er niets bij
(44,8 cm³ tegen 45,6 cm³ bij verticale opvulling); de STL met topgevels en
dakkapellen blijft met overhangopvulling op 52,1 cm³. In de preview van de
controle-uitsnede (132 m) staat het stadhuis op het maaiveld van de
Breestraat en de Vismarkt en zit het vervangen pand niet meer in de export.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Stadhuis_van_Leiden)
(renaissancegevel 1595-1597, herbouw na de brand van 1929 door C.J. Blaauw),
PDOK BAG (de contour met de binnenhof), PDOK AHN (dsm en dtm 0,5 m via WCS:
de dakprofielen, de toren en het maaiveld aan beide kanten), de PDOK
luchtfoto en foto's op Wikimedia Commons (de gevel en de toren aan de
Breestraat). Geschat zijn de verdeling van de toren in romp,
klokkenverdieping, koepel en spits (foto's; het DSM geeft circa +51 m als top),
het hoektorentje, de hoogtes van de platte delen rond de hof, de maten van de
dakkapellen en de treden van de trapgevel. Vereenvoudigd: de overige
schoorstenen, de renaissancegevel met beelden en het bordes zijn weggelaten.
