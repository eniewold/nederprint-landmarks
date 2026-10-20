# Harbour Village (Rotterdam)

Vereenvoudigd, printbaar model van Harbour Village op het Wijnhaveneiland (HM Architecten, hoogste punt 2001, opgeleverd 2002): twee woontorens, elk met een eigen plint van vijf lagen. De toren aan de Jufferstraat is 85 m hoog (29 lagen), de toren aan de Bierstraat 70 m (24 lagen). De noord- en zuidgevels zijn gemetseld met loggia's; de oost- en westgevels zijn van glas en staan schuin.

Let op: de backlog noemde één toren aan de Jufferstraat met twee BAG-panden "toren en voet". Volgens Wikipedia, de BAG-adressen en de 3D BAG zijn de twee panden de twee torens: `0599100000750224` is de toren Jufferstraat (Jufferstraat 96–318), `0599100000750223` de toren Bierstraat (Bierstraat 101–301). Het model bevat daarom beide torens. Het bouwjaar in de BAG is voor beide 2002 (de 3D BAG geeft voor de toren Bierstraat 2003); de backlog noemde circa 83 m, de 3D BAG geeft een dak op NAP +85,1 m (82,6 m boven maaiveld).

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `harbour-village.glb` | Model in meters, Y omhoog, één node `building:harbour-village-twee-torens-met-schuine-glasgevels-en-plinten` |
| `harbour-village.json` | Catalogusitem |
| `harbour-village-1-1000.stl` | Los te printen op 1:1000 (56 × 58 × 86 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[93078, 436840]`, tussen de twee BAG-panden bij de gedeelde muur. De lokale X-as staat 18,1° linksom op RD-oost, langs het straatraster van het Wijnhaveneiland (BAG-gevels van beide panden en van Up:Town); +Y wijst naar het noordnoordwesten. De toren Jufferstraat staat aan de −X-kant, de toren Bierstraat aan de +X-kant. Lokaal z = 0 is NAP +2,48 m. `groundSamplePoints` liggen op de Jufferstraat, de Bierstraat en de straat aan de zuidkant, `groundHeight` is 46,026 m (ellipsoïdisch), `groundOffsetMetres` −0,15.

## Onderdelen en maten

| Onderdeel | Plattegrond (lokaal) | Hoogte (NAP) |
| --- | --- | --- |
| Toren Jufferstraat | vierhoek: noordrand v = −2,5, westrand u = −24,6, zuidrand 15,8° gedraaid, oostgevel geknikt | +85,1 m |
| Liftopbouw | 2,4 × 9,4 m | +87,7 m |
| Noordstrook toren Jufferstraat | driehoek tussen hoofddak, westgevel en een 16° gedraaide noordgevel | +77,0 m |
| Toren Bierstraat | westrand u = 7,3, zuidgevel 15,4° gedraaid, oost- en noordgevel op de BAG-contour (oostgevel geknikt) | +71,6 m |
| Westvleugel toren Bierstraat | geknikte glazen westgevel van (4,0; 3,0) via (1,6; 9,0) naar (0,8; 15,8) | +63,5 m |
| Installaties toren Bierstraat | 3,4 × 12 m en 2,2 × 3,1 m | +74,13 en +74,77 m |
| Plinten | per dakdeel op de BAG-contour | +10,2 / 10,8 / 11,4 / 11,5 / 12,9 / 14,2 / 14,25 / 17,1 / 17,2 / 17,3 / 17,6 / 17,9 / 18,0 m |
| Lessenaarsdak tussen de torens | z = 0,089 u − 0,2645 v + 16,81 | +17,3 tot +21,0 m |

De glazen westgevel van de toren Jufferstraat staat aan de voet op de BAG-contour (u = −26,2 tot −28,8) en helt naar de dakrand op u = −24,6: 1,6 m naar binnen aan de noordkant, 4,2 m aan de zuidkant. Het AHN-DSM ziet daar een schuin vlak met hoogtes die naar de toren toe oplopen, de luchtfoto een glazen strook naast de dakrand.

Contouren uit de BAG, dakhoogtes uit de 3D BAG (LoD2.2, AHN5 2023), dakranden van de torens uit het AHN-DSM 0,5 m, verdiepingen uit Wikipedia: 5 lagen in de plint (begane grond 4,2 m, daarboven 2,63 m) en 24 resp. 19 lagen erboven (2,83 en 2,86 m).

## Geschat en weggelaten

- De helling van de westgevel van de toren Jufferstraat is uit het DSM en de BAG-contour afgeleid; tussen voet en dakrand is de gevel een gedraaid vlak (omhulsel van beide contouren).
- De knik in de oostgevel van de toren Jufferstraat (in (−4,6; −8,8)) is geschat uit het DSM en de foto; het DSM toont alleen een geringe knik.
- De ligging van de zuidgevel aan de voet van de toren Jufferstraat: de BAG-contour loopt daar 1,3 m zuidelijker langs het straatraster. Het model houdt de zuidgevel recht op de lijn uit het DSM.
- Glasgevels: verdiepingshoge glasvakken van 2,2–3,4 m als blinde nissen van 0,35 m tussen verdiepingsranden van 0,9 m en stijlen van 0,9–1,3 m, per laag verspringend (de verdiepingshoge panelen van HM Architecten verspringen per laag). Baksteengevels: loggia's van 3,6–6 m per verdieping. Het precieze patroon is geschat.
- Plinten: kleine dakopbouwen, hekken en dakranden onder 0,9 m zijn weggelaten; de 3D BAG-vlakken 107 (+17,7 m) en 106 (+84,7 tot +88,5 m) zijn niet overgenomen: het eerste staat niet in het DSM, het tweede is de verplaatsbare gevelonderhoudsinstallatie op het dak.
- Balustrades en de dunne stijlen en regels van de glasgevels (< 0,9 m) zijn niet gemodelleerd.

## Controle

`node scripts/generate-harbour-village.mjs` geeft `NoError`, genus 0 en één gesloten deel (12.008 driehoeken). In de webshop controleert `tests/landmark-models.test.ts` de dakhoogtes van beide torens, de noordstrook, de westvleugel en de plinten, de helling van de westgevel, de gedraaide zuidgevel, dat een glasvak in de oostgevel van de toren Bierstraat na de printcorrectie op 45° een blinde nis blijft, één component en de plaatsing; de printcorrectie voegt geen volume toe. Vier schuine aanzichten zijn naast de PDOK-reconstructie en de foto gelegd, samen met de buurmodellen Up:Town en The Red Apple; het model overlapt die niet.

## Bronnen

- PDOK BAG, panden `0599100000750224` (toren Jufferstraat) en `0599100000750223` (toren Bierstraat), bouwjaar 2002; actuele orthoHR; AHN DSM 0,5 m.
- 3D BAG: [toren Jufferstraat](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000750224), [toren Bierstraat](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000750223).
- [Wikipedia: Harbour Village](https://nl.wikipedia.org/wiki/Harbour_Village).
- Foto op Wikimedia Commons (niet meegeleverd): [Harbor Village](https://commons.wikimedia.org/wiki/File:Harbor_Village.jpg).
