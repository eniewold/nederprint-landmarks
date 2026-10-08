# Museum de Fundatie (Zwolle)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `museum-de-fundatie.glb` | Catalogusbron in meters: node `building:museum-de-fundatie` met het Paleis aan de Blijmarkt, de twee portieken onder het fronton, de aanbouw en de Wolk op het dak |
| `museum-de-fundatie-1-1000.stl` | Het museum in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (41 × 34 × 27 mm) |
| `museum-de-fundatie.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van de Wolk op RD
(202809,43, 502730,95), op het maaiveld aan de Blijmarkt (NAP +3,2 m) en de
glTF-conventie Y omhoog. +X loopt langs de lengteas van het paleis naar het
zuidoosten (RD-richting -31,7 graden), +Y naar het noordoosten, de Blijmarkt.
Het maaiveld wordt op vier punten rondom het paleis bemonsterd
(`groundSamplePoints`, NAP +3,2 tot +3,8 m). Het catalogusitem vervangt
BAG-pand `NL.IMBAG.Pand.0193100000042204`; de aangebouwde panden aan de
noordwestkant blijven staan.

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM):

- Het paleis op de BAG-contour van 38,1 × 25,1 m met een vlak dak op
  +15,0 m en een kroonlijst van 0,3 × 0,6 m onder de dakrand.
- De portieken aan de Blijmarkt (3,1 m diep) en aan de Potgietersingel
  (5,8 m diep), 14,4 m breed, onder een zadeldak met de nok dwars op de gevel:
  het fronton van +14,2 m aan de rand tot +16,4 m in de nok. De zes zuilen en
  de ruimte erachter zijn een dicht blok.
- De lage aanbouw aan de noordwestkant (3,0 × 1,5 m, +11,3 m).
- De Wolk van Bierman Henket: de bovenhelft als halve ellipsoïde, met de
  kleinste kwadraten gefit op 2408 DSM-punten (rms 0,11 m): evenaar op
  +21,05 m, halve assen 17,69 en 12,16 m langs de assen van het paleis, top
  op +29,0 m. De onderhelft is een halve ellipsoïde met een verticale halve as
  van 12 m (geschat op foto's); hij snijdt het dak op 86 % van de grootste
  breedte.

Printbaar op 1:1000 zonder steun: het paleis staat recht op vanaf 1 m onder
het maaiveld en de onderkant van de Wolk hangt hooguit 42 graden over (het
flauwste ondervlak staat 48 graden boven de horizon; het script controleert
dat). De enige vlakke onderkant is die van de kroonlijst. Die is bewust
gehouden: zonder één vlak steiler dan 45 graden krijgt de node in de export de
verticale opvulling en wordt de Wolk een rechte koker tot het dak (valkuil
Kubuswoningen). Met de kroonlijst vult de export de node laag voor laag onder
de printbare hoek (gesloten, volume 21 288 mm³ voor en
23 322 mm³ na op 1:1000; het verschil is vooral de voet die tot de
grondplaat doorloopt) en blijft de ronde onderkant van de Wolk behouden. De
export van een uitsnede van 140 m op 1:1000 duurt circa 1 seconde.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Museum_de_Fundatie) (Paleis
aan de Blijmarkt van Eduard Louis de Coninck, 1838-1841; de Wolk van Hubert-Jan
Henket, geopend in 2013), PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via
WCS: dak, frontons, aanbouw, maaiveld en de Wolk), de PDOK luchtfoto en foto's
van Wikimedia Commons (`Museum de Fundatie Zwolle in 2021.jpg` voor de
portiek aan de Blijmarkt en de Wolk van opzij, `De Fundatie, Zwolle.jpg` en
`Basiliek van Onze-Lieve-Vrouw-Tenhemelopneming - Zwolle - View from the tower
towards the southeast - De Fundatie.jpg` voor de onderkant van de Wolk).
Geschat zijn de onderhelft van de Wolk en de kroonlijst; de zuilen, het
glazen venster in de Wolk, de lichtstraten in het dak, het gouden beeld op de
dakrand en de gevelindeling zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
