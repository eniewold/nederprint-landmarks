# Teleport Tower (Amsterdam)

Vereenvoudigd, printbaar model van de Teleport Tower aan de Kingsfordweg in Teleport/Sloterdijk (2000–2001, Alberts en Van Huut): een crèmekleurige kantoortoren van 17 lagen en circa 65 m in de 'organische' stijl van het bureau, met drie vleugels die naar Schiphol, station Sloterdijk en het centrum wijzen. De west- en de noordvleugel lopen in terrassen af, de zuidoostvleugel gaat tot het dak door; in de binnenhoeken zit glas over de hele hoogte en tegen de noordwestgevel staat een glazen entreepaviljoen.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `teleport-tower.glb` | Model in meters, Y omhoog, één node: `building:teleport-tower` |
| `teleport-tower.json` | Catalogusitem |
| `teleport-tower-1-1000.stl` | Los te printen op 1:1000 (54 × 55 × 64 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[117970.0, 488772.0]`, in het hart van de toren; de lokale assen vallen samen met de RD-assen (X naar het oosten, Y naar het noorden), omdat de vleugels onder allerlei hoeken staan. Lokaal z = 0 is NAP +2,55 m: het dek van de ondergrondse garage waar de toren op staat (AHN-DTM 2,5–2,6; de straat ligt op 1,0–1,3). `groundHeight` is 45,55 m (ellipsoïdisch: dek + 43,0, de geoïde NLGEO2018 is hier 42,98 en Radarweg 306 ijkt op 43,0), `groundOffsetMetres` −0,15, en `groundSamplePoints` liggen op het dek rond de toren, zodat het model niet naar de lagere straat zakt.

Het BAG-pand `0363100012081516` omvat het hele garagedek (circa 65 × 78 m); het bovengrondse deel is de voetafdruk van de 3D BAG (1228 m²). Het dek zelf zit in het maaiveld en is niet gemodelleerd.

## Onderdelen en maten

| Onderdeel | Hoogte (NAP) | Bron |
| --- | --- | --- |
| Voetafdruk | — | 3D BAG grondvlak, Douglas-Peucker 0,4 m |
| Torendak | +64,43 m | 3D BAG dakvlak 210 (70e percentiel van het dak 64,47); AHN4-DSM 64–64,5 |
| Verhoogd middendeel | +65,82 m | 3D BAG dakvlak 226; DSM 65,8–66 |
| Zuidoostvleugel | +64,49 m | 3D BAG dakvlak 223 |
| Installatieopbouwen | +65,49 en +67,13 m | 3D BAG dakvlakken 227/228 en 198; DSM 67–68 |
| Westvleugel, terrassen | +53,71, +28,48, +17,70, +10,50, +6,91 m | 3D BAG dakvlakken 213, 221, 203, 206, 201; DSM |
| Noordvleugel, terrassen | +53,72, +28,50, +17,71, +10,50, +6,91 m | 3D BAG dakvlakken 209, 217, 218, 219, 224; DSM |
| Opstaande koppen | +8,43, +29,96, +55,37, +66,15 m | 3D BAG dakvlakken 200, 205, 214, 197 |
| Glazen entreepaviljoen | +11,8 tot +14,5 m | 3D BAG dakvlakken 207, 208, 220 (omhullende); ortho, foto |

Elk dakvlak is een prisma tot zijn eigen hoogte; per hoogteniveau wordt alles wat minstens zo hoog is tot één plak samengevoegd, binnen de voetafdruk. De terrassen liggen precies op de lagen: begane grond 4,35 m (dek +2,55 tot +6,9), daarboven 16 lagen van 3,6 m tot +64,5 m.

Gevelreliëf: per laag en per gevel vensters van twee ramen (1,5 m) op een travee van 3,0 m als blinde nissen van 0,35 m met een plafond onder 45°, op een afgeschuinde hoek één venster; korte facetten (2–5,5 m) aan een binnenhoek zijn de glasstroken, met per laag één doorlopende nis en een borstwering van 0,9 m. Achter het paviljoen en onder hogere terrassen geen nissen.

## Geschat en weggelaten

- Verdiepingsindeling (begane grond 4,35 m, daarboven 3,6 m) volgt uit de terrashoogtes en de 17 lagen uit Wikipedia; vensterstramien en -maten zijn uit foto's geschat.
- Welke facetten glas zijn, volgt uit een regel (kort facet aan een binnenhoek), niet uit een opmeting per facet.
- De vorm van het entreepaviljoen is de convexe omhullende van zijn drie dakvlakken; de glasfacetten zelf zijn niet nagebouwd.
- Weggelaten: opstaande dakranden smaller dan 0,9 m (3D BAG-vlakken 225, 202, 211, 199, 216, 215, 222), de stalen kroonframes en leuningen op de terrassen en het dak, en de lichtreclame (kleiner dan 0,9 m); het golvende verloop van de dakranden op de terrassen (binnen 1–2 m, alleen als opstaande koppen); het garagedek, de muur eromheen en de garage-inrit op het dek (horen bij het maaiveld, niet bij de toren).

## Controle

`node scripts/generate-teleport-tower.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert een test in `tests/landmark-models.test.ts` de dak- en terrashoogtes, het paviljoen, dat de vensternissen in de oostgevel de printcorrectie op 45° overleven (volume print/raw < 1,01), één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0363100012081516` (bouwjaar 2001); actuele orthoHR; AHN4-DSM en -DTM 0,5 m.
- 3D BAG v2 (3DGI/TU Delft, CC BY 4.0), `NL.IMBAG.Pand.0363100012081516`, LoD2.2 (puntwolk AHN3).
- [Teleport Tower](https://nl.wikipedia.org/wiki/Teleport_Tower) op Wikipedia.
- Foto's op Wikimedia Commons (niet meegeleverd): [Teleport Tower Amsterdam](https://commons.wikimedia.org/wiki/File:Teleport_Tower_Amsterdam.jpg), [Regus Sloterdijk Teleport Towers](https://commons.wikimedia.org/wiki/File:Regus_Sloterdijk_Teleport_Towers.JPG), [Amsterdam kantoorpand Regus](https://commons.wikimedia.org/wiki/File:Amsterdam_kantoorpand_Regus.jpg).
