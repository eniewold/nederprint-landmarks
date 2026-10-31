# Haasje Over (Eindhoven)

Vereenvoudigd, printbaar model van Haasje Over op Strijp-S (VMX Architects voor Trudo, 2021), in de werklijst "Woontoren Veemstraat (Strijp-S)". Een rode woontoren van 19 lagen in gepigmenteerd prefab-beton met verspringende vensters en een open kroon van zonnepanelen; een dubbele glazen arm van twee lagen loopt op 12 m hoogte in U-vorm rond een patio over de oude Philipshal met de skatebaan heen, en op de tiende verdieping gaat een stalen vakwerkbrug naar het dak van gebouw Anton. De hal uit 1958 hoort bij het model omdat de PDOK-reconstructie van die hal de arm bevat.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `veemstraat-strijp-s.glb` | Model in meters, Y omhoog, twee nodes: `building:veemstraat-strijp-s-toren` (toren, kroon en luchtbrug) en `building:veemstraat-strijp-s-arm-en-skatehal` |
| `veemstraat-strijp-s.json` | Catalogusitem |
| `veemstraat-strijp-s-1-1000.stl` | Los te printen op 1:1000 (100 × 115 × 80 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[159726.94, 384339.05]`, het hart van de torencontour. De X-as loopt langs de lange armgevels naar het noordoosten (`xAxis` `[0.4723, 0.8815]`, 61,82° op RD-oost; BAG-randen evenwijdig), Y 90° linksom naar het noordwesten. Lokaal z = 0 is NAP +18,42 m (3D BAG-maaiveld); `groundHeight` is 62,34 m (NAP + geoïde 43,92 m uit NLGEO2018 ter plekke, gelijk aan de PDOK-voet van het pand) en `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (pand `0772100001026060`) | 22,74 × 30,10 m, 3 × 4 travees van 7,5 m | dakrand +91,51 m | BAG, AHN4-DSM (mediaan 91,51) |
| Kroon | paneelrand 1,0 m buiten de gevel, 1,0 m dik; kern 3 m achter de gevel; palen 0,9 m op hoeken en traveelijnen; opening 5,6 × 13 m | +98,02 m | 3D BAG (AHN5, 98,01–98,03), luchtfoto, foto's |
| Woonlagen | 14 lagen van 3,65 m boven de arm, dichte bovenrand | +38,52 tot +91,51 m | foto zuidoostgevel |
| Glazen band om de toren | twee lagen ter hoogte van de arm | +30,2 tot +38,52 m | foto |
| Rode sokkel en glazen begane grond | kolommen 0,9 m op de traveelijnen | tot +21,6 m en +30,2 m | foto |
| Arm (pand `0772100001026060`) | 57,74 × 30,10 m, U-vorm rond een patio van 13,4 m breed | +30,2 tot +38,52 m | BAG, AHN4 (38,51–38,52), 3D BAG (38,47–38,59) |
| Patio | open tot op het haldak tussen u 16,0 en 49,5 m; dekken aan beide koppen | +26,55 m, dekken +31,5 m | AHN4 |
| Onderbouw onder de arm | 2 m teruggezet, kraag onder 45° | tot +28,1 m | geschat |
| Hal (pand `0772100000303079`, 1958) | 40,4 × 114,8 m | +26,55 m | BAG, AHN4 (26,50–26,60) |
| Zaagtanden op de hal | zes tanden op 5,0 m, stijgend naar het noordoosten | tot +28,6 m | AHN4-profiel, 3D BAG (tot 28,6–28,9) |
| Luchtbrug naar Anton | 19,7 × 7,25 m, vakwerk met regels van 0,9 m | +52,4 tot +56,4 m | breedte uit het DSM, hoogte uit foto |

Gevelreliëf (blinde nissen van 0,35 m met een plafond onder 45°): per woonlaag en travee één venster van 5,0 × 2,2 m (glas plus dicht paneel), verspringend links of rechts en ongeveer een op de drie travees dicht, zoals op de foto's; de gemeenschappelijke laag (vijfde boven de arm) rondom glas; in de glazen band en in de arm per laag ramen tussen stijlen van 0,9 m; in de hal vensters van 3,0 m op 5,0 m. De begane grond van de toren is een nis van 0,6 m tussen de kolommen; de vakwerkbrug heeft driehoekige nissen tussen de diagonalen.

## Geschat en weggelaten

- Naam: de werklijst noemt het pand "Woontoren Veemstraat"; BAG-pand, bouwjaar, rode gevel en arm over de skatehal horen bij Haasje Over (80 m inclusief kroon in de hoogbouwlijst).
- Het AHN4 is gevlogen voor de kroon klaar was (DSM tot circa 92–96 m); de kroonhoogte komt uit de 3D BAG (AHN5).
- Onderkant van de arm (+30,2 m), sokkel en begane grond, de lagenindeling en het vensterpatroon zijn geschat uit foto's.
- Kroon: in werkelijkheid een open stalen frame met schuine panelen; gemodelleerd als kern 3 m achter de gevel met palen en een overstekende paneelrand, zodat hij zonder steun printbaar is.
- Onder de kop van de arm (noordoost, circa 10 m voorbij de hal) is het open; in het model loopt de onderbouw daar door tot het maaiveld, 2 m teruggezet, omdat een vrije plaat van 30 m breed op 1:1000 niet zonder steun te printen is.
- Luchtbrug: hoogte en vakwerkopbouw geschat (in het AHN4 ruis van 29 tot 53 m); de brug landt 1 m over de dakrand van Anton. De export vult onder de brug op (printvolume toren +1,9 %), omdat Anton niet bij dit model hoort.
- Hallevensters geschat; de PDOK-hal wordt vervangen omdat zijn reconstructie de arm bevat (blok tot NAP +38,6 m dat 0,3 m buiten de zuidoostgevel van de arm steekt en op de noordwestgevel samenvalt).
- Weggelaten: de gevelonderhoudsinstallatie in de kroonopening en de installatiekastjes op de arm (kleiner dan 0,9 m), de ribben van het prefab-gevelraster (minder dan 0,3 m reliëf), de ingang (geen foto van de entreezijde).

## Controle

`node scripts/generate-veemstraat-strijp-s.mjs` geeft per node `NoError` en één gesloten deel (toren genus 14, arm en hal genus 0). In de webshop controleert de test de dakhoogtes van toren, kroon, arm, patio, hal en zaagtand, de nissen van de gemeenschappelijke laag en de arm, de open kroon tussen de palen en de teruggezette onderbouw na de printcorrectie op 45°, het printvolume (arm < 1 %, toren < 3 % door de luchtbrug) en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en foto's gelegd.

## Bronnen

- PDOK BAG, panden `0772100001026060` (2021) en `0772100000303079` (1958); actuele orthoHR; AHN4-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5 2024); PDOK 3D-gebouwtegels.
- [Lijst van hoogste gebouwen van Eindhoven](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Eindhoven).
- [VMX Architects, Haasje Over (Divisare)](https://divisare.com/projects/512191-vmx-architects-marcel-van-der-burg-haasje-over).
- Foto's op Wikimedia Commons (niet meegeleverd): [Woontoren Haasje Over in Eindhoven](https://commons.wikimedia.org/wiki/File:Woontoren_Haasje_Over_in_Eindhoven.jpg), [Nieuwbouw in de Eindhovense wijk Strijp-S](https://commons.wikimedia.org/wiki/File:Nieuwbouw_in_de_Eindhovense_wijk_Strijp-S.jpg), [Haasje-2021](https://commons.wikimedia.org/wiki/File:Haasje-2021.jpg), [Haasje Over Eindhoven](https://commons.wikimedia.org/wiki/File:Haasje_Over_Eindhoven.jpg).
