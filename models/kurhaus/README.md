# Kurhaus (Scheveningen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `kurhaus.glb` | Catalogusbron in meters: node `building:kurhaus` (vleugels, middenblok, koepel, torentjes en lage delen als gesloten solid) |
| `kurhaus-1-1000.stl` | Het Kurhaus op 1:1000 met de onderkant (NAP +8,5 m) op het printbed (142 × 88 × 47,5 mm) |
| `kurhaus.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (79287,66, 458896,00), in het
middenblok, op het maaiveld van het Gevers Deynootplein (NAP +9,0 m), en de
glTF-conventie Y omhoog. +X loopt langs de hoofdvleugel naar het noordoosten
(RD-richting 46,4 graden); +Y wijst naar het noordwesten, de zee. Het
maaiveld wordt op het plein bemonsterd (`groundSamplePoints`, AHN NAP +8,6
tot +8,8 m), niet op de boulevard aan zee (+10 tot +12 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0518100000205738`.

Onderdelen (hoogtes in NAP, uit dwarsprofielen en een radiaal profiel van
het AHN-DSM):

- De hoofdvleugel van 125 bij 18,5 m met muren tot de goot op +29 m en een
  flauw schilddak (+32 m op 3 m uit de gevel) met een plat bovendak op
  +33 m, een kroonlijst onder de goot (1 m hoog, 0,9 m uitstekend onder 48
  graden, ook om de kopvleugels), in de pleingevel blinde vensters van 1,4 m
  breed om de 3,5 m op drie verdiepingen en lisenen van 0,8 m breed (0,5 m
  diep) tussen de vensters, aan de pleingevel en aan de zeegevel; de zeegevel
  boven de lage vleugels heeft twee verdiepingen blinde vensters.
- De twee kopvleugels naar zee (42 m diep) met een zadeldak dwars op de
  hoofdvleugel tot de nok op +34 m, en in de kopgevels drie vensters op twee
  verdiepingen met een venster in de punt van de gevel.
- Het middenblok (+31,5 m) met de achtkante koepel om het zwaartepunt van
  het DSM: tambour met 13,3 m straal tot +39,5 m, koepel tot +45,5 m,
  lantaarn tot +51 m en spits tot +56 m; vier achtkante hoektorentjes met een
  koepeltje tot +37,5 m en het portaal aan het plein tot +20 m met een
  frontonnetje tot +23 m. In de acht vlakken van de tambour zitten blinde
  nissen van 2,2 m breed (NAP +33,5 tot +38 m); het middenblok heeft
  blinde vensters boven het portaal en aan de zeekant.
- De lage delen op de BAG-contour, met de hoogte per deel uit de mediaan van
  het DSM: de vleugels naar zee (+16,5 en +17,5 m), het terras en het
  paviljoen aan zee (+12 en +10,5 m), de stroken aan het plein (+12 m) en
  het bijgebouw in het westen (+13 en +15,5 m); in de noordgevels van de
  vleugels naar zee zitten blinde vensters van 1,6 m breed (NAP +11,5 tot
  +14,5 m).

Vergelijking met het AHN-DSM: binnen de voetafdruk ligt 67 % van de circa
35.000 DSM-cellen binnen 1 m en 82 % binnen 2 m (mediaan -0,01 m); de
afwijkingen zitten in de lage delen naar zee, die in werkelijkheid binnenplaatsen
en lichtkappen hebben, en in de randen van de daken.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken en de
koepel lopen alleen omhoog en de torentjes staan op het middenblok; alleen de
vensternissen hebben een vlakke bovenkant van 0,35 m diep. Met
overhangopvulling op 1:1000 blijft 125,3 cm³ over boven de onderplaat: de
export voegt niets toe aan het model (125,3 cm³), ook niet onder de
kroonlijst. In de kaart (vanaf het plein, met de zee
erachter) en in de preview van een uitsnede van 170 m staat het gebouw zonder
het vervangen pand.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Kurhaus_(Scheveningen))
(Henkenhaf en Ebert, 1885), PDOK BAG (het pand), PDOK AHN (dsm en dtm 0,5 m
via WCS) en de PDOK luchtfoto. Geschat zijn de vorm van de spits en van de
koepeltjes, de plaats en het aantal van de vensters, de lisenen, de kroonlijst,
het frontonnetje en de grenzen tussen de lage delen. Vereenvoudigd: de koepel
is achtkant gefacetteerd, de dakkapellen, balustrades en overige
gevelornamenten (zuilen, bogen in het portaal) ontbreken en de binnenplaatsen van de lage
delen zijn dicht.
