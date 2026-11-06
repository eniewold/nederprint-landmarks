# Watertoren Raalte (Raalte)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-raalte.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, plint, goot en dak zijn convexe omhullenden van achthoeken (schacht en dak als vlakken van een taps prisma en een tentdak), de lisenen, balkons en luifel convexe omhullenden, de vensters, roosters en deuren blinde nissen met een schuin plafond.

De watertoren aan de Korenstraat werd in 1933 gebouwd voor de Waterleiding Maatschappij Overijssel; volgens Wikipedia is hij 44,7 m hoog met een reservoir van 177 m³ en is hij een gemeentelijk monument. Een vlakbodemreservoir van beton in een bakstenen omkleding in licht expressionistische vormen, afgedekt met een afgeknot tentdak (Monumenten in Nederland: Overijssel). Vitens verkocht hem in 2004; sinds 2025-2026 wordt hij verbouwd tot woning (BAG-status "Verbouwing pand", woonfunctie). De luchtfoto van 2026 toont een bouwplaats met een nieuwe funderingsplaat ten zuidwesten van de toren en een bouwlift aan de oostkant; die aanbouw staat nog niet en is niet gemodelleerd.

Een achtkante, licht taps toelopende toren van donkere baksteen: een iets uitspringende plint met ventilatieroosters, op de acht hoeken lisenen die ruim 2,5 m onder de goot met een schuine kop eindigen, in de westgevel een kolom smalle trapvensters, bovenin een betonnen balkon op een console met een deur en een luifel (west) en een tweede balkon (noordwest), een betonnen goot en een achtkant tentdak met pannen.

## Bestanden

