# Zilveren Toren (Den Haag)

Vereenvoudigd, printbaar model van de Zilveren Toren aan de Prinses Beatrixlaan (kantoortoren uit 1969–1971, gerenoveerd als hoofdkantoor van MN): een schijf met golvende horizontale zonweringsbanden per verdieping, een dichte aluminium kroon rond het dak met twee installatieruimtes erbinnen, een lage vleugel met een gebogen dak naast de verdiepte Utrechtsebaan, en de lage verbindingsdelen tussen vleugel en toren.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `zilveren-toren.glb` | Model in meters, Y omhoog, één node `building:zilveren-toren-schijf-kroon-en-gebogen-vleugel` |
| `zilveren-toren.json` | Catalogusitem |
| `zilveren-toren-1-1000.stl` | Los te printen op 1:1000 (57 × 101 × 75 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[82865.02, 455071.54]`, het hart van het BAG-pand. De lokale X-as loopt langs de lange gevel, 35,6° linksom op RD-oost; +Y wijst naar het noordwesten (de toren), −Y naar de vleugel. Lokaal z = 0 is NAP +0,66 m: het maaiveld rondom volgens de AHN-DTM (+0,66 tot +1,0 m). De 3D BAG geeft voor dit pand een maaiveld van NAP −1,98 m, kennelijk van een verdiept deel; met die waarde zou het model 2,6 m te hoog komen. `groundSamplePoints` liggen op de paden rondom, `groundHeight` is 44,141 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Schijf | 56,0 × 28,1 m | dak +69,86 m |
| Dichte kroon | rand van 1,5 m rondom, vanaf circa +61 m | +74,9 m |
| Twee installatieruimtes op het dak | 14,2 × 12,8 m en 14,3 × 9,0 m | +73,68 m |
| Vleugel met gebogen dak | 49,4 × 50,5 m, parabool langs de lange as | rand +17,35 m, top +20,6 m |
| Oostelijke strook langs de vleugel | 3,7 × 54,5 m | +9,1 m |
| Verbinding naar de toren | 22,7 × 15 m | +9,3 m |
| Laag deel westkant | 22,6 × 15 m | +5,8 m |

Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023). Het gebogen dak is een parabool door de drie dakvlakken die de 3D BAG voor de vleugel geeft (+17,5 / +20,4 / +19,8 / +17,2 m), opgebouwd uit 24 stroken.

## Geschat en weggelaten

- De onderkant van de kroon (+61 m) en de verdiepingen (begane grond 5 m, 16 kantoorlagen van circa 3,46 m) komen uit foto's. Per laag een zonweringsband: glas 0,45 m achter een band van 0,9 m, plafond onder 45°, hoekpenanten van 0,95 m. De golving van de banden en de belettering op de kroon zijn kleiner dan 0,9 m of alleen kleur.
- De BAG-contour heeft een spleet van 0,9 m tussen het lage westdeel en de toren; die is gedicht zodat het model één geheel is.
- Delen van de BAG-contour zonder dakvlak in de 3D BAG (doorgangen op maaiveld) zijn niet gemodelleerd.

## Controle

`node scripts/generate-zilveren-toren.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van alle delen, de top en de rand van het gebogen dak, dat een zonweringsband na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd; de kaart met landmarks aan en een preview-export op 1:1000 (ondersteuning 0,06 % van het volume) zijn bekeken.

## Bronnen

- PDOK BAG, pand `0518100000246102` (bouwjaar 1971); actuele orthoHR; AHN-DTM 0,5 m (PDOK WCS) voor het maaiveld.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000246102).
- [Wikipedia: Zilveren Toren](https://nl.wikipedia.org/wiki/Zilveren_Toren).
- Foto's op Wikimedia Commons (niet meegeleverd): [Zilveren Toren Den Haag](https://commons.wikimedia.org/wiki/File:Zilveren_Toren_Den_Haag.jpg), [Zilveren toren - Den Haag](https://commons.wikimedia.org/wiki/File:Zilveren_toren_-_Den_Haag.JPG).
