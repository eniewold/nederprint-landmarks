# Concertgebouw (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `concertgebouw.glb` | Catalogusbron in meters: node `building:concertgebouw` (zaal, vleugels, paviljoens, ronde zaal, aanbouw en bijgebouw als gesloten solid) |
| `concertgebouw-1-1000.stl` | Het Concertgebouw op 1:1000 met de onderkant (NAP 0 m) op het printbed (101 × 69 × 28 mm) |
| `concertgebouw.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (120386,78, 485497,13), in de
Grote Zaal, op het maaiveld (NAP +0,5 m), en de glTF-conventie Y omhoog. +X
loopt langs de as naar het oostnoordoosten (RD-richting 22,9 graden), naar de
voorgevel; +Y wijst naar het noordnoordwesten. Het maaiveld wordt op de
straten langs de noord- en zuidkant en voor de voorgevel bemonsterd
(`groundSamplePoints`, AHN NAP +0,2 tot +1,0 m). Vervangt de
PDOK-reconstructie van `NL.IMBAG.Pand.0363100012233435` (het Concertgebouw)
en `NL.IMBAG.Pand.0363100012237012` (het bijgebouw in het westen).

Onderdelen (hoogtes in NAP, uit het AHN-DSM):

- De Grote Zaal (48 bij 29,5 m) met muren tot de goot op +19,5 m en een
  zadeldak met de nok op +26 m langs de as, en aan beide kopse kanten een
  topgevel van 2 m dik die 0,7 m boven het dak uitsteekt, met een pinakel
  (west) en de lier (oost) tot +28,3 m.
- De vleugels rondom de zaal op de BAG-contour tot +16 m, met vier
  hoekpaviljoens (goot +20,5 m, tentdak tot +22,5 m).
- De voorbouw aan de oostkant met een schilddak tot +23 m en drie blinde
  hoge vensters van 3 m breed (+5 tot +14 m, 0,4 m diep).
- De ronde zaal aan de westkant (zestienkant met 9,2 m straal uit de
  BAG-boog, muur tot +22,5 m, kegeldak tot +26,5 m).
- De glazen aanbouw aan de zuidkant (Merkx, 1988) tot +10,5 m en het
  bijgebouw in het westen (laag deel +4 m, vleugel +13 m, paviljoen met
  tentdak tot +20 m).

Vergelijking met het AHN-DSM: binnen de voetafdruk ligt 69 % van de circa
17.000 DSM-cellen binnen 1 m en 82 % binnen 2 m (mediaan +0,12 m); de
afwijkingen zitten in de dakranden en lichtstraten van de vleugels, de glazen
kap tussen zaal en zuidvleugel en de echte rondingen van de paviljoendaken.

Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken lopen
onder 18 tot 45 graden omhoog en topgevels en paviljoens staan op de muren;
alleen de vensternissen hebben een vlakke bovenkant van 0,4 m diep. Met
overhangopvulling op 1:1000 blijft 77,4 cm³ over boven de onderplaat (recht
naar beneden opgevuld 78,6 cm³). In de kaart en in de preview van een
uitsnede van 130 m staat het gebouw met de voorgevel naar de Van
Baerlestraat zonder de vervangen panden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Concertgebouw_(Amsterdam))
(A.L. van Gendt, 1888, glazen aanbouw van Pi de Bruijn en Merkx), PDOK BAG
(de twee panden), PDOK AHN (dsm en dtm 0,5 m via WCS) en de PDOK luchtfoto.
Geschat zijn de vorm van de pinakel en de lier, de hoogte van de topgevels
boven het dak en de plaats van de vensters. Vereenvoudigd: de daken van de
paviljoens zijn tentdaken, de lichtstraten en de glazen kap ontbreken en de
gevels hebben verder geen reliëf.
