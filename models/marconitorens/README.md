# Europoint, Marconitorens (Rotterdam)

Vereenvoudigd, printbaar model van het Europoint-complex aan het Marconiplein in Bospolder, de westelijke poort van Rotterdam: drie identieke kantoortorens van Skidmore, Owings & Merrill (gebouwd 1971–1979, circa 94 m), waarvan de twee oostelijke sinds 2019 de woontorens Lee Towers zijn (verbouwing diederendirrix) en de westelijke de Rotterdam Science Tower, plus het oudere Overbeekhuis (F.U. Verbruggen en P.R. Goldschmidt, 1960–1965), een vliesgevelblok dat aan een betonnen dakparasol op een kern hangt.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `marconitorens.glb` | Model in meters, Y omhoog, drie nodes: `building:europoint-lee-towers`, `building:europoint-rotterdam-science-tower` en `building:europoint-overbeekhuis` |
| `marconitorens.json` | Catalogusitem |
| `marconitorens-1-1000.stl` | Los te printen op 1:1000, Z omhoog (drie losse delen) |

## Oorsprong en oriëntatie

RD-oorsprong `[89211.17, 436393.76]`, in het midden van de entreebouw tussen de twee Lee Towers. De lokale X-as loopt langs de korte gevels van de torens, 5,86° op RD-oost; de lange BAG-zijden van alle drie de torens liggen in dat stelsel op een constante x (afwijking < 0,02 m). Het script meet in een stelsel vanaf het vaste punt `[89200, 436390]` (u, v) en verschuift aan het eind met (−11,496, −2,6).

Lokaal z = 0 is NAP +3,3 m: 3D BAG `b3_h_maaiveld` 3,31 (Lee Towers), 3,17 (Science Tower) en 3,60 (Overbeekhuis), AHN-DTM op de straten rondom 3,2–3,7. `groundSamplePoints` liggen op de straten en stoepen rond de vier gebouwen; `groundHeight` is 46,809 m (ellipsoïdisch, laagste PDOK-terrein op die punten, aan de Galvanistraat), `groundOffsetMetres` −0,15.

`replacesBuildings` bevat de drie BAG-panden: `0599100000701896` (beide Lee Towers met de entreebouw en het verhoogde plein, bouwjaar 1974), `0599100000649440` (Science Tower met de lage delen, bouwjaar 1979) en `0599100000701700` (Overbeekhuis, bouwjaar 1966). De buurpanden steken in hun PDOK-reconstructie niet boven het AHN uit en raken het model niet.

## Onderdelen en maten

| Onderdeel | Vorm | Hoogte (NAP) |
| --- | --- | --- |
| Lee Towers West | schijf van 33,5 × 47,3 m (u −34,2 … −0,7, v −41,24 … 6,1) | dak +97,05 m |
| Lee Towers Oost | schijf van 33,5 × 47,5 m (u 23,42 … 56,9, v −19,66 … 27,8) | dak +97,12 m |
| Rotterdam Science Tower | schijf van 33,5 × 47,8 m (u −98,97 … −65,47, v −16,07 … 31,7) | dak +97,01 m |
| Gevelraster torens | 9 traveeën op de korte, 13 op de lange gevels, penanten van 0,9 m (ook op de hoeken), ramen als nissen van 0,35 m (2,7 m breed); begane grond 7,2 m met glas 0,6 m diep, 21 lagen van 3,78 m (opening 2,68 m, borstweringsband 1,1 m), installatielaag met roosters (opening 5,6 m) onder een dakrand van 1,0 m | |
| Installatieblokken | Lee West 14,5 × 22,9 m met een lagere strook ervoor; Lee Oost 14,5 × 22,2 m met daarop de witte S-vormige opbouw (3D BAG-vlak 129, ook op de luchtfoto); Science Tower 7,2 × 21,8 m en twee kasten van circa 4 × 2 m | +101,1 / +98,65; +101,55 / +102,75; +100,04 / +98,1 m |
| Entreebouw Lee Towers | u −0,7 … 23,65, v −15,5 … 20,7, glazen pui over de begane grond | +10,8 m |
| Lage delen Science Tower | zuidblok 43,7 × 22,1 m en een tussenlid naar de toren, beide met zonnepanelen | +9,16 en +7,6 m |
| Overbeekhuis, hangende vloeren | 27,6 × 26,3 m, 0,85 m binnen de dakparasol; elf lagen van 3,2 m met glasbanden tussen stijlen om de circa 1,95 m (nissen van 1,0 × 2,2 m, 0,3 m diep) | onderkant +14,26 m, dakterras +49,46 m |
| Overbeekhuis, dakparasol | 29,3 × 28,0 m, buitenrand 2,5 m en vier balken van 1,5 m langs de randen van het middenvak (raster op de luchtfoto), onderkant +53,4 m; daaronder de open daklaag met stijlen van 0,9 m om de 3,9 m op de gevellijn en vier hoekschoren onder 45° | +55,05 m |
| Overbeekhuis, kern en opbouw | kern van 9,2 × 11,3 m van maaiveld tot de installatieopbouw in het middenvak; lagere installatieruimte ten oosten ervan | +63,65 m; +58,5 m |
| Overbeekhuis, onderbouw | westblok met de KFC (3D BAG-contour) met een pui en een vensterband; oostblok dat onder de vloeren door tot de kern loopt; lage entreehal tussen het westblok en de kern | +11,1 m; +9,9 m; +7,6 m |

