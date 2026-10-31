# Scheepvaart en Transport College (Rotterdam)

Vereenvoudigd, printbaar model van het Scheepvaart en Transport College (STC-gebouw) aan de Lloydstraat 300 in het Lloydkwartier, ontworpen door Neutelings Riedijk en opgeleverd in 2005. Het gebouw is opgezet als een periscoop: een vierkante schacht van 16 lagen met bovenop een kop van vier lagen die naar het westen uitkraagt, met een groot ingelijst venster naar de haven; aan de noordkant een onderbouw met een schuin dak, aan de west- en zuidkant een lage vleugel met op de zuidwesthoek een witte doos met een groot venster naar de rivier, en langs de oostgevel een teruggelegde begane grond achter V-kolommen. De gevels zijn een schaakbord van blauwe en zilvergrijze golfplaat met een raamstrook per laag.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `stc-gebouw.glb` | Model in meters, Y omhoog, één node `building:stc-gebouw` |
| `stc-gebouw.json` | Catalogusitem |
| `stc-gebouw-1-1000.stl` | Los te printen op 1:1000 (62 × 82 × 69 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[91287.24, 435192.8]`, in het hart van de schacht. De X-as loopt langs de zuidgevel naar het oosten (8,1° op RD-oost, de BAG-randen liggen op 8,05–8,09°), Y haaks erop naar het noorden. Het script rekent in een stelsel (u, v) vanaf de zuidoosthoek van de BAG-contour; model x = u + 16,7, y = v − 18,7. De westgevels staan 12,9° scheef op de rest (BAG en 3D BAG). Lokaal z = 0 is NAP +3,0 m, de kade aan de oost- en zuidkant; `groundHeight` is 46,5 m (NAP + 43,5; NLGEO2018 geeft 43,62 en de Lloydtoren 43,5) en `groundOffsetMetres` −0,15. `groundSamplePoints` liggen op de kade en de straat rondom, niet in het water.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Schacht | 32,4 × 32,6 m | dak +64,2 m | BAG-knik op de zuidrand, AHN-DSM, 3D BAG (64,20–64,22) |
| Scherm van de bovenste laag | rondom de kop, 1,0 m dik | +68,4 m | 3D BAG (68,38–68,45) |
| Uitkragende kop | 20,4 m uitkraging aan de zuidkant, 13,0 m aan de noordkant, vier lagen | onderkant +52,4 m, dak +67,4 m | 3D BAG (67,35–67,53), foto's (onderkant) |
| Installatiekast | 21,5 × 12,1 m | +69,2 m | 3D BAG (69,15–69,2), DSM (69,1–69,4) |
| Opstanden langs de kast | 2,1 m en 1,1 m breed | +69,85 en +69,77 m | 3D BAG |
| Plateaus ten noorden van de kast | 18,4 × 3,4 m en 5,5 × 4,2 m | +67,4 en +66,6 m | 3D BAG |
| Voet van de gevelonderhoudskraan | 2 × 2 m | +71,6 m | AHN-DSM |
| Onderbouw met schuin dak | tussen toren en noordgevel, 9,9° naar het noorden | +26,77 tegen de toren, +19,24 aan de noordgevel | 3D BAG, DSM (25,0 op 10 m van de toren, 22,35 op 25 m) |
| Lage vleugel west en zuid | rest van de BAG-contour, drie lagen | +15,2 m | 3D BAG (14,6–15,6), DSM (14,8–15,4) |
| Arcade langs de oostgevel | 75 m lang, 2,4 m diep, 10 V-kolommen; één travee op de zuidgevel bij de zuidoosthoek | onderkant gevel +7,6 m | foto's |

Gevelreliëf: begane grond 4,6 m, daarboven lagen van 3,8 m. Per vak van 3,6 m een raamstrook van 2,7 × 1,5 m onderin de laag (begane grond 2,8 m hoog) als blinde nis van 0,35 m met een plafond onder 45°. De westkop heeft een ingelijst venster (rand 1,8 m opzij, 3,0 m onder, 2,6 m boven, 1,2 m diep) en de zuidgevel van de witte doos een ingelijst venster van 1,0 m diep; beide plafonds onder 45°. De arcade heeft een plafond onder 45° van +2,2 m tegen de pui naar +4,6 m aan de gevel; de V-kolommen zijn 0,9 m diep met poten van 1,1 m breed.

## Geschat en weggelaten

- De onderkant van de kop (+52,4 m) komt uit de foto's: vier lagen van 3,8 m plus een vloerrand. Het AHN ziet alleen het dak, en het AHN4 geeft op de kop alleen ruis; de daken en de westgevel van de kop komen uit de 3D BAG (AHN5 2022).
- De westgevel van de schacht onder de kop ligt op de knik in de BAG-zuidrand en de rand van de AHN-ruis; de verhouding schacht/kop klopt met frontale foto's van de zuidgevel (0,61–0,64).
- De zuidgevel van de schacht ligt op het DSM, 2,4 m binnen de BAG-rand; de BAG-strook ervoor is maaiveld.
- Wat onder de kop zit is aangenomen als de lage vleugel op +15,2 m, zoals de foto's laten zien.
- Verdiepingshoogtes, het vensterraster, de diepte van de arcade, de vorm en het aantal V-kolommen en de randen van de grote vensters zijn geschat uit foto's.
- Het scherm van de bovenste laag is in werkelijkheid een open lamellenwand; hier een dichte wand van 1,0 m.
- Weggelaten: de giek van de gevelonderhoudskraan (dunner dan 0,9 m en vrij uitkragend), de lamellen en stijlen van de grote vensters, de belettering en het logo (kleiner dan 0,9 m), en het schaakbordpatroon (alleen kleur). Een strook van 2 m op circa +10 m langs de zuidrand van de witte doos in het AHN4 staat niet in de 3D BAG en is niet gemodelleerd.

## Controle

`node scripts/generate-stc-gebouw.mjs` geeft `NoError`, genus 22 (de openingen tussen en in de V-kolommen) en één gesloten deel. In de webshop controleert de test de daken van schacht, kop, scherm, installaties, kraanvoet, onderbouw en lage vleugel, de vrije onderkant van de kop, dat de arcade en het venster in de westkop na de printcorrectie op 45° open blijven, één component en de plaatsing op het maaiveld. De export vult onder de uitkraging een wig van 45° tegen de schacht op; het volume groeit daardoor met circa 2,3 %. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0599100000750477` (bouwjaar 2005, onderwijsfunctie); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG `NL.IMBAG.Pand.0599100000750477` (LoD2.2, puntenwolk AHN5 2022).
- [Neutelings Riedijk: Shipping and Transport College](https://neutelings-riedijk.com/shipping-and-transport-college/); [Architectuurgids Rotterdam](https://www.architectureguide.nl/project/item/prj_id/1952/alfa/S).
- Foto's op Wikimedia Commons (niet meegeleverd): [STC Lloydstraat](https://commons.wikimedia.org/wiki/File:STC_Lloydstraat.jpg), [panoramio](https://commons.wikimedia.org/wiki/File:Shipping_and_Transport_College_-_panoramio.jpg), [Lloydstraat](https://commons.wikimedia.org/wiki/File:Scheepvaart_en_Transport_College_-_Lloydstraat_-_Rotterdam_(28872432443).jpg), [V-kolommen](https://commons.wikimedia.org/wiki/File:Rotterdam_-_Scheepvaart_en_Transport_College_(5).jpg).
