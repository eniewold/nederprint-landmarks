# Markthal (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `markthal.glb` | Catalogusbron in meters: node `building:markthal` (de boog met de verdiepte kopgevels als gesloten solid) |
| `markthal-1-1000.stl` | De Markthal op 1:1000 met de onderkant (NAP +3,0 m) op het printbed (118 × 72 × 41 mm) |
| `markthal.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (93068,75, 437230,84), het midden
van de boog, op het maaiveld (NAP +3,5 m), en de glTF-conventie Y omhoog. +X
loopt langs de as naar het oostnoordoosten (RD-richting 15,78 graden); +Y
wijst naar het noordnoordwesten. Het maaiveld wordt op de straat langs beide
lange gevels bemonsterd, 4 m ervoor (`groundSamplePoints`, AHN NAP +3,5 m).
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0599100100007493`.

Opbouw: de rechthoek van de boog (118,2 bij 71,7 m) is de kleinste rechthoek
om het DSM boven NAP +8 m. Het dwarsprofiel is het 90e percentiel per meter
dwars op de as over vijf blokken van 20 m; die blokken liggen overal binnen
0,5 m van elkaar, dus het profiel is symmetrisch gemiddeld en langs de as
geëxtrudeerd: de zijwanden recht op tot NAP +15 m, de bocht van de boog, een
richel op +40,4 m (circa 10 m uit de rand) en de flauwe kap tot de nok op
+43,9 m. In beide kopgevels ligt het glas 3 m achter de voorkant, in een
opening in de vorm van een brede afgeronde rechthoek (herzien op een
luchtfoto): halve breedte 20,8 m, bovenrand op NAP +36,3 m en de hoeken als
kwartellipsen van 13 bij 17,8 m, dus de woningen zijn aan de zijkanten circa
15 m dik en erboven circa 7,5 m; de rand loopt onder circa 50 graden naar het
glas.

Vergelijking met het AHN-DSM: binnen de voetafdruk ligt 72 % van de circa
33.000 DSM-cellen binnen 1 m en 87 % binnen 2 m (mediaan +0,11 m); de
afwijkingen zitten in de lichtkoepels op het dak en langs de randen.

Printbaar op 1:1000 zonder steun: het dak loopt vanaf de rechte zijwanden
alleen omhoog en de rand van de kopgevels loopt onder circa 50 graden terug;
het script controleert dat geen vlak vlakker dan 45 graden naar beneden
wijst. Met overhangopvulling op 1:1000 blijft ongeveer 310 cm³ over boven de
onderplaat (de verdiepte kopgevels; volume van het model 309,5 cm³). In
de kaart en in de preview van een uitsnede van 160 m staat de boog met de
verdiepte kopgevels zonder het vervangen pand.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Markthal_(Rotterdam))
(MVRDV, 2014, woningen in een boog over de markthal met glazen kopgevels),
PDOK BAG (het pand), PDOK AHN (dsm en dtm 0,5 m via WCS: rechthoek,
dwarsprofiel en maaiveld) en een luchtfoto van de kopgevel (vorm van de
opening). Geschat zijn de afmetingen van de opening en de diepte van het glas. Vereenvoudigd: de markthal zelf is dicht (het glas is
een vlak in de kopgevel), de lichtkoepels, ramen en balkons ontbreken.
