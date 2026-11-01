# Nieuwe watertoren (Zaltbommel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-zaltbommel-nieuwe.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, holle overgang, kegel en dakrand zijn één omwentelingsprofiel, de voegen omgewentelde V-groeven, de nissen omhulsels van twee driehoeken en de antenne-installatie blokken.

De nieuwe watertoren van Zaltbommel staat aan de Steenweg. Hij is in 1964 gebouwd naar ontwerp van Brouwer en Deurvorst, 38 m hoog, met drie reservoirs van 1255, 875 en 415 m³. Het is een rijksmonument (532144), een van de topmonumenten uit de periode 1959–1965. De oude watertoren van Zaltbommel is een eigen model.

## Bestanden

- `watertoren-zaltbommel-nieuwe.glb`: één node van klasse `building`, op het maaiveld: schacht, kegel, dak en antenne-installatie samen. De export vult elke node apart op.
- `watertoren-zaltbommel-nieuwe.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-zaltbommel-nieuwe-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [145070.94, 423357.22], het middelpunt van de ronde BAG-contour van pand 0297100000002210 (straal 5,10 m, afwijking van de cirkel hooguit 6 cm), op maaiveld (NAP +3,04 m, mediaan van het DTM op 5 tot 12 m van het hart; het terrein rond de toren is vlak binnen 0,1 m). Assen in RD-richting (`xAxis` [1, 0]). Het dak ligt in het AHN binnen circa 0,25 m boven het hart; het model staat recht.

De twaalf nissen in de plint staan om de 30 graden, met een op het noorden (kompas k × 30 graden). Op de foto vanaf het zuidelijke fietspad staat er een nis vrijwel recht voor de camera; de precieze fase is niet gemeten, maar bij twaalf gelijke nissen valt een afwijking van enkele graden op de kaart niet op.

## Onderdeel `building:schacht-kegel-dak-en-antennes`

- Ronde betonnen schacht van 10,2 m (straal 5,1) tot +13,7.
- Holle overgang van +13,7 tot +17,7 (kwadratische Bézier met het knikpunt op +15,7 als controlepunt, raakt aan schacht en kegel), daarboven een rechte kegel die 0,2235 m per m uitwaaiert (12,6 graden uit het lood) tot straal 9,8 op +36,75.
- Afgeschuinde bovenrand van 0,2 × 0,2 m naar het platte dak op +36,95 (straal 9,6).
- Tien voegen om de 3,18 m van +5,7 tot +34,32: V-groeven van 0,12 m diep, de onderkant 0,12 m onder en het plafond tot 0,45 m boven de voeglijn (onder 62 graden).
- Plint met twaalf spitse nissen: achterkant (het glas) 0,8 m breed met de top op +4,0 en 0,4 m diep, schuine dagkanten naar een opening van circa 1,3 m in het oppervlak met de top op +4,4. Tussen de nissen blijft aan de voet 1,3 m muur.
- Antenne-installatie in het midden van het dak: het vakwerkframe als blok van 3,4 × 3,4 m tot +39,15, met op de vier hoeken antennepanelen van 0,9 × 0,9 m tot +40,35.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Zaltbommel)): bouwjaar 1964, Brouwer en Deurvorst, 38 m, de drie reservoirs.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +3,04, dak NAP +39,9 à +40,0 (36,95 m boven maaiveld), antenneframe 2 à 3 m daarboven met losse punten tot NAP +46,0 (de dunne masten). De buitenste verhoogde cellen liggen 9,75 tot 10,25 m van het hart; tussen 8 en 10 m en in een ring op 4 à 5 m geeft het DSM lagere waarden (gemengde randcellen en weerspiegeling op het natte dak), dus de dakstraal komt uit de buitengrens en de foto's.
- BAG-pand 0297100000002210 (bouwjaar 1960, in gebruik): een cirkel van 5,10 m straal, de voet van de schacht.
- Luchtfoto (PDOK, 8 cm): het donkere platte dak met de lichte rand en de antenne-installatie in het midden; door de hoogteverplaatsing staat het dak 8,6 m zuidelijker en is de noordkant van de plint met de spitse nissen te zien.
- Foto [vanaf het zuidelijke fietspad 2](https://commons.wikimedia.org/wiki/File:Zaltbommel_Nieuwe_Watertoren_gezien_vanaf_zuidelijk_fietspad_2024-09-24-2.jpg) en foto [watertoren gebouwd in 1964](https://commons.wikimedia.org/wiki/File:Zaltbommel_-_watertoren_gebouwd_in_1964.jpg) (beide frontaal van ver weg): de linkerrand tegen de lucht is boven circa 18 m een rechte lijn en gaat tussen circa 14 en 17,5 m geleidelijk over in de verticale schacht; de verhouding dakrand/schacht is 1,96 en 1,87 (model 1,92 met de schacht uit de BAG en de dakrand uit het AHN). De voegen liggen op beide foto's op gelijke afstand, met de onderste op 5,5 à 5,85 m en de bovenste circa 2,6 m onder de dakrand. De plint: twaalf nissen (de nissen naast de middelste staan op ±30 graden), top op circa 4,4 m, aan de voet ongeveer 1 m glas tussen schuine lichte dagkanten.
- Foto [vanaf het zuidelijke fietspad 1](https://commons.wikimedia.org/wiki/File:Zaltbommel_Nieuwe_Watertoren_gezien_vanaf_zuidelijk_fietspad_2024-09-24-1.jpg): de plint van dichtbij, de afgeschuinde bovenrand en de antenne-installatie (frame circa 4,9 m breed en 2,2 m hoog, panelen tot 3,3 m boven de rand).

## Geschat en weggelaten

Geschat: de hoogtes van de voegen en de overgang komen van foto's van onderaf (circa 0,5 m nauwkeurig); de voegen zijn op gelijke afstand gelegd. De dakstraal (9,85 m op de kegellijn) ligt tussen de foto's (9,5 tot 10,1 m bij een schacht van 5,1 m) en de buitengrens van het DSM. De vorm van de voegen (V-groef in plaats van een verspringing tussen de ringen) en de diepte en dagkanten van de nissen zijn geschat; de nissen zijn rondom gelijk genomen. Het antenneframe is een dicht blok en kleiner dan het vakwerk op de foto, met panelen alleen op de hoeken.

Weggelaten: de dunne zendmasten en kabelgoten op het dak (onder 0,9 m), de kozijnen en de deur in een van de nissen, het hekwerk, de keet en de trafo bij de voet, en het pompgebouw uit 2019 ten zuidwesten van de toren (een eigen BAG-pand, niet vervangen; het model raakt het niet).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,00000): de kegel helt 12,6 graden uit het lood, de holle overgang minder, de voegen hebben een plafond onder 62 graden, de zijvlakken van de nissen staan onder 78 graden en de antennepanelen staan op het frame. De doorsneden op 1, 3, 4,3, 5,75, 8,95, 14, 15,3, 16, 25, 34,5, 36,5, 36,9, 38 en 40 m blijven gelijk. Op de kaart hoort de trechter op de plek van het verborgen PDOK-pand te staan (de PDOK-reconstructie is een rechte cilinder van de voet met een antenneblok). Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt geen steun. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,11–0,12 m in het maaiveld; het pompgebouw blijft PDOK en raakt de dakrand niet.

Controle-URL: http://localhost:3000/kaart/51.79861/5.24306/200/1x1/0
