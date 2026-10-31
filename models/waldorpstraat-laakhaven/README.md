# Studententorens Waldorpstraat (Den Haag)

Vereenvoudigd, printbaar model van de twee vrijstaande studententorens aan de Waldorpstraat in Laakhaven-Oost, langs het spoor bij station Den Haag HS (2013, K2 Architecten, 620 studentenwoningen, beheer DUWO). Beide torens zijn rechthoekige blokken van circa 70 m in donkere baksteen met een 'streepjescodegevel': witte verticale vensterbanen van wisselende breedte, op elke gevel anders. Boven de begane grond loopt langs de straat- en de spoorgevel een luifel; op het platte dak staan een liftopbouw, een installatie en ventilatiekappen.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `waldorpstraat-laakhaven.glb` | Model in meters, Y omhoog, twee nodes: `building:waldorpstraat-laakhaven-toren-47` (zuidwest) en `building:waldorpstraat-laakhaven-toren-45` (noordoost) |
| `waldorpstraat-laakhaven.json` | Catalogusitem |
| `waldorpstraat-laakhaven-1-1000.stl` | Los te printen op 1:1000 (108 × 28 × 74 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[81703.53, 453728.71]`, midden tussen de twee torens. De X-as loopt langs de lange gevels naar het noordoosten (34,96° op RD-oost; de BAG-randen van beide torens zijn evenwijdig binnen 0,1°), de Y-as haaks erop naar het spoor. Lokaal z = 0 is NAP +0,7 m, het maaiveld aan de Waldorpstraat; `groundHeight` is 44,14 m (NAP +0,7 plus de geoïde NLGEO2018 ter plekke, 43,44; de Laakhaventoren is op 43,43 geijkt) en `groundOffsetMetres` −0,15. `groundSamplePoints` liggen op de stoep langs de Waldorpstraat. Aan de spoorkant en aan de noordoostkant ligt het parkeerterrein op een verhoging van circa NAP +3,5 m; dat terrein hoort niet bij de panden en zit niet in het model.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren 47 (pand `0518100001625661`) | BAG-contour 27,6 × 22,3 m | +72,1 m | BAG, 3D BAG (70e percentiel 72,11), AHN-DSM (mediaan 72,07) |
| Toren 45 (pand `0518100001625111`) | BAG-contour 27,4 × 22,3 m | +72,1 m | BAG, 3D BAG (70e percentiel 72,12), AHN-DSM (mediaan 72,07) |
| Liftopbouw | 4,0 × 3,3 m (47) en 4,25 × 3,5 m (45) | +73,22 m | 3D BAG-dakvlak (73,21–73,25), AHN-DSM |
| Installaties op het dak | twee per toren, 1,0–2,5 × 1,5–2,0 m | +73,45 tot +73,75 m | AHN-DSM |
| Ventilatiekappen | 1,0 × 1,0 m, zeven (47) en zes (45) | +73,0 m | AHN-DSM (72,9–73,1), luchtfoto |
| Luifel straatgevel | volle gevelbreedte, 3,5 m diep, 1,5 m dik | bovenkant +6,55 m | AHN-DSM (6,4–6,7), luchtfoto |
| Luifel spoorgevel | volle gevelbreedte, 2,4 m diep, 1,5 m dik | bovenkant +6,55 m | AHN-DSM |
| Lagen | begane grond 5,4 m, 23 woonlagen van 2,82 m | tot +71,0 m | ritme van de vensterbanen in de luchtfoto |

Gevelreliëf: elke witte vensterbaan is per woonlaag een blinde nis over de volle baanbreedte (1,0–3,2 m), 0,35 m diep met een plafond onder 45°, met tussen de lagen een borstwering van 1,15 m. De banen staan per gevel op hun gemeten plaats: straat- en zuidwestgevel uit de luchtfoto van 2026, spoor- en noordoostgevel uit die van 2023 (andere kijkrichting). Onder elke luifel loopt een kraag onder 45° naar de gevel.

## Geschat en weggelaten

- Naam: de torens hebben geen eigen projectnaam en staan niet (meer) in de hoogbouwlijst; ze heten hier naar de straat en hun functie.
- Het aantal lagen (24) en de verdiepingshoogte komen uit het ritme van de vensterbanen in de schuine luchtfoto, niet uit een bron.
- De plaats en breedte van de vensterbanen zijn op ±0,5 m uit de luchtfoto's gemeten; op de spoor- en noordoostgevel (in de schaduw) is de breedte minder zeker.
- De dikte van de luifels (1,5 m) is de printminimum, niet gemeten; in het echt zijn het dunne platen.
- Weggelaten: de lamellen in de luifels en de dakrandbeveiliging (kleiner dan 0,9 m), en de indeling van de begane grond (geen beeld van de gevels onder de luifels).

## Controle

`node scripts/generate-waldorpstraat-laakhaven.mjs` geeft per toren `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test de daken, liftopbouwen en luifels, dat een vensternis in de straatgevel na de printcorrectie op 45° open blijft, dat de printcorrectie minder dan 1 % volume toevoegt, één component per toren en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG (benadering van de PDOK-reconstructie) en de luchtfoto's gelegd.

## Bronnen

- PDOK BAG, panden `0518100001625661` (Waldorpstraat 47) en `0518100001625111` (Waldorpstraat 45), bouwjaar 2013; luchtfoto's orthoHR 2026 en 2023; AHN-DSM en -DTM 0,5 m; 3D BAG (LoD2.2, AHN5 2023).
- [Lijst van hoogste gebouwen van Den Haag](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag).
- [Kegro: 620 studentendeuren voor Waldorpstraat Den Haag](https://kegro.nl/studenten-waldorpstraat-den-haag/) (architect K2, hoogte 70 m, streepjescodegevel).