- `watertoren-raalte.glb`: één node, `building:watertoren-schacht-lisenen-balkons-en-dak`.
- `watertoren-raalte.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-raalte-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [215613.7, 489468.1] (52,38971 N, 6,27763 O), het hart van de achtkante dakrand in het AHN-DSM, op het maaiveld: AHN-DTM NAP +6,3 (6,2 tot 6,5 in een ring van 6 tot 12 m). +X wijst naar RD-richting -4 graden, +Y naar 86 graden; de acht gevels staan haaks op 0 + 45k graden in dit stelsel, de westgevel (naar de Korenstraat) op -X. De richting komt uit de oost-, west- en noordzijde van het BAG-pand (-5, -4 en -3 graden); in het DSM past een regelmatige achthoek bij elke draaiing even goed.

BAG-pand 0177100000191442 is slordig getekend en bevat al de nieuwe aanbouw (zuidwest) en een uitbouw aan de noordoostkant; de oost-, noord- en westgevel liggen op 6,0 à 6,2 m van het hart. Het model vervangt het hele pand; in de PDOK-tegels is dat een rechte kolom tot ellipsoïdisch 93,77 m plus vlakke delen op het maaiveld. Buurpanden liggen op 16 m of verder en zijn laag (tot 8,7 m).

`groundSamplePoints` liggen op 8,5 m oost, west, noord en zuid; `groundHeight` 49,19 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (49,19 tot 49,30, gemeten 2026-11-06; het PDOK-pand begint op 49,17). `groundOffsetMetres` is -0,1.

## Onderdelen

Apothema's (afstand van het hart tot een gevelvlak) en hoogtes boven het maaiveld (NAP +6,3).

- Schacht: achtkant, taps van apothema 6,0 m op het maaiveld tot 5,35 m op 41,7 m.
- Plint: 0,12 m uit de gevel tot 3,3 m, schuin terug tot 3,45 m; per gevel twee roosters (nis 0,7 bij 1,1 m, 0,8 tot 1,9 m).
- Hoeklisenen: op elke hoek, 0,85 m langs elk aangrenzend vlak en 0,25 m uit de gevel, tot 39,0 m met een schuine kop (buitenkant 38,55 m).
- Westgevel: vijf trapvensters (nis 0,45 bij 1,2 m) vanaf 7, 14, 21, 28 en 34,3 m; balkon van 1,9 m breed en 0,95 m uit met een borstwering van 36,85 tot 37,9 m (AHN NAP +44,2) op een console onder 52 graden; balkondeur (nis 1,2 m breed) van 37,9 tot 40,0 m; luifel van 2,1 m breed en 0,55 m uit tot de goot, met een onderkant van 50 graden.
- Noordwestgevel: hetzelfde balkon zonder deur en luifel; deur op het maaiveld (nis 1,3 m breed, tot 2,4 m).
- Goot: apothema 5,6 m van 41,15 tot 41,7 m (AHN-dakrand NAP +48,0), onderkant 50 graden.
- Dak: achtkant tentdak van de goot tot apothema 0,5 m op 44,25 m (0,5 m per m, 27 graden), afgeknot met een dekschild tot 44,5 m (AHN NAP +50,8).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Raalte)): 1933, 44,7 m, 177 m³, gemeentelijk monument; in 2004 verkocht door Vitens. (De opdracht noemde 44,5 m en 117 m³; het AHN geeft 44,5 m tot de top.)
- [Monumenten in Nederland: Overijssel (DBNL)](https://www.dbnl.org/tekst/sten009monu03_01/sten009monu03_01_0085.php): Korenstraat 18, 1933, Waterleiding Maatschappij Overijssel, vlakbodemreservoir van beton, bakstenen omkleding in licht expressionistische vormen, afgeknot tentdak.
- BAG-pand 0177100000191442 (PDOK, 2026-11-06, bouwjaar 1933, status "Verbouwing pand").
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +6,3; dakrand NAP +48,0 op 5,3 à 5,4 m van het hart; gevelpunten tot 6,0 à 6,3 m tussen NAP +13 en +38 (taps); dak rechtlijnig 0,5 m per m tot NAP +50,8; balkons tot NAP +44,2 net buiten de goot naar het westen en noordwesten (de westkant van het DSM heeft een gat in de schaduw van de toren).
- Luchtfoto's 2022 en 2026 (PDOK): achtkant tentdak met acht graten, bouwplaats en nieuwe funderingsplaat.
- Foto op Wikimedia Commons: "Raalte Watertoren 8245.JPG" (2006, vanaf de Korenstraat in het westen, van onderaf; schaal circa 61 px/m bovenin en 72 px/m onderin uit de gevelbreedte): lisenen en hun koppen, balkons, luifel, goot, dak, trapvensters, plint en roosters.

## Geschat en weggelaten

Geschat: er is maar één bruikbare foto (vanuit het westen), dus de noord-, oost- en zuidkant zijn aangenomen gelijk aan wat de foto en het AHN laten zien; de taps (apothema 6,0 tot 5,35 m) uit de BAG-voet, de gevelpunten en de dakrand in het AHN (circa 0,2 m); de breedte, uitsprong en kophoogte van de lisenen, de plinthoogte, de maten van balkons, luifel en deuren en de hoogtes van de trapvensters uit de foto (circa 0,5 m); de plaats van de deur op het maaiveld (noordwestgevel, uit verticale lijnen op de foto); de lijn van de westgevel en de balkons naar het westen en noordwesten (foto vanaf de Korenstraat en de balkonhoogtes in het AHN).

Weggelaten: de antennemast en antennes aan de noordwestkant (te dun), de regenpijpen, de kleine dakkapel met een smal venster boven het westbalkon (kleiner dan 0,9 m), de twee kleine vensters onder het westbalkon, de kozijnen en de nieuwe aanbouw en bouwlift (nog in aanbouw).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling het volume met minder dan 0,01 % (randjes onder de luifel en in de nissen). Een export op 1:1000 (80 bij 80 m rond de toren) met `createModelBundle` verbergt het PDOK-pand en geeft een ondersteuningsobject van 0,27 mm³. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een rechte, vrijwel vierkante kolom met een vlak dak op 44,5 m) de achtkante taps toelopende vorm, de plint met roosters, de lisenen met schuine koppen, de trapvensters, de balkons met deur en luifel, de goot en het tentdak.

Controle-URL: http://localhost:3000/kaart/52.38970/6.27759/200/1x1/0