Contouren uit de BAG, dakhoogtes uit de dakvlakken van de 3D BAG (LoD2.2; voor de torens AHN4 2020 en AHN5 2023, voor het Overbeekhuis AHN3 2011), gecontroleerd met het AHN-DSM 0,5 m (torens 97,0–97,2, installatieblokken 101–103, parasol 55,0, dakterras 49,4, installatieopbouw 63,6). Het raster van de dakparasol en de plaats van de installatieblokken komen van de actuele luchtfoto.

## Geschat en weggelaten

- De backlog noemde twee woontorens van 1974 en 1979 met galerijen. Het zijn drie kantoortorens van SOM met een raster van diepliggende ramen, zonder galerijen; beide Lee Towers (de woontorens) vallen onder één pand van 1974, de toren van 1979 is de Rotterdam Science Tower. Alle drie zijn gemodelleerd, met het Overbeekhuis (51,5 m tot de parasol, 3D BAG `b3_h_dak_70p` 53,6) als vierde volume.
- Verdiepingshoogtes van de torens: 22 lagen (begane grond plus 21) volgens skyscrapercenter en PSS; de verdeling (begane grond 7,2 m, lagen van 3,78 m, installatielaag circa 7,2 m) is geschat uit frontale foto's en past op de gemeten dakhoogte. Het aantal traveeën (9 × 13) is op foto's geteld; de nisbreedte volgt uit een gelijke verdeling met penanten van 0,9 m.
- Overbeekhuis: het aantal lagen (elf glasbanden) en de onderkant van de vloeren (+14,26 m) zijn uit foto's geschat; de kern en de onderbouw onder de vloeren zijn niet te meten (plaats van de kern onder de installatieopbouw, de entreehal geschat). De slanke hangers van de gevel om de 1,95 m zijn als stijlen van 0,9 m om de 3,9 m gemodelleerd. Onder de vlakke onderkant van de hangende vloeren en onder de parasol zet de printcorrectie steun (circa 7 % extra volume voor het Overbeekhuis); de vloeren zweven in werkelijkheid.
- Het verhoogde plein ten noorden van de Lee Towers (+4,4 m) hoort bij het BAG-pand maar staat in het AHN-DTM als maaiveld en zit in het PDOK-terrein; het is niet als gebouw gemodelleerd.
- Weggelaten: de gondelrails en lage dakranden op de torens (minder dan 0,5 m hoog), het lage dakvlak op +97,35–97,5 m naast de installatieblokken (0,3–0,4 m boven het dak), de verhoging van de zonnepanelen op het zuidblok van de Science Tower (+9,86 m, 0,7 m), de luifel boven de ingang van de Science Tower en de luifel met kolom van de drive-in onder de KFC (dunner dan 0,9 m), de reclameletters "Rotterdam Science Tower" en de leuningen op het dakterras van het Overbeekhuis.

## Controle

`node scripts/generate-marconitorens.mjs` geeft per node `NoError` en één gesloten deel: Lee Towers genus 0 (32552 driehoeken, 2024 nissen), Science Tower genus 0 (17180 driehoeken, 1067 nissen), Overbeekhuis genus 40 (12108 driehoeken, 688 nissen; de gaten zijn de open daklaag tussen de stijlen en schoren onder de parasol). In de webshop controleert `tests/landmark-models.test.ts` de drie dakhoogtes, de installatieblokken en de S, de entreebouw en de lage delen, de installatieopbouw, parasol, dakterras en onderbouw van het Overbeekhuis, de onderkant van de hangende vloeren, dat een vensternis op de zuidgevel van Lee Towers West na de printcorrectie op 45° een nis blijft, de volumeverhouding print/model (1,005 in totaal; torens 1,000, Overbeekhuis 1,072) en de plaatsing. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, panden `0599100000701896`, `0599100000649440` en `0599100000701700` (met de verblijfsobjecten: 883 woningen in het eerste); actuele orthoHR; AHN-DSM en -DTM 0,5 m (PDOK WCS).
- 3D BAG: [0599100000701896](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000701896), [0599100000649440](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000649440), [0599100000701700](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000701700).
- [Wikipedia: Marconiplein](https://nl.wikipedia.org/wiki/Marconiplein) (Europoint, Overbeekhuis, Lee Towers).
- [Architectuurgids Rotterdam: Overbeekhuis](https://www.architectureguide.nl/project/list_projects_of_city/cit_id/242/prj_id/1855) (vloeren aan een dakparasol op een kern); [Structurae: Europoint I](https://structurae.net/structures/europoint-i).
- Foto's op Wikimedia Commons (niet meegeleverd): [Europoint - Rotterdam - 2010](https://commons.wikimedia.org/wiki/File:Europoint_-_Rotterdam_-_2010.jpg), [Europoint Rotterdam 2018 1](https://commons.wikimedia.org/wiki/File:Europoint_Rotterdam_2018_1.jpg), [Europoint Rotterdam 2018 2](https://commons.wikimedia.org/wiki/File:Europoint_Rotterdam_2018_2.jpg), [Europoint Rotterdam 2019 2](https://commons.wikimedia.org/wiki/File:Europoint_Rotterdam_2019_2.jpg), [Europoint](https://commons.wikimedia.org/wiki/File:Europoint.jpg), [Overbeekhuis in 2013](https://commons.wikimedia.org/wiki/File:Overbeekhuis_in_2013.jpg), [Overbeekhuis2](https://commons.wikimedia.org/wiki/File:Overbeekhuis2.jpg), [Marconiplein foto3 2014](https://commons.wikimedia.org/wiki/File:Rotterdam,_Marconiplein_foto3_2014-03-09_10.56.jpg).
