# Little Manhattan (Amsterdam)

Vereenvoudigd, printbaar model van Little Manhattan aan het Cornelis Lelyplein bij station Lelylaan (2017, ontwerp studioninedots): studentenwoningen met winkels in de plint. Op een Z-vormige voet van negen lagen (ruim 3.000 m²) staan twee torens: de noordtoren van 23 lagen (73 m) op de noordvleugel langs het spoor en de zuidtoren van 19 lagen (61 m) op de oostvleugel aan het plein. De gevels zijn van lichte betonelementen met een strak vensterraster; de buitenste torengevels hebben verspreide smalle venstersleuven. Onderaan een hoge glazen plint met penanten, en waar de zuid- en oostvleugel elkaar raken een glazen spleet over de hele hoogte van de voet.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `little-manhattan.glb` | Model in meters, Y omhoog, vijf nodes: `building:little-manhattan-toren-noord`, `building:little-manhattan-toren-zuid`, `building:little-manhattan-voet-west`, `building:little-manhattan-voet-noordoost` en `building:little-manhattan-voet-zuid` |
| `little-manhattan.json` | Catalogusitem |
| `little-manhattan-1-1000.stl` | Los te printen op 1:1000 (61 × 90 × 75 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[117413.0, 485619.0]`, in het hart van de contour; de lokale assen vallen samen met de RD-assen (X naar het oosten, Y naar het noorden), omdat het gebouw twee gevelrichtingen heeft: de noordvleugel staat op 0,6°, de oost- en zuidvleugel op −8,24°. Alle hoekpunten liggen op die rechte BAG-lijnen. Lokaal z = 0 is NAP −0,2 m (3D BAG-maaiveld −0,18); `groundHeight` is 42,82 m (NAP −0,2 plus geoïdehoogte NLGEO2018 43,02) en `groundOffsetMetres` −0,15.

De voet valt zonder de torens in drie stukken uiteen en is daarom drie nodes; elke toren loopt als eigen node van de onderkant tot het dak. De nodes overlappen niet (samen 141.890 m³, gelijk aan het volume van de STL).

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Voet (west, noordoost, zuid) | BAG-contour, 61 × 90 m, 3.045 m² | +30,8 m | 3D BAG (30,79–30,84), AHN-DSM (30,74–30,79) |
| Noordtoren | 34,9 × 20,1 m, westgevel 7,5 m terug van de westkop | +72,97 m | 3D BAG-dakvlak (72,97–72,99), AHN-DSM, hoogbouwlijst 73 m / 23 lagen |
| Zuidtoren | circa 20 × 33 m over de volle breedte van de oostvleugel, 5,4 m terug van de zuidgevel | +61,12 m | 3D BAG-dakvlak (61,11–61,17), AHN-DSM (61,08–61,11) |
| Luchtkanalen noordtoren | twee kanalen van 1,0 × 19 m noord-zuid met een bocht | +74,0 m | AHN-DSM (+1,0 boven het dak), 3D BAG (73,93–74,12) |
| Installatiekast noordtoren | 2 × 8 m | +74,0 m | AHN-DSM |
| Luchtkanalen zuidtoren | twee kanalen van 1,0 × 17–19 m langs de −8,24°-richting | +62,12 m | AHN-DSM, 3D BAG (62,11–62,15) |
| Installatiekast zuidtoren | 4 × 2,6 m | +62,12 m | AHN-DSM, 3D BAG-dakvlak (10,6 m²) |
| Glazen spleet | inham van 6,2 × 1,9 m in de zuidgevel, glas over de hele hoogte | tot circa +29,6 m | BAG-contour, foto's |

Gevelreliëf, alles als blinde nissen van 0,4 m diep met een plafond onder 45°, op een raster van 2,25 m dat per gevellijn vastligt (voet en toren in hetzelfde vlak hebben dezelfde kolommen):

- plint van 6,6 m: openingen van 1,35 m breed tot 5,7 m boven maaiveld tussen penanten van 0,9 m;
- lagen van 3,0 m (voet 8, noordtoren 22, zuidtoren 18 boven de plint);
- raster: vensters van 1,3 × 1,75 m, penanten 0,95 m, op de gevels naar de binnenhof, het plein, het spoor (voet) en de Willem Frogerstraat;
- sleuven: 0,9 × 2,05 m, verspreid in korte verticale reeksen, op de west- en noordgevel van de noordtoren, de oost- en zuidgevel van de zuidtoren en de westkop van de noordvleugel en de zuidkop van de oostvleugel;
- glazen spleet: één nis van 4,4 m breed over de hele hoogte van de voet.

## Geschat en weggelaten

- Naam: de taak noemt een "woon- en hotelcomplex" van circa 61 m. De 61 m is het 70e percentiel van het dak in de 3D BAG en hoort bij de zuidtoren; de noordtoren is 73 m (23 lagen). Commons en de BAG geven studentenwoningen met winkels (geen hotelfunctie gevonden).
- Plinthoogte (6,6 m), verdiepingshoogte (3,0 m) en het aantal lagen per toren zijn afgeleid uit de daken en het aantal lagen in de hoogbouwlijst en op foto's.
- Vensterraster, vensterafmetingen en welke gevels sleuven hebben zijn geschat uit foto's; het patroon van de sleuven is schematisch (niet per venster nagetekend). Van de oostgevel van de noordtoren is geen duidelijke foto gevonden (raster aangenomen).
- De plaats van de kast op de noordtoren komt uit het AHN-DSM; de 3D BAG legt hem 2–3 m westelijker.
- Weggelaten: de kleinere luchtkanalen op de torendaken (0,5 m breed) en de kanalen op de daken van de voet (0,5–0,7 m hoog), kleiner dan 0,9 m; de schuine neggen naast de torenvensters en de voegen tussen de gevelelementen (kleiner dan 0,9 m).
- Weggelaten: de overkapping van circa 5,5 × 30 m op +3,6–4,0 m langs de westgevel van de oostvleugel in de binnenhof (DSM); die valt buiten de BAG-contour. Het paviljoen in de binnenhof is een eigen BAG-pand (`0363100012246894`, 6,8 m) en blijft de PDOK-reconstructie.

## Controle

`node scripts/generate-little-manhattan.mjs` geeft per node `NoError`, genus 0 en één gesloten deel (1.835 nissen). In de webshop controleert de test de daken, kanalen en kasten van de torens en de voet, dat de glazen spleet na de printcorrectie op 45° een nis van 0,4 m blijft, één component per node, een volumegroei door de printcorrectie onder 1 % en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG (LoD2.2) en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0363100012246893` (bouwjaar 2017); 3D BAG (LoD2.2, AHN5 2023); actuele orthoHR; AHN-DSM en -DTM 0,5 m; geoïde NLGEO2018.
- [Lijst van hoogste gebouwen van Amsterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam) en [Willem Frogerstraat](https://nl.wikipedia.org/wiki/Willem_Frogerstraat).
- Foto's op Wikimedia Commons (niet meegeleverd): [Category:Little Manhattan (Amsterdam)](https://commons.wikimedia.org/wiki/Category:Little_Manhattan_(Amsterdam)), [Little Manhattan Amsterdam.jpg](https://commons.wikimedia.org/wiki/File:Little_Manhattan_Amsterdam.jpg).
