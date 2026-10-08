# Johan Cruijff ArenA (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `johan-cruijff-arena.glb` | Catalogusbron in meters: één node `building:stadion` met stadion, dakdelen, spanten, torens en bijgebouwen |
| `johan-cruijff-arena-1-1000.stl` | Het stadion in één stuk op 1:1000, met de onderkant (NAP -5 m) op het printbed (257 × 214 × 74 mm) |
| `johan-cruijff-arena.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong in het hart van het veld op straatniveau
(NAP -3,4 m) en de glTF-conventie Y omhoog. +X loopt langs de lengteas van het
veld naar het zuidzuidoosten (RD-richting (0,485, -0,875), 61 graden onder het
oosten), +Y dwars daarop. Het maaiveld wordt op drie punten op de straten rond
het stadion bemonsterd (`groundSamplePoints`), niet op het verhoogde dek
eromheen (NAP +6 m). Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0363100012075730`; de PDOK-reconstructie daarvan is een
LoD1.1-blok op één hoogte, zonder veldopening, dak of spanten.

Alle vormen zijn glad en op het AHN gefit, zodat gevel en dak strak zijn (een
eerdere versie als hoogteveld uit het AHN gaf kartels langs gevel en dakrand).
Het Mapbox Standard-landmarkmodel is alleen visueel vergeleken (dakvorm, spanten
op torens buiten de gevel); er is geen geometrie uit overgenomen.

Onderdelen in het model (hoogtes in NAP):

- Ovale gevel als superellips |u/116|^2,8 + |v/88|^2,8 = 1 (AHN-dakrand,
  mediane afwijking 0,6 %), verticaal van de onderkant tot het dak.
- Dak als even polynoom in u en v (achtste graad), gefit op het AHN buiten
  veldopening, spanten en dakdelen (rms 0,6 m): +62,7 m in het hart, circa
  +42 m aan de rand.
- Veldopening van 106 × 69 m met afgeronde hoeken, het veld op +7,4 m.
- Opengeschoven dakdelen boven de lange tribunes: 8,3 m boven het dak, tot
  |u| 54,5 m, van |v| 39 tot 71 m (AHN; Wikipedia: twee delen van 37 × 120 m).
- Twee boogvormige dwarsspanten op 59 m aan weerszijden van het hart (118 m
  uit elkaar): driehoekig vakwerk als massief prisma van 10 m breed en 11,9 m
  hoog, met de top van +69,4 m in het midden naar +49 m op 92,5 m; de onderkant
  zakt overal in het dak en buiten het ovaal lopen de spanten als pyloon door tot
  de grond.
- Vier ronde torens van 7 m doorsnede onder de spanteinden, met een koepel tot
  +51,5 m.
- Bijgebouwen buiten het ovaal (BAG-contour min ovaal): het bouwdeel aan de
  zuidwestkant met daken op +13,9 en +26,5 m en twee hogere delen tot +43,4 m,
  en twee lage bouwsels aan de kopse kanten (+0,7 m).

Er hangt niets vrij over dat de export moet opvullen, op een paar kleine
vlakjes na; de export van een uitsnede van 400 mm met het stadion duurt
daardoor circa 5 seconden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Johan_Cruijff_ArenA)
(Schuurman en Soeters, 1996, veld 105 × 68 m, schuifdak van twee delen van
37 × 120 m, onderkant 8,4 m boven maaiveld), PDOK BAG (contour), PDOK AHN (dsm
en dtm 0,5 m via WCS: dakrand, dakvlak, veldopening, dakdelen, spanten, torens,
bijgebouwen en straatniveau) en de PDOK luchtfoto. De tribunes onder het dak,
de gevelindeling, de tweede bol die de luchtfoto per spanteinde toont en het
vakwerk van de spanten zijn niet of vereenvoudigd gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
